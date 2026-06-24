import { createAppError } from '../common/app.error.js';
import { MatchStatus, PhaseFormat, PhaseStatus, PhaseType, SeasonStatus, SeasonTeamStatus } from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { shuffle } from "../libs/array.utils.js";
import { ScheduleEngine } from '../libs/schedule.engine.js';
export class ScheduleService extends ScheduleEngine {
    query;
    constructor(prisma) {
        // FIX: bỏ 'round' khỏi sortable. Cột `round` là String (generateRoundRobin
        // lưu round: String(d.round)) → orderBy DB-level sort lexicographic
        // ("10" < "2"), sai thứ tự khi >=10 round (double round-robin với 6+ team
        // đã chạm mức này: numRounds*2 = (n-1)*2). Muốn sort theo round đúng nghĩa
        // số phải migrate cột sang Int, hoặc sort ở application layer (xem
        // findMatchesByTeam — vẫn chưa migrate nên tạm chặn ở Queryable).
        super(prisma);
        this.query = new Queryable(prisma.match, {
            filterable: ['status', 'venue_id', 'round'],
            sortable: ['scheduled_at'],
            defaultSort: { column: 'scheduled_at', direction: 'asc' },
            searchFields: [],
            defaultPerPage: 20,
            maxPerPage: 300, // đủ load full season 1 request; nâng tiếp nếu tournament scale lên multi-league
            // TODO: select đang rỗng — verify thật runtime xem Prisma version này throw
            // hay fallback trả mỗi `id`. Fill rõ field list cần dùng trước khi findAll
            // được gọi ở chỗ phụ thuộc field khác ngoài id.
            beforeBuild: (wheres) => { wheres.push({ is_active: true }); },
        });
    }
    findAll(req = {}) {
        return this.query.run(req);
    }
    async findMatchesByTeam(seasonId, teamId, req = {}) {
        // FIX: clamp input. page/per_page <= 0 từ client trước đây gây skip âm
        // (Prisma throw PrismaClientValidationError) hoặc take=0 (vẫn full count scan
        // vô nghĩa). Không liên quan gì đến "ít dữ liệu" — đó chỉ trả data: [] sạch,
        // không cần xử lý riêng.
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300)); // đồng bộ cap với Queryable.maxPerPage — nếu Queryable export hằng số dùng chung được thì import lại, đừng hardcode 2 nơi
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
        // FIX: nếu sortCol === 'round' thì KHÔNG dùng orderBy DB-level (round là String,
        // lexicographic sort sai khi round >= 10). Phải fetch hết rồi sort+paginate ở app
        // layer. Trade-off: mất khả năng skip/take ở DB cho case này — acceptable vì
        // dataset 1 season/1 team chỉ vài chục match, không phải hàng nghìn.
        if (sortCol === 'round') {
            const [allRows, total] = await this.prisma.$transaction([
                this.prisma.match.findMany({
                    where,
                    select: {
                        id: true, round: true, home_team_id: true, away_team_id: true,
                        scheduled_at: true, venue_id: true, status: true,
                    },
                }),
                this.prisma.match.count({ where }),
            ]);
            allRows.sort((a, b) => {
                const ra = parseInt(a.round ?? '0', 10);
                const rb = parseInt(b.round ?? '0', 10);
                return direction === 'asc' ? ra - rb : rb - ra;
            });
            const data = allRows.slice((page - 1) * perPage, (page - 1) * perPage + perPage);
            const last_page = Math.max(1, Math.ceil(total / perPage));
            return {
                data,
                meta: { total, page, per_page: perPage, last_page, has_next: page < last_page },
            };
        }
        // FIX: orderBy bị mất ở bản trước — skip/take không có orderBy là undefined
        // behavior trên MySQL/Postgres (page 2 có thể lặp/lệch row khi không có thứ tự
        // tự nhiên ổn định, đặc biệt nếu có write xảy ra giữa request).
        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                select: {
                    id: true, round: true, home_team_id: true, away_team_id: true,
                    scheduled_at: true, venue_id: true, status: true,
                },
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
    async generateGroupsAndSchedule(seasonId, options) {
        const warnings = [];
        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');
        const { groupCount, groupIds } = await this.prisma.$transaction(async (tx) => {
            await tx.$executeRaw `SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;
            const season = await tx.season.findUnique({
                where: { id: seasonId },
                include: {
                    season_teams: { where: { status: { not: SeasonTeamStatus.withdrawn } } },
                    phases: { select: { id: true } },
                },
            });
            if (!season)
                throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
            if (season.status !== SeasonStatus.registration_open)
                throw createAppError('CONFLICT', `Season phải ở trạng thái 'registration_open' để generate, hiện tại: '${season.status}'`);
            if (season.phases.length > 0)
                throw createAppError('CONFLICT', `Season ${seasonId} đã có phase — không generate lại`);
            const teamIds = season.season_teams.map(st => st.team_id);
            if (teamIds.length < 2)
                throw createAppError('VALIDATION_ERROR', `Chỉ có ${teamIds.length} team active — cần ít nhất 2`);
            const groupCount = this.resolveGroupCount(teamIds.length, options.desiredGroupCount, options.minGroupSize);
            if (groupCount === 1 && teamIds.length > options.maxGroupSize)
                throw createAppError('VALIDATION_ERROR', `${teamIds.length} team không fit 1 group (maxGroupSize=${options.maxGroupSize})`);
            const distributed = this.assignTeamsToGroups(teamIds, groupCount);
            const phase = await tx.phase.create({
                data: {
                    season_id: seasonId,
                    name: 'Vòng bảng',
                    type: PhaseType.group_stage,
                    format: PhaseFormat.round_robin,
                    order: 1,
                    status: PhaseStatus.in_progress,
                    min_rest_days_per_team: options.minRestDaysPerTeam ?? 3,
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
                // FIX (CRITICAL #1): mapping bị mất khi refactor sang Promise.all — restore lại
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
            await tx.season.update({ where: { id: seasonId }, data: { status: SeasonStatus.ongoing } });
            return { groupCount, groupIds: createdGroupIds };
        }, { timeout: 30_000 });
        const scheduleResult = await this.autoScheduleMatches(seasonId, options);
        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(`${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`);
        }
        return { groupCount, groupIds, ...scheduleResult, warnings };
    }
    async autoScheduleMatches(seasonId, options) {
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                scheduled_at: null,
                status: MatchStatus.scheduled,
                group_id: { not: null },
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                round: true,
                group_id: true,
            },
            orderBy: [{ round: 'asc' }, { id: 'asc' }],
        });
        if (matches.length === 0)
            return { matchesScheduled: 0, failedMatchIds: [] };
        const [phase, season] = await Promise.all([
            this.prisma.phase.findFirst({
                where: {
                    season_id: seasonId,
                    type: PhaseType.group_stage
                },
                select: { min_rest_days_per_team: true },
            }),
            this.prisma.season.findUnique({
                where: { id: seasonId },
                select: { start_date: true },
            }),
        ]);
        if (!phase)
            throw createAppError('NOT_FOUND', `Không tìm thấy group_stage phase cho season ${seasonId}`);
        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);
        if (!season.start_date)
            throw createAppError('VALIDATION_ERROR', `Season ${seasonId} chưa có start_date`);
        const minRestDays = phase.min_rest_days_per_team ?? 3;
        const startDate = season.start_date; // UTC Date từ DB — dùng trực tiếp
        if (startDate < new Date())
            // log warning nhưng không throw — vẫn schedule được, chỉ pool nhỏ hơn
            console.warn(`[autoSchedule] season ${seasonId} start_date đã qua: ${startDate.toISOString()}`);
        const rangeEnd = new Date(startDate);
        rangeEnd.setMonth(rangeEnd.getMonth() + 6);
        const takenSet = await this.loadTakenSlots(options.venueIds, startDate, rangeEnd);
        const pool = this.buildSlotPool(options.venueIds, startDate, rangeEnd, options.matchTimes, takenSet);
        if (pool.length < matches.length) {
            throw createAppError('VALIDATION_ERROR', `Không đủ slot: cần ${matches.length}, chỉ có ${pool.length}. ` +
                `Thêm venueId / matchTime hoặc đẩy startDate sớm hơn.`);
        }
        const lastPlayedAt = new Map();
        const usedSlotIdx = new Set();
        const updates = [];
        const unscheduled = [];
        const byRound = new Map();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }
        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            for (const match of byRound.get(round)) {
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
        }
        const failedFromCollision = await this.writeScheduleBatch(updates);
        unscheduled.push(...failedFromCollision);
        return {
            matchesScheduled: updates.length - failedFromCollision.length,
            failedMatchIds: unscheduled,
        };
    }
    async rescheduleMatch(matchId, input) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: { id: true, status: true, home_team_id: true, away_team_id: true },
        });
        if (!match || match.status === MatchStatus.cancelled)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại hoặc đã bị huỷ`);
        const conflict = await this.prisma.match.findFirst({
            where: {
                id: { not: matchId },
                scheduled_at: input.scheduledAt,
                status: { not: MatchStatus.cancelled },
                OR: [
                    { venue_id: input.venueId },
                    { home_team_id: { in: [match.home_team_id, match.away_team_id] } },
                    { away_team_id: { in: [match.home_team_id, match.away_team_id] } },
                ],
            },
            select: { id: true },
        });
        if (conflict)
            throw createAppError('CONFLICT', `Venue ${input.venueId} hoặc 1 trong 2 team đã có trận lúc ${input.scheduledAt.toISOString()}`);
        // status: scheduled ở đây KHÔNG redundant như writeScheduleBatch — reschedule là entry point
        // duy nhất xử lý match đang ở `postponed` cần gán lại giờ. Set lại scheduled = transition
        // postponed -> scheduled hợp lệ. Match đang `ongoing`/`finished`/`forfeited`/`bye`/`abandoned`
        // mà bị reschedule là input-error, nên thêm whitelist rõ thay vì chỉ exclude cancelled:
        if (match.status !== MatchStatus.scheduled && match.status !== MatchStatus.postponed)
            throw createAppError('CONFLICT', `Match ${matchId} đang ở status '${match.status}' — không thể reschedule`);
        await this.prisma.match.update({
            where: { id: matchId },
            data: { scheduled_at: input.scheduledAt, venue_id: input.venueId, status: MatchStatus.scheduled },
        });
    }
    async getSeasonSchedule(seasonId) {
        const matches = await this.prisma.match.findMany({
            where: { season_id: seasonId, is_active: true },
            select: {
                id: true, round: true,
                home_team_id: true, away_team_id: true,
                scheduled_at: true, venue_id: true, status: true,
            },
            orderBy: [{ round: 'asc' }, { scheduled_at: 'asc' }, { id: 'asc' }],
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
                if (a === null || a === undefined || b === null || b === undefined) {
                    continue;
                }
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