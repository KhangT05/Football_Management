import { createAppError } from '../common/app.error.js';
import {
    Match,
    MatchStatus,
    PhaseFormat,
    PhaseStatus,
    PhaseType,
    PrismaClient,
    SeasonStatus,
    SeasonTeamStatus,
} from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { shuffle } from '../libs/array.utils.js';
import {
    GenerateOptions,
    GenerateResult,
    MatchByTeamRow,
    MatchDraft,
    RescheduleInput,
    ScheduleOptions,
    SeasonSchedule,
} from '../types/schedule.type.js';
import { PaginatedResult, QueryRequest, SortDir } from '../types/queryable.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';

export class ScheduleService extends ScheduleEngine {
    private readonly query: Queryable<Match>;

    constructor(prisma: PrismaClient) {
        // round là String column → DB-level orderBy là lexicographic ("10" < "2").
        // Chặn 'round' khỏi sortable ở Queryable; sort đúng chỉ ở app layer sau khi
        // parseInt. Muốn DB-level sort chuẩn phải migrate round sang Int.
        super(prisma);

        this.query = new Queryable<Match>(prisma.match, {
            filterable: ['status', 'venue_id', 'round'],
            sortable: ['scheduled_at'],
            defaultSort: { column: 'scheduled_at', direction: 'asc' },
            searchFields: [],
            defaultPerPage: 20,
            maxPerPage: 300,
            beforeBuild: (wheres) => { wheres.push({ is_active: true }); },
        });
    }

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Match>> {
        return this.query.run(req);
    }

