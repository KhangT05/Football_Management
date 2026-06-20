import { createAppError } from '../common/app.error.js';
import { Match, MatchStatus, PhaseFormat, PhaseStatus, PhaseType, Prisma, PrismaClient, SeasonStatus, SeasonTeamStatus } from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { shuffle } from "../libs/array.utils.js";
import {
    GenerateOptions,
    GenerateResult,
    MatchByTeamRow,
    MatchDraft,
    RescheduleInput,
    ScheduleOptions,
    SeasonSchedule,
    Slot,
} from '../types/schedule.type.js';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { PaginatedResult, QueryRequest, SortDir } from '../types/queryable.type.js';

export class ScheduleService {

    private readonly query: Queryable<Match>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
        // FIX: bỏ 'round' khỏi sortable. Cột `round` là String (generateRoundRobin
        // lưu round: String(d.round)) → orderBy DB-level sort lexicographic
        // ("10" < "2"), sai thứ tự khi >=10 round (double round-robin với 6+ team
        // đã chạm mức này: numRounds*2 = (n-1)*2). Muốn sort theo round đúng nghĩa
        // số phải migrate cột sang Int, hoặc sort ở application layer (xem
        // findMatchesByTeam — vẫn chưa migrate nên tạm chặn ở Queryable).

