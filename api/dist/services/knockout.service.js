import { createAppError } from '../common/app.error.js';
import { Prisma, MatchStatus, PhaseType, PhaseFormat, PhaseStatus, SeasonStatus, } from '../generated/prisma/client.js';
import { bracketSlotNodeSelect, byeSlotSelect, BRACKET_SIZE_TO_PHASE_TYPE, slotWithParentLinksSelect, } from '../types/knockout.type.js';
import { ScheduleEngine, DEFAULT_VENUE_BUFFER_MINUTES } from '../libs/schedule.engine.js';
import { buildRound1Pairings, nextPowerOf2 } from '../helper/match.helper.js';
import { lockSeason } from '../helper/season-lock.helper.js';
import { shuffle } from '../libs/array.utils.js';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
const TERMINAL_MATCH_STATUSES = [MatchStatus.finished, MatchStatus.forfeited];
function vnStartOfDay(d) {
    const vnDateStr = formatInTimeZone(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    return fromZonedTime(`${vnDateStr}T00:00:00`, 'Asia/Ho_Chi_Minh');
}
function vnEndOfDay(d) {
    const vnDateStr = formatInTimeZone(d, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
    return fromZonedTime(`${vnDateStr}T23:59:59.999`, 'Asia/Ho_Chi_Minh');
}
// NEW: thứ tự tiền đề giữa các vòng knockout — dùng để chặn tạo phase sau
// (vd 'final') khi phase trước ('semi_final') chưa tồn tại hoặc còn trận
// chưa kết thúc. round_of_16 không có tiền đề trong bảng này (vòng đầu tiên).
const KNOCKOUT_STAGE_PREREQUISITE = {
    [PhaseType.final]: PhaseType.semi_final,
    [PhaseType.third_place]: PhaseType.semi_final,
    [PhaseType.semi_final]: PhaseType.quarter_final,
    [PhaseType.quarter_final]: PhaseType.round_of_16,
};
// ═══════════════════════════════════════════════════════════════════════════
export class KnockoutService extends ScheduleEngine {
    standingsService;
    constructor(prisma, standingsService) {
        super(prisma);
        this.standingsService = standingsService;
    }
    // ─── PHASE RESOLUTION (season-scoped, mirror GroupService) ────────────────
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
    async ensureSeasonOngoing(tx, seasonId) {
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
    /**
     * Guard dùng chung cho cả resolveSeeds (manual seed theo rank) và
     * generateKnockoutFromStandings (auto-seed theo topN): group phải hết
     * match pending, và standings phải được recompute mới nhất trước khi
     * đọc position.
     */
    async _ensureGroupsReadyAndRecompute(tx, groupIds) {
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
        for (const groupId of groupIds) {
            await this.standingsService.recomputeGroupStandings(groupId, tx);
        }
    }
    async resolveSeeds(tx, seeds) {
        const groupIds = [
            ...new Set(seeds
                .filter((s) => s.kind === 'standing')
                .map(s => s.groupId)),
        ];
        if (groupIds.length > 0) {
            await this._ensureGroupsReadyAndRecompute(tx, groupIds);
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
    // ─── generateKnockoutBracket (manual seed list) ────────────────────────────
    async generateKnockoutBracket(options) {
        if (options.seeds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 seed cho knockout');
        const bracketSize = nextPowerOf2(options.seeds.length);
        const phaseType = options.phaseTypeOverride ?? BRACKET_SIZE_TO_PHASE_TYPE[bracketSize];
        if (!phaseType)
            throw createAppError('VALIDATION_ERROR', `Bracket size ${bracketSize} không map được sang PhaseType chuẩn — ` +
                `truyền phaseTypeOverride nếu đây là case đặc biệt`);
        const byeCount = bracketSize - options.seeds.length;
        const result = await this.prisma.$transaction(async (tx) => {
            const seededTeamIds = await this.resolveSeeds(tx, options.seeds);
            const seeding = [
                ...seededTeamIds,
                ...Array(byeCount).fill(null),
            ];
            const round1Pairings = buildRound1Pairings(seeding);
            return this._buildBracketInPhase(tx, options.seasonId, phaseType, options.legs, round1Pairings);
        }, { timeout: 30_000 });
        return this._finalizeWithSchedule(result, options.seasonId, options);
    }
    // ─── NEW: generateKnockoutFromStandings (auto seed thẳng/chéo/random) ──────
    /**
     * Tự chọn top-N mỗi group theo TeamStanding.position rồi ghép cặp round 1
     * theo `mode`, không cần nhập tay từng SeedSource:
     * - 'straight': top-k group[i] đấu top-k group[i+1] (ghép cặp group liên
     *   tiếp trong mảng groupIds) — vd top1 A vs top1 B, top2 A vs top2 B.
     * - 'cross': top-k group[i] đấu top-(N+1-k) group[i+1] — vd top1 A vs
     *   top2 B, top2 A vs top1 B.
     * - 'random': random toàn bộ pool top-N của mọi group, đảm bảo không có
     *   cặp nào cùng group (round-robin interleave, không cần retry/backtrack).
     *
     * Tổng số đội (groupIds.length × topN) BẮT BUỘC là lũy thừa của 2 — đây
     * là ràng buộc cấu trúc bracket single-elimination, không né được.
     */
    async generateKnockoutFromStandings(options) {
        if (options.groupIds.length < 2)
            throw createAppError('VALIDATION_ERROR', 'Cần ít nhất 2 group để tự seed knockout');
        if (new Set(options.groupIds).size !== options.groupIds.length)
            throw createAppError('VALIDATION_ERROR', 'groupIds bị trùng lặp');
        if (options.topN < 1)
            throw createAppError('VALIDATION_ERROR', 'topN phải >= 1');
        if ((options.mode === 'straight' || options.mode === 'cross') && options.groupIds.length % 2 !== 0)
            throw createAppError('VALIDATION_ERROR', `Mode '${options.mode}' cần số group chẵn (ghép cặp group liên tiếp) — hiện có ${options.groupIds.length} group`);
        const totalTeams = options.groupIds.length * options.topN;
        if (!Number.isInteger(Math.log2(totalTeams)))
            throw createAppError('VALIDATION_ERROR', `Tổng số đội vào knockout (${options.groupIds.length} group × top${options.topN} = ${totalTeams}) ` +
                `không phải lũy thừa của 2 — điều chỉnh topN hoặc số group`);
        const phaseType = options.phaseTypeOverride ?? BRACKET_SIZE_TO_PHASE_TYPE[totalTeams];
        if (!phaseType)
            throw createAppError('VALIDATION_ERROR', `${totalTeams} đội không map được sang PhaseType chuẩn — truyền phaseTypeOverride`);
        const result = await this.prisma.$transaction(async (tx) => {
            await lockSeason(tx, options.seasonId);
            await this.assertSeasonOperable(tx, options.seasonId);
            await this._ensureGroupsReadyAndRecompute(tx, options.groupIds);
            const rows = await tx.teamStanding.findMany({
                where: { group_id: { in: options.groupIds }, deleted_at: null, position: { lte: options.topN } },
                select: { group_id: true, position: true, team_id: true },
                orderBy: [{ group_id: 'asc' }, { position: 'asc' }],
            });
            const byGroup = new Map();
            for (const gid of options.groupIds)
                byGroup.set(gid, []);
            for (const r of rows)
                byGroup.get(r.group_id).push({ position: r.position, teamId: r.team_id });
            for (const gid of options.groupIds) {
                const list = byGroup.get(gid);
                if (list.length < options.topN)
                    throw createAppError('CONFLICT', `Group ${gid} chỉ có ${list.length} standing, cần top${options.topN} — ` +
                        `kiểm tra group đã đá đủ và đã recompute standings`);
            }
            const pairs = options.mode === 'straight'
                ? this._buildStraightPairs(options.groupIds, byGroup, options.topN)
                : options.mode === 'cross'
                    ? this._buildCrossPairs(options.groupIds, byGroup, options.topN)
                    : this._buildRandomPairs(options.groupIds, byGroup, options.topN);
            // Sanity check cuối — construction ở mọi nhánh trên đã đảm bảo
            // "không trùng group", đây chỉ là lưới an toàn cuối cùng.
            const groupOfTeam = new Map();
            for (const [gid, list] of byGroup)
                for (const t of list)
                    groupOfTeam.set(t.teamId, gid);
            for (const p of pairs) {
                if (groupOfTeam.get(p.home) === groupOfTeam.get(p.away))
                    throw createAppError('CONFLICT', `Ghép cặp lỗi: 2 đội cùng group ${groupOfTeam.get(p.home)} đối đầu nhau`);
            }
            return this._buildBracketInPhase(tx, options.seasonId, phaseType, options.legs, pairs);
        }, { timeout: 30_000 });
        return this._finalizeWithSchedule(result, options.seasonId, options);
    }
    _buildStraightPairs(groupIds, byGroup, topN) {
        const pairs = [];
        for (let i = 0; i < groupIds.length; i += 2) {
            const a = byGroup.get(groupIds[i]);
            const b = byGroup.get(groupIds[i + 1]);
            for (let rank = 0; rank < topN; rank++) {
                pairs.push({ home: a[rank].teamId, away: b[rank].teamId });
            }
        }
        return pairs;
    }
    _buildCrossPairs(groupIds, byGroup, topN) {
        const pairs = [];
        for (let i = 0; i < groupIds.length; i += 2) {
            const a = byGroup.get(groupIds[i]);
            const b = byGroup.get(groupIds[i + 1]);
            for (let rank = 0; rank < topN; rank++) {
                pairs.push({ home: a[rank].teamId, away: b[topN - 1 - rank].teamId });
            }
        }
        return pairs;
    }
    /**
     * Random nhưng không trùng group bằng round-robin interleave thay vì
     * shuffle-rồi-thử-lại: xáo trong từng group trước, rồi trải đều theo
     * chu kỳ group1,group2,...,groupG lặp topN lần. Với mọi group có ĐÚNG
     * topN phần tử, 2 phần tử liên tiếp trong chuỗi trải đều luôn khác group
     * (groupIds.length >= 2 đã được validate ở entrypoint). Ghép cặp
     * (index 2k, 2k+1) của chuỗi đã trải đều.
     */
    _buildRandomPairs(groupIds, byGroup, topN) {
        const shuffledByGroup = new Map(groupIds.map(gid => [gid, shuffle(byGroup.get(gid).map(t => t.teamId))]));
        const interleaved = [];
        for (let rank = 0; rank < topN; rank++) {
            for (const gid of groupIds) {
                interleaved.push(shuffledByGroup.get(gid)[rank]);
            }
        }
        const pairs = [];
        for (let i = 0; i < interleaved.length; i += 2) {
            pairs.push({ home: interleaved[i], away: interleaved[i + 1] });
        }
        return pairs;
    }
    async _finalizeWithSchedule(result, seasonId, scheduleOptions) {
        const warnings = [...result.warnings];
        const scheduleResult = await this.scheduleMatchBatch(result.round1MatchIds, seasonId, result.phaseId, scheduleOptions);
        if (scheduleResult.error) {
            warnings.push(`Bracket đã tạo (phase ${result.phaseId}) nhưng KHÔNG xếp được lịch tự động: ` +
                `${scheduleResult.error}. ${result.round1MatchIds.length} match hiện chưa có ` +
                `scheduled_at/venue — cần xếp lịch thủ công hoặc gọi lại API xếp lịch.`);
        }
        else if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp được lịch: ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
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
    /**
     * Refactor chung từ generateKnockoutBracket cũ: mọi logic tạo
     * phase/slot/link/round1-match/bye-propagation/stranded-match giờ nhận
     * thẳng `round1Pairings` đã build sẵn — dùng chung cho cả manual-seed
     * (buildRound1Pairings từ SeedSource, có thể có bye) và auto-seed từ
     * standings (luôn đủ cặp, byeCount = 0). is_bye tự suy ra từ pairing
     * có null hay không, không cần tham số byeCount riêng.
     */
    async _buildBracketInPhase(tx, seasonId, phaseType, legsOption, round1Pairings) {
        const warnings = [];
        // FIX: round1Pairings.length = SỐ CẶP đấu round 1 (P = N/2, N = tổng
        // số đội/slot của cả bracket). buildAllSlotCreateData cần bracketSize
        // = N (slotsInRound = bracketSize / 2^round đúng khi bracketSize=N,
        // round1 -> N/2 = P slot). Trước đây gán nhầm bracketSize = P khiến
        // totalRounds bị tính thiếu 1 (log2(P) thay vì log2(N)=log2(P)+1) —
        // luôn mất round cuối cùng (chung kết), và với N=2 (P=1) thì
        // log2(1)=0 -> vòng lặp tạo slot không chạy lần nào -> 0 slot, 0 match.
        const bracketSize = round1Pairings.length * 2;
        const totalRounds = Math.log2(bracketSize);
        if (!Number.isInteger(totalRounds))
            throw createAppError('VALIDATION_ERROR', `Số cặp round 1 (${bracketSize}) không phải lũy thừa của 2`);
        const phase = await this.getOrCreateKnockoutPhase(tx, seasonId, phaseType, legsOption);
        await this.ensureSeasonOngoing(tx, seasonId);
        await this.assertSeasonOperable(tx, seasonId);
        if (!phase.is_active)
            throw createAppError('CONFLICT', 'Phase đã bị deactivate');
        if (phase.status === PhaseStatus.locked)
            throw createAppError('CONFLICT', 'Phase đã locked, không thể generate bracket');
        const existingCount = await tx.bracketSlot.count({ where: { phase_id: phase.id } });
        if (existingCount > 0)
            throw createAppError('CONFLICT', `Phase ${phase.id} đã có bracket`);
        // NEW: chặn tạo bracket cho phaseType này nếu vòng liền trước chưa xong.
        await this._assertPreviousStageComplete(tx, seasonId, phaseType);
        const byeSlotNumbers = new Set(round1Pairings
            .map((p, i) => (p.home === null || p.away === null ? i + 1 : null))
            .filter((n) => n !== null));
        if (byeSlotNumbers.size > 0)
            warnings.push(`${byeSlotNumbers.size} bye slot(s) — bracket size ${bracketSize}`);
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
        const allSlotsAfterPropagate = await tx.bracketSlot.findMany({
            where: { phase_id: phase.id, match_id: null, is_bye: false },
            select: { id: true, round: true, slot_number: true, seeded_home_team_id: true, seeded_away_team_id: true },
        });
        const strandedSlots = allSlotsAfterPropagate.filter(s => s.round > 1 && s.seeded_home_team_id !== null && s.seeded_away_team_id !== null);
        const strandedMatchDrafts = [];
        for (const slot of strandedSlots) {
            const m = await tx.match.create({
                data: {
                    phase_id: phase.id,
                    home_team_id: slot.seeded_home_team_id,
                    away_team_id: slot.seeded_away_team_id,
                    status: MatchStatus.scheduled,
                    leg: legs > 1 ? 1 : null,
                    group_id: null,
                    round: String(slot.round),
                },
                select: { id: true },
            });
            await tx.bracketSlot.update({ where: { id: slot.id }, data: { match_id: m.id } });
            strandedMatchDrafts.push({ id: m.id, round: slot.round, home: slot.seeded_home_team_id, away: slot.seeded_away_team_id });
            if (legs === 2) {
                await tx.match.create({
                    data: {
                        phase_id: phase.id,
                        home_team_id: slot.seeded_away_team_id,
                        away_team_id: slot.seeded_home_team_id,
                        status: MatchStatus.scheduled,
                        leg: 2,
                        group_id: null,
                        round: String(slot.round),
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
            round1MatchIds: [...createdMatchIds, ...strandedMatchDrafts.map(d => d.id)],
            byeSlots: byeSlotNumbers.size,
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
                const leg2Match = await tx.match.findFirst({
                    where: {
                        phase_id: phaseId,
                        home_team_id: slot.seeded_away_team_id,
                        away_team_id: slot.seeded_home_team_id,
                        leg: 2,
                        is_active: true,
                        deleted_at: null,
                    },
                    select: { id: true, status: true },
                });
                if (!leg2Match)
                    throw createAppError('CONFLICT', `Slot legs=2 nhưng không tìm thấy leg 2 match (home=${slot.seeded_away_team_id}, ` +
                        `away=${slot.seeded_home_team_id}) trong phase ${phaseId} — có thể đã bị soft-delete ` +
                        `hoặc chưa được tạo. Không thể xác định winner từ 1 lượt.`);
                if (!TERMINAL_MATCH_STATUSES.includes(leg2Match.status))
                    return { matchCreated: false, newMatchIds: [] };
                resolvedWinnerId = await this._computeAggregateWinner(tx, input.matchId, leg2Match.id, slot.seeded_home_team_id, slot.seeded_away_team_id);
            }
            return this.propagateWinner(tx, slot, resolvedWinnerId, phaseId, seasonId, legs);
        }, { timeout: 15_000 });
        let scheduleWarning;
        if (result.matchCreated && result.newMatchIds.length > 0) {
            const scheduleResult = await this.scheduleMatchBatch(result.newMatchIds, seasonId, phaseId, scheduleOptions);
            if (scheduleResult.error) {
                scheduleWarning =
                    `Match mới (${result.newMatchIds.join(', ')}) đã tạo nhưng chưa xếp được lịch: ` +
                        scheduleResult.error;
                console.warn(`[KnockoutService] ${scheduleWarning}`);
            }
            else if (scheduleResult.failedMatchIds.length > 0) {
                scheduleWarning =
                    `${scheduleResult.failedMatchIds.length} match (advance) chưa xếp được lịch: ` +
                        `IDs [${scheduleResult.failedMatchIds.join(', ')}]`;
                console.warn(`[KnockoutService] ${scheduleWarning}`);
            }
        }
        return { matchCreated: result.matchCreated, newMatchId: result.newMatchId, scheduleWarning };
    }
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
            return homeWonPenalty ? slotAwayTeamId : slotHomeTeamId;
        }
        throw createAppError('CONFLICT', `Aggregate hoà ${slotHomeAgg}-${slotAwayAgg} giữa leg 1 (${leg1MatchId}) và leg 2 (${leg2MatchId}) ` +
            `nhưng leg 2 không có penalty score — không xác định được winner.`);
    }
    async scheduleBracket(phaseId, seasonId, scheduleOptions) {
        await this.assertSeasonOperable(this.prisma, seasonId);
        const matches = await this.prisma.match.findMany({
            where: {
                phase_id: phaseId,
                scheduled_at: null,
                status: MatchStatus.scheduled,
                deleted_at: null,
            },
            select: { id: true },
            orderBy: { id: 'asc' },
        });
        if (matches.length === 0) {
            return { scheduledCount: 0, failedMatchIds: [] };
        }
        const matchIds = matches.map(m => m.id);
        const result = await this.scheduleMatchBatch(matchIds, seasonId, phaseId, scheduleOptions);
        let scheduleWarning;
        if (result.error) {
            scheduleWarning = `Lỗi xếp lịch: ${result.error}`;
            console.warn(`[KnockoutService] ${scheduleWarning}`);
        }
        else if (result.failedMatchIds.length > 0) {
            scheduleWarning = `${result.failedMatchIds.length} trận chưa thể xếp lịch. IDs [${result.failedMatchIds.join(', ')}]`;
            console.warn(`[KnockoutService] ${scheduleWarning}`);
        }
        return {
            scheduledCount: result.matchesScheduled,
            failedMatchIds: result.failedMatchIds,
            scheduleWarning,
        };
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
            matchStatus: s.match?.status ?? null,
        }));
    }
    // ─── NEW: swapSeeds — đổi 2 đội giữa 2 vị trí (round 1) ────────────────────
    /**
     * Đổi chỗ 2 đội đang seed ở round 1 — dùng khi admin muốn tránh cùng
     * bảng gặp lại nhau sớm, cân bằng nhánh mạnh/yếu, v.v.
     *
     * KHÔNG cho phép:
     * - Swap khi phase đã "xác nhận" (PhaseStatus.locked — xem confirmBracket
     *   bên dưới, tái dùng status có sẵn, không thêm cột mới).
     * - Swap khi 1 trong 2 slot có match liên quan đã kết thúc/forfeit — coi
     *   như bracket đã "tự chốt" một khi trận đầu tiên diễn ra.
     * - Swap slot rỗng (chưa có đội / bye) — không có gì để đổi.
     *
     * Nếu slot đã có match (Match đã được tạo sẵn nhưng CHƯA đá), đồng bộ
     * luôn home/away_team_id của match đó (và leg 2 nếu có) theo đội mới —
     * an toàn vì chưa có MatchResult nào tham chiếu.
     *
     * Nếu slot là BYE và đã propagate winner lên slot round 2, đồng bộ luôn
     * seeded_home/away của slot round 2 đó — nếu không, nhánh trên vẫn hiển
     * thị đội cũ dù vòng 1 đã đổi.
     */
    async swapSeeds(phaseId, input) {
        if (input.slotIdA === input.slotIdB && input.sideA === input.sideB)
            throw createAppError('VALIDATION_ERROR', 'Không thể swap 1 vị trí với chính nó');
        await this.prisma.$transaction(async (tx) => {
            const phase = await tx.phase.findUnique({
                where: { id: phaseId },
                select: { id: true, status: true, format: true, legs: true, season_id: true },
            });
            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);
            if (phase.format !== PhaseFormat.knockout)
                throw createAppError('VALIDATION_ERROR', `Phase ${phaseId} không phải phase knockout`);
            await this.assertSeasonOperable(tx, phase.season_id);
            if (phase.status === PhaseStatus.locked)
                throw createAppError('CONFLICT', 'Sơ đồ đã được xác nhận — không thể đổi nhánh nữa');
            const slots = await tx.bracketSlot.findMany({
                where: { id: { in: [input.slotIdA, input.slotIdB] }, phase_id: phaseId, round: 1 },
                select: {
                    id: true, slot_number: true, match_id: true, is_bye: true,
                    seeded_home_team_id: true, seeded_away_team_id: true,
                },
            });
            if (slots.length !== 2)
                throw createAppError('VALIDATION_ERROR', 'Chỉ swap được 2 slot vòng 1 hợp lệ, cùng phase');
            const slotA = slots.find(s => s.id === input.slotIdA);
            const slotB = slots.find(s => s.id === input.slotIdB);
            const teamAt = (s, side) => side === 'home' ? s.seeded_home_team_id : s.seeded_away_team_id;
            const teamA = teamAt(slotA, input.sideA);
            const teamB = teamAt(slotB, input.sideB);
            if (teamA === null || teamB === null)
                throw createAppError('VALIDATION_ERROR', 'Một trong 2 vị trí chưa có đội (bye/chưa xếp) — không swap được');
            // Chặn nếu match của 1 trong 2 slot ĐÃ KẾT THÚC. Ghi chú: hệ
            // thống hiện tại (theo TERMINAL_MATCH_STATUSES) chỉ coi
            // finished/forfeited là "đã đá" — nếu sau này có state
            // 'live'/'in_progress' cho trận đang diễn ra, bổ sung vào mảng
            // này để chặn sớm hơn (không chờ trận kết thúc mới khoá).
            const matchIds = [slotA.match_id, slotB.match_id].filter((id) => id !== null);
            if (matchIds.length > 0) {
                const playedCount = await tx.match.count({
                    where: { id: { in: matchIds }, status: { in: TERMINAL_MATCH_STATUSES } },
                });
                if (playedCount > 0)
                    throw createAppError('CONFLICT', 'Đã có trận liên quan kết thúc — không thể đổi nhánh');
            }
            // 1) Ghi đổi trên bracket_slots
            const colA = input.sideA === 'home' ? 'seeded_home_team_id' : 'seeded_away_team_id';
            const colB = input.sideB === 'home' ? 'seeded_home_team_id' : 'seeded_away_team_id';
            await tx.bracketSlot.update({ where: { id: slotA.id }, data: { [colA]: teamB } });
            await tx.bracketSlot.update({ where: { id: slotB.id }, data: { [colB]: teamA } });
            // 2) Đồng bộ match đã tạo (chưa đá) theo đội mới
            const legs = phase.legs;
            await this._syncMatchTeamAfterSwap(tx, slotA.match_id, input.sideA, teamB, legs);
            await this._syncMatchTeamAfterSwap(tx, slotB.match_id, input.sideB, teamA, legs);
            // 3) Nếu là slot BYE đã propagate winner lên round 2 — sửa luôn
            // slot round 2 tương ứng.
            await this._syncByeParentAfterSwap(tx, slotA, teamA, teamB, legs);
            await this._syncByeParentAfterSwap(tx, slotB, teamB, teamA, legs);
        }, { timeout: 10_000 });
    }
    /**
     * Cập nhật home/away_team_id của match (leg 1 + leg 2 nếu có) sau khi
     * swap seed — match CHƯA có MatchResult (đảm bảo ở tầng gọi bằng
     * TERMINAL_MATCH_STATUSES check) nên ghi đè trực tiếp là an toàn.
     */
    async _syncMatchTeamAfterSwap(tx, matchId, side, newTeamId, legs) {
        if (matchId === null)
            return;
        const leg1 = await tx.match.findUnique({
            where: { id: matchId },
            select: { id: true, phase_id: true, home_team_id: true, away_team_id: true },
        });
        if (!leg1)
            return;
        if (legs === 2) {
            // Tìm leg 2 (lượt về) TRƯỚC khi update leg 1 — leg 2 được tạo
            // với home/away đảo ngược đúng leg 1 gốc (xem createRound1Matches).
            const leg2 = await tx.match.findFirst({
                where: {
                    phase_id: leg1.phase_id,
                    leg: 2,
                    home_team_id: leg1.away_team_id,
                    away_team_id: leg1.home_team_id,
                    is_active: true,
                    deleted_at: null,
                },
                select: { id: true },
            });
            if (leg2) {
                await tx.match.update({
                    where: { id: leg2.id },
                    // Leg 2 đảo chiều leg 1: side='home' ở leg1 => team đó
                    // là AWAY ở leg 2.
                    data: side === 'home' ? { away_team_id: newTeamId } : { home_team_id: newTeamId },
                });
            }
        }
        await tx.match.update({
            where: { id: leg1.id },
            data: side === 'home' ? { home_team_id: newTeamId } : { away_team_id: newTeamId },
        });
    }
    /**
     * Nếu slot vừa swap là BYE, winner của nó đã được propagate 1 lần lên
     * slot round 2 lúc generate (xem parentUpdates trong _buildBracketInPhase)
     * — swap xong phải sửa luôn slot round 2 đó, và match của slot round 2
     * đó nếu đã được tạo (double-bye stranded match).
     */
    async _syncByeParentAfterSwap(tx, slot, oldTeamId, newTeamId, legs) {
        if (!slot.is_bye)
            return;
        const isSourceA = slot.slot_number % 2 === 1;
        const parent = await tx.bracketSlot.findFirst({
            where: isSourceA ? { source_a_slot_id: slot.id } : { source_b_slot_id: slot.id },
            select: { id: true, seeded_home_team_id: true, seeded_away_team_id: true, match_id: true },
        });
        if (!parent)
            return;
        if (isSourceA && parent.seeded_home_team_id === oldTeamId) {
            await tx.bracketSlot.update({ where: { id: parent.id }, data: { seeded_home_team_id: newTeamId } });
            await this._syncMatchTeamAfterSwap(tx, parent.match_id, 'home', newTeamId, legs);
        }
        else if (!isSourceA && parent.seeded_away_team_id === oldTeamId) {
            await tx.bracketSlot.update({ where: { id: parent.id }, data: { seeded_away_team_id: newTeamId } });
            await this._syncMatchTeamAfterSwap(tx, parent.match_id, 'away', newTeamId, legs);
        }
        // Nếu parent không còn giữ đúng oldTeamId ở đúng vị trí (dữ liệu đã
        // lệch vì lý do khác), không đụng vào — an toàn hơn là ghi đè nhầm.
    }
    // ─── NEW: confirmBracket — "chốt" sơ đồ, không cho swap nữa ────────────────
    /**
     * "Xác nhận" sơ đồ = chuyển phase sang PhaseStatus.locked — TÁI DÙNG
     * status đã có sẵn trong schema (không thêm cột/migration mới).
     * `_buildBracketInPhase` đã dùng `locked` để chặn generate lại bracket
     * cho phase này, nên tái dùng cùng ngữ nghĩa "phase đã chốt cấu trúc,
     * không sửa nữa" là nhất quán, không xung đột với chỗ khác.
     *
     * Chặn xác nhận nếu đã có trận vòng 1 kết thúc — không phải lỗi, chỉ vì
     * lúc đó không còn gì để "xác nhận" nữa (coi như đã tự chốt khi trận
     * đầu tiên diễn ra).
     */
    async confirmBracket(phaseId) {
        await this.prisma.$transaction(async (tx) => {
            const phase = await tx.phase.findUnique({
                where: { id: phaseId },
                select: { id: true, status: true, format: true, season_id: true },
            });
            if (!phase)
                throw createAppError('NOT_FOUND', `Phase ${phaseId} không tồn tại`);
            if (phase.format !== PhaseFormat.knockout)
                throw createAppError('VALIDATION_ERROR', `Phase ${phaseId} không phải phase knockout`);
            await this.assertSeasonOperable(tx, phase.season_id);
            if (phase.status === PhaseStatus.locked)
                throw createAppError('CONFLICT', 'Sơ đồ đã được xác nhận trước đó');
            const round1Slots = await tx.bracketSlot.findMany({
                where: { phase_id: phaseId, round: 1 },
                select: { match_id: true },
            });
            const matchIds = round1Slots.map(s => s.match_id).filter((id) => id !== null);
            if (matchIds.length > 0) {
                const playedCount = await tx.match.count({
                    where: { id: { in: matchIds }, status: { in: TERMINAL_MATCH_STATUSES } },
                });
                if (playedCount > 0)
                    throw createAppError('CONFLICT', 'Đã có trận vòng 1 kết thúc — sơ đồ coi như đã tự chốt, không cần xác nhận thêm');
            }
            await tx.phase.update({ where: { id: phaseId }, data: { status: PhaseStatus.locked } });
        });
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
    async scheduleMatchBatch(matchIds, seasonId, phaseId, options) {
        if (matchIds.length === 0)
            return { matchesScheduled: 0, failedMatchIds: [] };
        // FIX: check dailyStartTime/dailyEndTime thay vì matchTimes (đã bỏ fixed slots).
        if (!options.venueIds || options.venueIds.length === 0 || !options.dailyStartTime || !options.dailyEndTime) {
            return {
                matchesScheduled: 0,
                failedMatchIds: matchIds,
                error: 'Thiếu venueIds hoặc dailyStartTime/dailyEndTime — không thể xếp lịch tự động cho các match mới tạo.',
            };
        }
        const bufferMinutes = options.bufferMinutes ?? DEFAULT_VENUE_BUFFER_MINUTES;
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
                error: `Season ${seasonId} end_date (${rangeEnd.toISOString()}) không sau startDate ` +
                    `(${startDate.toISOString()}) — không đủ khoảng thời gian để xếp lịch knockout`,
            };
        const teamIds = matches.flatMap(m => [m.home_team_id, m.away_team_id]);
        const [takenWindows, recentMatches] = await Promise.all([
            this.loadTakenVenueWindows(options.venueIds, startDate, rangeEnd),
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
        const pool = this.buildSlotPool(options.venueIds, startDate, rangeEnd, options.dailyStartTime, options.dailyEndTime, bufferMinutes, takenWindows, options.excludedDates ?? []);
        if (pool.length < matches.length) {
            return {
                matchesScheduled: 0,
                failedMatchIds: matchIds,
                error: `Không đủ slot cho knockout: cần ${matches.length}, chỉ có ${pool.length}. ` +
                    `Thêm venueId, mở rộng khung giờ, giảm bufferMinutes, hoặc mở rộng end_date của season.`,
            };
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
        const candidateMatches = matches.map(m => ({
            id: m.id,
            home_team_id: m.home_team_id,
            away_team_id: m.away_team_id,
            round: m.round,
        }));
        const conflictContext = await this.loadPlayerConflictContext(this.prisma, teamIds);
        const { updates, unscheduled } = this.scheduleMatchesWithRetry(candidateMatches, pool, minRestDays, lastPlayedAt, conflictContext);
        const failedFromCollision = await this.writeScheduleBatch(updates);
        const writtenIds = updates
            .map(u => u.id)
            .filter(id => !failedFromCollision.includes(id));
        const quarantinedIds = await this.prisma.$transaction((tx) => this.quarantinePlayerConflicts(tx, writtenIds));
        const finalUnscheduled = [...unscheduled, ...failedFromCollision, ...quarantinedIds];
        return {
            matchesScheduled: updates.length - failedFromCollision.length - quarantinedIds.length,
            failedMatchIds: finalUnscheduled,
        };
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
    /**
 * Guard dùng NGAY TRONG transaction tạo bracket — chặn tạo phase 'final'/
 * 'third_place'/'semi_final'/'quarter_final' khi phase liền trước chưa tồn
 * tại hoặc còn match chưa kết thúc (finished/forfeited).
 */
    async _assertPreviousStageComplete(tx, seasonId, phaseType) {
        const priorType = KNOCKOUT_STAGE_PREREQUISITE[phaseType];
        if (!priorType)
            return;
        const priorPhase = await tx.phase.findFirst({
            where: { season_id: seasonId, format: PhaseFormat.knockout, type: priorType, is_active: true },
            select: { id: true },
        });
        if (!priorPhase)
            return;
        const unfinishedCount = await tx.match.count({
            where: { phase_id: priorPhase.id, deleted_at: null, status: { notIn: TERMINAL_MATCH_STATUSES } },
        });
        if (unfinishedCount > 0)
            throw createAppError('CONFLICT', `Còn ${unfinishedCount} trận '${priorType}' chưa kết thúc — hoàn thành trước khi tạo '${phaseType}'`);
    }
    /**
     * NEW: đọc-only version cho FE — gọi TRƯỚC khi bấm "Tạo Sơ Đồ Bracket" để
     * disable nút + hiện lý do, thay vì để user ăn lỗi 409 sau khi submit. Cần
     * thêm route (chưa có sẵn controller trong context này):
     *   GET /knockout/seasons/:seasonId/stage-readiness?phaseType=final
     */
    async getStageReadiness(seasonId, targetPhaseType) {
        const priorType = KNOCKOUT_STAGE_PREREQUISITE[targetPhaseType] ?? null;
        if (!priorType)
            return { ready: true, priorPhaseType: null, priorPhaseExists: true, unfinishedCount: 0 };
        const priorPhase = await this.prisma.phase.findFirst({
            where: { season_id: seasonId, format: PhaseFormat.knockout, type: priorType, is_active: true },
            select: { id: true },
        });
        if (!priorPhase)
            return { ready: true, priorPhaseType: priorType, priorPhaseExists: false, unfinishedCount: 0 };
        const unfinishedCount = await this.prisma.match.count({
            where: { phase_id: priorPhase.id, deleted_at: null, status: { notIn: TERMINAL_MATCH_STATUSES } },
        });
        return { ready: unfinishedCount === 0, priorPhaseType: priorType, priorPhaseExists: true, unfinishedCount };
    }
    async assertSeasonOperable(tx, seasonId) {
        const season = await tx.season.findUnique({
            where: { id: seasonId },
            select: { status: true },
        });
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (season.status === SeasonStatus.finished || season.status === SeasonStatus.cancelled)
            throw createAppError('CONFLICT', `Season đang ở trạng thái '${season.status}' — không thể thao tác knockout nữa`);
    }
}
//# sourceMappingURL=knockout.service.js.map