    async findMatchesByTeam(
        seasonId: number,
        teamId: number,
        req: QueryRequest = {},
    ): Promise<PaginatedResult<MatchByTeamRow>> {
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300));
        const sortCol = (req.sort === 'round' || req.sort === 'scheduled_at')
            ? req.sort
            : 'scheduled_at';
        const direction: SortDir = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';

        const where = {
            phase: { season_id: seasonId },
            is_active: true,
            OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
        };

        const SELECT = {
            id: true, round: true, home_team_id: true, away_team_id: true,
            scheduled_at: true, venue_id: true, status: true,
        } as const;

        // round là String → không thể dùng DB-level orderBy đúng nghĩa số.
        // Fetch toàn bộ dataset (bounded: vài chục match/team/season) rồi sort ở app.
        if (sortCol === 'round') {
            const [allRows, total] = await this.prisma.$transaction([
                this.prisma.match.findMany({ where, select: SELECT }),
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

        // scheduled_at là DateTime → DB-level orderBy hợp lệ.
        const [data, total] = await this.prisma.$transaction([
            this.prisma.match.findMany({
                where,
                select: SELECT,
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

    async generateGroupsAndSchedule(
        seasonId: number,
        options: GenerateOptions,
    ): Promise<GenerateResult> {
        const warnings: string[] = [];

        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');

        const { groupCount, groupIds } = await this.prisma.$transaction(
            async tx => {
                await tx.$executeRaw`SELECT id FROM seasons WHERE id = ${seasonId} FOR UPDATE`;

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
                    throw createAppError(
                        'CONFLICT',
                        `Season phải ở 'registration_open' để generate, hiện tại: '${season.status}'`,
                    );
                if (season.phases.length > 0)
                    throw createAppError('CONFLICT', `Season ${seasonId} đã có phase — không generate lại`);

                const teamIds = season.season_teams.map(st => st.team_id);
                if (teamIds.length < 2)
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `Chỉ có ${teamIds.length} team active — cần ít nhất 2`,
                    );

                const groupCount = this.resolveGroupCount(
                    teamIds.length,
                    options.desiredGroupCount,
                    options.minGroupSize,
                );

                if (groupCount === 1 && teamIds.length > options.maxGroupSize)
                    throw createAppError(
                        'VALIDATION_ERROR',
                        `${teamIds.length} team không fit 1 group (maxGroupSize=${options.maxGroupSize})`,
                    );

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

                const groups = await Promise.all(
                    groupCreateData.map(data => tx.group.create({ data })),
                );

                const createdGroupIds: number[] = [];
                const allMatches: MatchDraft[] = [];

                for (let i = 0; i < groups.length; i++) {
                    const group = groups[i]!;
                    const teamsInGroup = distributed[i]!;

                    await tx.seasonTeam.updateMany({
                        where: { season_id: seasonId, team_id: { in: teamsInGroup } },
                        data: { group_id: group.id },
                    });

                    if (teamsInGroup.length < 2) {
                        warnings.push(
                            `${group.name}: chỉ có ${teamsInGroup.length} team — bỏ qua generate match`,
                        );
                        continue;
                    }

                    const matches = this.generateRoundRobin(
                        teamsInGroup, group.id, phase.id, options.doubleRound ?? true,
                    );
                    allMatches.push(...matches);
                    createdGroupIds.push(group.id);
                }

                await tx.match.createMany({ data: allMatches });
                await tx.season.update({
                    where: { id: seasonId },
                    data: { status: SeasonStatus.ongoing },
                });

                return { groupCount, groupIds: createdGroupIds };
            },
            { timeout: 30_000 },
        );

        const scheduleResult = await this.autoScheduleMatches(seasonId, options);

        if (scheduleResult.failedMatchIds.length > 0) {
            warnings.push(
                `${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );
        }

        return { groupCount, groupIds, ...scheduleResult, warnings };
    }

    async autoScheduleMatches(
        seasonId: number,
        options: ScheduleOptions,
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        // Fetch không orderBy round ở DB — round là String, sort sai khi >= 10.
        // Sort ở app layer sau khi parseInt.
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
            // Không orderBy round ở DB — lexicographic sai. Sort ở app layer bên dưới.
            orderBy: { id: 'asc' }, // stable secondary sort để output deterministic
        });

        if (matches.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        const [phase, season] = await Promise.all([
            this.prisma.phase.findFirst({
                where: { season_id: seasonId, type: PhaseType.group_stage },
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
        const startDate = season.start_date;

        if (startDate < new Date())
            console.warn(`[autoSchedule] season ${seasonId} start_date đã qua: ${startDate.toISOString()}`);

        const rangeEnd = new Date(startDate);
        rangeEnd.setMonth(rangeEnd.getMonth() + 6);

        const takenSet = await this.loadTakenSlots(options.venueIds, startDate, rangeEnd);
        const pool = this.buildSlotPool(
            options.venueIds, startDate, rangeEnd, options.matchTimes, takenSet,
        );

        if (pool.length < matches.length) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Không đủ slot: cần ${matches.length}, chỉ có ${pool.length}. ` +
                `Thêm venueId / matchTime hoặc đẩy startDate sớm hơn.`,
            );
        }

        const lastPlayedAt = new Map<number, number>();
        const usedSlotIdx = new Set<number>();
        const updates: { id: number; scheduledAt: Date; venueId: number }[] = [];
        const unscheduled: number[] = [];

        // Group by round (parseInt để sort đúng thứ tự số).
        const byRound = new Map<number, typeof matches>();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }

        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            for (const match of byRound.get(round)!) {
                const slotIdx = this.findEarliestValidSlot(
                    pool, usedSlotIdx,
                    match.home_team_id, match.away_team_id,
                    lastPlayedAt, minRestDays,
                );

                if (slotIdx === -1) { unscheduled.push(match.id); continue; }

                const slot = pool[slotIdx]!;
                const scheduledAt = this.vnTimeToUtc(slot.date, slot.time);

                usedSlotIdx.add(slotIdx);
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

    async rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void> {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: {
                id: true,
                status: true,
                home_team_id: true,
                away_team_id: true,
                phase: { select: { min_rest_days_per_team: true } },
            },
        });

        if (!match)
            throw createAppError('NOT_FOUND', `Match ${matchId} không tồn tại`);

        // Whitelist status hợp lệ để reschedule — tránh silent accept trên ongoing/finished.
        const RESCHEDULABLE: MatchStatus[] = [MatchStatus.scheduled, MatchStatus.postponed];
        if (!RESCHEDULABLE.includes(match.status))
            throw createAppError(
                'CONFLICT',
                `Match ${matchId} đang ở status '${match.status}' — chỉ reschedule được khi scheduled/postponed`,
            );

        // Conflict check: exact-time overlap cho venue hoặc team.
        // Note: không check rest days ở đây — manual reschedule là override có chủ đích,
        // caller (admin) chịu trách nhiệm. Nếu muốn enforce thì cần thêm flag strictRestDays.
        const conflict = await this.prisma.match.findFirst({
            where: {
                id: { not: matchId },
                scheduled_at: input.scheduledAt,
                status: { notIn: [MatchStatus.cancelled, MatchStatus.forfeited] },
                OR: [
                    { venue_id: input.venueId },
                    { home_team_id: { in: [match.home_team_id, match.away_team_id] } },
                    { away_team_id: { in: [match.home_team_id, match.away_team_id] } },
                ],
            },
            select: { id: true, status: true },
        });

        if (conflict)
            throw createAppError(
                'CONFLICT',
                `Venue ${input.venueId} hoặc 1 trong 2 team đã có trận lúc ${input.scheduledAt.toISOString()}`,
            );

        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                scheduled_at: input.scheduledAt,
                venue_id: input.venueId,
                status: MatchStatus.scheduled, // transition: postponed → scheduled hợp lệ
            },
        });
    }

    async getSeasonSchedule(seasonId: number): Promise<SeasonSchedule> {
        // match không có season_id trực tiếp — join qua phase.
        const matches = await this.prisma.match.findMany({
            where: {
                phase: { season_id: seasonId },
                is_active: true,
            },
            select: {
                id: true, round: true,
                home_team_id: true, away_team_id: true,
                scheduled_at: true, venue_id: true, status: true,
            },
            // round là String → không sort ở DB. Sort ở app layer bên dưới.
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });

        // Sort theo round (số) + scheduled_at làm secondary.
        matches.sort((a, b) => {
            const ra = parseInt(a.round ?? '0', 10);
            const rb = parseInt(b.round ?? '0', 10);
            if (ra !== rb) return ra - rb;
            // secondary: scheduled_at asc (null cuối)
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
            })),
        };
    }

    private resolveGroupCount(
        totalTeams: number,
        desiredGroups: number,
        minGroupSize: number,
    ): number {
        let g = Math.min(desiredGroups, totalTeams);
        while (g > 1) {
            if (Math.floor(totalTeams / g) >= minGroupSize) return g;
            g--;
        }
        return 1;
    }

    private assignTeamsToGroups(
        teamIds: number[],
        numberOfGroups: number,
        seedOrder?: number[],
    ): number[][] {
        const ordered = seedOrder ?? shuffle([...teamIds]);
        const groups: number[][] = Array.from({ length: numberOfGroups }, () => []);
        let idx = 0;
        let dir = 1;

        for (const teamId of ordered) {
            groups[idx]!.push(teamId);
            idx += dir;
            if (idx === numberOfGroups) { idx = numberOfGroups - 1; dir = -1; }
            else if (idx === -1) { idx = 0; dir = 1; }
        }
        return groups;
    }

    private generateRoundRobin(
        teamIds: number[],
        groupId: number,
        phaseId: number,
        doubleRound = true,
    ): MatchDraft[] {
        if (teamIds.length < 2) return [];

        const teams: (number | null)[] = [...teamIds];
        if (teams.length % 2 !== 0) teams.push(null); // bye slot

        const n = teams.length;
        const numRounds = n - 1;
        const drafts: { round: number; home: number; away: number }[] = [];
        let current = [...teams];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < n / 2; i++) {
                const a = current[i];
                const b = current[n - 1 - i];
                if (a == null || b == null) continue;
                const [home, away] = round % 2 === 0 ? [a, b] : [b, a];
                drafts.push({ round: round + 1, home, away });
            }
            current = this.rotate(current);
        }

        if (doubleRound) {
            drafts.push(
                ...drafts.map(d => ({ round: d.round + numRounds, home: d.away, away: d.home })),
            );
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

    private rotate<T>(arr: T[]): T[] {
        if (arr.length <= 2) return arr;
        // Giữ arr[0] cố định (round-robin rotation algorithm), xoay phần còn lại.
        return [arr[0]!, arr[arr.length - 1]!, ...arr.slice(1, arr.length - 1)];
    }
}