import { createAppError } from '../common/app.error.js';
import { Prisma, MatchStatus, PhaseFormat, PhaseStatus, } from '../generated/prisma/client.js';
import { bracketSlotNodeSelect, byeSlotSelect, BRACKET_SIZE_TO_PHASE_TYPE, slotWithParentLinksSelect, } from '../types/knockout.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { buildRound1Pairings, nextPowerOf2 } from '../helper/match.helper.js';
import { lockSeason } from '../helper/season-lock.helper.js';
const TERMINAL_MATCH_STATUSES = [MatchStatus.finished, MatchStatus.forfeited];
export class KnockoutService extends ScheduleEngine {
    standingsService;
    constructor(prisma, standingsService) {
        super(prisma);
        this.standingsService = standingsService;
    }
    // ─── PHASE RESOLUTION (season-scoped, mirror GroupService) ────────────────
    /**
     * Get-or-create knockout Phase theo (season, phaseType) — FE không còn
     * gửi phaseId, vì phaseId là OUTPUT của generate, không phải input.
     * Lock season trước để tránh race 2 request generate cùng lúc tạo trùng
     * phase (giống invariant của GroupService.getOrCreateRoundRobinPhase).
     */
    async getOrCreateKnockoutPhase(tx, seasonId, phaseType, legs) {
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
    phaseNameFor(t) {
        const map = {
            round_of_16: 'Vòng 16 đội',
            quarter_final: 'Tứ kết',
            semi_final: 'Bán kết',
            third_place: 'Tranh hạng 3',
            final: 'Chung kết',
        };
        return map[t] ?? t;
    }
    /**
     * Resolve SeedSource[] -> teamId[], GIỮ NGUYÊN thứ tự input (thứ tự này
     * quyết định seed 1 gặp seed cuối cùng qua buildRound1Pairings — không
     * được sort lại hay dùng Map iteration order thay thế).
     *
     * Trust-boundary: đọc TeamStanding.position đã persist là KHÔNG đủ an
     * toàn — recomputeGroupStandings vốn "eventually consistent" theo
     * comment gốc trong StandingsService (chạy sau khi match transaction
     * commit, có thể pending/fail). Recompute lại NGAY TRONG transaction
     * này trước khi đọc để loại race giữa "trận cuối vừa confirm" và
     * "admin bấm generate knockout".
     */
    async resolveSeeds(tx, seeds) {
        const groupIds = [
            ...new Set(seeds
                .filter((s) => s.kind === 'standing')
                .map(s => s.groupId)),
        ];
        if (groupIds.length > 0) {
            // Guard: group phải đá xong hết mới seed theo standings — tránh
            // seed dựa trên bảng chưa kết thúc (trận đang schedule/live).
            const pendingCount = await tx.match.count({
                where: {
                    group_id: { in: groupIds },
                    deleted_at: null,
                    status: { notIn: TERMINAL_MATCH_STATUSES },
                },
            });
            if (pendingCount > 0)
                throw createAppError('CONFLICT', `Còn ${pendingCount} match chưa kết thúc ở các group liên quan — ` +
                    `hoàn thành group stage trước khi tạo knockout`);
            // Recompute inline trong CÙNG transaction — atomic với việc tạo
            // bracket, không trust snapshot cũ. StandingsService.recomputeGroupStandings
            // phải nhận `tx` optional (xem patch riêng ở standing.service.ts).
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
            if (s.kind === 'manual')
                return s.teamId;
            const teamId = standingMap.get(`${s.groupId}:${s.rank}`);
            if (!teamId)
                throw createAppError('CONFLICT', `Không tìm thấy team hạng ${s.rank} ở group ${s.groupId} — ` +
                    `kiểm tra group đã có đủ team và đã recompute standings`);
            return teamId;
        });
        if (new Set(resolved).size !== resolved.length)
            throw createAppError('CONFLICT', 'Sau khi resolve, 2 seed trỏ cùng 1 team — data ranking không nhất quán ' +
                '(có thể do 1 team nằm trong nhiều seed source, hoặc DB standings sai)');
        return resolved;
    }
    // ─── generateKnockoutBracket ──────────────────────────────────────────────
    async generateKnockoutBracket(options) {
        const warnings = [];
        if (options.seeds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 seed cho knockout');
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');
        const bracketSize = nextPowerOf2(options.seeds.length);
        const phaseType = options.phaseTypeOverride ?? BRACKET_SIZE_TO_PHASE_TYPE[bracketSize];
        if (!phaseType)
            throw createAppError('VALIDATION_ERROR', `Bracket size ${bracketSize} không map được sang PhaseType chuẩn — ` +
                `truyền phaseTypeOverride nếu đây là case đặc biệt`);
        const byeCount = bracketSize - options.seeds.length;
        const totalRounds = Math.log2(bracketSize);
        if (byeCount > 0)
            warnings.push(`${byeCount} bye slot(s) — bracket size ${bracketSize}`);
        const result = await this.prisma.$transaction(async (tx) => {
            const phase = await this.getOrCreateKnockoutPhase(tx, options.seasonId, phaseType, options.legs);
            if (!phase.is_active)
                throw createAppError('CONFLICT', 'Phase đã bị deactivate');
            if (phase.status === PhaseStatus.locked)
                throw createAppError('CONFLICT', 'Phase đã locked, không thể generate bracket');
            const existingCount = await tx.bracketSlot.count({ where: { phase_id: phase.id } });
            if (existingCount > 0)
                throw createAppError('CONFLICT', `Phase ${phase.id} đã có bracket`);
            const seededTeamIds = await this.resolveSeeds(tx, options.seeds);
            const seeding = [
                ...seededTeamIds,
                ...Array(byeCount).fill(null),
            ];
            const round1Pairings = buildRound1Pairings(seeding);
            const byeSlotNumbers = new Set(round1Pairings
                .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
                .filter((n) => n !== null));
            const slotCreateData = this.buildAllSlotCreateData(phase.id, totalRounds, bracketSize, round1Pairings);
            await tx.bracketSlot.createMany({ data: slotCreateData });
            const createdSlots = await tx.bracketSlot.findMany({
                where: { phase_id: phase.id },
                select: { id: true, round: true, slot_number: true },
                orderBy: [{ round: 'asc' }, { slot_number: 'asc' }],
            });
            const slotMap = new Map(createdSlots.map(s => [`${s.round}:${s.slot_number}`, s.id]));
            const slotById = new Map(createdSlots.map(s => [s.id, s]));
            const linkUpdates = createdSlots
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
            const legs = phase.legs;
            const { createdMatchIds, slotMatchLinks } = await this.createRound1Matches(tx, round1Slots, phase.id, legs);
            if (slotMatchLinks.length > 0) {
                const cases = slotMatchLinks.map(l => Prisma.sql `WHEN ${l.slotId} THEN ${l.matchId}`);
                const ids = slotMatchLinks.map(l => l.slotId);
                await tx.$executeRaw `
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
            const parentUpdates = new Map();
            for (const bye of byeSlots) {
                const winner = bye.seeded_home_team_id ?? bye.seeded_away_team_id;
                if (!winner)
                    continue;
                const byeSlotEntry = slotById.get(bye.id);
                if (!byeSlotEntry)
                    continue;
                const parentSlotNumber = Math.ceil(byeSlotEntry.slot_number / 2);
                const parentId = slotMap.get(`2:${parentSlotNumber}`);
                if (!parentId)
                    continue;
                const isSourceA = (byeSlotEntry.slot_number % 2 === 1);
                const existing = parentUpdates.get(parentId) ?? {};
                if (isSourceA)
                    existing.home = winner;
                else
                    existing.away = winner;
                parentUpdates.set(parentId, existing);
            }
            if (parentUpdates.size > 0) {
                const homeCases = [];
                const awayCases = [];
                const parentIds = [];
                for (const [parentId, { home, away }] of parentUpdates) {
                    parentIds.push(parentId);
                    if (home !== undefined)
                        homeCases.push(Prisma.sql `WHEN ${parentId} THEN ${home}`);
                    if (away !== undefined)
                        awayCases.push(Prisma.sql `WHEN ${parentId} THEN ${away}`);
                }
                if (homeCases.length > 0) {
                    await tx.$executeRaw `
                        UPDATE bracket_slots
                        SET seeded_home_team_id = CASE id ${Prisma.join(homeCases, ' ')} ELSE seeded_home_team_id END
                        WHERE id IN (${Prisma.join(parentIds)})
                    `;
                }
                if (awayCases.length > 0) {
                    await tx.$executeRaw `
                        UPDATE bracket_slots
                        SET seeded_away_team_id = CASE id ${Prisma.join(awayCases, ' ')} ELSE seeded_away_team_id END
                        WHERE id IN (${Prisma.join(parentIds)})
                    `;
                }
            }
            // Double-bye: slot round > 1 nhận đủ 2 seeded team ngay từ bye
            // propagation nhưng chưa có match_id — advanceWinner() chỉ chạy
            // sau khi có 1 trận THẬT finish, nên slot này bị "kẹt" nếu không
            // quét lại và tự tạo match ở đây.
            const allSlotsAfterPropagate = await tx.bracketSlot.findMany({
                where: { phase_id: phase.id, match_id: null, is_bye: false },
                select: { id: true, round: true, slot_number: true, seeded_home_team_id: true, seeded_away_team_id: true },
            });
            const strandedSlots = allSlotsAfterPropagate.filter(s => s.round > 1 && s.seeded_home_team_id !== null && s.seeded_away_team_id !== null);
            const strandedMatchIds = [];
            for (const slot of strandedSlots) {
                const m = await tx.match.create({
                    data: {
                        phase_id: phase.id,
                        home_team_id: slot.seeded_home_team_id,
                        away_team_id: slot.seeded_away_team_id,
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
                            phase_id: phase.id,
                            home_team_id: slot.seeded_away_team_id,
                            away_team_id: slot.seeded_home_team_id,
                            status: MatchStatus.scheduled,
                            leg: 2,
                            group_id: null,
                        },
                    });
                }
            }
            if (strandedSlots.length > 0)
                warnings.push(`${strandedSlots.length} slot round > 1 nhận đủ 2 đội ngay từ bye propagation ` +
                    `(double-bye) — đã tự tạo match cho các slot này.`);
            return {
                phaseId: phase.id,
                phaseType: phase.type,
                totalSlots: slotCreateData.length,
                round1MatchIds: [...createdMatchIds, ...strandedMatchIds],
                byeSlots: byeCount,
            };
        }, { timeout: 30_000 });
        const scheduleResult = await this.scheduleMatchBatch(result.round1MatchIds, options.seasonId, result.phaseId, options);
        if (scheduleResult.failedMatchIds.length > 0)
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp được lịch: ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
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
    async advanceWinner(phaseId, seasonId, input, scheduleOptions) {
        const result = await this.prisma.$transaction(async (tx) => {
            const phase = await tx.phase.findUnique({
                where: { id: phaseId },
                select: { legs: true },
            });
            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);
            const legs = phase.legs;
            let slot = await tx.bracketSlot.findFirst({
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
                    throw createAppError('NOT_FOUND', `Không tìm thấy leg 1 match đã kết thúc (finished/forfeited) cho pairing ` +
                        `(home=${match.away_team_id}, away=${match.home_team_id}) trong phase ${phaseId}`);
                slot = await tx.bracketSlot.findFirst({
                    where: { match_id: leg1Match.id },
                    select: slotWithParentLinksSelect,
                });
                if (!slot)
                    throw createAppError('NOT_FOUND', `Không tìm thấy BracketSlot cho leg 1 match ${leg1Match.id}`);
                resolvedWinnerId = await this._computeAggregateWinner(tx, leg1Match.id, input.matchId, slot.seeded_home_team_id, slot.seeded_away_team_id);
            }
            else if (legs === 2) {
                const leg2Pending = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id,
                        away_team_id: slot.seeded_home_team_id,
                        leg: 2,
                        status: { notIn: TERMINAL_MATCH_STATUSES },
                    },
                    select: { id: true },
                });
                if (leg2Pending)
                    return { matchCreated: false, newMatchIds: [] };
                const leg2Match = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id,
                        away_team_id: slot.seeded_home_team_id,
                        leg: 2,
                        status: { in: TERMINAL_MATCH_STATUSES },
                    },
                    select: { id: true },
                });
                if (leg2Match) {
                    resolvedWinnerId = await this._computeAggregateWinner(tx, input.matchId, leg2Match.id, slot.seeded_home_team_id, slot.seeded_away_team_id);
                }
                // leg2Match null: leg 2 chưa tồn tại — giữ resolvedWinnerId =
                // input.winnerTeamId làm fallback (không nên xảy ra nếu
                // createRound1Matches/propagateWinner luôn tạo đủ cả 2 leg
                // cùng lúc — đúng invariant hiện tại của code).
            }
            return this.propagateWinner(tx, slot, resolvedWinnerId, phaseId, seasonId, legs);
        }, { timeout: 15_000 });
        if (result.matchCreated && result.newMatchIds.length > 0) {
            const scheduleResult = await this.scheduleMatchBatch(result.newMatchIds, seasonId, phaseId, scheduleOptions);
            if (scheduleResult.failedMatchIds.length > 0) {
                console.warn(`[KnockoutService] ${scheduleResult.failedMatchIds.length} match (advance) chưa xếp được lịch: ` +
                    `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
            }
        }
        return { matchCreated: result.matchCreated, newMatchId: result.newMatchId };
    }
    /**
     * Tính winner theo aggregate 2 lượt. Away-goals KHÔNG áp dụng (assumption
     * — đổi lại nếu giải dùng luật cũ). Nếu aggregate hoà, winner quyết bằng
     * penalty của leg 2 — nếu leg 2 không có penalty score, fail loud thay
     * vì đoán.
     */
    async _computeAggregateWinner(tx, leg1MatchId, leg2MatchId, slotHomeTeamId, slotAwayTeamId) {
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
            throw createAppError('CONFLICT', `Thiếu MatchResult cho leg 1 (${leg1MatchId}) hoặc leg 2 (${leg2MatchId}) — không tính được aggregate`);
        const slotHomeAgg = leg1Result.home_final_score + leg2Result.away_final_score;
        const slotAwayAgg = leg1Result.away_final_score + leg2Result.home_final_score;
        if (slotHomeAgg !== slotAwayAgg)
            return slotHomeAgg > slotAwayAgg ? slotHomeTeamId : slotAwayTeamId;
        if (leg2Result.home_penalty_score !== null && leg2Result.away_penalty_score !== null) {
            const homeWonPenalty = leg2Result.home_penalty_score > leg2Result.away_penalty_score;
            return homeWonPenalty ? slotAwayTeamId : slotHomeTeamId; // leg2 home = slotAway
        }
        throw createAppError('CONFLICT', `Aggregate hoà ${slotHomeAgg}-${slotAwayAgg} giữa leg 1 (${leg1MatchId}) và leg 2 (${leg2MatchId}) ` +
            `nhưng leg 2 không có penalty score — không xác định được winner.`);
    }
    async getBracket(phaseId) {
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
    async propagateWinner(tx, slot, winnerTeamId, phaseId, seasonId, legs) {
        const parentViaA = slot.fed_as_a[0] ?? null;
        const parentViaB = slot.fed_as_b[0] ?? null;
        const parentSlot = parentViaA ?? parentViaB;
        if (!parentSlot)
            return { matchCreated: false, newMatchIds: [] };
        const isHomeInParent = parentViaA !== null;
        const updated = await tx.bracketSlot.update({
            where: { id: parentSlot.id },
            data: isHomeInParent
                ? { seeded_home_team_id: winnerTeamId }
                : { seeded_away_team_id: winnerTeamId },
            select: { seeded_home_team_id: true, seeded_away_team_id: true, match_id: true },
        });
        if (!updated.seeded_home_team_id || !updated.seeded_away_team_id)
            return { matchCreated: false, newMatchIds: [] };
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
    async createRound1Matches(tx, round1Slots, phaseId, legs) {
        if (round1Slots.length === 0)
            return { createdMatchIds: [], slotMatchLinks: [] };
        const createdMatchIds = [];
        const slotMatchLinks = [];
        for (const slot of round1Slots) {
            const homeId = slot.seeded_home_team_id;
            const awayId = slot.seeded_away_team_id;
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
    async scheduleMatchBatch(matchIds, seasonId, phaseId, options) {
        if (matchIds.length === 0)
            return { matchesScheduled: 0, failedMatchIds: [] };
        const [matches, phase, season] = await Promise.all([
            this.prisma.match.findMany({
                where: { id: { in: matchIds }, is_active: true },
                select: { id: true, home_team_id: true, away_team_id: true },
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
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có end_date`);
        const minRestDays = phase?.min_rest_days_per_team ?? 3;
        const now = new Date();
        const startDate = season.start_date && season.start_date > now ? season.start_date : now;
        const rangeEnd = season.end_date;
        if (rangeEnd <= startDate)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} end_date (${rangeEnd.toISOString()}) không sau startDate ` +
                `(${startDate.toISOString()}) — không đủ khoảng thời gian để xếp lịch knockout`);
        const teamIds = matches.flatMap(m => [m.home_team_id, m.away_team_id]);
        const [takenSet, recentMatches] = await Promise.all([
            this.loadTakenSlots(options.venueIds, startDate, rangeEnd),
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
        const pool = this.buildSlotPool(options.venueIds, startDate, rangeEnd, options.matchTimes, takenSet);
        if (pool.length < matches.length) {
            throw createAppError('VALIDATION_ERROR', `Không đủ slot cho knockout: cần ${matches.length}, chỉ có ${pool.length}. ` +
                `Thêm venueId / matchTime hoặc mở rộng end_date của season.`);
        }
        const lastPlayedAt = new Map();
        for (const m of recentMatches) {
            if (!m.played_at)
                continue;
            const t = m.played_at.getTime();
            if ((lastPlayedAt.get(m.home_team_id) ?? 0) < t)
                lastPlayedAt.set(m.home_team_id, t);
            if ((lastPlayedAt.get(m.away_team_id) ?? 0) < t)
                lastPlayedAt.set(m.away_team_id, t);
        }
        const usedSlotIdx = new Set();
        const updates = [];
        const unscheduled = [];
        for (const match of matches) {
            const slotIdx = this.findEarliestValidSlot(pool, usedSlotIdx, match.home_team_id, match.away_team_id, lastPlayedAt, minRestDays);
            if (slotIdx === -1) {
                unscheduled.push(match.id);
                continue;
            }
            const slot = pool[slotIdx];
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
    buildAllSlotCreateData(phaseId, totalRounds, bracketSize, round1Pairings) {
        const data = [];
        for (let round = 1; round <= totalRounds; round++) {
            const slotsInRound = bracketSize / Math.pow(2, round);
            for (let slotNum = 1; slotNum <= slotsInRound; slotNum++) {
                const seed = round === 1 ? round1Pairings[slotNum - 1] : null;
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
    async bulkLinkSlots(tx, updates) {
        if (updates.length === 0)
            return;
        const aCases = updates
            .filter(u => u.source_a_slot_id !== null)
            .map(u => Prisma.sql `WHEN ${u.id} THEN ${u.source_a_slot_id}`);
        const bCases = updates
            .filter(u => u.source_b_slot_id !== null)
            .map(u => Prisma.sql `WHEN ${u.id} THEN ${u.source_b_slot_id}`);
        const ids = updates.map(u => u.id);
        if (aCases.length > 0) {
            await tx.$executeRaw `
                UPDATE bracket_slots
                SET source_a_slot_id = CASE id ${Prisma.join(aCases, ' ')} ELSE source_a_slot_id END
                WHERE id IN (${Prisma.join(ids)})
            `;
        }
        if (bCases.length > 0) {
            await tx.$executeRaw `
                UPDATE bracket_slots
                SET source_b_slot_id = CASE id ${Prisma.join(bCases, ' ')} ELSE source_b_slot_id END
                WHERE id IN (${Prisma.join(ids)})
            `;
        }
    }
}
//# sourceMappingURL=knockout.service.js.map