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
import { ScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { KNOCKOUT_PHASE_TYPES } from '../dtos/knockout.schema.js';

// Set cho O(1) lookup — KNOCKOUT_PHASE_TYPES (tuple) là source of truth dùng chung
// với validation layer (knockout.schema.ts)

// ── Building-block select — compose bằng spread thay vì lặp field list ──────
// Mỗi nhóm field xuất hiện ở nhiều query khác nhau trong service này; tách
// riêng để sửa 1 chỗ khi schema đổi, và compose (...) ở từng query theo đúng
// nhu cầu — vẫn tránh fetch dư cột (created_at/updated_at/...) như select rời.

export class KnockoutService extends ScheduleEngine {

    constructor(prisma: PrismaClient) {
        super(prisma);
    }

    async generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult> {
        const warnings: string[] = [];

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

        // Standard seeding: seed 1 vs N, 2 vs N-1
        const seeding: (number | null)[] = [
            ...options.seededTeamIds,
            ...Array<null>(byeCount).fill(null),
        ];
        const round1Pairings = this.buildRound1Pairings(seeding);

        // Derive bye slot_number từ pairings — pure, không cần round-trip DB.
        // Tránh O(n²) lookup qua slotCreateData.find() sau khi đã insert.
        const byeSlotNumbers = new Set(
            round1Pairings
                .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
                .filter((n): n is number => n !== null),
        );

        const result = await this.prisma.$transaction(async tx => {
            // ── Guard ────────────────────────────────────────────────────────────
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

            // ── Step 1: createMany tất cả slots, KHÔNG có source links ───────────
            // Tránh N sequential roundtrips trong transaction.
            // Source links được set ở step 3 sau khi có IDs.
            const slotCreateData = this.buildAllSlotCreateData(
                options.phaseId, totalRounds, bracketSize, round1Pairings,
            );
            await tx.bracketSlot.createMany({ data: slotCreateData });

            // ── Step 2: Fetch IDs vừa tạo để build slotMap ───────────────────────
            const createdSlots = await tx.bracketSlot.findMany({
                where: { phase_id: options.phaseId },
                select: { id: true, round: true, slot_number: true },
                orderBy: [{ round: 'asc' }, { slot_number: 'asc' }],
            });

            const slotMap = new Map(createdSlots.map(s => [`${s.round}:${s.slot_number}`, s.id]));
            // Lookup theo id — dùng lại ở step 5, tránh .find() lặp O(n) mỗi lần.
            const slotById = new Map(createdSlots.map(s => [s.id, s]));

            // ── Step 3: Bulk-update source links (1 roundtrip) ───────────────────
            const linkUpdates: SlotLinkUpdate[] = createdSlots
                .filter(s => s.round > 1)
                .map(s => ({
                    id: s.id,
                    // slot k ở round r ← winner of slot (2k-1) và (2k) ở round r-1
                    source_a_slot_id: slotMap.get(`${s.round - 1}:${2 * s.slot_number - 1}`) ?? null,
                    source_b_slot_id: slotMap.get(`${s.round - 1}:${2 * s.slot_number}`) ?? null,
                }));

            await this.bulkLinkSlots(tx, linkUpdates);

            // ── Step 4: Tạo match cho round 1 non-bye slots (batched) ────────────
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
                tx, round1Slots, options.phaseId, options.seasonId, legs,
            );

            // Bulk link slot → match_id (1 roundtrip thay vì N updates)
            if (slotMatchLinks.length > 0) {
                const cases = slotMatchLinks.map(l => Prisma.sql`WHEN ${l.slotId} THEN ${l.matchId}`);
                const ids = slotMatchLinks.map(l => l.slotId);
                await tx.$executeRaw`
                    UPDATE bracket_slots
                    SET match_id = CASE id ${Prisma.join(cases, ' ')} END
                    WHERE id IN (${Prisma.join(ids)})
                `;
            }

            // ── Step 5: Resolve bye slots — collect winner + parent slot pairs ───
            // Xử lý tất cả byes TRƯỚC khi tạo match round 2, tránh race trên
            // parent slot khi 2 bye liền kề cùng feed vào 1 parent.
            const byeSlotIds = createdSlots
                .filter(s => s.round === 1 && byeSlotNumbers.has(s.slot_number))
                .map(s => s.id);

            // Re-fetch bye slots đầy đủ để lấy seeded teams
            const byeSlots = byeSlotIds.length > 0
                ? await tx.bracketSlot.findMany({
                    where: { id: { in: byeSlotIds } },
                    select: byeSlotSelect,
                })
                : [];

            // Build bye winner updates: group by parent slot
            // parentSlotId → { home?: number, away?: number }
            const parentUpdates = new Map<number, { home?: number; away?: number }>();

            for (const bye of byeSlots) {
                const winner = bye.seeded_home_team_id ?? bye.seeded_away_team_id;
                if (!winner) continue;

                const byeSlotEntry = slotById.get(bye.id);
                if (!byeSlotEntry) continue;

                const parentSlotNumber = Math.ceil(byeSlotEntry.slot_number / 2);
                const parentId = slotMap.get(`2:${parentSlotNumber}`);
                if (!parentId) continue;

                const isSourceA = (byeSlotEntry.slot_number % 2 === 1); // odd slot_number = source_a
                const existing = parentUpdates.get(parentId) ?? {};
                if (isSourceA) existing.home = winner;
                else existing.away = winner;
                parentUpdates.set(parentId, existing);
            }

            // Bulk update parent slots với bye winners
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

            return {
                totalSlots: slotCreateData.length,
                round1MatchIds: createdMatchIds,
                byeSlots: byeCount,
            };
        }, { timeout: 30_000 });

        // ── Step 6: Auto-schedule round 1 matches (ngoài TX) ─────────────────
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

    /**
     * Gọi sau khi MatchResultService đã xác định winner (aggregate 2 legs nếu cần).
     * KnockoutService không tự aggregate — nhận winnerTeamId từ caller.
     *
     * winnerTeamId: number (không nullable) — invalid state "draw trong knockout"
     * bị loại ở schema layer (advanceWinnerInputSchema), không model ở đây nữa.
     */
    async advanceWinner(
        phaseId: number,
        seasonId: number,
        input: AdvanceWinnerInput,
        scheduleOptions: ScheduleOptions,
    ): Promise<{ matchCreated: boolean; newMatchId?: number }> {
        return this.prisma.$transaction(async tx => {
            // Fetch legs 1 lần — dùng cho cả nhánh leg2Pending check và propagateWinner.
            const phase = await tx.phase.findUnique({
                where: { id: phaseId },
                select: { legs: true },
            });
            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);

            const legs = phase.legs as 1 | 2;

            // Tìm slot anchor (leg 1 link)
            // select thay include: propagateWinner chỉ cần .id của parent slot,
            // không cần full BracketSlot row của fed_as_a/fed_as_b.
            let slot: SlotWithParentLinks | null = await tx.bracketSlot.findFirst({
                where: { match_id: input.matchId },
                select: slotWithParentLinksSelect,
            });

            // Không tìm thấy → có thể là leg 2 (không link match_id)
            if (!slot) {
                const match = await tx.match.findUnique({
                    where: { id: input.matchId },
                    select: { leg: true, home_team_id: true, away_team_id: true, phase_id: true },
                });

                if (!match || match.phase_id !== phaseId)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không thuộc phase ${phaseId}`);
                if (match.leg !== 2)
                    throw createAppError('NOT_FOUND', `Match ${input.matchId} không link với BracketSlot`);

                // Leg 2: tìm slot qua leg 1 (home/away đảo)
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
            } else if (legs === 2) {
                // Leg 1 finished, two-legged — check leg 2 đã xong chưa
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
                if (leg2Pending) return { matchCreated: false };
            }

            return this.propagateWinner(tx, slot, input.winnerTeamId, phaseId, seasonId, legs, scheduleOptions);
        }, { timeout: 15_000 });
    }

    async getBracket(phaseId: number): Promise<BracketSlotNode[]> {
        // select tường minh (compose từ building-block ở đầu file) thay vì
        // fetch full row rồi map — tránh kéo dư cột không dùng qua network.
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

    private async propagateWinner(
        tx: Prisma.TransactionClient,
        slot: SlotWithParentLinks,
        winnerTeamId: number,
        phaseId: number,
        seasonId: number,
        legs: 1 | 2,
        scheduleOptions: ScheduleOptions,
    ): Promise<{ matchCreated: boolean; newMatchId?: number }> {
        const parentViaA = slot.fed_as_a[0] ?? null;
        const parentViaB = slot.fed_as_b[0] ?? null;
        const parentSlot = parentViaA ?? parentViaB;

        if (!parentSlot) return { matchCreated: false }; // Final đã xong

        const isHomeInParent = parentViaA !== null;

        // Update + select gộp 1 roundtrip — bỏ findUnique riêng.
        const updated = await tx.bracketSlot.update({
            where: { id: parentSlot.id },
            data: isHomeInParent
                ? { seeded_home_team_id: winnerTeamId }
                : { seeded_away_team_id: winnerTeamId },
            select: { seeded_home_team_id: true, seeded_away_team_id: true },
        });

        if (!updated.seeded_home_team_id || !updated.seeded_away_team_id)
            return { matchCreated: false }; // chờ winner slot kia

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

        // Fire-and-forget — guaranteed delivery cần job queue (BullMQ/pg-boss)
        setImmediate(async () => {
            try {
                await this.scheduleMatchBatch(newMatchIds, phaseId, seasonId, scheduleOptions);
            } catch (err) {
                console.error(`[KnockoutService] schedule failed for matches ${newMatchIds}:`, err);
            }
        });

        return { matchCreated: true, newMatchId: leg1.id };
    }

    /**
     * Batch-create match cho round 1 (thay N sequential `tx.match.create()`).
     *
     * MySQL `createMany` không trả id → re-fetch theo composite key
     * (home_team_id:away_team_id:leg) để map ngược lại match.id. Key này
     * unique trong phạm vi round 1 vì seededTeamIds đã được validate
     * không trùng (knockout.schema.ts) — mỗi team chỉ xuất hiện ở đúng
     * 1 slot, nên mọi pairing home/away trong round 1 là duy nhất.
     *
     * Chỉ leg 1 được link vào bracket_slots.match_id (đúng hành vi gốc) —
     * leg 2 được resolve qua home/away đảo trong advanceWinner().
     */
    private async createRound1Matches(
        tx: Prisma.TransactionClient,
        round1Slots: { id: number; seeded_home_team_id: number | null; seeded_away_team_id: number | null }[],
        phaseId: number,
        seasonId: number,
        legs: 1 | 2,
    ): Promise<{ createdMatchIds: number[]; slotMatchLinks: { slotId: number; matchId: number }[] }> {
        if (round1Slots.length === 0)
            return { createdMatchIds: [], slotMatchLinks: [] };

        const matchKey = (home: number, away: number, leg: number | null) => `${home}:${away}:${leg ?? 'x'}`;

        const matchCreateData: Prisma.MatchCreateManyInput[] = [];
        // Chỉ track leg 1 — đây là phần cần map ngược về slot.
        const leg1Meta: { slotId: number; key: string }[] = [];
        const leg1Tag = legs > 1 ? 1 : null;

        for (const slot of round1Slots) {
            const homeId = slot.seeded_home_team_id!;
            const awayId = slot.seeded_away_team_id!;

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

        // Re-fetch — an toàn vì existingCount guard ở generateKnockoutBracket
        // đảm bảo phase này chưa có match nào trước batch insert này.
        const createdMatches = await tx.match.findMany({
            where: { phase_id: phaseId, season_id: seasonId },
            select: { id: true, home_team_id: true, away_team_id: true, leg: true },
            orderBy: { id: 'asc' }, // deterministic order cho schedule batch phía sau
        });

        const matchIdByKey = new Map(
            createdMatches.map(m => [matchKey(m.home_team_id, m.away_team_id, m.leg), m.id]),
        );

        const slotMatchLinks: { slotId: number; matchId: number }[] = [];
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

    private async scheduleMatchBatch(
        matchIds: number[],
        seasonId: number,
        phasesId: number,
        options: ScheduleOptions,
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        if (matchIds.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        const [matches, phase] = await Promise.all([
            this.prisma.match.findMany({
                where: { id: { in: matchIds }, is_active: true },
                select: { id: true, home_team_id: true, away_team_id: true },
            }),
            this.prisma.phase.findUnique({
                where: { id: phasesId, },
                select: { min_rest_days_per_team: true },
            }),
        ]);

        const minRestDays = phase?.min_rest_days_per_team ?? 3;
        const startDate = new Date(); // knockout: schedule từ now
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

    // ─────────────────────────────────────────────────────────────────────────────
    // PRIVATE — BRACKET MATH
    // ─────────────────────────────────────────────────────────────────────────────

    /**
     * Build flat data array cho createMany — không có source links (set sau).
     * Iterate round 1 → totalRounds (không cần reverse vì links set riêng).
     *
     * Round 1 (leaf) và round>1 (internal) gộp chung 1 nhánh — khác biệt duy
     * nhất là seed data, phần còn lại (phase_id/round/slot_number/source_*)
     * giống nhau nên không cần 2 object literal lặp lại.
     */
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
                    // round 1: null vì là leaf node. round>1: set sau via bulkLinkSlots.
                    source_a_slot_id: null,
                    source_b_slot_id: null,
                });
            }
        }
        return data;
    }

    /**
     * Bulk-update source_a/b_slot_id sau khi có IDs từ createMany.
     * 1 roundtrip thay vì N updates.
     */
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

    private nextPowerOf2(n: number): number {
        let p = 1;
        while (p < n) p *= 2;
        return p;
    }

    private buildRound1Pairings(
        seeding: (number | null)[],
    ): { home: number | null; away: number | null }[] {
        const n = seeding.length;
        return Array.from({ length: n / 2 }, (_, i) => ({
            home: seeding[i] ?? null,
            away: seeding[n - 1 - i] ?? null,
        }));
    }
}