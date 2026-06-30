import { createAppError } from '../common/app.error.js';
import { SeasonListItem } from '../dtos/season.schema.js';
import { PrismaClient, SeasonStatus } from '../generated/prisma/client.js';
import { Queryable } from '../libs/queryable.js';
import { PaginatedResult, QueryableConfig, QueryRequest } from '../types/queryable.type.js';
import {
    H2HRecord,
    PLAYER_STATISTIC_SELECT,
    PlayerStatisticRow,
    StandingAccum,
    TEAM_STANDING_SELECT,
    TeamStandingRow,
} from '../types/standing.type.js';

export class StandingsService {
    private standingQueryable: Queryable<TeamStandingRow>;
    private playerStatQueryable: Queryable<PlayerStatisticRow>;

    constructor(private readonly prisma: PrismaClient) {
        // Standings: sort by position by default, filter by group_id inject từ caller
        const standingConfig: QueryableConfig = {
            select: TEAM_STANDING_SELECT,
            sortable: ['position', 'points', 'goals_for', 'wins', 'id'],
            defaultSort: { column: 'position', direction: 'asc' },
            filterable: [],
            defaultPerPage: 20,
            maxPerPage: 50,
        };

        // Player stats: sort by goals by default, filter by season_id + team_id inject từ caller
        const playerStatConfig: QueryableConfig = {
            select: PLAYER_STATISTIC_SELECT,
            sortable: ['goals_scored', 'yellow_cards', 'red_cards', 'matches_played', 'id'],
            defaultSort: { column: 'goals_scored', direction: 'desc' },
            filterable: [],
            defaultPerPage: 20,
            maxPerPage: 100,
        };

        this.standingQueryable = new Queryable<TeamStandingRow>(
            this.prisma.teamStanding,
            standingConfig,
        );

        this.playerStatQueryable = new Queryable<PlayerStatisticRow>(
            this.prisma.playerStatistic,
            playerStatConfig,
        );
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — STANDINGS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List standings của 1 group cụ thể.
     *
     * API nhận groupId trực tiếp — TeamStanding có group_id FK nên không cần join.
     * Không nhận seasonId vì:
     *   - standings thuộc group, không phải season
     *   - season có thể có nhiều group → caller phải chỉ định group nào
     *   - nếu cần cross-group view, dùng listStandingsBySeason()
     *
     * QueryRequest từ HTTP: page, sort, direction, per_page
     */
    // ═══════════════════════════════════════════════════════════════════════════
    // FIX — listGroupStandings: thêm seasonId guard
    // ═══════════════════════════════════════════════════════════════════════════
    // Thay thế method listGroupStandings cũ bằng version này.
    // Thêm param seasonId để validate group thuộc đúng season —
    // tránh user gọi /seasons/1/standings/99 với group 99 thuộc season khác.

    async listGroupStandings(
        groupId: number,
        req: QueryRequest,
        seasonId?: number, // optional — nếu có thì validate
    ): Promise<PaginatedResult<TeamStandingRow>> {
        // Guard: validate group thuộc season nếu seasonId được truyền
        if (seasonId !== undefined) {
            const group = await this.prisma.group.findUnique({
                where: { id: groupId },
                select: { phase: { select: { season_id: true } } },
            });

            if (!group)
                throw createAppError('NOT_FOUND', `Group ${groupId} không tồn tại`);

            if (group.phase.season_id !== seasonId)
                throw createAppError(
                    'VALIDATION_ERROR',
                    `Group ${groupId} không thuộc season ${seasonId}`,
                );
        }

        const page = Math.max(1, Number(req.page) || 1);
        const per_page = Math.min(Math.max(1, Number(req.per_page) || 20), 50);
        const skip = (page - 1) * per_page;

        const allowedSortColumns = ['position', 'points', 'goals_for', 'wins', 'id'] as const;
        type SortCol = typeof allowedSortColumns[number];
        const sortColumn: SortCol = allowedSortColumns.includes(req.sort as SortCol)
            ? (req.sort as SortCol)
            : 'position';
        const sortDir = req.direction === 'desc' ? 'desc' : 'asc';

        // FIX: TeamStanding không có field `is_active` trong schema — chỉ có soft-delete
        // `deleted_at`. Filter cũ `is_active: true` sai schema, gây Prisma validation error
        // runtime (PrismaClientValidationError: Unknown argument `is_active`).
        const where = { group_id: groupId, deleted_at: null };

        const [data, total] = await Promise.all([
            this.prisma.teamStanding.findMany({
                where,
                select: TEAM_STANDING_SELECT,
                orderBy: { [sortColumn]: sortDir },
                skip,
                take: per_page,
            }),
            this.prisma.teamStanding.count({ where }),
        ]);

        const last_page = Math.ceil(total / per_page) || 1;

        return {
            data,
            meta: { total, page, per_page, last_page, has_next: page < last_page },
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // FIX — listStandingsBySeason: group output theo group_id (World Cup style)
    // ═══════════════════════════════════════════════════════════════════════════
    // Thay thế method listStandingsBySeason cũ.
    // Group raw rows theo group để client render từng bảng một cách tường minh.

    async listStandingsBySeason(seasonId: number): Promise<{
        groupId: number;
        groupName: string;
        standings: TeamStandingRow[];
    }[]> {
        // Validate season status — chỉ serve ongoing/finished/cancelled
        const season = await this.prisma.season.findUnique({
            where: { id: seasonId },
            select: { status: true },
        });

        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);

        const allowedStatuses: SeasonStatus[] = ['ongoing', 'finished', 'cancelled'];
        if (!allowedStatuses.includes(season.status as SeasonStatus))
            throw createAppError(
                'FORBIDDEN',
                `Season ${seasonId} ở trạng thái '${season.status}' — không có standings để xem`,
            );

        const rows = await this.prisma.teamStanding.findMany({
            where: {
                // FIX: cùng lỗi is_active -> deleted_at như listGroupStandings
                deleted_at: null,
                group: { phase: { season_id: seasonId } },
            },
            select: {
                ...TEAM_STANDING_SELECT,
                // Lấy thêm group info để group output
                group: { select: { id: true, name: true } },
            },
            orderBy: [{ group_id: 'asc' }, { position: 'asc' }],
        });

        // Group rows theo group_id — Map giữ insertion order
        const groupMap = new Map<number, { groupId: number; groupName: string; standings: TeamStandingRow[] }>();

        for (const row of rows) {
            const gid = row.group.id;
            if (!groupMap.has(gid)) {
                groupMap.set(gid, { groupId: gid, groupName: row.group.name, standings: [] });
            }
            // Tách group field ra khỏi row trước khi push vào standings
            const { group: _group, ...standingRow } = row;
            groupMap.get(gid)!.standings.push(standingRow as TeamStandingRow);
        }

        return [...groupMap.values()];
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — PLAYER STATS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List player stats trong season, optional filter theo team.
     *
     * seasonId là context chính — PlayerStatistic có season_id FK trực tiếp.
     * team_id optional filter, inject từ req.filter.
     */
    async listPlayerStats(
        seasonId: number,
        req: QueryRequest,
    ): Promise<PaginatedResult<PlayerStatisticRow>> {
        const queryReq: QueryRequest = {
            ...req,
            filter: {
                ...(req.filter || {}),
                season_id: { eq: seasonId },
            },
        };

        return this.playerStatQueryable.run(queryReq);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — SUSPENDED PLAYERS
    // ═══════════════════════════════════════════════════════════════════════════

    async getSuspendedPlayers(seasonId: number) {
        return this.prisma.playerStatistic.findMany({
            where: { season_id: seasonId, is_suspended: true },
            include: {
                player: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
            },
            orderBy: { team_id: 'asc' },
        });
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // WRITE — RECOMPUTE STANDINGS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Recompute standings của 1 group từ đầu — full scan, không incremental.
     *
     * Full scan là đúng ở scale này (group ≤ 8 teams, ≤ 28 matches/group).
     * Incremental update phức tạp hơn nhiều (phải undo kết quả cũ) và không đáng.
     *
     * Flow:
     *   1. Load TournamentRule (points config + tiebreaker order)
     *   2. Load tất cả official finished matches của group
     *   3. Accumulate stats cho từng team
     *   4. Load card stats nếu tiebreaker cần
     *   5. Build H2H map nếu tiebreaker cần
     *   6. Sort với H2H mini-league logic (UEFA standard)
     *   7. Upsert batch trong transaction
     *
     * Không gọi từ bên ngoài transaction của confirmResult —
     * standings recompute chạy sau khi match transaction commit (eventually consistent).
     * Nếu fail: standings stale nhưng match đã finalized. Acceptable cho scale này.
     */
    async recomputeGroupStandings(groupId: number): Promise<void> {
        // Path dài vì TournamentRule attach vào tournament, không phải season/group.
        // Không có cách ngắn hơn trừ khi denormalize rule xuống group — không nên.
        const group = await this.prisma.group.findUniqueOrThrow({
            where: { id: groupId },
            select: {
                phase: {
                    select: {
                        season: {
                            select: {
                                id: true,
                                tournament: {
                                    select: {
                                        tournamentRule: {
                                            select: {
                                                points_per_win: true,
                                                points_per_draw: true,
                                                points_per_loss: true,
                                                tiebreaker_order: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        // Phase.season_id là non-null trong schema — assert để catch misconfiguration sớm
        const seasonId = group.phase.season?.id;
        if (!seasonId) {
            throw new Error(`Group ${groupId}: phase không có season — data integrity issue`);
        }

        const rule = group.phase.season?.tournament?.tournamentRule;
        const pointsWin = rule?.points_per_win ?? 3;
        const pointsDraw = rule?.points_per_draw ?? 1;
        const pointsLoss = rule?.points_per_loss ?? 0;
        const tiebreakerOrder = (rule?.tiebreaker_order as string[]) ?? ['goal_diff', 'goals_scored', 'head_to_head'];

        // Load official matches — chỉ 'official' status, bỏ qua protested/under_review
        const matches = await this.prisma.match.findMany({
            where: {
                group_id: groupId,
                status: { in: ['finished', 'forfeited'] },
                is_active: true,
                matchResult: { status: 'official' },
            },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                matchResult: {
                    select: {
                        home_final_score: true,
                        away_final_score: true,
                        winner_team_id: true,
                        status: true,
                    },
                },
            },
        });

        // Chỉ tính matches có matchResult (guard null)
        const officialMatches = matches.filter(
            (m): m is typeof m & { matchResult: NonNullable<typeof m.matchResult> } =>
                m.matchResult !== null,
        );

        // Load teams thuộc group qua seasonTeam
        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: { group_id: groupId },
            select: { team_id: true },
        });
        const teamIds = seasonTeams.map(st => st.team_id);

        // Init accumulators cho tất cả teams, kể cả chưa đá trận nào
        const standings = new Map<number, StandingAccum>(
            teamIds.map(tid => [tid, {
                teamId: tid, played: 0, wins: 0, draws: 0, losses: 0,
                goalsFor: 0, goalsAgainst: 0, yellowCards: 0, redCards: 0, points: 0,
            }]),
        );

        // Accumulate stats từ mỗi match
        for (const m of officialMatches) {
            const r = m.matchResult;
            const home = standings.get(m.home_team_id);
            const away = standings.get(m.away_team_id);

            // Guard: team có thể không thuộc group nếu data dirty
            if (!home || !away) continue;

            const hg = r.home_final_score;
            const ag = r.away_final_score;

            home.played++; away.played++;
            home.goalsFor += hg; home.goalsAgainst += ag;
            away.goalsFor += ag; away.goalsAgainst += hg;

            if (hg > ag) {
                home.wins++; home.points += pointsWin;
                away.losses++; away.points += pointsLoss;
            } else if (ag > hg) {
                away.wins++; away.points += pointsWin;
                home.losses++; home.points += pointsLoss;
            } else {
                home.draws++; home.points += pointsDraw;
                away.draws++; away.points += pointsDraw;
            }
        }

        // Load card stats — chỉ khi tiebreaker order có yellow/red_cards
        // seasonId đã assert not null ở trên
        const needsCardStats =
            tiebreakerOrder.includes('yellow_cards') ||
            tiebreakerOrder.includes('red_cards');

        if (needsCardStats) {
            const cardStats = await this.prisma.playerStatistic.groupBy({
                by: ['team_id'],
                where: { team_id: { in: teamIds }, season_id: seasonId },
                _sum: { yellow_cards: true, red_cards: true },
            });

            for (const stat of cardStats) {
                const s = standings.get(stat.team_id);
                if (!s) continue;
                s.yellowCards = stat._sum.yellow_cards ?? 0;
                s.redCards = stat._sum.red_cards ?? 0;
            }
        }

        // Build H2H map — chỉ khi cần
        const h2h = new Map<string, H2HRecord>();

        if (tiebreakerOrder.includes('head_to_head')) {
            const k = (a: number, b: number) => `${a}:${b}`;

            for (const m of officialMatches) {
                const r = m.matchResult;
                const hg = r.home_final_score;
                const ag = r.away_final_score;

                const homeH2H = h2h.get(k(m.home_team_id, m.away_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };
                const awayH2H = h2h.get(k(m.away_team_id, m.home_team_id)) ?? { goalsFor: 0, goalsAgainst: 0, points: 0 };

                homeH2H.goalsFor += hg; homeH2H.goalsAgainst += ag;
                awayH2H.goalsFor += ag; awayH2H.goalsAgainst += hg;

                if (hg > ag) { homeH2H.points += pointsWin; }
                else if (ag > hg) { awayH2H.points += pointsWin; }
                else { homeH2H.points += pointsDraw; awayH2H.points += pointsDraw; }

                h2h.set(k(m.home_team_id, m.away_team_id), homeH2H);
                h2h.set(k(m.away_team_id, m.home_team_id), awayH2H);
            }
        }

        // Sort với H2H mini-league logic (UEFA standard)
        const sorted = this._sortStandings(
            [...standings.values()],
            tiebreakerOrder,
            h2h,
            officialMatches,
            pointsWin,
            pointsDraw,
        );

        // Upsert batch trong single transaction
        // Sequential map → array of Prisma operations, chạy trong interactive transaction
        await this.prisma.$transaction(
            sorted.map((s, idx) =>
                this.prisma.teamStanding.upsert({
                    where: { group_id_team_id: { group_id: groupId, team_id: s.teamId } },
                    create: {
                        group_id: groupId,
                        team_id: s.teamId,
                        // FIX: schema có field `season_id` (optional FK) trên TeamStanding,
                        // code cũ bỏ trống → mọi truy vấn lọc TeamStanding theo season_id trực
                        // tiếp (không qua group->phase->season join) sẽ miss row này.
                        season_id: seasonId,
                        position: idx + 1,
                        matches_played: s.played,
                        wins: s.wins,
                        draws: s.draws,
                        losses: s.losses,
                        goals_for: s.goalsFor,
                        goals_against: s.goalsAgainst,
                        points: s.points,
                    },
                    update: {
                        position: idx + 1,
                        matches_played: s.played,
                        wins: s.wins,
                        draws: s.draws,
                        losses: s.losses,
                        goals_for: s.goalsFor,
                        goals_against: s.goalsAgainst,
                        points: s.points,
                        // season_id không update — group không đổi season giữa các lần recompute,
                        // và update field FK không cần thiết tốn thêm write.
                    },
                }),
            ),
        );
    }
    // ─── Thêm vào StandingsService ───────────────────────────────────────────────
    // Paste 2 method này vào class StandingsService, bên dưới constructor.
    // Import thêm: SeasonStatus từ generated prisma client.
    //
    // import { SeasonStatus } from '../generated/prisma/client.js';

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — LIST SEASONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List seasons ở trạng thái người dùng quan tâm: ongoing, finished, cancelled.
     * upcoming / registration_open bị loại — chưa có standings để xem.
     *
     * Trả kèm tournament name để client render breadcrumb/filter.
     * Không load standings ở đây — lazy load khi user chọn season.
     */
    async listSeasons(params: {
        status?: 'ongoing' | 'finished' | 'cancelled';
        tournamentId?: number;
        page?: number;
        per_page?: number;
        q?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    }): Promise<PaginatedResult<SeasonListItem>> {

        const { status, tournamentId, q, sort, direction } = params;
        const page = Math.max(1, Number(params.page) || 1);
        const per_page = Math.min(Math.max(1, Number(params.per_page) || 20), 50);
        const skip = (page - 1) * per_page;

        // Allowed statuses — loại upcoming và registration_open
        const allowedStatuses: SeasonStatus[] = ['ongoing', 'finished', 'cancelled'];
        const statusFilter = status && allowedStatuses.includes(status as SeasonStatus)
            ? [status as SeasonStatus]
            : allowedStatuses;

        const allowedSortCols = ['start_date', 'end_date', 'name', 'status'] as const;
        type SortCol = typeof allowedSortCols[number];
        const sortCol: SortCol = allowedSortCols.includes(sort as SortCol)
            ? (sort as SortCol)
            : 'start_date';
        const sortDir = direction === 'asc' ? 'asc' : 'desc';

        const where = {
            status: { in: statusFilter },
            is_active: true,
            ...(tournamentId && { tournament_id: tournamentId }),
            ...(q && { name: { contains: q } }),
        };

        const [data, total] = await Promise.all([
            this.prisma.season.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    status: true,
                    start_date: true,
                    end_date: true,
                    tournament: {
                        select: { id: true, name: true },
                    },
                    // Count phases để client biết season có group stage hay không
                    _count: { select: { phases: true } },
                },
                orderBy: { [sortCol]: sortDir },
                skip,
                take: per_page,
            }),
            this.prisma.season.count({ where }),
        ]);

        const last_page = Math.ceil(total / per_page) || 1;

        return {
            data,
            meta: { total, page, per_page, last_page, has_next: page < last_page },
        };
    }

    // ─── Sort logic ────────────────────────────────────────────────────────────

    /**
     * Sort standings theo UEFA H2H mini-league standard:
     *
     * 1. Points (overall)
     * 2. Criteria trước head_to_head (goal_diff, goals_scored, etc.)
     * 3. Với nhóm tied sau bước 2: H2H mini-league (points → GD → GS giữa các team tied)
     * 4. Criteria sau head_to_head cho nhóm vẫn tied
     *
     * Nếu head_to_head không có trong tiebreakerOrder: sort tuyến tính theo criteria.
     */
    private _sortStandings(
        teams: StandingAccum[],
        tiebreakerOrder: string[],
        h2h: Map<string, H2HRecord>,
        officialMatches: Array<{
            home_team_id: number;
            away_team_id: number;
            matchResult: { home_final_score: number; away_final_score: number } | null;
        }>,
        pointsWin: number,
        pointsDraw: number,
    ): StandingAccum[] {
        // Không có H2H trong tiebreaker → sort tuyến tính đơn giản
        if (!tiebreakerOrder.includes('head_to_head')) {
            return [...teams].sort((a, b) => this._compareOverall(a, b, tiebreakerOrder, h2h));
        }

        const h2hIdx = tiebreakerOrder.indexOf('head_to_head');
        const criteriaBeforeH2H = tiebreakerOrder.slice(0, h2hIdx);
        const criteriaAfterH2H = tiebreakerOrder.slice(h2hIdx + 1);

        // Bước 1: sort sơ bộ theo points + criteria trước H2H
        const preliminary = [...teams].sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            return this._applyTiebreakers(a, b, criteriaBeforeH2H, h2h);
        });

        // Bước 2: với mỗi nhóm tied, apply H2H mini-league
        const result: StandingAccum[] = [];
        let i = 0;

        while (i < preliminary.length) {
            // Tìm boundary của tied group
            let j = i + 1;
            while (
                j < preliminary.length &&
                preliminary[j]!.points === preliminary[i]!.points &&
                this._applyTiebreakers(preliminary[i]!, preliminary[j]!, criteriaBeforeH2H, h2h) === 0
            ) j++;

            const group = preliminary.slice(i, j);

            if (group.length === 1) {
                result.push(group[0]!);
            } else {
                // Build H2H mini-league chỉ với matches giữa các team trong nhóm tied
                const miniH2H = this._buildMiniH2H(
                    group.map(t => t.teamId),
                    officialMatches,
                    pointsWin,
                    pointsDraw,
                );

                const sortedGroup = [...group].sort((a, b) => {
                    const aH2H = miniH2H.get(a.teamId);
                    const bH2H = miniH2H.get(b.teamId);

                    const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
                    if (ptsDiff !== 0) return ptsDiff;

                    const gdDiff =
                        ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0)) -
                        ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
                    if (gdDiff !== 0) return gdDiff;

                    const gsDiff = (bH2H?.goalsFor ?? 0) - (aH2H?.goalsFor ?? 0);
                    if (gsDiff !== 0) return gsDiff;

                    // Vẫn tied sau H2H → apply criteria sau H2H (yellow_cards, red_cards, etc.)
                    return this._applyTiebreakers(a, b, criteriaAfterH2H, h2h);
                });

                result.push(...sortedGroup);
            }

            i = j;
        }

        return result;
    }

    /**
     * Build H2H record chỉ cho matches giữa các team trong `teamIds`.
     * Dùng `officialMatches` của toàn group — filter bằng idSet.
     */
    private _buildMiniH2H(
        teamIds: number[],
        officialMatches: Array<{
            home_team_id: number;
            away_team_id: number;
            matchResult: { home_final_score: number; away_final_score: number } | null;
        }>,
        pointsWin: number,
        pointsDraw: number,
    ): Map<number, { points: number; goalsFor: number; goalsAgainst: number }> {
        const idSet = new Set(teamIds);
        const map = new Map<number, { points: number; goalsFor: number; goalsAgainst: number }>(
            teamIds.map(id => [id, { points: 0, goalsFor: 0, goalsAgainst: 0 }]),
        );

        for (const m of officialMatches) {
            // Chỉ tính matches giữa các team trong tied group
            if (!idSet.has(m.home_team_id) || !idSet.has(m.away_team_id)) continue;
            if (!m.matchResult) continue;

            const hg = m.matchResult.home_final_score;
            const ag = m.matchResult.away_final_score;
            const home = map.get(m.home_team_id)!;
            const away = map.get(m.away_team_id)!;

            home.goalsFor += hg; home.goalsAgainst += ag;
            away.goalsFor += ag; away.goalsAgainst += hg;

            if (hg > ag) { home.points += pointsWin; }
            else if (ag > hg) { away.points += pointsWin; }
            else { home.points += pointsDraw; away.points += pointsDraw; }
        }

        return map;
    }

    private _compareOverall(
        a: StandingAccum,
        b: StandingAccum,
        tiebreakerOrder: string[],
        h2h: Map<string, H2HRecord>,
    ): number {
        if (b.points !== a.points) return b.points - a.points;
        return this._applyTiebreakers(a, b, tiebreakerOrder, h2h);
    }

    private _applyTiebreakers(
        a: StandingAccum,
        b: StandingAccum,
        criteria: string[],
        h2h: Map<string, H2HRecord>,
    ): number {
        for (const criterion of criteria) {
            switch (criterion) {
                case 'goal_diff': {
                    const diff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
                    if (diff !== 0) return diff;
                    break;
                }
                case 'goals_scored': {
                    const diff = b.goalsFor - a.goalsFor;
                    if (diff !== 0) return diff;
                    break;
                }
                case 'goals_conceded': {
                    // Ít bàn thua hơn = tốt hơn → a - b (ascending)
                    const diff = a.goalsAgainst - b.goalsAgainst;
                    if (diff !== 0) return diff;
                    break;
                }
                case 'head_to_head': {
                    // H2H trong _applyTiebreakers = so sánh trực tiếp 2 team
                    // (khác với mini-league dùng khi > 2 teams tied)
                    const aH2H = h2h.get(`${a.teamId}:${b.teamId}`);
                    const bH2H = h2h.get(`${b.teamId}:${a.teamId}`);
                    const ptsDiff = (bH2H?.points ?? 0) - (aH2H?.points ?? 0);
                    if (ptsDiff !== 0) return ptsDiff;
                    const gdDiff =
                        ((bH2H?.goalsFor ?? 0) - (bH2H?.goalsAgainst ?? 0)) -
                        ((aH2H?.goalsFor ?? 0) - (aH2H?.goalsAgainst ?? 0));
                    if (gdDiff !== 0) return gdDiff;
                    const gsDiff = (bH2H?.goalsFor ?? 0) - (aH2H?.goalsFor ?? 0);
                    if (gsDiff !== 0) return gsDiff;
                    break;
                }
                case 'yellow_cards': {
                    // Ít thẻ vàng hơn = tốt hơn → a - b (ascending)
                    const diff = a.yellowCards - b.yellowCards;
                    if (diff !== 0) return diff;
                    break;
                }
                case 'red_cards': {
                    // Ít thẻ đỏ hơn = tốt hơn → a - b (ascending)
                    const diff = a.redCards - b.redCards;
                    if (diff !== 0) return diff;
                    break;
                }
            }
        }
        return 0;
    }
}