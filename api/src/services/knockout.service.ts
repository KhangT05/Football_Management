import { createAppError } from '../common/app.error.js';
import {
    Prisma,
    PrismaClient,
    MatchStatus,
} from '../generated/prisma/client.js';
import {
    AdvanceWinnerInput,
    BracketSlotNode,
    bracketSlotNodeSelect,
    byeSlotSelect,
    KNOCKOUT_PHASE_TYPE_SET,
    KnockoutGenerateOptions,
    KnockoutGenerateResult,
    SlotLinkUpdate,
    SlotWithParentLinks,
    slotWithParentLinksSelect,
} from '../types/knockout.type.js';
import { OptionalScheduleOptions, ScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { KNOCKOUT_PHASE_TYPES } from '../dtos/knockout.schema.js';
import { buildRound1Pairings, nextPowerOf2 } from '../helper/match.helper.js';

export class KnockoutService extends ScheduleEngine {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    // ─── generateKnockoutBracket ──────────────────────────────────────────────

    async generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult> {
        const warnings: string[] = [];

        if (options.seededTeamIds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 team cho knockout');
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');

        const bracketSize = nextPowerOf2(options.seededTeamIds.length);
        const byeCount = bracketSize - options.seededTeamIds.length;
        const totalRounds = Math.log2(bracketSize);

        if (byeCount > 0)
            warnings.push(`${byeCount} bye slot(s) — bracket size ${bracketSize}`);

        const seeding: (number | null)[] = [
            ...options.seededTeamIds,
            ...Array<null>(byeCount).fill(null),
        ];
        const round1Pairings = buildRound1Pairings(seeding);

        const byeSlotNumbers = new Set(
            round1Pairings
                .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
                .filter((n): n is number => n !== null),
        );

        const result = await this.prisma.$transaction(async tx => {
            const phase = await tx.phase.findUnique({
                where: { id: options.phaseId },
                select: { id: true, type: true, season_id: true, legs: true },
            });

            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${options.phaseId} không tồn tại`);
            if (!KNOCKOUT_PHASE_TYPE_SET.has(phase.type))
                throw createAppError('CONFLICT', `Phase type '${phase.type}' không phải knockout`);
            if (phase.season_id !== options.seasonId)
                throw createAppError('CONFLICT', 'Phase không thuộc season này');

            const existingCount = await tx.bracketSlot.count({ where: { phase_id: options.phaseId } });
            if (existingCount > 0)
                throw createAppError('CONFLICT', `Phase ${options.phaseId} đã có bracket`);

            const slotCreateData = this.buildAllSlotCreateData(
                options.phaseId, totalRounds, bracketSize, round1Pairings,
            );
            await tx.bracketSlot.createMany({ data: slotCreateData });

            const createdSlots = await tx.bracketSlot.findMany({
                where: { phase_id: options.phaseId },
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
                where: { phase_id: options.phaseId, round: 1, is_bye: false },
                select: {
                    id: true,
                    seeded_home_team_id: true,
                    seeded_away_team_id: true,
                },
            });

            const legs = phase.legs as 1 | 2;
            const { createdMatchIds, slotMatchLinks } = await this.createRound1Matches(
                tx, round1Slots, options.phaseId, legs,
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

            // FIX (double-bye): nếu sau khi propagate, có slot round > 1 đã
            // nhận đủ 2 seeded team (cả 2 nhánh con đều là bye) nhưng vẫn
            // chưa có match_id — không có gì trigger tạo match cho slot này vì
            // advanceWinner() chỉ chạy SAU KHI có 1 trận thật finish. Quét lại
            // toàn bộ slot tại đây, tự tạo match cho các slot bị "kẹt".
            const allSlotsAfterPropagate = await tx.bracketSlot.findMany({
                where: { phase_id: options.phaseId, match_id: null, is_bye: false },
                select: { id: true, round: true, slot_number: true, seeded_home_team_id: true, seeded_away_team_id: true },
            });

            const strandedSlots = allSlotsAfterPropagate.filter(
                s => s.round > 1 && s.seeded_home_team_id !== null && s.seeded_away_team_id !== null,
            );

            const strandedMatchIds: number[] = [];
            for (const slot of strandedSlots) {
                const m = await tx.match.create({
                    data: {
                        phase_id: options.phaseId,
                        home_team_id: slot.seeded_home_team_id!,
                        away_team_id: slot.seeded_away_team_id!,
                        status: MatchStatus.scheduled,
                        leg: legs > 1 ? 1 : null,
                        group_id: null,
                    },
                    select: { id: true },
                });
                await tx.bracketSlot.update({ where: { id: slot.id }, data: { match_id: m.id } });
                strandedMatchIds.push(m.id);

                if (legs === 2) {
                    await tx.match.create({
                        data: {
                            phase_id: options.phaseId,
                            home_team_id: slot.seeded_away_team_id!,
                            away_team_id: slot.seeded_home_team_id!,
                            status: MatchStatus.scheduled,
                            leg: 2,
                            group_id: null,
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
                totalSlots: slotCreateData.length,
                round1MatchIds: [...createdMatchIds, ...strandedMatchIds],
                byeSlots: byeCount,
            };
        }, { timeout: 30_000 });

        const scheduleResult = await this.scheduleMatchBatch(
            result.round1MatchIds, options.seasonId, options.phaseId, options,
        );

        if (scheduleResult.failedMatchIds.length > 0)
            warnings.push(
                `${scheduleResult.failedMatchIds.length} match chưa xếp được lịch: ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );

        return {
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
    ): Promise<{ matchCreated: boolean; newMatchId?: number }> {
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
                        status: MatchStatus.finished,
                    },
                    select: { id: true },
                });

                if (!leg1Match)
                    throw createAppError(
                        'NOT_FOUND',
                        `Không tìm thấy leg 1 match đã finished cho pairing ` +
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

            } else if (legs === 2) {
                const leg2Pending = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id!,
                        away_team_id: slot.seeded_home_team_id!,
                        leg: 2,
                        status: { not: MatchStatus.finished },
                    },
                    select: { id: true },
                });
                if (leg2Pending)
                    return { matchCreated: false, newMatchIds: [] as number[] };
            }

            return this.propagateWinner(tx, slot, input.winnerTeamId, phaseId, seasonId, legs);
        }, { timeout: 15_000 });

        if (result.matchCreated && result.newMatchIds.length > 0) {
            const scheduleResult = await this.scheduleMatchBatch(
                result.newMatchIds, seasonId, phaseId, scheduleOptions,
            );
            if (scheduleResult.failedMatchIds.length > 0) {
                console.warn(
                    `[KnockoutService] ${scheduleResult.failedMatchIds.length} match (advance) chưa xếp được lịch: ` +
                    `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
                );
            }
        }

        return { matchCreated: result.matchCreated, newMatchId: result.newMatchId };
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

    /**
     * FIX (idempotency): thêm guard `parentSlot.match_id !== null` ngay sau khi
     * xác nhận cả 2 slot con đã có winner, TRƯỚC khi tạo match mới.
     *
     * Trước đây nếu propagateWinner bị gọi 2 lần cho cùng matchId (retry sau
     * timeout dù request đầu đã commit, hoặc cron grace-period chen vào) —
     * lần gọi thứ 2 vẫn set lại seeded_home/away_team_id (vô hại, giá trị
     * giống cũ), nhưng sau đó vẫn tạo THÊM 1 match mới cho round kế tiếp vì
     * code cũ không check parent slot đã có match_id chưa. Bug này trước đây
     * được "cứu" gián tiếp qua _guardConfirm ở MatchResultService — nhưng đó
     * là phòng thủ ở tầng khác, không phải invariant của chính hàm này.
     *
     * NOTE: slotWithParentLinksSelect cần đảm bảo fed_as_a/fed_as_b nested
     * select có include match_id — nếu chưa, thêm vào types/knockout.type.ts.
     */
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
            // FIX: select thêm match_id để check idempotency ngay dưới đây
            select: { seeded_home_team_id: true, seeded_away_team_id: true, match_id: true },
        });

        if (!updated.seeded_home_team_id || !updated.seeded_away_team_id)
            return { matchCreated: false, newMatchIds: [] };

        // FIX: idempotency guard — nếu parent slot đã có match_id (match round
        // kế tiếp đã được tạo từ lần advance trước), không tạo thêm.
        if (updated.match_id !== null) {
            return { matchCreated: false, newMatchId: updated.match_id, newMatchIds: [] };
        }

        const homeId = updated.seeded_home_team_id;
        const awayId = updated.seeded_away_team_id;

        const leg1 = await tx.match.create({
            data: {
                phase_id: phaseId,
                home_team_id: homeId,
                away_team_id: awayId,
                status: MatchStatus.scheduled,
                leg: legs > 1 ? 1 : null,
                group_id: null,
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
                },
                select: { id: true },
            });
            newMatchIds.push(leg2.id);
        }

        return { matchCreated: true, newMatchId: leg1.id, newMatchIds };
    }

    // ─── createRound1Matches ──────────────────────────────────────────────────
    //
    // FIX: trước đây dùng createMany rồi lookup-by-key (home, away, leg) sau
    // đó — nếu 2 slot vô tình có cùng cặp (home, away, leg), map bị ghi đè,
    // silent wrong mapping. Không nên xảy ra với seeding chuẩn, nhưng đổi
    // sang tạo từng match tuần tự + link slotId trực tiếp loại bỏ hẳn rủi ro
    // này — round1Slots tối đa = bracketSize/2 (≤16 với bracket 32 đội), chi
    // phí N round-trip nhỏ, đổi lấy correctness chắc chắn.

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
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        if (matchIds.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        const [matches, phase] = await Promise.all([
            this.prisma.match.findMany({
                where: { id: { in: matchIds }, is_active: true },
                select: { id: true, home_team_id: true, away_team_id: true },
            }),
            this.prisma.phase.findUnique({
                where: { id: phaseId },
                select: { min_rest_days_per_team: true },
            }),
        ]);

        const minRestDays = phase?.min_rest_days_per_team ?? 3;
        const startDate = new Date();
        const rangeEnd = new Date(startDate);
        rangeEnd.setMonth(rangeEnd.getMonth() + 6);

        const teamIds = matches.flatMap(m => [m.home_team_id, m.away_team_id]);

        const [takenSet, recentMatches] = await Promise.all([
            this.loadTakenSlots(options.venueIds!, startDate, rangeEnd),
            this.prisma.match.findMany({
                where: {
                    phase: { season_id: seasonId },
                    status: MatchStatus.finished,
                    OR: [
                        { home_team_id: { in: teamIds } },
                        { away_team_id: { in: teamIds } },
                    ],
                },
                select: { home_team_id: true, away_team_id: true, played_at: true },
                orderBy: { played_at: 'desc' },
            }),
        ]);

        const pool = this.buildSlotPool(options.venueIds!, startDate, rangeEnd, options.matchTimes!, takenSet);

        const lastPlayedAt = new Map<number, number>();
        for (const m of recentMatches) {
            if (!m.played_at) continue;
            const t = m.played_at.getTime();
            if ((lastPlayedAt.get(m.home_team_id) ?? 0) < t) lastPlayedAt.set(m.home_team_id, t);
            if ((lastPlayedAt.get(m.away_team_id) ?? 0) < t) lastPlayedAt.set(m.away_team_id, t);
        }

        const usedSlotIdx = new Set<number>();
        const updates: { id: number; scheduledAt: Date; venueId: number }[] = [];
        const unscheduled: number[] = [];

        for (const match of matches) {
            const slotIdx = this.findEarliestValidSlot(
                pool, usedSlotIdx,
                match.home_team_id, match.away_team_id,
                lastPlayedAt, minRestDays,
            );

            if (slotIdx === -1) { unscheduled.push(match.id); continue; }

            const slot = pool[slotIdx]!;
            usedSlotIdx.add(slotIdx);

            const scheduledAt = this.vnTimeToUtc(slot.date, slot.time);
            lastPlayedAt.set(match.home_team_id, scheduledAt.getTime());
            lastPlayedAt.set(match.away_team_id, scheduledAt.getTime());
            updates.push({ id: match.id, scheduledAt, venueId: slot.venue_id });
        }

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