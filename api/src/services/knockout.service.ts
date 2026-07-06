import { createAppError } from '../common/app.error.js';
import {
    Prisma,
    PrismaClient,
    MatchStatus,
    PhaseType,
    PhaseFormat,
    PhaseStatus,
    SeasonStatus,
} from '../generated/prisma/client.js';
import {
    AdvanceWinnerInput,
    BracketSlotNode,
    bracketSlotNodeSelect,
    byeSlotSelect,
    BRACKET_SIZE_TO_PHASE_TYPE,
    KnockoutGenerateOptions,
    KnockoutGenerateResult,
    SeedSource,
    SlotLinkUpdate,
    SlotWithParentLinks,
    slotWithParentLinksSelect,
} from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine, ScheduleCandidateMatch } from '../libs/schedule.engine.js';
import { buildRound1Pairings, nextPowerOf2 } from '../helper/match.helper.js';
import { lockSeason } from '../helper/season-lock.helper.js';
import { StandingsService } from './standing.service.js';

const TERMINAL_MATCH_STATUSES: MatchStatus[] = [MatchStatus.finished, MatchStatus.forfeited];

// season.start_date/end_date là date-only field (@db.Date), Prisma trả về
// UTC-midnight của NGÀY VN chứ không phải instant thật. Toàn bộ so sánh với
// `now`/dateRangeStart/dateRangeEnd (instant thật) phải normalize qua đây
// trước, nếu không lệch UTC+7 ở biên ngày.
//
// ASSUMPTION cần confirm: field Prisma đúng là @db.Date (naive). Nếu thực
// tế là DateTime full instant đã lưu chuẩn UTC thật, bỏ 2 helper này.
//
// FIX #2: options.dateRangeStart/dateRangeEnd (input từ FE, date-only string
// qua <input type="date">) giờ normalize qua CÙNG helper trước khi so sánh
// với seasonStartUtc/seasonEndUtc (đã normalize) — trước đây so 1 giá trị
// normalized với 1 giá trị chưa normalize, lệch 7h ở đúng biên ngày cuối.
const VN_OFFSET_MS = 7 * 60 * 60 * 1000;

function vnStartOfDay(d: Date): Date {
    return new Date(d.getTime() - VN_OFFSET_MS);
}

function vnEndOfDay(d: Date): Date {
    return new Date(d.getTime() - VN_OFFSET_MS + 24 * 60 * 60 * 1000 - 1);
}

// scheduleMatchBatch chạy SAU KHI transaction generate/advance đã commit —
// bracket/slot/match đã persist bất kể xếp lịch có thành công hay không.
// KHÔNG throw cho lỗi "business validation" (thiếu end_date, dateRange vượt
// season, không đủ slot, thiếu venueIds/matchTimes) — soft-fail qua `error`,
// caller đẩy vào warnings. Match vẫn tồn tại ở trạng thái "scheduled nhưng
// chưa có scheduled_at/venue" — CẦN endpoint reschedule riêng (chưa có
// trong file này) để xử lý tiếp.
type ScheduleBatchResult = {
    matchesScheduled: number;
    failedMatchIds: number[];
    error?: string;
};

export class KnockoutService extends ScheduleEngine {
    constructor(
        prisma: PrismaClient,
        private readonly standingsService: StandingsService,
    ) {
        super(prisma);
    }

    // ─── PHASE RESOLUTION (season-scoped, mirror GroupService) ────────────────

