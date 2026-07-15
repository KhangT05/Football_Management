import { createAppError } from '../common/app.error.js';
import { MatchEventType, MatchStatus, PhaseFormat, PhaseStatus, PhaseType, SeasonStatus, SeasonTeamStatus, } from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { shuffle } from '../libs/array.utils.js';
import { ScheduleEngine, ASSUMED_MATCH_DURATION_MS, DEFAULT_VENUE_BUFFER_MINUTES, } from '../libs/schedule.engine.js';
const MATCH_WITH_PHASE_SELECT = {
    id: true, round: true, home_team_id: true, away_team_id: true,
    scheduled_at: true, venue_id: true, status: true,
    phase: { select: { id: true, name: true, type: true, format: true } },
};
const MATCH_CARD_INCLUDE = {
    home_team: { select: { id: true, name: true, logo: true } },
    away_team: { select: { id: true, name: true, logo: true } },
    venue: { select: { id: true, name: true } },
    // FIX (#4 review): FE Schedule Tab filter loại match knockout bằng
    // `m.phase?.format !== 'knockout'` nhưng include cũ không có `phase` —
    // filter luôn true, knockout lọt vào tab group-stage. Thêm field này.
    phase: { select: { format: true } },
    matchResult: {
        select: {
            result_type: true,
            home_penalty_score: true,
            away_penalty_score: true,
            home_extra_time_score: true,
            away_extra_time_score: true,
        },
    },
};
const RED_CARD_EVENT_TYPES = [MatchEventType.red_card, MatchEventType.second_yellow];
const NON_BLOCKING_STATUSES = [MatchStatus.cancelled, MatchStatus.forfeited];
export class ScheduleService extends ScheduleEngine {
    query;
    constructor(prisma) {
        super(prisma);
        this.query = new Queryable(prisma.match, {
            filterable: ['status', 'venue_id', 'round'],
            sortable: ['scheduled_at'],
            defaultSort: { column: 'scheduled_at', direction: 'asc' },
            searchFields: [],
            defaultPerPage: 20,
            maxPerPage: 300,
            beforeBuild: (wheres) => { wheres.push({ is_active: true }); },
        });
    }
    findAll(req = {}) {
        return this.query.run(req);
    }
    async findMatchesBySeason(seasonId, req = {}) {
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300));
        const sortCol = req.sort === 'scheduled_at' ? req.sort : 'scheduled_at';
        const direction = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';
        const where = {
            phase: { season_id: seasonId },
            is_active: true,
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                orderBy: { [sortCol]: direction },
                skip: (page - 1) * perPage,
                take: perPage,
                include: MATCH_CARD_INCLUDE,
            }),
            this.prisma.match.count({ where }),
        ]);
        const withCardMeta = await this._attachCardCounts(data);
        const last_page = Math.max(1, Math.ceil(total / perPage));
        return {
            data: withCardMeta,
            meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
        };
    }
    async _attachCardCounts(matches) {
        if (matches.length === 0)
            return [];
        const matchIds = matches.map(m => m.id);
        const cardEvents = await this.prisma.matchEvent.groupBy({
            by: ['match_id', 'team_id', 'type'],
            where: {
                match_id: { in: matchIds },
                type: { in: [MatchEventType.yellow_card, ...RED_CARD_EVENT_TYPES] },
            },
            _count: { _all: true },
        });
        return matches.map(m => {
            const forThisMatch = cardEvents.filter(c => c.match_id === m.id);
            const countFor = (teamId, types) => forThisMatch
                .filter(c => c.team_id === teamId && types.includes(c.type))
                .reduce((sum, c) => sum + c._count._all, 0);
            return {
                ...m,
                home_yellow_cards: countFor(m.home_team_id, [MatchEventType.yellow_card]),
                away_yellow_cards: countFor(m.away_team_id, [MatchEventType.yellow_card]),
                home_red_cards: countFor(m.home_team_id, RED_CARD_EVENT_TYPES),
                away_red_cards: countFor(m.away_team_id, RED_CARD_EVENT_TYPES),
            };
        });
    }
    async findMatchesByTeam(seasonId, teamId, req = {}) {
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300));
        const sortCol = (req.sort === 'round' || req.sort === 'scheduled_at')
            ? req.sort
            : 'scheduled_at';
        const direction = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';
        const where = {
            phase: { season_id: seasonId },
            is_active: true,
            OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        };
        if (sortCol === 'round') {
            const [allRows, total] = await this.prisma.$transaction([
                this.prisma.match.findMany({ where, select: MATCH_WITH_PHASE_SELECT }),
                this.prisma.match.count({ where }),
            ]);
            allRows.sort((a, b) => {
                const ra = parseInt(a.round ?? '0', 10);
                const rb = parseInt(b.round ?? '0', 10);
                return direction === 'asc' ? ra - rb : rb - ra;
            });
            const data = allRows.slice((page - 1) * perPage, page * perPage);
            const last_page = Math.max(1, Math.ceil(total / perPage));
            return {
                data,
                meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
            };
        }
        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                select: MATCH_WITH_PHASE_SELECT,
                orderBy: { [sortCol]: direction },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
            this.prisma.match.count({ where }),
        ]);
        const last_page = Math.max(1, Math.ceil(total / perPage));
        return {
            data,
            meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
        };
    }
    /**
     * NEW: DTO cho round-selector FE. groupIds optional — nếu truyền, chỉ
     * tính round trong phạm vi các group đó (dùng khi admin đã chọn subset
     * bảng đấu trước khi mở round selector).
     */
    async getGroupStageRoundsSummary(seasonId, groupIds) {
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId, type: PhaseType.group_stage },
                is_active: true,
                ...(groupIds?.length ? { group_id: { in: groupIds } } : {}),
            },
            select: { round: true, scheduled_at: true },
        });
        const byRound = new Map();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const e = byRound.get(r) ?? { total: 0, unscheduled: 0 };
            e.total++;
            if (m.scheduled_at === null)
                e.unscheduled++;
            byRound.set(r, e);
        }
        return [...byRound.entries()]
            .sort(([a], [b]) => a - b)
            .map(([round, s]) => ({ round, ...s, fullyScheduled: s.unscheduled === 0 }));
    }
    async generateGroupsAndSchedule(seasonId, options) {
        const warnings = [];
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (!options.dailyStartTime || !options.dailyEndTime)
            throw createAppError('VALIDATION_ERROR', 'dailyStartTime/dailyEndTime không được rỗng');
        const { groupCount, groupIds } = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;
            const season = await tx.season.findUnique({
                where: { id: seasonId },
                include: {
                    season_teams: { where: { status: SeasonTeamStatus.approved, deleted_at: null } },
                    phases: { select: { id: true } },
                },
            });
            if (!season)
                throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
            if (season.status !== SeasonStatus.registration_open)
                throw createAppError('CONFLICT', `Season phải ở 'registration_open' để generate, hiện tại: '${season.status}'`);
            if (season.phases.length > 0)
                throw createAppError('CONFLICT', `Season ${seasonId} đã có phase — không generate lại. Nếu bảng đã được tạo/bốc ` +
                    `thăm qua GroupService, dùng endpoint generate-from-groups thay vì endpoint này.`);
            const teamIds = season.season_teams.map(st => st.team_id);
            if (teamIds.length < 2)
                throw createAppError('VALIDATION_ERROR', `Chỉ có ${teamIds.length} team active — cần ít nhất 2`);
            const groupCount = this.resolveGroupCount(teamIds.length, options.desiredGroupCount, options.minGroupSize);
            if (groupCount === 1 && teamIds.length > options.maxGroupSize)
                throw createAppError('VALIDATION_ERROR', `${teamIds.length} team không fit 1 group (maxGroupSize=${options.maxGroupSize})`);
            const distributed = this.assignTeamsToGroups(teamIds, groupCount);
            const nominalTeamsPerGroup = Math.max(...distributed.map(g => g.length));
            const phase = await tx.phase.create({
                data: {
                    season_id: seasonId,
                    name: 'Vòng bảng',
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    order: 1,
                    status: PhaseStatus.in_progress,
                    min_rest_days_per_team: options.minRestDaysPerTeam ?? 3,
                    teams_per_group: nominalTeamsPerGroup,
                },
            });
            const groupCreateData = distributed.map((teams, i) => ({
                phase_id: phase.id,
                name: `Bảng ${String.fromCharCode(65 + i)}`,
                is_active: teams.length >= 2,
            }));
            const groups = await Promise.all(groupCreateData.map(data => tx.group.create({ data })));
            const createdGroupIds = [];
            const allMatches = [];
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i];
                const teamsInGroup = distributed[i];
                await tx.seasonTeam.updateMany({
                    where: { season_id: seasonId, team_id: { in: teamsInGroup } },
                    data: { group_id: group.id },
                });
                if (teamsInGroup.length < 2) {
                    warnings.push(`${group.name}: chỉ có ${teamsInGroup.length} team — bỏ qua generate match`);
                    continue;
                }
                const matches = this.generateRoundRobin(teamsInGroup, group.id, phase.id, options.doubleRound ?? true);
                allMatches.push(...matches);
                createdGroupIds.push(group.id);
            }
            await tx.match.createMany({ data: allMatches });
            await tx.season.update({
                where: { id: seasonId },
                data: { status: SeasonStatus.ongoing },
            });
            return { groupCount, groupIds: createdGroupIds };
        }, { timeout: 30_000 });
        const scheduleResult = await this.autoScheduleMatches(seasonId, options);
        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot hoặc ` +
                `thuật toán không tìm ra phương án — xem lại venueIds/khung giờ/minRestDays): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
        }
        return { groupCount, groupIds, ...scheduleResult, warnings };
    }
    async generateMatchesFromDrawnGroups(seasonId, options) {
        const warnings = [];
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (!options.dailyStartTime || !options.dailyEndTime)
            throw createAppError('VALIDATION_ERROR', 'dailyStartTime/dailyEndTime không được rỗng');
        const { groupCount, groupIds } = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;
            const season = await tx.season.findUnique({ where: { id: seasonId } });
            if (!season)
                throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
            const phase = await tx.phase.findFirst({
                where: {
                    season_id: seasonId,
                    format: PhaseFormat.round_robin,
                    type: PhaseType.group_stage,
                    is_active: true,
                },
            });
            if (!phase)
                throw createAppError('CONFLICT', `Season ${seasonId} chưa có bảng đấu — tạo bảng & bốc thăm qua GroupService ` +
                    `trước khi tạo lịch, hoặc dùng endpoint generate (tự tạo bảng) nếu chưa từng tạo.`);
            if (phase.status === PhaseStatus.locked)
                throw createAppError('CONFLICT', `Phase ${phase.id} đã locked`);
            const existingMatches = await tx.match.count({
                where: { phase_id: phase.id, deleted_at: null },
            });
            if (existingMatches > 0)
                throw createAppError('CONFLICT', `Season ${seasonId} đã có lịch thi đấu (${existingMatches} match) — dùng endpoint ` +
                    `xếp lịch (autoSchedule) để xếp thêm/lại các round chưa xếp, thay vì generate lại.`);
            const groups = await tx.group.findMany({
                where: { phase_id: phase.id, is_active: true },
                include: {
                    season_teams: {
                        where: {
                            deleted_at: null,
                            is_active: true,
                            status: SeasonTeamStatus.approved,
                        },
                        select: { team_id: true },
                    },
                },
                orderBy: { id: 'asc' },
            });
            if (groups.length === 0)
                throw createAppError('CONFLICT', `Phase ${phase.id} chưa có group nào`);
            const allMatches = [];
            const usedGroupIds = [];
            for (const group of groups) {
                const teamIds = group.season_teams.map(st => st.team_id);
                if (teamIds.length < 2) {
                    warnings.push(`${group.name}: chỉ có ${teamIds.length} đội đã bốc thăm — bỏ qua generate match`);
                    continue;
                }
                const matches = this.generateRoundRobin(teamIds, group.id, phase.id, options.doubleRound ?? false);
                allMatches.push(...matches);
                usedGroupIds.push(group.id);
            }
            if (allMatches.length === 0)
                throw createAppError('CONFLICT', 'Không bảng nào đủ >= 2 đội đã bốc thăm — bốc thăm bảng trước khi tạo lịch.');
            await tx.match.createMany({ data: allMatches });
            if (options.minRestDaysPerTeam !== undefined) {
                await tx.phase.update({
                    where: { id: phase.id },
                    data: { min_rest_days_per_team: options.minRestDaysPerTeam },
                });
            }
            if (season.status === SeasonStatus.registration_open) {
                await tx.season.update({
                    where: { id: seasonId },
                    data: { status: SeasonStatus.ongoing },
                });
            }
            return { groupCount: usedGroupIds.length, groupIds: usedGroupIds };
        }, { timeout: 30_000 });
        // rounds/groupIds trong options chỉ có ý nghĩa cho BƯỚC XẾP LỊCH, không
        // ảnh hưởng bước tạo match ở trên (luôn tạo đủ mọi round cho mọi group
        // đã bốc thăm).
        const scheduleResult = await this.autoScheduleMatches(seasonId, {
            venueIds: options.venueIds,
            dailyStartTime: options.dailyStartTime,
            dailyEndTime: options.dailyEndTime,
            bufferMinutes: options.bufferMinutes,
            rounds: options.rounds,
            groupIds: options.groupIds,
            allowPastDate: options.allowPastDate,
        });
        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot hoặc ` +
                `thuật toán không tìm ra phương án — xem lại venueIds/khung giờ/minRestDays): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
        }
        return { groupCount, groupIds, ...scheduleResult, warnings };
    }
    /**
     * FIX: nhận thêm rounds/groupIds (AutoScheduleFilterOptions) — lọc TẬP
     * MATCH cần xếp lịch trong lần gọi này, cho phép admin chọn cùng lúc
     * nhiều round của nhiều bảng (vd vòng 1,2,3 cho 5 bảng), để lại các round
     * khác chưa xếp cho lần gọi sau — không bắt buộc xếp hết 1 lần.
     *
     * FIX: bỏ matchTimes cố định, dùng dailyStartTime/dailyEndTime/
     * bufferMinutes liên tục (xem ScheduleEngine.buildSlotPool) — buffer mặc
     * định DEFAULT_VENUE_BUFFER_MINUTES nếu không truyền.
     */
    async autoScheduleMatches(seasonId, options) {
        if (!options.dailyStartTime || !options.dailyEndTime)
            throw createAppError('VALIDATION_ERROR', 'dailyStartTime/dailyEndTime không được rỗng');
        if (options.dailyStartTime >= options.dailyEndTime)
            throw createAppError('VALIDATION_ERROR', 'dailyStartTime phải trước dailyEndTime');
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                scheduled_at: null,
                status: MatchStatus.scheduled,
                group_id: { not: null },
                ...(options.groupIds?.length ? { group_id: { in: options.groupIds } } : {}),
                ...(options.rounds?.length ? { round: { in: options.rounds.map(String) } } : {}),
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                round: true,
            },
            orderBy: { id: 'asc' },
        });
        if (matches.length === 0)
            return { matchesScheduled: 0, failedMatchIds: [] };
        const [phase, season] = await Promise.all([
            this.prisma.phase.findFirst({
                where: { season_id: seasonId, type: PhaseType.group_stage },
                select: { min_rest_days_per_team: true },
            }),
            this.prisma.season.findUnique({
                where: { id: seasonId },
                select: { start_date: true, end_date: true },
            }),
        ]);
        if (!phase)
            throw createAppError('NOT_FOUND', `Không tìm thấy group_stage phase cho season ${seasonId}`);
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (!season.start_date)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có start_date`);
        if (!season.end_date)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có end_date`);
        const minRestDays = phase.min_rest_days_per_team ?? 3;
        const bufferMinutes = options.bufferMinutes ?? DEFAULT_VENUE_BUFFER_MINUTES;
        const startDate = season.start_date;
        const rangeEnd = season.end_date;
        if (rangeEnd <= startDate)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} end_date (${rangeEnd.toISOString()}) phải sau start_date ` +
                `(${startDate.toISOString()})`);
        if (startDate < new Date() && !options.allowPastDate) {
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} có start_date đã qua (${startDate.toISOString()}) — ` +
                `slot pool sẽ rơi vào quá khứ. Cập nhật start_date hoặc gọi với allowPastDate=true ` +
                `nếu đây là backfill có chủ đích.`);
        }
        const takenWindows = await this.loadTakenVenueWindows(options.venueIds, startDate, rangeEnd);
        const pool = this.buildSlotPool(options.venueIds, startDate, rangeEnd, options.dailyStartTime, options.dailyEndTime, bufferMinutes, takenWindows, options.excludedDates ?? []);
        if (pool.length < matches.length) {
            throw createAppError('VALIDATION_ERROR', `Không đủ slot: cần ${matches.length}, chỉ có ${pool.length}. ` +
                `Thêm venueId, mở rộng dailyStartTime/dailyEndTime, giảm bufferMinutes, đẩy startDate sớm ` +
                `hơn, hoặc mở rộng end_date của season.`);
        }
        const allTeamIds = [...new Set(matches.flatMap(m => [m.home_team_id, m.away_team_id]))];
        const conflictContext = await this.loadPlayerConflictContext(this.prisma, allTeamIds);
        const { updates, unscheduled } = this.scheduleMatchesWithRetry(matches, pool, minRestDays, undefined, conflictContext);
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
    /**
     * FIX (venue buffer chính xác + configurable): trước đây window check
     * dùng `±ASSUMED_MATCH_DURATION_MS` đối xứng quanh scheduledAt — không
     * phải overlap thật theo [start, start+duration], và không có khái niệm
     * buffer riêng giữa 2 trận. Giờ tính đúng overlap [newStart,newEnd] so
     * với [existingStart,existingEnd] rồi mở rộng thêm bufferMs mỗi phía.
     */
    async rescheduleMatch(matchId, input) {
        const bufferMs = (input.bufferMinutes ?? DEFAULT_VENUE_BUFFER_MINUTES) * 60_000;
        await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT id FROM matches WHERE id = ${matchId} FOR UPDATE`;
            const match = await tx.match.findUnique({
                where: { id: matchId },
                select: { id: true, status: true, home_team_id: true, away_team_id: true },
            });
            if (!match)
                throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);
            const RESCHEDULABLE = [MatchStatus.scheduled, MatchStatus.postponed];
            if (!RESCHEDULABLE.includes(match.status))
                throw createAppError('CONFLICT', `Match ${matchId} đang ở status '${match.status}' — chỉ reschedule được khi scheduled/postponed`);
            const conflictMap = await this.buildTeamConflictMap(tx, [match.home_team_id, match.away_team_id]);
            const conflictingTeamIds = [...new Set([
                    ...(conflictMap.get(match.home_team_id) ?? [match.home_team_id]),
                    ...(conflictMap.get(match.away_team_id) ?? [match.away_team_id]),
                ])];
            for (const tid of [...conflictingTeamIds].sort((a, b) => a - b)) {
                await tx.$executeRaw `SELECT id FROM teams WHERE id = ${tid} FOR UPDATE`;
            }
            const newStart = input.scheduledAt.getTime();
            const newEnd = newStart + ASSUMED_MATCH_DURATION_MS;
            const searchWindowStart = new Date(newStart - ASSUMED_MATCH_DURATION_MS - bufferMs);
            const searchWindowEnd = new Date(newEnd + bufferMs);
            // Venue conflict — overlap [newStart-buffer, newEnd+buffer] với bất kỳ
            // trận nào khác cùng sân.
            const venueCandidates = await tx.match.findMany({
                where: {
                    id: { not: matchId },
                    venue_id: input.venueId,
                    scheduled_at: { gte: searchWindowStart, lte: searchWindowEnd },
                    status: { notIn: NON_BLOCKING_STATUSES },
                },
                select: { id: true, scheduled_at: true },
            });
            const venueConflict = venueCandidates.find(m => {
                const s = m.scheduled_at.getTime();
                const e = s + ASSUMED_MATCH_DURATION_MS;
                return s < newEnd + bufferMs && (e + bufferMs) > newStart - bufferMs === false
                    ? false
                    : s < newEnd + bufferMs && newStart - bufferMs < e;
            });
            if (venueConflict)
                throw createAppError('CONFLICT', `Venue ${input.venueId} đã có trận (match ${venueConflict.id}) không đủ ` +
                    `${bufferMs / 60000} phút cách quãng quanh ${input.scheduledAt.toISOString()}`);
            // Team/player conflict — không tính buffer riêng, giữ nguyên nghĩa cũ
            // (né trùng khung ±duration cho cùng team/player, không phải venue).
            const conflict = await tx.match.findFirst({
                where: {
                    id: { not: matchId },
                    scheduled_at: {
                        gte: new Date(newStart - ASSUMED_MATCH_DURATION_MS),
                        lte: new Date(newEnd + ASSUMED_MATCH_DURATION_MS),
                    },
                    status: { notIn: NON_BLOCKING_STATUSES },
                    OR: [
                        { home_team_id: { in: conflictingTeamIds } },
                        { away_team_id: { in: conflictingTeamIds } },
                    ],
                },
                select: { id: true, scheduled_at: true, home_team_id: true, away_team_id: true },
            });
            if (conflict)
                throw createAppError('CONFLICT', `Trùng lịch: match ${conflict.id} (team ${conflict.home_team_id} vs ` +
                    `${conflict.away_team_id}) đã xếp lúc ${conflict.scheduled_at?.toISOString()} — ` +
                    `có team hoặc cầu thủ dùng chung roster với trận này quanh ` +
                    `${input.scheduledAt.toISOString()}`);
            await tx.match.update({
                where: { id: matchId },
                data: {
                    scheduled_at: input.scheduledAt,
                    venue_id: input.venueId,
                    status: MatchStatus.scheduled,
                },
            });
        });
    }
    async getSeasonSchedule(seasonId) {
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                is_active: true,
            },
            select: MATCH_WITH_PHASE_SELECT,
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });
        matches.sort((a, b) => {
            if (a.phase?.format !== 'knockout' && b.phase?.format !== 'knockout') {
                const ra = parseInt(a.round ?? '0', 10);
                const rb = parseInt(b.round ?? '0', 10);
                if (ra !== rb)
                    return ra - rb;
            }
            const ta = a.scheduled_at?.getTime() ?? Infinity;
            const tb = b.scheduled_at?.getTime() ?? Infinity;
            return ta - tb;
        });
        const scheduled = matches.filter(m => m.scheduled_at !== null).length;
        return {
            seasonId,
            totalMatches: matches.length,
            scheduledMatches: scheduled,
            unscheduledMatches: matches.length - scheduled,
            matches: matches.map(m => ({
                matchId: m.id,
                round: m.round,
                homeTeamId: m.home_team_id,
                awayTeamId: m.away_team_id,
                scheduledAt: m.scheduled_at,
                venueId: m.venue_id,
                status: m.status,
                phaseId: m.phase?.id ?? null,
                phaseName: m.phase?.name ?? null,
                phaseType: m.phase?.type ?? null,
                phaseFormat: m.phase?.format ?? null,
            })),
        };
    }
    resolveGroupCount(totalTeams, desiredGroups, minGroupSize) {
        let g = Math.min(desiredGroups, totalTeams);
        while (g > 1) {
            if (Math.floor(totalTeams / g) >= minGroupSize)
                return g;
            g--;
        }
        return 1;
    }
    assignTeamsToGroups(teamIds, numberOfGroups, seedOrder) {
        const ordered = seedOrder ?? shuffle([...teamIds]);
        const groups = Array.from({ length: numberOfGroups }, () => []);
        let idx = 0;
        let dir = 1;
        for (const teamId of ordered) {
            groups[idx].push(teamId);
            idx += dir;
            if (idx === numberOfGroups) {
                idx = numberOfGroups - 1;
                dir = -1;
            }
            else if (idx === -1) {
                idx = 0;
                dir = 1;
            }
        }
        return groups;
    }
    generateRoundRobin(teamIds, groupId, phaseId, doubleRound = true) {
        if (teamIds.length < 2)
            return [];
        const teams = [...teamIds];
        if (teams.length % 2 !== 0)
            teams.push(null);
        const n = teams.length;
        const numRounds = n - 1;
        const drafts = [];
        let current = [...teams];
        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < n / 2; i++) {
                const a = current[i];
                const b = current[n - 1 - i];
                if (a == null || b == null)
                    continue;
                const [home, away] = round % 2 === 0 ? [a, b] : [b, a];
                drafts.push({ round: round + 1, home, away });
            }
            current = this.rotate(current);
        }
        if (doubleRound) {
            drafts.push(...drafts.map(d => ({ round: d.round + numRounds, home: d.away, away: d.home })));
        }
        return drafts.map(d => ({
            phase_id: phaseId,
            group_id: groupId,
            home_team_id: d.home,
            away_team_id: d.away,
            round: String(d.round),
            status: MatchStatus.scheduled,
        }));
    }
    rotate(arr) {
        if (arr.length <= 2)
            return arr;
        return [arr[0], arr[arr.length - 1], ...arr.slice(1, arr.length - 1)];
    }
}
//# sourceMappingURL=schedule.service.js.map