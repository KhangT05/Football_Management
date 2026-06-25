import { createAppError } from '../common/app.error.js';
import { Prisma, MatchStatus, } from '../generated/prisma/client.js';
import { bracketSlotNodeSelect, byeSlotSelect, KNOCKOUT_PHASE_TYPE_SET, slotWithParentLinksSelect, } from '../types/knockout.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
export class KnockoutService extends ScheduleEngine {
    constructor(prisma) {
        super(prisma);
    }
    async generateKnockoutBracket(options) {
        const warnings = [];
        if (options.seededTeamIds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 team cho knockout');
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');
        const bracketSize = this.nextPowerOf2(options.seededTeamIds.length);
        const byeCount = bracketSize - options.seededTeamIds.length;
        const totalRounds = Math.log2(bracketSize);
        if (byeCount > 0)
            warnings.push(`${byeCount} bye slot(s) — bracket size ${bracketSize}`);
        const seeding = [
            ...options.seededTeamIds,
            ...Array(byeCount).fill(null),
        ];
        const round1Pairings = this.buildRound1Pairings(seeding);
        const byeSlotNumbers = new Set(round1Pairings
            .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
            .filter((n) => n !== null));
        const result = await this.prisma.$transaction(async (tx) => {
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
            const slotCreateData = this.buildAllSlotCreateData(options.phaseId, totalRounds, bracketSize, round1Pairings);
            await tx.bracketSlot.createMany({ data: slotCreateData });
            const createdSlots = await tx.bracketSlot.findMany({
                where: { phase_id: options.phaseId },
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
                where: { phase_id: options.phaseId, round: 1, is_bye: false },
                select: {
                    id: true,
                    seeded_home_team_id: true,
                    seeded_away_team_id: true,
                },
            });
            const legs = phase.legs;
            const { createdMatchIds, slotMatchLinks } = await this.createRound1Matches(tx, round1Slots, options.phaseId, options.seasonId, legs);
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
            return {
                totalSlots: slotCreateData.length,
                round1MatchIds: createdMatchIds,
                byeSlots: byeCount,
            };
        }, { timeout: 30_000 });
        const scheduleResult = await this.scheduleMatchBatch(result.round1MatchIds, options.seasonId, options.phaseId, options);
        if (scheduleResult.failedMatchIds.length > 0)
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp được lịch: ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
        return {
            totalSlots: result.totalSlots,
            round1Matches: result.round1MatchIds.length,
            byeSlots: result.byeSlots,
            warnings,
        };
    }
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
            if (!slot) {
                const match = await tx.match.findUnique({
                    where: { id: input.matchId },
                    select: { leg: true, home_team_id: true, away_team_id: true, phase_id: true },
                });
                if (!match || match.phase_id !== phaseId)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không thuộc phase ${phaseId}`);
                if (match.leg !== 2)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không link với BracketSlot`);
                slot = await tx.bracketSlot.findFirst({
                    where: {
                        phase_id: phaseId,
                        seeded_home_team_id: match.away_team_id,
                        seeded_away_team_id: match.home_team_id,
                    },
                    select: slotWithParentLinksSelect,
                });
                if (!slot)
                    throw createAppError('NOT_FOUND', 'Không tìm thấy BracketSlot cho two-legged match');
            }
            else if (legs === 2) {
                const leg2Pending = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id,
                        away_team_id: slot.seeded_home_team_id,
                        leg: 2,
                        status: { not: MatchStatus.finished },
                    },
                    select: { id: true },
                });
                if (leg2Pending)
                    return { matchCreated: false, newMatchIds: [] };
            }
            return this.propagateWinner(tx, slot, input.winnerTeamId, phaseId, seasonId, legs);
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
    // ─────────────────────────────────────────────────────────────────────────────
    // PRIVATE — BRACKET LOGIC
    // ─────────────────────────────────────────────────────────────────────────────
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
            select: { seeded_home_team_id: true, seeded_away_team_id: true },
        });
        if (!updated.seeded_home_team_id || !updated.seeded_away_team_id)
            return { matchCreated: false, newMatchIds: [] };
        const homeId = updated.seeded_home_team_id;
        const awayId = updated.seeded_away_team_id;
        const leg1 = await tx.match.create({
            data: {
                phase_id: phaseId,
                season_id: seasonId,
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
                    season_id: seasonId,
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
    async createRound1Matches(tx, round1Slots, phaseId, seasonId, legs) {
        if (round1Slots.length === 0)
            return { createdMatchIds: [], slotMatchLinks: [] };
        const matchKey = (home, away, leg) => `${home}:${away}:${leg ?? 'x'}`;
        const matchCreateData = [];
        const leg1Meta = [];
        const leg1Tag = legs > 1 ? 1 : null;
        for (const slot of round1Slots) {
            const homeId = slot.seeded_home_team_id;
            const awayId = slot.seeded_away_team_id;
            matchCreateData.push({
                phase_id: phaseId,
                home_team_id: homeId,
                away_team_id: awayId,
                status: MatchStatus.scheduled,
                leg: leg1Tag,
                group_id: null,
            });
            leg1Meta.push({ slotId: slot.id, key: matchKey(homeId, awayId, leg1Tag) });
            if (legs === 2) {
                matchCreateData.push({
                    phase_id: phaseId,
                    home_team_id: awayId,
                    away_team_id: homeId,
                    status: MatchStatus.scheduled,
                    leg: 2,
                    group_id: null,
                });
            }
        }
        await tx.match.createMany({ data: matchCreateData });
        const createdMatches = await tx.match.findMany({
            where: { phase_id: phaseId, season_id: seasonId },
            select: { id: true, home_team_id: true, away_team_id: true, leg: true },
            orderBy: { id: 'asc' },
        });
        const matchIdByKey = new Map(createdMatches.map(m => [matchKey(m.home_team_id, m.away_team_id, m.leg), m.id]));
        const slotMatchLinks = [];
        for (const meta of leg1Meta) {
            const matchId = matchIdByKey.get(meta.key);
            if (matchId === undefined)
                throw createAppError('CONFLICT', `Không tìm thấy match vừa tạo cho slot ${meta.slotId}`);
            slotMatchLinks.push({ slotId: meta.slotId, matchId });
        }
        return {
            createdMatchIds: createdMatches.map(m => m.id),
            slotMatchLinks,
        };
    }
    // ─────────────────────────────────────────────────────────────────────────────
    // PRIVATE — SCHEDULING
    // ─────────────────────────────────────────────────────────────────────────────
    async scheduleMatchBatch(matchIds, seasonId, phaseId, options) {
        if (matchIds.length === 0)
            return { matchesScheduled: 0, failedMatchIds: [] };
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
            this.loadTakenSlots(options.venueIds, startDate, rangeEnd),
            this.prisma.match.findMany({
                where: {
                    season_id: seasonId,
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
    // ─────────────────────────────────────────────────────────────────────────────
    // PRIVATE — BRACKET MATH
    // ─────────────────────────────────────────────────────────────────────────────
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
    nextPowerOf2(n) {
        let p = 1;
        while (p < n)
            p *= 2;
        return p;
    }
    buildRound1Pairings(seeding) {
        const n = seeding.length;
        return Array.from({ length: n / 2 }, (_, i) => ({
            home: seeding[i] ?? null,
            away: seeding[n - 1 - i] ?? null,
        }));
    }
}
//# sourceMappingURL=knockout.service.js.map