    private async getOrCreateKnockoutPhase(
        tx: Prisma.TransactionClient,
        seasonId: number,
        phaseType: PhaseType,
        legs: 1 | 2,
    ) {
        await lockSeason(tx, seasonId);

        let phase = await tx.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.knockout,
                type: phaseType,
                is_active: true,
            },
        });

        if (!phase) {
            phase = await tx.phase.create({
                data: {
                    season_id: seasonId,
                    format: PhaseFormat.knockout,
                    type: phaseType,
                    status: PhaseStatus.draft,
                    order: 1,
                    name: this.phaseNameFor(phaseType),
                    is_active: true,
                    legs,
                },
            });
        }
        return phase;
    }

    private phaseNameFor(t: PhaseType): string {
        const map: Partial<Record<PhaseType, string>> = {
            round_of_16: 'Vòng 16 đội',
            quarter_final: 'Tứ kết',
            semi_final: 'Bán kết',
            third_place: 'Tranh hạng 3',
            final: 'Chung kết',
        };
        return map[t] ?? t;
    }

    private async ensureSeasonOngoing(tx: Prisma.TransactionClient, seasonId: number): Promise<void> {
        const season = await tx.season.findUnique({
            where: { id: seasonId },
            select: { status: true },
        });
        if (season?.status === SeasonStatus.registration_open) {
            await tx.season.update({
                where: { id: seasonId },
                data: { status: SeasonStatus.ongoing },
            });
        }
    }

    private async resolveSeeds(
        tx: Prisma.TransactionClient,
        seeds: SeedSource[],
    ): Promise<number[]> {
        const groupIds = [
            ...new Set(
                seeds
                    .filter((s): s is Extract<SeedSource, { kind: 'standing' }> => s.kind === 'standing')
                    .map(s => s.groupId),
            ),
        ];

        if (groupIds.length > 0) {
            const pendingCount = await tx.match.count({
                where: {
                    group_id: { in: groupIds },
                    deleted_at: null,
                    status: { notIn: TERMINAL_MATCH_STATUSES },
                },
            });
            if (pendingCount > 0)
                throw createAppError(
                    'CONFLICT',
                    `Còn ${pendingCount} match chưa kết thúc ở các group liên quan — ` +
                    `hoàn thành group stage trước khi tạo knockout`,
                );

            for (const groupId of groupIds) {
                await this.standingsService.recomputeGroupStandings(groupId, tx);
            }
        }

        const standingRows = groupIds.length > 0
            ? await tx.teamStanding.findMany({
                where: { group_id: { in: groupIds }, deleted_at: null },
                select: { group_id: true, team_id: true, position: true },
            })
            : [];
        const standingMap = new Map(standingRows.map(s => [`${s.group_id}:${s.position}`, s.team_id]));

        const resolved = seeds.map(s => {
            if (s.kind === 'manual') return s.teamId;
            const teamId = standingMap.get(`${s.groupId}:${s.rank}`);
            if (!teamId)
                throw createAppError(
                    'CONFLICT',
                    `Không tìm thấy team hạng ${s.rank} ở group ${s.groupId} — ` +
                    `kiểm tra group đã có đủ team và đã recompute standings`,
                );
            return teamId;
        });

        if (new Set(resolved).size !== resolved.length)
            throw createAppError(
                'CONFLICT',
                'Sau khi resolve, 2 seed trỏ cùng 1 team — data ranking không nhất quán ' +
                '(có thể do 1 team nằm trong nhiều seed source, hoặc DB standings sai)',
            );

        return resolved;
    }

    // ─── generateKnockoutBracket ──────────────────────────────────────────────

    async generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult> {
        const warnings: string[] = [];
        if (options.seeds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 seed cho knockout');

        // FIX #1: BỎ 2 guard throw venueIds/matchTimes ở đây. Generate giờ
        // KHÔNG bắt buộc có venue/time — scheduling là bước riêng
        // (ScheduleBracketModal ở FE), khớp với payload { seeds, legs } mà
        // KnockoutUI gửi. scheduleMatchBatch tự xử lý thiếu field bằng
        // soft-fail (trả error trong warnings), không throw chặn cả request.

        const bracketSize = nextPowerOf2(options.seeds.length);
        const phaseType = options.phaseTypeOverride ?? BRACKET_SIZE_TO_PHASE_TYPE[bracketSize];
        if (!phaseType)
            throw createAppError(
                'VALIDATION_ERROR',
                `Bracket size ${bracketSize} không map được sang PhaseType chuẩn — ` +
                `truyền phaseTypeOverride nếu đây là case đặc biệt`,
            );

        const byeCount = bracketSize - options.seeds.length;
        const totalRounds = Math.log2(bracketSize);
        if (byeCount > 0)
            warnings.push(`${byeCount} bye slot(s) — bracket size ${bracketSize}`);

        const result = await this.prisma.$transaction(async tx => {
            const phase = await this.getOrCreateKnockoutPhase(tx, options.seasonId, phaseType, options.legs);

            await this.ensureSeasonOngoing(tx, options.seasonId);

            if (!phase.is_active) throw createAppError('CONFLICT', 'Phase đã bị deactivate');
            if (phase.status === PhaseStatus.locked)
                throw createAppError('CONFLICT', 'Phase đã locked, không thể generate bracket');

            const existingCount = await tx.bracketSlot.count({ where: { phase_id: phase.id } });
            if (existingCount > 0)
                throw createAppError('CONFLICT', `Phase ${phase.id} đã có bracket`);

            const seededTeamIds = await this.resolveSeeds(tx, options.seeds);

            const seeding: (number | null)[] = [
                ...seededTeamIds,
                ...Array<null>(byeCount).fill(null),
            ];
            const round1Pairings = buildRound1Pairings(seeding);
            const byeSlotNumbers = new Set(
                round1Pairings
                    .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
                    .filter((n): n is number => n !== null),
            );

            const slotCreateData = this.buildAllSlotCreateData(
                phase.id, totalRounds, bracketSize, round1Pairings,
            );
            await tx.bracketSlot.createMany({ data: slotCreateData });

            const createdSlots = await tx.bracketSlot.findMany({
                where: { phase_id: phase.id },
                select: { id: true, round: true, slot_number: true },
                orderBy: [{ round: 'asc' }, { slot_number: 'asc' }],
            });
            const slotMap = new Map(createdSlots.map(s => [`${s.round}:${s.slot_number}`, s.id]));
            const slotById = new Map(createdSlots.map(s => [s.id, s]));

            const linkUpdates: SlotLinkUpdate[] = createdSlots
                .filter(s => s.round > 1)
                .map(s => ({
                    id: s.id,
                    source_a_slot_id: slotMap.get(`${s.round - 1}:${2 * s.slot_number - 1}`) ?? null,
                    source_b_slot_id: slotMap.get(`${s.round - 1}:${2 * s.slot_number}`) ?? null,
                }));
            await this.bulkLinkSlots(tx, linkUpdates);

            const round1Slots = await tx.bracketSlot.findMany({
                where: { phase_id: phase.id, round: 1, is_bye: false },
                select: {
                    id: true,
                    seeded_home_team_id: true,
                    seeded_away_team_id: true,
                },
            });

            const legs = phase.legs as 1 | 2;
            const { createdMatchIds, slotMatchLinks } = await this.createRound1Matches(
                tx, round1Slots, phase.id, legs,
            );

            if (slotMatchLinks.length > 0) {
                const cases = slotMatchLinks.map(l => Prisma.sql`WHEN ${l.slotId} THEN ${l.matchId}`);
                const ids = slotMatchLinks.map(l => l.slotId);
                await tx.$executeRaw`
                    UPDATE bracket_slots
                    SET match_id = CASE id ${Prisma.join(cases, ' ')} END
                    WHERE id IN (${Prisma.join(ids)})
                `;
            }

            const byeSlotIds = createdSlots
                .filter(s => s.round === 1 && byeSlotNumbers.has(s.slot_number))
                .map(s => s.id);
            const byeSlots = byeSlotIds.length > 0
                ? await tx.bracketSlot.findMany({
                    where: { id: { in: byeSlotIds } },
                    select: byeSlotSelect,
                })
                : [];

            const parentUpdates = new Map<number, { home?: number; away?: number }>();
            for (const bye of byeSlots) {
                const winner = bye.seeded_home_team_id ?? bye.seeded_away_team_id;
                if (!winner) continue;
                const byeSlotEntry = slotById.get(bye.id);
                if (!byeSlotEntry) continue;
                const parentSlotNumber = Math.ceil(byeSlotEntry.slot_number / 2);
                const parentId = slotMap.get(`2:${parentSlotNumber}`);
                if (!parentId) continue;
                const isSourceA = (byeSlotEntry.slot_number % 2 === 1);
                const existing = parentUpdates.get(parentId) ?? {};
                if (isSourceA) existing.home = winner;
                else existing.away = winner;
                parentUpdates.set(parentId, existing);
            }

            if (parentUpdates.size > 0) {
                const homeCases: Prisma.Sql[] = [];
                const awayCases: Prisma.Sql[] = [];
                const parentIds: number[] = [];
                for (const [parentId, { home, away }] of parentUpdates) {
                    parentIds.push(parentId);
                    if (home !== undefined)
                        homeCases.push(Prisma.sql`WHEN ${parentId} THEN ${home}`);
                    if (away !== undefined)
                        awayCases.push(Prisma.sql`WHEN ${parentId} THEN ${away}`);
                }
                if (homeCases.length > 0) {
                    await tx.$executeRaw`
                        UPDATE bracket_slots
                        SET seeded_home_team_id = CASE id ${Prisma.join(homeCases, ' ')} ELSE seeded_home_team_id END
                        WHERE id IN (${Prisma.join(parentIds)})
                    `;
                }
                if (awayCases.length > 0) {
                    await tx.$executeRaw`
                        UPDATE bracket_slots
                        SET seeded_away_team_id = CASE id ${Prisma.join(awayCases, ' ')} ELSE seeded_away_team_id END
                        WHERE id IN (${Prisma.join(parentIds)})
                    `;
                }
            }

            const allSlotsAfterPropagate = await tx.bracketSlot.findMany({
                where: { phase_id: phase.id, match_id: null, is_bye: false },
                select: { id: true, round: true, slot_number: true, seeded_home_team_id: true, seeded_away_team_id: true },
            });
            const strandedSlots = allSlotsAfterPropagate.filter(
                s => s.round > 1 && s.seeded_home_team_id !== null && s.seeded_away_team_id !== null,
            );
            const strandedMatchDrafts: { id: number; round: number; home: number; away: number }[] = [];
            for (const slot of strandedSlots) {
                const m = await tx.match.create({
                    data: {
                        phase_id: phase.id,
                        home_team_id: slot.seeded_home_team_id!,
                        away_team_id: slot.seeded_away_team_id!,
                        status: MatchStatus.scheduled,
                        leg: legs > 1 ? 1 : null,
                        group_id: null,
                        round: String(slot.round),
                    },
                    select: { id: true },
                });
                await tx.bracketSlot.update({ where: { id: slot.id }, data: { match_id: m.id } });
                strandedMatchDrafts.push({ id: m.id, round: slot.round, home: slot.seeded_home_team_id!, away: slot.seeded_away_team_id! });
                if (legs === 2) {
                    await tx.match.create({
                        data: {
                            phase_id: phase.id,
                            home_team_id: slot.seeded_away_team_id!,
                            away_team_id: slot.seeded_home_team_id!,
                            status: MatchStatus.scheduled,
                            leg: 2,
                            group_id: null,
                            round: String(slot.round),
                        },
                    });
                }
            }
            if (strandedSlots.length > 0)
                warnings.push(
                    `${strandedSlots.length} slot round > 1 nhận đủ 2 đội ngay từ bye propagation ` +
                    `(double-bye) — đã tự tạo match cho các slot này.`,
                );

            return {
                phaseId: phase.id,
                phaseType: phase.type,
                totalSlots: slotCreateData.length,
                round1MatchIds: [...createdMatchIds, ...strandedMatchDrafts.map(d => d.id)],
                byeSlots: byeCount,
            };
        }, { timeout: 30_000 });

        // scheduleMatchBatch chạy ngoài transaction (đã commit). Nếu options
        // không có venueIds/matchTimes (case thường gặp giờ đây, vì FE tách
        // generate/schedule), hàm này trả error ngay ở guard đầu tiên thay
        // vì crash — xem scheduleMatchBatch.
        const scheduleResult = await this.scheduleMatchBatch(
            result.round1MatchIds, options.seasonId, result.phaseId, options,
        );
        if (scheduleResult.error) {
            warnings.push(
                `Bracket đã tạo (phase ${result.phaseId}) nhưng KHÔNG xếp được lịch tự động: ` +
                `${scheduleResult.error}. ${result.round1MatchIds.length} match hiện chưa có ` +
                `scheduled_at/venue — cần xếp lịch thủ công hoặc gọi lại API xếp lịch.`,
            );
        } else if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(
                `${scheduleResult.failedMatchIds.length} match chưa xếp được lịch: ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );
        }

        return {
            phaseId: result.phaseId,
            phaseType: result.phaseType,
            totalSlots: result.totalSlots,
            round1Matches: result.round1MatchIds.length,
            byeSlots: result.byeSlots,
            warnings,
        };
    }

    // ─── advanceWinner ────────────────────────────────────────────────────────

    async advanceWinner(
        phaseId: number,
        seasonId: number,
        input: AdvanceWinnerInput,
        scheduleOptions: OptionalScheduleOptions,
    ): Promise<{ matchCreated: boolean; newMatchId?: number; scheduleWarning?: string }> {
        const result = await this.prisma.$transaction(async tx => {
            const phase = await tx.phase.findUnique({
                where: { id: phaseId },
                select: { legs: true },
            });
            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);
            const legs = phase.legs as 1 | 2;

            let slot: SlotWithParentLinks | null = await tx.bracketSlot.findFirst({
                where: { match_id: input.matchId },
                select: slotWithParentLinksSelect,
            });

            let resolvedWinnerId = input.winnerTeamId;

            if (!slot) {
                const match = await tx.match.findUnique({
                    where: { id: input.matchId },
                    select: { leg: true, home_team_id: true, away_team_id: true, phase_id: true },
                });
                if (!match || match.phase_id !== phaseId)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không thuộc phase ${phaseId}`);
                if (match.leg !== 2)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không link với BracketSlot`);

                const leg1Match = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        leg: 1,
                        home_team_id: match.away_team_id,
                        away_team_id: match.home_team_id,
                        status: { in: TERMINAL_MATCH_STATUSES },
                    },
                    select: { id: true },
                });
                if (!leg1Match)
                    throw createAppError(
                        'NOT_FOUND',
                        `Không tìm thấy leg 1 match đã kết thúc (finished/forfeited) cho pairing ` +
                        `(home=${match.away_team_id}, away=${match.home_team_id}) trong phase ${phaseId}`,
                    );

                slot = await tx.bracketSlot.findFirst({
                    where: { match_id: leg1Match.id },
                    select: slotWithParentLinksSelect,
                });
                if (!slot)
                    throw createAppError(
                        'NOT_FOUND',
                        `Không tìm thấy BracketSlot cho leg 1 match ${leg1Match.id}`,
                    );

                resolvedWinnerId = await this._computeAggregateWinner(
                    tx, leg1Match.id, input.matchId,
                    slot.seeded_home_team_id!, slot.seeded_away_team_id!,
                );
            } else if (legs === 2) {
                // FIX: gộp leg2Pending + leg2Match thành 1 query, phân biệt rõ
                // 3 trạng thái (pending / done / KHÔNG TỒN TẠI) thay vì suy ra
                // "không tồn tại" từ 2 query rời (notIn TERMINAL vs in TERMINAL)
                // — filter đó không loại trừ lẫn nhau khi match bị soft-delete
                // hoặc is_active=false, khiến code cũ fall-through và dùng
                // thẳng winner của leg1 làm winner chung (silent single-leg
                // override, sai aggregate mà không có warning/error nào).
                const leg2Match = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id!,
                        away_team_id: slot.seeded_home_team_id!,
                        leg: 2,
                        is_active: true,
                        deleted_at: null,
                    },
                    select: { id: true, status: true },
                });

                if (!leg2Match)
                    throw createAppError(
                        'CONFLICT',
                        `Slot legs=2 nhưng không tìm thấy leg 2 match (home=${slot.seeded_away_team_id}, ` +
                        `away=${slot.seeded_home_team_id}) trong phase ${phaseId} — có thể đã bị soft-delete ` +
                        `hoặc chưa được tạo. Không thể xác định winner từ 1 lượt.`,
                    );

                if (!TERMINAL_MATCH_STATUSES.includes(leg2Match.status))
                    return { matchCreated: false, newMatchIds: [] as number[] }; // leg2 chưa đá xong — chờ

                resolvedWinnerId = await this._computeAggregateWinner(
                    tx, input.matchId, leg2Match.id,
                    slot.seeded_home_team_id!, slot.seeded_away_team_id!,
                );
            }

            return this.propagateWinner(tx, slot, resolvedWinnerId, phaseId, seasonId, legs);
        }, { timeout: 15_000 });

        let scheduleWarning: string | undefined;
        if (result.matchCreated && result.newMatchIds.length > 0) {
            const scheduleResult = await this.scheduleMatchBatch(
                result.newMatchIds, seasonId, phaseId, scheduleOptions,
            );
            if (scheduleResult.error) {
                scheduleWarning =
                    `Match mới (${result.newMatchIds.join(', ')}) đã tạo nhưng chưa xếp được lịch: ` +
                    scheduleResult.error;
                console.warn(`[KnockoutService] ${scheduleWarning}`);
            } else if (scheduleResult.failedMatchIds.length > 0) {
                scheduleWarning =
                    `${scheduleResult.failedMatchIds.length} match (advance) chưa xếp được lịch: ` +
                    `IDs [${scheduleResult.failedMatchIds.join(', ')}]`;
                console.warn(`[KnockoutService] ${scheduleWarning}`);
            }
        }
        return { matchCreated: result.matchCreated, newMatchId: result.newMatchId, scheduleWarning };
    }

    private async _computeAggregateWinner(
        tx: Prisma.TransactionClient,
        leg1MatchId: number,
        leg2MatchId: number,
        slotHomeTeamId: number,
        slotAwayTeamId: number,
    ): Promise<number> {
        const [leg1Result, leg2Result] = await Promise.all([
            tx.matchResult.findUnique({
                where: { match_id: leg1MatchId },
                select: { home_final_score: true, away_final_score: true },
            }),
            tx.matchResult.findUnique({
                where: { match_id: leg2MatchId },
                select: { home_final_score: true, away_final_score: true, home_penalty_score: true, away_penalty_score: true },
            }),
        ]);
        if (!leg1Result || !leg2Result)
            throw createAppError(
                'CONFLICT',
                `Thiếu MatchResult cho leg 1 (${leg1MatchId}) hoặc leg 2 (${leg2MatchId}) — không tính được aggregate`,
            );

        const slotHomeAgg = leg1Result.home_final_score + leg2Result.away_final_score;
        const slotAwayAgg = leg1Result.away_final_score + leg2Result.home_final_score;
        if (slotHomeAgg !== slotAwayAgg)
            return slotHomeAgg > slotAwayAgg ? slotHomeTeamId : slotAwayTeamId;

        if (leg2Result.home_penalty_score !== null && leg2Result.away_penalty_score !== null) {
            const homeWonPenalty = leg2Result.home_penalty_score > leg2Result.away_penalty_score;
            return homeWonPenalty ? slotAwayTeamId : slotHomeTeamId;
        }

        throw createAppError(
            'CONFLICT',
            `Aggregate hoà ${slotHomeAgg}-${slotAwayAgg} giữa leg 1 (${leg1MatchId}) và leg 2 (${leg2MatchId}) ` +
            `nhưng leg 2 không có penalty score — không xác định được winner.`,
        );
    }

    async getBracket(phaseId: number): Promise<BracketSlotNode[]> {
        const phase = await this.prisma.phase.findUnique({
            where: { id: phaseId },
            select: { id: true },
        });
        if (!phase)
            throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);

        const slots = await this.prisma.bracketSlot.findMany({
            where: { phase_id: phaseId },
            select: bracketSlotNodeSelect,
            orderBy: [{ round: 'asc' }, { slot_number: 'asc' }],
        });

        return slots.map(s => ({
            slotId: s.id,
            round: s.round,
            slotNumber: s.slot_number,
            matchId: s.match_id,
            isBye: s.is_bye,
            seededHomeTeamId: s.seeded_home_team_id,
            seededAwayTeamId: s.seeded_away_team_id,
            sourceASlotId: s.source_a_slot_id,
            sourceBSlotId: s.source_b_slot_id,
        }));
    }

    // ─── PRIVATE — BRACKET LOGIC ──────────────────────────────────────────────

    private async propagateWinner(
        tx: Prisma.TransactionClient,
        slot: SlotWithParentLinks,
        winnerTeamId: number,
        phaseId: number,
        seasonId: number,
        legs: 1 | 2,
    ): Promise<{ matchCreated: boolean; newMatchId?: number; newMatchIds: number[] }> {
        const parentViaA = slot.fed_as_a[0] ?? null;
        const parentViaB = slot.fed_as_b[0] ?? null;
        const parentSlot = parentViaA ?? parentViaB;
        if (!parentSlot) return { matchCreated: false, newMatchIds: [] };

        const isHomeInParent = parentViaA !== null;
        const updated = await tx.bracketSlot.update({
            where: { id: parentSlot.id },
            data: isHomeInParent
                ? { seeded_home_team_id: winnerTeamId }
                : { seeded_away_team_id: winnerTeamId },
            select: { round: true, seeded_home_team_id: true, seeded_away_team_id: true, match_id: true },
        });

        if (!updated.seeded_home_team_id || !updated.seeded_away_team_id)
            return { matchCreated: false, newMatchIds: [] };

        if (updated.match_id !== null) {
            return { matchCreated: false, newMatchId: updated.match_id, newMatchIds: [] };
        }

        const homeId = updated.seeded_home_team_id;
        const awayId = updated.seeded_away_team_id;
        const roundTag = String(updated.round);
        const leg1 = await tx.match.create({
            data: {
                phase_id: phaseId,
                home_team_id: homeId,
                away_team_id: awayId,
                status: MatchStatus.scheduled,
                leg: legs > 1 ? 1 : null,
                group_id: null,
                round: roundTag,
            },
            select: { id: true },
        });
        await tx.bracketSlot.update({
            where: { id: parentSlot.id },
            data: { match_id: leg1.id },
        });

        const newMatchIds = [leg1.id];
        if (legs === 2) {
            const leg2 = await tx.match.create({
                data: {
                    phase_id: phaseId,
                    home_team_id: awayId,
                    away_team_id: homeId,
                    status: MatchStatus.scheduled,
                    leg: 2,
                    group_id: null,
                    round: roundTag,
                },
                select: { id: true },
            });
            newMatchIds.push(leg2.id);
        }
        return { matchCreated: true, newMatchId: leg1.id, newMatchIds };
    }

    // ─── createRound1Matches ──────────────────────────────────────────────────

    private async createRound1Matches(
        tx: Prisma.TransactionClient,
        round1Slots: { id: number; seeded_home_team_id: number | null; seeded_away_team_id: number | null }[],
        phaseId: number,
        legs: 1 | 2,
    ): Promise<{ createdMatchIds: number[]; slotMatchLinks: { slotId: number; matchId: number }[] }> {
        if (round1Slots.length === 0)
            return { createdMatchIds: [], slotMatchLinks: [] };

        const createdMatchIds: number[] = [];
        const slotMatchLinks: { slotId: number; matchId: number }[] = [];

        for (const slot of round1Slots) {
            const homeId = slot.seeded_home_team_id!;
            const awayId = slot.seeded_away_team_id!;
            const leg1 = await tx.match.create({
                data: {
                    phase_id: phaseId,
                    home_team_id: homeId,
                    away_team_id: awayId,
                    status: MatchStatus.scheduled,
                    leg: legs > 1 ? 1 : null,
                    group_id: null,
                    round: '1',
                },
                select: { id: true },
            });
            createdMatchIds.push(leg1.id);
            slotMatchLinks.push({ slotId: slot.id, matchId: leg1.id });

            if (legs === 2) {
                const leg2 = await tx.match.create({
                    data: {
                        phase_id: phaseId,
                        home_team_id: awayId,
                        away_team_id: homeId,
                        status: MatchStatus.scheduled,
                        leg: 2,
                        group_id: null,
                        round: '1',
                    },
                    select: { id: true },
                });
                createdMatchIds.push(leg2.id);
            }
        }
        return { createdMatchIds, slotMatchLinks };
    }

    // ─── PRIVATE — SCHEDULING ─────────────────────────────────────────────────

    private async scheduleMatchBatch(
        matchIds: number[],
        seasonId: number,
        phaseId: number,
        options: OptionalScheduleOptions,
    ): Promise<ScheduleBatchResult> {
        if (matchIds.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        if (!options.venueIds || options.venueIds.length === 0 || !options.matchTimes || options.matchTimes.length === 0) {
            return {
                matchesScheduled: 0,
                failedMatchIds: matchIds,
                error: 'Thiếu venueIds hoặc matchTimes — không thể xếp lịch tự động cho các match mới tạo.',
            };
        }

        const [matches, phase, season] = await Promise.all([
            this.prisma.match.findMany({
                where: { id: { in: matchIds }, is_active: true },
                select: { id: true, home_team_id: true, away_team_id: true, round: true },
            }),
            this.prisma.phase.findUnique({
                where: { id: phaseId },
                select: { min_rest_days_per_team: true },
            }),
            this.prisma.season.findUnique({
                where: { id: seasonId },
                select: { start_date: true, end_date: true },
            }),
        ]);

        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (!season.end_date)
            return { matchesScheduled: 0, failedMatchIds: matchIds, error: `Season ${seasonId} chưa có end_date` };

        const minRestDays = phase?.min_rest_days_per_team ?? 3;
        const now = new Date();

        const seasonStartUtc = season.start_date ? vnStartOfDay(season.start_date) : null;
        const seasonEndUtc = vnEndOfDay(season.end_date);

        // FIX #2: normalize input date-only trước khi so sánh/dùng làm range.
        // options.dateRangeStart/dateRangeEnd từ FE là <input type="date">
        // → UTC-midnight của ngày đó, KHÔNG phải instant thật. Trước đây so
        // trực tiếp với seasonStartUtc/seasonEndUtc (đã +normalize) gây lệch
        // 7h ở biên ngày (loại hết match giờ chiều/tối ngày cuối).
        const dateRangeStartNorm = options.dateRangeStart ? vnStartOfDay(options.dateRangeStart) : undefined;
        const dateRangeEndNorm = options.dateRangeEnd ? vnEndOfDay(options.dateRangeEnd) : undefined;

        const startDate = dateRangeStartNorm && dateRangeStartNorm > now
            ? dateRangeStartNorm
            : (seasonStartUtc && seasonStartUtc > now ? seasonStartUtc : now);
        const rangeEnd = dateRangeEndNorm ?? seasonEndUtc;

        if (rangeEnd > seasonEndUtc)
            return { matchesScheduled: 0, failedMatchIds: matchIds, error: 'dateRangeEnd vượt quá season.end_date' };
        if (dateRangeStartNorm && seasonStartUtc && dateRangeStartNorm < seasonStartUtc)
            return { matchesScheduled: 0, failedMatchIds: matchIds, error: 'dateRangeStart trước season.start_date' };

        if (rangeEnd <= startDate)
            return {
                matchesScheduled: 0,
                failedMatchIds: matchIds,
                error:
                    `Season ${seasonId} end_date (${rangeEnd.toISOString()}) không sau startDate ` +
                    `(${startDate.toISOString()}) — không đủ khoảng thời gian để xếp lịch knockout`,
            };

        const teamIds = matches.flatMap(m => [m.home_team_id, m.away_team_id]);
        const [takenSet, recentMatches] = await Promise.all([
            this.loadTakenSlots(options.venueIds, startDate, rangeEnd),
            this.prisma.match.findMany({
                where: {
                    phase: { season_id: seasonId },
                    is_active: true,
                    deleted_at: null,
                    status: { in: TERMINAL_MATCH_STATUSES },
                    OR: [
                        { home_team_id: { in: teamIds } },
                        { away_team_id: { in: teamIds } },
                    ],
                },
                select: { home_team_id: true, away_team_id: true, played_at: true },
                orderBy: { played_at: 'desc' },
            }),
        ]);

        const pool = this.buildSlotPool(options.venueIds, startDate, rangeEnd, options.matchTimes, takenSet);
        if (pool.length < matches.length) {
            return {
                matchesScheduled: 0,
                failedMatchIds: matchIds,
                error:
                    `Không đủ slot cho knockout: cần ${matches.length}, chỉ có ${pool.length}. ` +
                    `Thêm venueId / matchTime hoặc mở rộng end_date của season.`,
            };
        }

        const lastPlayedAt = new Map<number, number>();
        for (const m of recentMatches) {
            if (!m.played_at) continue;
            const t = m.played_at.getTime();
            if ((lastPlayedAt.get(m.home_team_id) ?? 0) < t) lastPlayedAt.set(m.home_team_id, t);
            if ((lastPlayedAt.get(m.away_team_id) ?? 0) < t) lastPlayedAt.set(m.away_team_id, t);
        }

        const candidateMatches: ScheduleCandidateMatch[] = matches.map(m => ({
            id: m.id,
            home_team_id: m.home_team_id,
            away_team_id: m.away_team_id,
            round: m.round,
        }));

        const { updates, unscheduled } = this.scheduleMatchesWithRetry(
            candidateMatches, pool, minRestDays, lastPlayedAt,
        );

        const failed = await this.writeScheduleBatch(updates);
        unscheduled.push(...failed);
        return { matchesScheduled: updates.length - failed.length, failedMatchIds: unscheduled };
    }

    // ─── PRIVATE — BRACKET MATH ───────────────────────────────────────────────

    private buildAllSlotCreateData(
        phaseId: number,
        totalRounds: number,
        bracketSize: number,
        round1Pairings: { home: number | null; away: number | null }[],
    ): Prisma.BracketSlotCreateManyInput[] {
        const data: Prisma.BracketSlotCreateManyInput[] = [];
        for (let round = 1; round <= totalRounds; round++) {
            const slotsInRound = bracketSize / Math.pow(2, round);
            for (let slotNum = 1; slotNum <= slotsInRound; slotNum++) {
                const seed = round === 1 ? round1Pairings[slotNum - 1]! : null;
                data.push({
                    phase_id: phaseId,
                    round,
                    slot_number: slotNum,
                    is_bye: seed !== null && (seed.home === null || seed.away === null),
                    seeded_home_team_id: seed?.home ?? null,
                    seeded_away_team_id: seed?.away ?? null,
                    source_a_slot_id: null,
                    source_b_slot_id: null,
                });
            }
        }
        return data;
    }

    private async bulkLinkSlots(
        tx: Prisma.TransactionClient,
        updates: SlotLinkUpdate[],
    ): Promise<void> {
        if (updates.length === 0) return;
        const aCases = updates
            .filter(u => u.source_a_slot_id !== null)
            .map(u => Prisma.sql`WHEN ${u.id} THEN ${u.source_a_slot_id}`);
        const bCases = updates
            .filter(u => u.source_b_slot_id !== null)
            .map(u => Prisma.sql`WHEN ${u.id} THEN ${u.source_b_slot_id}`);
        const ids = updates.map(u => u.id);

        if (aCases.length > 0) {
            await tx.$executeRaw`
                UPDATE bracket_slots
                SET source_a_slot_id = CASE id ${Prisma.join(aCases, ' ')} ELSE source_a_slot_id END
                WHERE id IN (${Prisma.join(ids)})
            `;
        }
        if (bCases.length > 0) {
            await tx.$executeRaw`
                UPDATE bracket_slots
                SET source_b_slot_id = CASE id ${Prisma.join(bCases, ' ')} ELSE source_b_slot_id END
                WHERE id IN (${Prisma.join(ids)})
            `;
        }
    }
}