        this.query = new Queryable<Match>(prisma.match, {
            filterable: ['season_id', 'status', 'venue_id', 'round'],
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Match>> {
        return this.query.run(req);
    }

    async findMatchesByTeam(
        seasonId: number,
        teamId: number,
        req: QueryRequest = {},
    ): Promise<PaginatedResult<MatchByTeamRow>> {
        // FIX: clamp input. page/per_page <= 0 từ client trước đây gây skip âm
        // (Prisma throw PrismaClientValidationError) hoặc take=0 (vẫn full count scan
        // vô nghĩa). Không liên quan gì đến "ít dữ liệu" — đó chỉ trả data: [] sạch,
        // không cần xử lý riêng.
        const page = Math.max(1, Number(req.page ?? 1));
        const perPage = Math.max(1, Math.min(Number(req.per_page ?? 20), 300)); // đồng bộ cap với Queryable.maxPerPage — nếu Queryable export hằng số dùng chung được thì import lại, đừng hardcode 2 nơi
        const sortCol = (req.sort === 'round' || req.sort === 'scheduled_at')
            ? req.sort
            : 'scheduled_at';
        const direction: SortDir = (req.direction === 'asc' || req.direction === 'desc')
            ? req.direction
            : 'asc';

        const where = {
            season_id: seasonId,
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


    async generateGroupsAndSchedule(
        seasonId: number,
        options: GenerateOptions,
    ): Promise<GenerateResult> {
        const warnings: string[] = [];

        if (options.venueIds.length === 0)
            throw createAppError('VALIDATION_ERROR', 'venueIds không được rỗng');
        if (options.matchTimes.length === 0)
            throw createAppError('VALIDATION_ERROR', 'matchTimes không được rỗng');
        if (options.startDate < new Date())
            warnings.push('startDate đã qua — slot pool có thể không đủ');

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
                    throw createAppError('CONFLICT',
                        `Season phải ở trạng thái 'registration_open' để generate, hiện tại: '${season.status}'`);
                if (season.phases.length > 0)
                    throw createAppError('CONFLICT', `Season ${seasonId} đã có phase — không generate lại`);

                const teamIds = season.season_teams.map(st => st.team_id);
                if (teamIds.length < 2)
                    throw createAppError('VALIDATION_ERROR', `Chỉ có ${teamIds.length} team active — cần ít nhất 2`);

                const groupCount = this.resolveGroupCount(teamIds.length, options.desiredGroupCount, options.minGroupSize);

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
                    groupCreateData.map(data => tx.group.create({ data }))
                );

                const createdGroupIds: number[] = [];
                const allMatches: MatchDraft[] = [];

                for (let i = 0; i < groups.length; i++) {
                    const group = groups[i]!;
                    const teamsInGroup = distributed[i]!;

                    // FIX (CRITICAL #1): mapping bị mất khi refactor sang Promise.all — restore lại
                    await tx.seasonTeam.updateMany({
                        where: { season_id: seasonId, team_id: { in: teamsInGroup } },
                        data: { group_id: group.id },
                    });

                    if (teamsInGroup.length < 2) {
                        warnings.push(`${group.name}: chỉ có ${teamsInGroup.length} team — bỏ qua generate match`);
                        continue;
                    }

                    const matches = this.generateRoundRobin(
                        teamsInGroup, group.id, seasonId, phase.id, options.doubleRound ?? true
                    );
                    allMatches.push(...matches);
                    createdGroupIds.push(group.id);
                }

                await tx.match.createMany({ data: allMatches });
                await tx.season.update({ where: { id: seasonId }, data: { status: SeasonStatus.ongoing } });

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
        const matches = await this.prisma.match.findMany({
            // FIX (CRITICAL #2): match chưa có giờ phải là draft, không phải scheduled
            where: { season_id: seasonId, scheduled_at: null, status: MatchStatus.scheduled },
            orderBy: [{ round: 'asc' }, { id: 'asc' }],
        });

        if (matches.length === 0) return { matchesScheduled: 0, failedMatchIds: [] };

        const phase = await this.prisma.phase.findFirst({
            where: { season_id: seasonId, type: 'group_stage' },
            select: { min_rest_days_per_team: true },
        });

        if (!phase)
            throw createAppError('NOT_FOUND', `Không tìm thấy group_stage phase cho season ${seasonId}`);

        // FIX (CRITICAL #3 latent risk): null * ms = 0 → rest constraint bị tắt âm thầm
        const minRestDays = phase.min_rest_days_per_team ?? 3;

        const rangeEnd = new Date(options.startDate);
        rangeEnd.setMonth(rangeEnd.getMonth() + 6);

        const takenSet = await this.loadTakenSlots(options.venueIds, options.startDate, rangeEnd);
        const pool = this.buildSlotPool(options.venueIds, options.startDate, rangeEnd, options.matchTimes, takenSet);

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
    async rescheduleMatch(matchId: number, input: RescheduleInput): Promise<void> {
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
            throw createAppError(
                'CONFLICT',
                `Venue ${input.venueId} hoặc 1 trong 2 team đã có trận lúc ${input.scheduledAt.toISOString()}`,
            );

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

    async getSeasonSchedule(seasonId: number): Promise<SeasonSchedule> {
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



    private async loadTakenSlots(venueIds: number[], startDate: Date, rangeEnd: Date): Promise<Set<string>> {
        const taken = await this.prisma.match.findMany({
            where: {
                venue_id: { in: venueIds },
                scheduled_at: { not: null, gte: startDate, lte: rangeEnd },
                status: { not: MatchStatus.cancelled },
            },
            select: { venue_id: true, scheduled_at: true },
        });
        return new Set(taken.map(m => `${m.venue_id}_${m.scheduled_at!.toISOString()}`));
    }

    private async writeScheduleBatch(
        updates: { id: number; scheduledAt: Date; venueId: number }[],
    ): Promise<number[]> {
        if (updates.length === 0) return [];

        try {
            const scheduledCases = updates.map(u => Prisma.sql`WHEN ${u.id} THEN ${u.scheduledAt}`);
            const venueCases = updates.map(u => Prisma.sql`WHEN ${u.id} THEN ${u.venueId}`);
            const ids = updates.map(u => u.id);

            await this.prisma.$executeRaw`
                UPDATE matches
                SET scheduled_at = CASE id ${Prisma.join(scheduledCases, ' ')} END,
                    venue_id     = CASE id ${Prisma.join(venueCases, ' ')} END
                WHERE id IN (${Prisma.join(ids)})
            `;
            return [];
        } catch {
            // Bulk fail → fallback per-row để isolate conflict
            const failed: number[] = [];
            for (const u of updates) {
                try {
                    await this.prisma.match.update({
                        where: { id: u.id },
                        data: { scheduled_at: u.scheduledAt, venue_id: u.venueId },
                    });
                } catch {
                    failed.push(u.id);
                }
            }
            return failed;
        }
    }

    private buildSlotPool(
        venueIds: number[],
        startDate: Date,
        rangeEnd: Date,
        matchTimes: string[],
        takenSet: Set<string>,
    ): Slot[] {
        const slots: Slot[] = [];
        const cursor = new Date(startDate);

        while (cursor <= rangeEnd) {
            for (const venueId of venueIds) {
                for (const time of matchTimes) {
                    const dt = this.vnTimeToUtc(cursor, time);
                    if (!takenSet.has(`${venueId}_${dt.toISOString()}`)) {
                        slots.push({ venue_id: venueId, date: new Date(cursor), time });
                    }
                }
            }
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        return slots.sort((a, b) => {
            const d = a.date.getTime() - b.date.getTime();
            return d !== 0 ? d : a.time.localeCompare(b.time);
        });
    }

    private findEarliestValidSlot(
        pool: Slot[],
        usedSlotIdx: Set<number>,
        homeTeamId: number,
        awayTeamId: number,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): number {
        const minRestMs = minRestDays * 24 * 60 * 60 * 1000;

        for (let i = 0; i < pool.length; i++) {
            if (usedSlotIdx.has(i)) continue;
            const slotTime = pool[i]!.date.getTime();
            const homeLast = lastPlayedAt.get(homeTeamId);
            const awayLast = lastPlayedAt.get(awayTeamId);
            if (homeLast !== undefined && slotTime - homeLast < minRestMs) continue;
            if (awayLast !== undefined && slotTime - awayLast < minRestMs) continue;
            return i;
        }
        return -1;
    }

    private resolveGroupCount(totalTeams: number, desiredGroups: number, minGroupSize: number): number {
        let g = Math.min(desiredGroups, totalTeams);
        while (g > 1) {
            if (Math.floor(totalTeams / g) >= minGroupSize) return g;
            g--;
        }
        return 1;
    }

    private assignTeamsToGroups(teamIds: number[], numberOfGroups: number, seedOrder?: number[]): number[][] {
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
        seasonId: number,
        phaseId: number,
        doubleRound = true,
    ): MatchDraft[] {
        if (teamIds.length < 2) return [];

        const teams: (number | null)[] = [...teamIds];
        if (teams.length % 2 !== 0) teams.push(null);

        const n = teams.length;
        const numRounds = n - 1;
        const drafts: { round: number; home: number; away: number }[] = [];
        let current = [...teams];

        for (let round = 0; round < numRounds; round++) {
            for (let i = 0; i < n / 2; i++) {
                const a = current[i];
                const b = current[n - 1 - i];
                if (a === null || a === undefined || b === null || b === undefined) {
                    const realTeam = a ?? b;
                    if (realTeam !== null && realTeam !== undefined) {
                        drafts.push({ round: round + 1, home: realTeam, away: -1 });
                    }
                    continue;
                }
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
            season_id: seasonId,
            home_team_id: d.home,
            away_team_id: d.away,
            round: String(d.round),
            status: MatchStatus.scheduled,
        }));
    }

    private vnTimeToUtc(date: Date, vnTime: string): Date {
        const [h, m] = vnTime.split(':').map(Number);
        const vnDateStr = formatInTimeZone(date, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        const localStr = `${vnDateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        return fromZonedTime(localStr, 'Asia/Ho_Chi_Minh');
    }

    private rotate<T>(arr: T[]): T[] {
        if (arr.length <= 2) return arr;
        return [arr[0]!, arr[arr.length - 1]!, ...arr.slice(1, arr.length - 1)];
    }
}