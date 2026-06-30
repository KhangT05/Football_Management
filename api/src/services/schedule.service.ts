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

// Match duration giả định cho overlap check khi reschedule.
// Nếu giải có duration khác (futsal 2x20p, sân 11 người 2x45p+nghỉ), chỉnh
// lại hằng số này hoặc đưa thành config theo tournament/season.
const ASSUMED_MATCH_DURATION_MS = 2 * 60 * 60 * 1000; // 2h (đá + nghỉ + dự phòng)

// Số lần thử lại greedy scheduling với thứ tự match xáo trộn khác nhau,
// giữ lại kết quả có ít match thất bại nhất. Greedy chọn-slot-sớm-nhất theo
// 1 thứ tự cố định KHÔNG đảm bảo tìm ra lịch khả thi dù lịch đó tồn tại —
// đây là cách giảm rủi ro "failedMatchIds giả" với chi phí thấp, không cần
// CSP solver thật. Đủ cho scale vài chục match/giải sinh viên; nếu quy mô
// lớn hơn nhiều (hàng trăm match, ràng buộc phức tạp hơn) nên thay bằng
// constraint solver thật thay vì tăng số restart vô hạn.
const SCHEDULE_RESTARTS = 20;

type ScheduleCandidateMatch = {
    id: number;
    home_team_id: number;
    away_team_id: number;
    round: string | null;
    group_id: number | null;
};

