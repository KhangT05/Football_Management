import { createAppError } from '../common/app.error.js';
import { SeasonListItem } from '../dtos/season.schema.js';
import { Prisma, PrismaClient, SeasonStatus, PhaseFormat, PhaseStatus } from '../generated/prisma/client.js';
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

const VIEWABLE_SEASON_STATUSES: SeasonStatus[] = ['ongoing', 'finished', 'cancelled', 'upcoming', 'registration_open'];


// Format group/standing trả cho 1 phase round_robin cụ thể — dùng chung cho
// "phase đang mở" (listActiveGroupStandings) và "toàn bộ lịch sử"
// (listGroupStandingsHistory), để FE render tab RR1/RR2/... nhất quán.
type PhaseStandingsBlock = {
    phaseId: number;
    phaseName: string;
    phaseOrder: number;
    phaseStatus: PhaseStatus;
    groups: {
        groupId: number;
        groupName: string;
        standings: TeamStandingRow[];
    }[];
};

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
            filterable: ['season_id', 'team_id'],
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
    // READ — STANDINGS (paginated, 1 group cụ thể)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List standings của 1 group cụ thể.
     *
     * API nhận groupId trực tiếp — TeamStanding có group_id FK nên không cần join.
     * Không nhận seasonId nếu chỉ cần xem 1 bảng; nếu có seasonId (từ route
     * /seasons/:seasonId/standings/:groupId) thì validate group thuộc đúng
     * season — tránh user gọi nhầm group thuộc season khác.
     *
     * QueryRequest từ HTTP: page, sort, direction, per_page
     */
    async listGroupStandings(
        groupId: number,
        req: QueryRequest,
        seasonId?: number, // optional — nếu có thì validate
    ): Promise<PaginatedResult<TeamStandingRow>> {
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

        // TeamStanding không có field `is_active` trong schema — chỉ có
        // soft-delete `deleted_at`. Filter đúng schema, không dùng is_active.
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
    // READ — STANDINGS THEO SEASON (group-centric, phase-aware — RR→RR→KO)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Trả standings của phase round_robin ĐANG MỞ (status != locked, order lớn
     * nhất) trong season, group theo group_id. Mirror GroupService.findAllBySeason
     * — FE KHÔNG cần biết phaseId, chỉ cần seasonId.
     *
     * FIX (root cause "RR2 hiện lẫn standings RR1 đã locked"): bản cũ
     * (listStandingsBySeason) query `group: { phase: { season_id } }` KHÔNG
     * filter phase — khi season đã advance RR1 -> RR2 (advanceToNextRoundRobin
     * bên GroupService), TeamStanding của CẢ 2 phase cùng season_id đều lẫn
     * vào 1 danh sách group phẳng. Vì group_id là unique giữa các phase
     * (không trùng), rows không lỗi logic tính toán, nhưng FE nhận về danh
     * sách "Bảng A, Bảng B" gộp chung của RR1 (đã xong, hạng cũ) lẫn RR2
     * (đang đá) mà không có cách nào phân biệt — hiển thị sai ngữ cảnh
     * ("giờ đang ở vòng nào").
     *
     * Trả về null nếu season chưa có round_robin phase nào — trạng thái hợp
     * lệ ("chưa bắt đầu"), không phải lỗi (giống findAllBySeason).
     */
    async listActiveGroupStandings(seasonId: number): Promise<PhaseStandingsBlock | null> {
        await this._assertSeasonViewable(seasonId);

        const phase = await this.prisma.phase.findFirst({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
                status: { not: PhaseStatus.locked },
            },
            orderBy: { order: 'desc' },
            select: { id: true, name: true, order: true, status: true },
        });

        if (!phase) return null;

        return this._buildPhaseStandingsBlock(phase);
    }

    /**
     * Trả TOÀN BỘ lịch sử standings round_robin của season — mọi phase RR
     * (kể cả đã locked), order tăng dần: RR1 (locked) -> RR2 (đang mở) -> ...
     * Dùng cho FE render tab lịch sử ("Vòng bảng 1", "Vòng bảng 2") trong
     * flow RR->RR->KO, tách biệt hẳn khỏi listActiveGroupStandings (chỉ trả
     * phase hiện tại) để 2 use-case (xem hiện tại vs xem lại lịch sử) không
     * lẫn payload vào nhau.
     */
    async listGroupStandingsHistory(seasonId: number): Promise<PhaseStandingsBlock[]> {
        await this._assertSeasonViewable(seasonId);

        const phases = await this.prisma.phase.findMany({
            where: {
                season_id: seasonId,
                format: PhaseFormat.round_robin,
                is_active: true,
            },
            orderBy: { order: 'asc' },
            select: { id: true, name: true, order: true, status: true },
        });

        if (phases.length === 0) return [];

        return Promise.all(phases.map((p) => this._buildPhaseStandingsBlock(p)));
    }

    private async _assertSeasonViewable(seasonId: number): Promise<void> {
        const season = await this.prisma.season.findUnique({
            where: { id: seasonId },
            select: { status: true },
        });

        if (!season)
            throw createAppError('NOT_FOUND', `Season ${seasonId} không tồn tại`);

        if (!VIEWABLE_SEASON_STATUSES.includes(season.status as SeasonStatus))
            throw createAppError(
                'FORBIDDEN',
                `Season ${seasonId} ở trạng thái '${season.status}' — không có standings để xem`,
            );
    }

    private async _buildPhaseStandingsBlock(phase: {
        id: number;
        name: string;
        order: number;
        status: PhaseStatus;
    }): Promise<PhaseStandingsBlock> {
        const rows = await this.prisma.teamStanding.findMany({
            where: {
                deleted_at: null,
                group: { phase_id: phase.id },
            },
            select: {
                ...TEAM_STANDING_SELECT,
                group: { select: { id: true, name: true } },
            },
            orderBy: [{ group_id: 'asc' }, { position: 'asc' }],
        });

        const groupMap = new Map<number, { groupId: number; groupName: string; standings: TeamStandingRow[] }>();

        for (const row of rows) {
            const gid = row.group.id;
            if (!groupMap.has(gid)) {
                groupMap.set(gid, { groupId: gid, groupName: row.group.name, standings: [] });
            }
            const { group: _group, ...standingRow } = row;
            groupMap.get(gid)!.standings.push(standingRow as TeamStandingRow);
        }

        return {
            phaseId: phase.id,
            phaseName: phase.name,
            phaseOrder: phase.order,
            phaseStatus: phase.status,
            groups: [...groupMap.values()],
        };
    }

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
    async getSuspendedPlayers(seasonId: number) {
        return this.prisma.playerStatistic.findMany({
            where: {
                season_id: seasonId, // also fix: hardcoded `1` should be the parameter
                is_suspended: true,
            },
            include: {
                player: {
                    select: {
                        id: true,
                        user: { select: { name: true } },
                    },
                },
                team: {
                    select: { id: true, name: true },
                },
            },
            orderBy: {
                team_id: "asc",
            },
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
     * FIX (race condition — lost update): bản cũ, khi gọi standalone (không
     * có `tx` truyền vào), chạy TOÀN BỘ flow (load rule -> load match ->
     * accumulate -> sort -> upsert) bằng `this.prisma` KHÔNG transaction —
     * chỉ đoạn upsert cuối được bọc `$transaction`. 2 request confirmResult
     * của 2 match KHÁC NHAU cùng group gần như đồng thời (hoàn toàn có thể —
     * trọng tài nhập nhiều kết quả liền nhau) sẽ cùng đọc snapshot match cũ,
     * tính 2 bộ standings khác nhau, rồi ghi đè lên nhau — request nào ghi
     * sau "thắng", bộ standings của request đọc trước bị mất (lost update),
     * standings cuối cùng sai dù cả 2 request đều chạy thành công không lỗi.
     *
     * Fix bằng row lock trên group (SELECT ... FOR UPDATE), theo đúng pattern
     * đã dùng ở GroupService.deactivateGroup — serialize các lần recompute
     * CÙNG 1 group, không đụng group khác (khác lockSeason bên GroupService,
     * vốn serialize toàn bộ write-path group của season — recompute không
     * cần rộng vậy). Nếu gọi standalone (không có tx), tự mở 1 transaction
     * bao trọn toàn bộ flow để lock giữ được xuyên suốt lúc đọc + tính + ghi.
     */
    async recomputeGroupStandings(
        groupId: number,
        tx?: Prisma.TransactionClient,
    ): Promise<void> {
        if (tx) {
            await this._recomputeGroupStandingsLocked(groupId, tx);
            return;
        }

        await this.prisma.$transaction(async (innerTx) => {
            await this._recomputeGroupStandingsLocked(groupId, innerTx);
        });
    }

    private async _recomputeGroupStandingsLocked(
        groupId: number,
        tx: Prisma.TransactionClient,
    ): Promise<void> {
        // Row lock — xem giải thích ở recomputeGroupStandings phía trên.
        await tx.$queryRaw`SELECT id FROM \`groups\` WHERE id = ${groupId} FOR UPDATE`;

        const group = await tx.group.findUniqueOrThrow({
            where: { id: groupId },
            select: {
                phase: {
                    select: {
                        season: {
                            select: {
                                id: true,
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
        });

        const seasonId = group.phase.season?.id;
        if (!seasonId) {
            throw new Error(`Group ${groupId}: phase không có season — data integrity issue`);
        }

        const rule = group.phase.season.tournamentRule;
        const pointsWin = rule?.points_per_win ?? 3;
        const pointsDraw = rule?.points_per_draw ?? 1;
        const pointsLoss = rule?.points_per_loss ?? 0;
        const tiebreakerOrder = (rule?.tiebreaker_order as string[]) ?? ['goal_diff', 'goals_scored', 'head_to_head'];

        const matches = await tx.match.findMany({
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

        const officialMatches = matches.filter(
            (m): m is typeof m & { matchResult: NonNullable<typeof m.matchResult> } =>
                m.matchResult !== null,
        );

        const seasonTeams = await tx.seasonTeam.findMany({
            where: { group_id: groupId },
            select: { team_id: true },
        });
        const teamIds = seasonTeams.map(st => st.team_id);

        const standings = new Map<number, StandingAccum>(
            teamIds.map(tid => [tid, {
                teamId: tid, played: 0, wins: 0, draws: 0, losses: 0,
                goalsFor: 0, goalsAgainst: 0, yellowCards: 0, redCards: 0, points: 0,
            }]),
        );

        for (const m of officialMatches) {
            const r = m.matchResult;
            const home = standings.get(m.home_team_id);
            const away = standings.get(m.away_team_id);
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

        const needsCardStats =
            tiebreakerOrder.includes('yellow_cards') ||
            tiebreakerOrder.includes('red_cards');

        if (needsCardStats) {
            const cardStats = await tx.playerStatistic.groupBy({
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

        const sorted = this._sortStandings(
            [...standings.values()],
            tiebreakerOrder,
            h2h,
            officialMatches,
            pointsWin,
            pointsDraw,
        );

        // Đã ở trong transaction (do caller truyền vào, hoặc tự mở ở
        // recomputeGroupStandings phía trên) — dùng luôn `tx`, sequential
        // upsert. Prisma không hỗ trợ batch nhiều statement trong 1
        // round-trip khi đã ở trong interactive transaction, nên N
        // round-trip là bắt buộc. Chấp nhận được: group ≤ 8 teams → ≤ 8
        // round-trip, không phải hot path.
        const upsertOps = sorted.map((s, idx) => ({
            where: { group_id_team_id: { group_id: groupId, team_id: s.teamId } },
            create: {
                group_id: groupId,
                team_id: s.teamId,
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
            },
        }));

        for (const op of upsertOps) {
            await tx.teamStanding.upsert(op);
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // READ — LIST SEASONS
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * List seasons ở trạng thái người dùng quan tâm: ongoing, finished, cancelled.
     * upcoming / registration_open bị loại — chưa có standings để xem.
     *
     * Trả kèm tournament name để client render breadcrumb/filter.
     * Không load standings ở đây — lazy load khi user chọn season.
     *
     * FIX: `allowedStatuses` cũ liệt kê đủ cả 5 status (kể cả upcoming/
     * registration_open) — trái với đúng comment ngay phía trên, khiến
     * `statusFilter` mặc định (không truyền `status`) trả về CẢ 5 status
     * thay vì chỉ 3. Dùng chung `VIEWABLE_SEASON_STATUSES` — nếu FE truyền
     * status không nằm trong danh sách xem được (vd 'upcoming'), fallback
     * về mặc định 3 status thay vì lọt qua.
     */
    async listSeasons(params: {
        status?: 'ongoing' | 'finished' | 'cancelled' | 'registration_open' | 'upcoming';
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

        const statusFilter = status && VIEWABLE_SEASON_STATUSES.includes(status as SeasonStatus)
            ? [status as SeasonStatus]
            : VIEWABLE_SEASON_STATUSES;

        const allowedSortCols = ['start_date', 'end_date', 'name', 'status'] as const;
        type SortCol = typeof allowedSortCols[number];
        const sortCol: SortCol = allowedSortCols.includes(sort as SortCol)
            ? (sort as SortCol)
            : 'start_date';
        const sortDir = direction === 'asc' ? 'asc' : 'desc';

        const where = {
            status: { in: statusFilter },
            deleted_at: null,
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
                    registration_deadline: true,
                    max_teams: true,
                    cancel_reason: true,
                    is_registration_open: true,
                    group_count: true,
                    bank_id: true,
                    bank_account_no: true,
                    bank_account_name: true,
                    pitch_type: true,
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