type GreedyPassResult = {
    updates: { id: number; scheduledAt: Date; venueId: number }[];
    unscheduled: number[];
};

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

                // teams_per_group là approximate nominal capacity (groups có thể lệch
                // ±1 team do assignTeamsToGroups dùng snake-draft). Dùng giá trị lớn
                // nhất trong các group làm capacity — assignTeamToGroup (admin thêm 1
                // team lẻ sau draw) dùng số này để chặn group vượt quá. Yêu cầu field
                // Phase.teams_per_group (Int?) đã có trong schema.
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

                // N round-trip riêng (không phải N+1: không có query lồng trong loop
                // dựa trên kết quả query trước). Không gộp được thành 1 createMany vì
                // cần group.id trả về ngay để gán group_id cho seasonTeam/match draft
                // bên dưới — MySQL createMany không có RETURNING. Ở scale vài group/
                // giải sinh viên, N round-trip song song (Promise.all) không đáng lo.
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
                `${scheduleResult.failedMatchIds.length} match chưa xếp lịch (thiếu slot hoặc ` +
                `thuật toán không tìm ra phương án — xem lại venueIds/matchTimes/minRestDays): ` +
                `IDs [${scheduleResult.failedMatchIds.join(', ')}]`,
            );
        }

        return { groupCount, groupIds, ...scheduleResult, warnings };
    }

    async autoScheduleMatches(
        seasonId: number,
        // allowPastDate optional — mặc định false (throw nếu start_date đã qua).
        // Trước đây chỉ console.warn rồi vẫn chạy tiếp, sinh ra slot pool toàn
        // nằm trong quá khứ — sai lặng lẽ, không observable qua log structured.
        options: ScheduleOptions & { allowPastDate?: boolean },
    ): Promise<{ matchesScheduled: number; failedMatchIds: number[] }> {
        const matches: ScheduleCandidateMatch[] = await this.prisma.match.findMany({
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
            orderBy: { id: 'asc' }, // stable base order trước khi áp dụng MRV/restart
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

        // Throw thay vì chỉ warn — trừ khi caller chủ động bypass bằng
        // allowPastDate (vd backfill lịch sử có chủ đích).
        if (startDate < new Date() && !options.allowPastDate) {
            throw createAppError(
                'VALIDATION_ERROR',
                `Season ${seasonId} có start_date đã qua (${startDate.toISOString()}) — ` +
                `slot pool sẽ rơi vào quá khứ. Cập nhật start_date hoặc gọi với allowPastDate=true ` +
                `nếu đây là backfill có chủ đích.`,
            );
        }

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

        // Greedy chọn-slot-sớm-nhất theo 1 thứ tự cố định KHÔNG đảm bảo tìm ra
        // lịch khả thi dù lịch đó tồn tại (greedy không backtrack — 1 lựa chọn
        // sớm có thể khoá chết slot mà 1 match sau bắt buộc cần). Hai kỹ thuật
        // bù đắp, không cần CSP solver thật:
        //
        // 1. MRV ordering trong mỗi round: match nào có ÍT slot hợp lệ nhất
        //    (do ràng buộc rest-days của team đó) được xếp TRƯỚC — giảm khả
        //    năng nó bị "khoá chết" bởi match khác xếp trước nó. Đây là
        //    standard CSP heuristic (Minimum Remaining Values).
        // 2. Multi-restart: chạy toàn bộ pass greedy nhiều lần với random
        //    tie-break, giữ lại kết quả failedMatchIds ít nhất. Chi phí
        //    O(restarts × n), chấp nhận được vì đây là batch job chạy 1 lần,
        //    không phải hot path.
        let best: GreedyPassResult | null = null;

        for (let attempt = 0; attempt < SCHEDULE_RESTARTS; attempt++) {
            const result = this.runGreedyPass(matches, pool, minRestDays, attempt);
            if (!best || result.unscheduled.length < best.unscheduled.length) {
                best = result;
                if (best.unscheduled.length === 0) break; // tìm được lịch hoàn chỉnh, dừng sớm
            }
        }

        const { updates, unscheduled } = best!;

        const failedFromCollision = await this.writeScheduleBatch(updates);
        const finalUnscheduled = [...unscheduled, ...failedFromCollision];

        return {
            matchesScheduled: updates.length - failedFromCollision.length,
            failedMatchIds: finalUnscheduled,
        };
    }

    // ─── Greedy scheduling pass (1 lần thử, dùng nội bộ bởi multi-restart) ─────

    private runGreedyPass(
        matches: ScheduleCandidateMatch[],
        pool: ReturnType<ScheduleEngine['buildSlotPool']>,
        minRestDays: number,
        attemptSeed: number,
    ): GreedyPassResult {
        const lastPlayedAt = new Map<number, number>();
        const usedSlotIdx = new Set<number>();
        const updates: { id: number; scheduledAt: Date; venueId: number }[] = [];
        const unscheduled: number[] = [];

        const byRound = new Map<number, ScheduleCandidateMatch[]>();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }

        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            const roundMatches = byRound.get(round)!;

            // attempt 0 = thứ tự gốc (deterministic, dễ debug/reproduce).
            // attempt > 0 = MRV ordering trên bản shuffle khác nhau mỗi lần,
            // để tránh tie-break luôn rơi vào cùng 1 cục bộ tối ưu.
            const ordered = attemptSeed === 0
                ? roundMatches
                : this.orderByMostConstrained(
                    shuffle([...roundMatches]), pool, usedSlotIdx, lastPlayedAt, minRestDays,
                );

            for (const match of ordered) {
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

        return { updates, unscheduled };
    }

    // MRV heuristic: với mỗi match còn lại trong round, đếm số slot hợp lệ
    // (chưa bị used, thoả rest-days cho cả 2 team) TẠI THỜI ĐIỂM HIỆN TẠI —
    // không commit, chỉ đếm để sort. Match nào có ít lựa chọn nhất xử lý
    // trước, giảm rủi ro nó bị match khác "tiện tay" chiếm mất slot duy nhất
    // nó cần. Đây là proxy, không phải đếm chính xác theo lý thuyết CSP đầy
    // đủ (không tính ảnh hưởng dây chuyền các match sau), nhưng đủ tốt để
    // cải thiện tỷ lệ thành công so với thứ tự cố định ban đầu.
    private orderByMostConstrained(
        candidates: ScheduleCandidateMatch[],
        pool: ReturnType<ScheduleEngine['buildSlotPool']>,
        usedSlotIdx: Set<number>,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): ScheduleCandidateMatch[] {
        const withDegree = candidates.map(match => {
            let degree = 0;
            for (let idx = 0; idx < pool.length; idx++) {
                if (usedSlotIdx.has(idx)) continue;
                const slot = pool[idx]!;
                const candidateAt = this.vnTimeToUtc(slot.date, slot.time).getTime();
                if (this.isRestDaysSatisfied(match.home_team_id, candidateAt, lastPlayedAt, minRestDays)
                    && this.isRestDaysSatisfied(match.away_team_id, candidateAt, lastPlayedAt, minRestDays)) {
                    degree++;
                }
            }
            return { match, degree };
        });

        withDegree.sort((a, b) => a.degree - b.degree);
        return withDegree.map(w => w.match);
    }

    private isRestDaysSatisfied(
        teamId: number,
        candidateAtMs: number,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): boolean {
        const last = lastPlayedAt.get(teamId);
        if (last === undefined) return true;
        const diffDays = Math.abs(candidateAtMs - last) / (24 * 60 * 60 * 1000);
        return diffDays >= minRestDays;
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

        const RESCHEDULABLE: MatchStatus[] = [MatchStatus.scheduled, MatchStatus.postponed];
        if (!RESCHEDULABLE.includes(match.status))
            throw createAppError(
                'CONFLICT',
                `Match ${matchId} đang ở status '${match.status}' — chỉ reschedule được khi scheduled/postponed`,
            );

        // Trước đây chỉ check exact-time equality, không bắt được overlap thực
        // tế (trận trước chưa kết thúc, trận sau đã bắt đầu ở cùng sân/cùng
        // đội nhưng lệch giờ). Đổi sang window check ±ASSUMED_MATCH_DURATION_MS.
        // Note: không check rest-days ở đây — manual reschedule là override có
        // chủ đích, caller (admin) chịu trách nhiệm. Nếu muốn enforce, thêm
        // flag strictRestDays riêng.
        const windowStart = new Date(input.scheduledAt.getTime() - ASSUMED_MATCH_DURATION_MS);
        const windowEnd = new Date(input.scheduledAt.getTime() + ASSUMED_MATCH_DURATION_MS);

        const conflict = await this.prisma.match.findFirst({
            where: {
                id: { not: matchId },
                scheduled_at: { gte: windowStart, lte: windowEnd },
                status: { notIn: [MatchStatus.cancelled, MatchStatus.forfeited] },
                OR: [
                    { venue_id: input.venueId },
                    { home_team_id: { in: [match.home_team_id, match.away_team_id] } },
                    { away_team_id: { in: [match.home_team_id, match.away_team_id] } },
                ],
            },
            select: { id: true, status: true, scheduled_at: true },
        });

        if (conflict)
            throw createAppError(
                'CONFLICT',
                `Venue ${input.venueId} hoặc 1 trong 2 team đã có trận trong khoảng ` +
                `±${ASSUMED_MATCH_DURATION_MS / 60000} phút quanh ${input.scheduledAt.toISOString()} ` +
                `(match ${conflict.id} lúc ${conflict.scheduled_at?.toISOString()})`,
            );

        await this.prisma.match.update({
            where: { id: matchId },
            data: {
                scheduled_at: input.scheduledAt,
                venue_id: input.venueId,
                status: MatchStatus.scheduled,
            },
        });
    }

    async getSeasonSchedule(seasonId: number): Promise<SeasonSchedule> {
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
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });

        matches.sort((a, b) => {
            const ra = parseInt(a.round ?? '0', 10);
            const rb = parseInt(b.round ?? '0', 10);
            if (ra !== rb) return ra - rb;
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