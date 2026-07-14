import { createAppError } from "../common/app.error.js";
import { Prisma } from "../generated/prisma/client.js";
import { PERIOD_DAYS, Queryable } from "../libs/queryable.js";
const BUSINESS_TZ_OFFSET_HOURS = 7;
const businessNow = new Date(Date.now() + BUSINESS_TZ_OFFSET_HOURS * 60 * 60 * 1000);
// Match status coi là "đã đấu xong, có kết quả hợp lệ" — dùng chung cho mọi
// truy vấn aggregate team stats (tournament/season) trong hierarchy mới.
const FINISHED_MATCH_STATUSES = ["finished", "forfeited"];
export class StatisticsService {
    prisma;
    // Queryable dùng cho count-only path (KPI card) — không cần raw SQL,
    // không cần bucket theo ngày. Config tối thiểu: chỉ cần dateField để
    // applyPeriod() hoạt động; không cần searchFields/sortable vì chỉ gọi count().
    userQueryable;
    constructor(prisma) {
        this.prisma = prisma;
        this.userQueryable = new Queryable(this.prisma.user, {
            dateField: "created_at",
        });
    }
    // ═══════════════════════════════════════════════════════════════════════
    // USER REGISTRATION — new users trong N ngày gần nhất, bucket theo ngày
    // ═══════════════════════════════════════════════════════════════════════
    async getUserRegistrationStats(period = "30d") {
        const days = PERIOD_DAYS[period];
        if (!days) {
            throw createAppError("VALIDATION_ERROR", `getUserRegistrationStats called with invalid period=${period}`, "period không hợp lệ, dùng: 7d, 30d, 90d, 3m, 6m, 1y");
        }
        const tzOffset = `+${String(BUSINESS_TZ_OFFSET_HOURS).padStart(2, "0")}:00`;
        const rows = await this.prisma.$queryRaw `
        SELECT
            DATE(CONVERT_TZ(created_at, '+00:00', ${tzOffset})) AS day,
            COUNT(*) AS count
        FROM users
        WHERE created_at >= DATE_SUB(${businessNow}, INTERVAL ${days} DAY)
        GROUP BY day
        ORDER BY day ASC
    `;
        const dayMap = new Map();
        for (const r of rows) {
            dayMap.set(r.day.toISOString().slice(0, 10), Number(r.count));
        }
        const daily = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(businessNow);
            d.setUTCDate(d.getUTCDate() - i);
            const key = d.toISOString().slice(0, 10);
            daily.push({ day: key, count: dayMap.get(key) ?? 0 });
        }
        return {
            range_days: days,
            total_new_users: daily.reduce((sum, p) => sum + p.count, 0),
            daily,
        };
    }
    async getNewUserCount(period = "30d") {
        return this.userQueryable.count({ period });
    }
    async getSeasonRevenue(seasonId) {
        const seasonFilter = seasonId
            ? Prisma.sql `AND s.id = ${seasonId}`
            : Prisma.empty;
        const rows = await this.prisma.$queryRaw(Prisma.sql `
            SELECT
                s.id AS season_id,
                s.name AS season_name,
                COALESCE(SUM(CASE WHEN p.status = 'confirmed' THEN p.amount ELSE 0 END), 0) AS confirmed_revenue,
                COALESCE(SUM(CASE WHEN p.status = 'refunded' THEN p.refund_amount ELSE 0 END), 0) AS refunded_amount,
                COALESCE(SUM(CASE WHEN p.status = 'pending' THEN p.amount ELSE 0 END), 0) AS pending_amount,
                COUNT(p.id) AS payment_count
            FROM seasons s
            LEFT JOIN season_teams st ON st.season_id = s.id
            LEFT JOIN payments p ON p.season_team_id = st.id
            WHERE s.deleted_at IS NULL
                ${seasonFilter}
            GROUP BY s.id, s.name
            ORDER BY s.created_at DESC
        `);
        const seasons = rows.map((r) => {
            const confirmed = Number(r.confirmed_revenue);
            const refunded = Number(r.refunded_amount);
            return {
                season_id: r.season_id,
                season_name: r.season_name,
                confirmed_revenue: confirmed,
                refunded_amount: refunded,
                net_revenue: confirmed - refunded,
                pending_amount: Number(r.pending_amount),
                payment_count: Number(r.payment_count),
            };
        });
        return {
            seasons,
            total_net_revenue: seasons.reduce((sum, s) => sum + s.net_revenue, 0),
        };
    }
    async getTournamentOverview(tournamentId) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id: tournamentId },
            select: { id: true, name: true },
        });
        if (!tournament) {
            throw createAppError("NOT_FOUND", `Tournament id=${tournamentId} not found`, "Không tìm thấy giải đấu");
        }
        const [seasonCount, activeSeasonCount, matchCounts] = await Promise.all([
            this.prisma.season.count({ where: { tournament_id: tournamentId, deleted_at: null } }),
            this.prisma.season.count({
                where: {
                    tournament_id: tournamentId,
                    deleted_at: null,
                    status: { in: ["ongoing", "registration_open"] },
                },
            }),
            this.prisma.match.groupBy({
                by: ["status"],
                where: { phase: { season: { tournament_id: tournamentId } } },
                _count: { _all: true },
            }),
        ]);
        const total = matchCounts.reduce((sum, r) => sum + r._count._all, 0);
        const finished = matchCounts.find((r) => r.status === "finished")?._count._all ?? 0;
        const ongoing = matchCounts.find((r) => r.status === "ongoing")?._count._all ?? 0;
        return {
            tournament_id: tournament.id,
            tournament_name: tournament.name,
            season_count: seasonCount,
            active_season_count: activeSeasonCount,
            total_matches: total,
            finished_matches: finished,
            ongoing_matches: ongoing,
        };
    }
    async getTeamRegistrationStats(seasonId) {
        const rows = await this.prisma.seasonTeam.groupBy({
            by: ["season_id", "status"],
            where: {
                season: { deleted_at: null },
                ...(seasonId ? { season_id: seasonId } : {}),
            },
            _count: { _all: true },
        });
        const seasonIds = [...new Set(rows.map((r) => r.season_id))];
        const seasons = await this.prisma.season.findMany({
            where: { id: { in: seasonIds } },
            select: { id: true, name: true },
        });
        const nameMap = new Map(seasons.map((s) => [s.id, s.name]));
        const bySeason = new Map();
        for (const r of rows) {
            const entry = bySeason.get(r.season_id) ?? {
                season_id: r.season_id,
                season_name: nameMap.get(r.season_id) ?? "Unknown",
                pending_count: 0,
                approved_count: 0,
                active_count: 0,
                eliminated_count: 0,
                withdrawn_count: 0,
                total_count: 0,
            };
            const count = r._count._all;
            switch (r.status) {
                case "pending":
                    entry.pending_count = count;
                    break;
                case "approved":
                    entry.approved_count = count;
                    break;
                case "active":
                    entry.active_count = count;
                    break;
                case "eliminated":
                    entry.eliminated_count = count;
                    break;
                case "withdrawn":
                    entry.withdrawn_count = count;
                    break;
            }
            entry.total_count += count;
            bySeason.set(r.season_id, entry);
        }
        return { seasons: [...bySeason.values()] };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // TOP SCORERS
    // ═══════════════════════════════════════════════════════════════════════
    // FIX: Player không có cột `name` — tên nằm ở bảng `users` (users.name),
    // liên kết qua players.user_id. Query cũ join thẳng `pl.name` sẽ lỗi
    // "Unknown column" ngay ở raw SQL (crash muộn hơn Prisma validation vì
    // đây không đi qua Prisma Client typed API, lỗi ném ra ở tầng MySQL driver).
    async getTopScorers(seasonId, limit = 10) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getTopScorers called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.$queryRaw `
            SELECT
                pl.id AS player_id,
                u.name AS player_name,
                t.id AS team_id,
                t.name AS team_name,
                COUNT(*) AS goal_count
            FROM match_events me
            JOIN matches m ON m.id = me.match_id
            JOIN phases ph ON ph.id = m.phase_id
            JOIN players pl ON pl.id = me.player_id
            JOIN users u ON u.id = pl.user_id
            JOIN teams t ON t.id = me.team_id
            WHERE ph.season_id = ${seasonId}
                AND me.event_type = 'goal'
            GROUP BY pl.id, u.name, t.id, t.name
            ORDER BY goal_count DESC, u.name ASC
            LIMIT ${limit}
        `;
        return {
            season_id: seasonId,
            limit,
            scorers: rows.map((r) => ({
                player_id: r.player_id,
                player_name: r.player_name,
                team_id: r.team_id,
                team_name: r.team_name,
                goal_count: Number(r.goal_count),
            })),
        };
    }
    async getTeamDisciplineStats(seasonId) {
        const rows = await this.prisma.$queryRaw `
            SELECT
            t.id AS team_id,
            t.name AS team_name,
            COALESCE(SUM(CASE WHEN ph.id IS NOT NULL AND me.event_type = 'yellow_card' THEN 1 ELSE 0 END), 0) AS yellow_count,
            COALESCE(SUM(CASE WHEN ph.id IS NOT NULL AND me.event_type = 'red_card' THEN 1 ELSE 0 END), 0) AS red_count
            FROM teams t
            JOIN season_teams st ON st.team_id = t.id AND st.season_id = ${seasonId}
            LEFT JOIN match_events me ON me.team_id = t.id
                AND me.event_type IN ('yellow_card', 'red_card')
            LEFT JOIN matches m ON m.id = me.match_id
            LEFT JOIN phases ph ON ph.id = m.phase_id AND ph.season_id = ${seasonId}
            GROUP BY t.id, t.name
            ORDER BY red_count DESC, yellow_count DESC
        `;
        return {
            season_id: seasonId,
            teams: rows.map((r) => ({
                team_id: r.team_id,
                team_name: r.team_name,
                yellow_card_count: Number(r.yellow_count),
                red_card_count: Number(r.red_count),
                disciplinary_points: Number(r.yellow_count) * 1 + Number(r.red_count) * 3,
            })),
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER RANKING (goals/assists/yellow/red)
    // ═══════════════════════════════════════════════════════════════════════
    static RANKING_FIELD_MAP = {
        goals: "goals_scored",
        assists: "assists",
        yellow_cards: "yellow_cards",
        red_cards: "red_cards",
    };
    static RANKING_WHERE_MAP = {
        goals: (season_id) => ({ season_id, goals_scored: { gt: 0 } }),
        assists: (season_id) => ({ season_id, assists: { gt: 0 } }),
        yellow_cards: (season_id) => ({ season_id, yellow_cards: { gt: 0 } }),
        red_cards: (season_id) => ({ season_id, red_cards: { gt: 0 } }),
    };
    static RANKING_ORDER_MAP = {
        goals: [{ goals_scored: "desc" }, { matches_played: "asc" }],
        assists: [{ assists: "desc" }, { matches_played: "asc" }],
        yellow_cards: [{ yellow_cards: "desc" }, { matches_played: "asc" }],
        red_cards: [{ red_cards: "desc" }, { matches_played: "asc" }],
    };
    // FIX: `player: { select: { name: true } }` → Player không có field name
    // (đây chính là bug PrismaClientValidationError bạn gặp ở
    // standing.service.ts, cùng pattern, khác file). Đổi sang select qua
    // relation user, và đọc r.player.user.name khi map kết quả.
    async getPlayerRanking(seasonId, metric, limit = 10) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getPlayerRanking called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.playerStatistic.findMany({
            where: StatisticsService.RANKING_WHERE_MAP[metric](seasonId),
            orderBy: StatisticsService.RANKING_ORDER_MAP[metric],
            take: limit,
            include: {
                player: { select: { id: true, user: { select: { name: true } } } },
                team: { select: { id: true, name: true } },
            },
        });
        const field = StatisticsService.RANKING_FIELD_MAP[metric];
        return {
            season_id: seasonId,
            limit,
            metric,
            players: rows.map((r) => ({
                player_id: r.player.id,
                player_name: r.player.user.name,
                team_id: r.team.id,
                team_name: r.team.name,
                value: r[field],
                matches_played: r.matches_played,
            })),
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // BEST PLAYER (MVP)
    // ═══════════════════════════════════════════════════════════════════════
    // FIX: cùng bug player.name — đổi sang player.user.name.
    static DEFAULT_MVP_WEIGHTS = { goal: 4, assist: 3, yellow: -1, red: -3 };
    async getBestPlayers(seasonId, limit = 10, weights = StatisticsService.DEFAULT_MVP_WEIGHTS) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getBestPlayers called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.playerStatistic.findMany({
            where: { season_id: seasonId, matches_played: { gt: 0 } },
            include: {
                player: { select: { id: true, user: { select: { name: true } } } },
                team: { select: { id: true, name: true } },
            },
        });
        const scored = rows
            .map((r) => ({
            player_id: r.player.id,
            player_name: r.player.user.name,
            team_id: r.team.id,
            team_name: r.team.name,
            matches_played: r.matches_played,
            value: r.goals_scored,
            score: r.goals_scored * weights.goal +
                r.assists * weights.assist +
                r.yellow_cards * weights.yellow +
                r.red_cards * weights.red,
        }))
            .sort((a, b) => b.score - a.score || a.matches_played - b.matches_played)
            .slice(0, limit);
        return { season_id: seasonId, limit, weights, players: scored };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER FINANCE
    // ═══════════════════════════════════════════════════════════════════════
    // FIX: cùng bug player.name — đổi sang player.user.name.
    async getPlayerFinanceStats(seasonId) {
        const season = await this.prisma.season.findUnique({
            where: { id: seasonId },
            select: {
                id: true,
                tournamentRule: {
                    select: {
                        bonus_per_goal: true,
                        bonus_per_assist: true,
                        fine_per_yellow_card: true,
                        fine_per_red_card: true,
                    },
                },
            },
        });
        if (!season) {
            throw createAppError("NOT_FOUND", `Season id=${seasonId} not found`, "Không tìm thấy season");
        }
        if (!season.tournamentRule) {
            throw createAppError("CONFLICT", `Season id=${seasonId} chưa gán tournament_rule_id`, "Season chưa có luật giải — không tính được thưởng/phạt");
        }
        const bonusPerGoal = Number(season.tournamentRule.bonus_per_goal);
        const bonusPerAssist = Number(season.tournamentRule.bonus_per_assist);
        const finePerYellow = Number(season.tournamentRule.fine_per_yellow_card);
        const finePerRed = Number(season.tournamentRule.fine_per_red_card);
        const rows = await this.prisma.playerStatistic.findMany({
            where: { season_id: seasonId },
            include: {
                player: { select: { id: true, user: { select: { name: true } } } },
                team: { select: { id: true, name: true } },
            },
        });
        const players = rows
            .map((r) => {
            const bonus = r.goals_scored * bonusPerGoal + r.assists * bonusPerAssist;
            const fine = r.yellow_cards * finePerYellow + r.red_cards * finePerRed;
            return {
                player_id: r.player.id,
                player_name: r.player.user.name,
                team_id: r.team.id,
                team_name: r.team.name,
                goals_scored: r.goals_scored,
                assists: r.assists,
                yellow_cards: r.yellow_cards,
                red_cards: r.red_cards,
                bonus_earned: bonus,
                fine_owed: fine,
                net_amount: bonus - fine,
            };
        })
            .filter((p) => p.bonus_earned !== 0 || p.fine_owed !== 0)
            .sort((a, b) => b.net_amount - a.net_amount);
        return {
            season_id: seasonId,
            bonus_per_goal: bonusPerGoal,
            bonus_per_assist: bonusPerAssist,
            fine_per_yellow_card: finePerYellow,
            fine_per_red_card: finePerRed,
            players,
        };
    }
    async getPlayerCareerStats(playerId) {
        const player = await this.prisma.player.findUnique({
            where: { id: playerId },
            select: { id: true, user: { select: { name: true } } },
        });
        if (!player) {
            throw createAppError("NOT_FOUND", `Player id=${playerId} not found`, "Không tìm thấy cầu thủ");
        }
        const rows = await this.prisma.playerStatistic.findMany({
            where: { player_id: playerId },
            include: {
                season: {
                    select: {
                        id: true,
                        name: true,
                        tournament: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { season: { created_at: "desc" } },
        });
        const byTournament = new Map();
        for (const r of rows) {
            const tId = r.season.tournament.id;
            const entry = byTournament.get(tId) ?? {
                tournament_id: tId,
                tournament_name: r.season.tournament.name,
                seasons: [],
            };
            entry.seasons.push({
                season_id: r.season.id,
                season_name: r.season.name,
                matches_played: r.matches_played,
                goals: r.goals_scored,
                assists: r.assists,
                yellow_cards: r.yellow_cards,
                red_cards: r.red_cards,
            });
            byTournament.set(tId, entry);
        }
        return {
            player_id: player.id,
            player_name: player.user.name,
            tournaments: [...byTournament.values()],
        };
    }
    async getSystemOverviewStats(period = "30d") {
        const days = PERIOD_DAYS[period];
        if (!days) {
            throw createAppError("VALIDATION_ERROR", `getSystemOverviewStats called with invalid period=${period}`, "period không hợp lệ, dùng: 7d, 30d, 90d, 3m, 6m, 1y");
        }
        const [tournamentCount, seasonCount, teamCount, userCount, revenueRow, newUserCount,] = await Promise.all([
            this.prisma.tournament.count({ where: { deleted_at: null } }),
            this.prisma.season.count({ where: { deleted_at: null } }),
            this.prisma.team.count({ where: { deleted_at: null } }),
            this.prisma.user.count({ where: { is_active: true } }),
            this.prisma.$queryRaw `
                SELECT
                    COALESCE(SUM(CASE WHEN status = 'confirmed' THEN amount ELSE 0 END), 0) AS confirmed,
                    COALESCE(SUM(CASE WHEN status = 'refunded' THEN refund_amount ELSE 0 END), 0) AS refunded
                FROM payments
            `,
            this.userQueryable.count({ period }),
        ]);
        const confirmed = Number(revenueRow[0]?.confirmed ?? 0);
        const refunded = Number(revenueRow[0]?.refunded ?? 0);
        return {
            tournament_count: tournamentCount,
            season_count: seasonCount,
            team_count: teamCount,
            user_count: userCount,
            total_revenue: confirmed - refunded,
            new_user_count: newUserCount,
            period_days: days,
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // TEAM STATS HIERARCHY
    // ═══════════════════════════════════════════════════════════════════════
    // Team Stats (toàn bộ lịch sử) → Tournament Team Stats → Season Team Stats
    // → Match Team Stats. 3 method aggregate dùng chung 2 helper phía dưới
    // (_fetchTeamMatchesWithRule + _aggregateTeamMatches) để đảm bảo công
    // thức tính wins/draws/losses/points NHẤT QUÁN ở mọi tầng — tránh tình
    // trạng tổng các Season Team Stats không khớp Tournament Team Stats do
    // lệch logic tính giữa 2 method riêng biệt.
    /**
     * Lấy toàn bộ trận đã có kết quả official của 1 đội, optionally filter
     * theo seasonId hoặc tournamentId, kèm rule điểm số (points_per_win/
     * draw/loss) của ĐÚNG season chứa trận đó — vì 1 tournament có thể có
     * nhiều season với rule khác nhau, không thể áp 1 rule chung khi gộp
     * nhiều season lại (Tournament Team Stats).
     */
    async _fetchTeamMatchesWithRule(teamId, filter = {}) {
        const matches = await this.prisma.match.findMany({
            where: {
                OR: [{ home_team_id: teamId }, { away_team_id: teamId }],
                status: { in: [...FINISHED_MATCH_STATUSES] },
                matchResult: { status: "official" },
                phase: {
                    ...(filter.seasonId ? { season_id: filter.seasonId } : {}),
                    ...(filter.tournamentId ? { season: { tournament_id: filter.tournamentId } } : {}),
                },
            },
            select: {
                home_team_id: true,
                away_team_id: true,
                matchResult: { select: { home_final_score: true, away_final_score: true } },
                phase: {
                    select: {
                        season: {
                            select: {
                                tournamentRule: {
                                    select: {
                                        points_per_win: true,
                                        points_per_draw: true,
                                        points_per_loss: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return matches
            .filter((m) => m.matchResult !== null)
            .map((m) => ({
            home_team_id: m.home_team_id,
            away_team_id: m.away_team_id,
            home_final_score: m.matchResult.home_final_score,
            away_final_score: m.matchResult.away_final_score,
            // Fallback 3/1/0 nếu season chưa gán tournament_rule_id —
            // giống default của TournamentRule model.
            points_per_win: m.phase.season.tournamentRule?.points_per_win ?? 3,
            points_per_draw: m.phase.season.tournamentRule?.points_per_draw ?? 1,
            points_per_loss: m.phase.season.tournamentRule?.points_per_loss ?? 0,
        }));
    }
    _aggregateTeamMatches(teamId, matches) {
        let wins = 0, draws = 0, losses = 0, goalsFor = 0, goalsAgainst = 0, points = 0;
        for (const m of matches) {
            const isHome = m.home_team_id === teamId;
            const gf = isHome ? m.home_final_score : m.away_final_score;
            const ga = isHome ? m.away_final_score : m.home_final_score;
            goalsFor += gf;
            goalsAgainst += ga;
            if (gf > ga) {
                wins++;
                points += m.points_per_win;
            }
            else if (gf < ga) {
                losses++;
                points += m.points_per_loss;
            }
            else {
                draws++;
                points += m.points_per_draw;
            }
        }
        const matches_played = matches.length;
        return {
            total_matches_played: matches_played,
            total_wins: wins,
            total_draws: draws,
            total_losses: losses,
            win_rate: matches_played > 0 ? Number(((wins / matches_played) * 100).toFixed(1)) : 0,
            total_goals_for: goalsFor,
            total_goals_against: goalsAgainst,
            goal_difference: goalsFor - goalsAgainst,
            total_points: points,
        };
    }
    /**
     * TEAM STATS — toàn bộ lịch sử của đội, không filter season/tournament.
     * Mở rộng so với bản cũ: thêm participations (danh sách giải/mùa đã
     * tham gia, kể cả mùa CHƯA đá trận nào — lấy từ SeasonTeam, độc lập với
     * phần win/draw/loss vốn chỉ tính trên match đã có kết quả).
     */
    async getTeamOverviewStats(teamId) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            select: { id: true, name: true },
        });
        if (!team) {
            throw createAppError("NOT_FOUND", `Team id=${teamId} not found`, "Không tìm thấy đội");
        }
        const seasonTeams = await this.prisma.seasonTeam.findMany({
            where: { team_id: teamId },
            select: {
                status: true,
                season: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        tournament: { select: { id: true, name: true } },
                    },
                },
            },
            orderBy: { season: { created_at: "desc" } },
        });
        const tournamentIds = new Set(seasonTeams.map((st) => st.season.tournament.id));
        const participations = seasonTeams.map((st) => ({
            season_id: st.season.id,
            season_name: st.season.name,
            season_status: st.season.status,
            tournament_id: st.season.tournament.id,
            tournament_name: st.season.tournament.name,
            registration_status: st.status,
        }));
        const rows = await this.prisma.$queryRaw `
            SELECT
                SUM(CASE WHEN mr.winner_team_id = ${teamId} THEN 1 ELSE 0 END) AS wins,
                SUM(CASE WHEN mr.winner_team_id IS NULL THEN 1 ELSE 0 END) AS draws,
                SUM(CASE WHEN mr.winner_team_id IS NOT NULL AND mr.winner_team_id != ${teamId} THEN 1 ELSE 0 END) AS losses,
                COUNT(*) AS matches_played,
                COALESCE(SUM(CASE WHEN m.home_team_id = ${teamId} THEN mr.home_final_score ELSE mr.away_final_score END), 0) AS goals_for,
                COALESCE(SUM(CASE WHEN m.home_team_id = ${teamId} THEN mr.away_final_score ELSE mr.home_final_score END), 0) AS goals_against
            FROM matches m
            JOIN match_results mr ON mr.match_id = m.id
            WHERE (m.home_team_id = ${teamId} OR m.away_team_id = ${teamId})
                AND m.status = 'finished'
        `;
        const r = rows[0];
        const matches_played = Number(r?.matches_played ?? 0);
        const wins = Number(r?.wins ?? 0);
        const draws = Number(r?.draws ?? 0);
        const losses = Number(r?.losses ?? 0);
        const goals_for = Number(r?.goals_for ?? 0);
        const goals_against = Number(r?.goals_against ?? 0);
        return {
            team_id: team.id,
            team_name: team.name,
            tournament_count: tournamentIds.size,
            season_count: seasonTeams.length,
            participations,
            total_matches_played: matches_played,
            total_wins: wins,
            total_draws: draws,
            total_losses: losses,
            win_rate: matches_played > 0 ? Number(((wins / matches_played) * 100).toFixed(1)) : 0,
            total_goals_for: goals_for,
            total_goals_against: goals_against,
            goal_difference: goals_for - goals_against,
        };
    }
    /**
     * TOURNAMENT TEAM STATS — thống kê đội gộp qua TẤT CẢ season của 1 giải
     * đấu (vd Arsenal ở "Ngoại hạng Anh" tính từ mùa 2023 tới 2026).
     */
    async getTeamTournamentStats(teamId, tournamentId) {
        const [team, tournament, seasonTeams] = await Promise.all([
            this.prisma.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } }),
            this.prisma.tournament.findUnique({ where: { id: tournamentId }, select: { id: true, name: true } }),
            this.prisma.seasonTeam.findMany({
                where: { team_id: teamId, season: { tournament_id: tournamentId } },
                select: { season: { select: { id: true, name: true } } },
                distinct: ["season_id"],
            }),
        ]);
        if (!team) {
            throw createAppError("NOT_FOUND", `Team id=${teamId} not found`, "Không tìm thấy đội");
        }
        if (!tournament) {
            throw createAppError("NOT_FOUND", `Tournament id=${tournamentId} not found`, "Không tìm thấy giải đấu");
        }
        const matches = await this._fetchTeamMatchesWithRule(teamId, { tournamentId });
        const agg = this._aggregateTeamMatches(teamId, matches);
        return {
            team_id: team.id,
            team_name: team.name,
            tournament_id: tournament.id,
            tournament_name: tournament.name,
            season_count: seasonTeams.length,
            seasons: seasonTeams.map((st) => ({ season_id: st.season.id, season_name: st.season.name })),
            ...agg,
        };
    }
    /**
     * SEASON TEAM STATS — thống kê đội trong 1 mùa giải cụ thể
     * (vd "Arsenal mùa 2025: 38 trận, 82 điểm, 75 bàn").
     */
    async getTeamSeasonStats(teamId, seasonId) {
        const [team, seasonTeam] = await Promise.all([
            this.prisma.team.findUnique({ where: { id: teamId }, select: { id: true, name: true } }),
            this.prisma.seasonTeam.findUnique({
                where: { season_id_team_id: { season_id: seasonId, team_id: teamId } },
                select: {
                    group: { select: { name: true } },
                    season: {
                        select: {
                            id: true,
                            name: true,
                            tournament: { select: { id: true, name: true } },
                        },
                    },
                },
            }),
        ]);
        if (!team) {
            throw createAppError("NOT_FOUND", `Team id=${teamId} not found`, "Không tìm thấy đội");
        }
        if (!seasonTeam) {
            throw createAppError("NOT_FOUND", `Team ${teamId} chưa tham gia season ${seasonId}`, "Đội chưa tham gia mùa giải này");
        }
        const matches = await this._fetchTeamMatchesWithRule(teamId, { seasonId });
        const agg = this._aggregateTeamMatches(teamId, matches);
        return {
            team_id: team.id,
            team_name: team.name,
            season_id: seasonTeam.season.id,
            season_name: seasonTeam.season.name,
            tournament_id: seasonTeam.season.tournament.id,
            tournament_name: seasonTeam.season.tournament.name,
            group_name: seasonTeam.group?.name ?? null,
            ...agg,
        };
    }
    /**
     * MATCH TEAM STATS — góc nhìn 1 đội trong 1 trận cụ thể: đối thủ, kết
     * quả, danh sách người ghi bàn, thẻ phạt.
     */
    async getTeamMatchStats(teamId, matchId) {
        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
            select: {
                id: true,
                home_team_id: true,
                away_team_id: true,
                played_at: true,
                phase: { select: { id: true, name: true, season: { select: { id: true, name: true } } } },
                home_team: { select: { id: true, name: true } },
                away_team: { select: { id: true, name: true } },
                matchResult: { select: { home_final_score: true, away_final_score: true, status: true } },
                events: {
                    where: { team_id: teamId },
                    select: {
                        type: true,
                        minute: true,
                        player_id: true,
                        player: { select: { user: { select: { name: true } } } },
                    },
                },
            },
        });
        if (!match) {
            throw createAppError("NOT_FOUND", `Match id=${matchId} not found`, "Không tìm thấy trận đấu");
        }
        if (match.home_team_id !== teamId && match.away_team_id !== teamId) {
            throw createAppError("VALIDATION_ERROR", `Team ${teamId} không thi đấu trong match ${matchId}`, "Đội không thi đấu trong trận này");
        }
        const isHome = match.home_team_id === teamId;
        const opponent = isHome ? match.away_team : match.home_team;
        const hasOfficialResult = match.matchResult?.status === "official";
        const gf = hasOfficialResult
            ? (isHome ? match.matchResult.home_final_score : match.matchResult.away_final_score)
            : 0;
        const ga = hasOfficialResult
            ? (isHome ? match.matchResult.away_final_score : match.matchResult.home_final_score)
            : 0;
        let result = "pending";
        if (hasOfficialResult) {
            result = gf > ga ? "win" : gf < ga ? "loss" : "draw";
        }
        const goals = match.events
            .filter((e) => e.type === "goal" || e.type === "penalty_scored")
            .map((e) => ({
            minute: e.minute,
            player_id: e.player_id,
            player_name: e.player?.user?.name ?? null,
            type: e.type,
        }));
        return {
            team_id: teamId,
            team_name: isHome ? match.home_team.name : match.away_team.name,
            match_id: match.id,
            season_id: match.phase.season.id,
            season_name: match.phase.season.name,
            phase_id: match.phase.id,
            phase_name: match.phase.name,
            played_at: match.played_at ? match.played_at.toISOString() : null,
            opponent_team_id: opponent.id,
            opponent_team_name: opponent.name,
            is_home: isHome,
            goals_for: gf,
            goals_against: ga,
            result,
            goals,
            yellow_cards: match.events.filter((e) => e.type === "yellow_card" || e.type === "second_yellow").length,
            red_cards: match.events.filter((e) => e.type === "red_card").length,
        };
    }
    async getTeamMatchTimeSeries(teamId, granularity = "month", period) {
        if (!["day", "month", "year"].includes(granularity)) {
            throw createAppError("VALIDATION_ERROR", `getTeamMatchTimeSeries called with invalid granularity=${granularity}`, "granularity không hợp lệ, dùng: day, month, year");
        }
        const tzOffset = `+${String(BUSINESS_TZ_OFFSET_HOURS).padStart(2, "0")}:00`;
        const dateFormatMap = {
            day: "%Y-%m-%d",
            month: "%Y-%m",
            year: "%Y",
        };
        const bucketExpr = Prisma.raw(`DATE_FORMAT(CONVERT_TZ(m.played_at, '+00:00', '${tzOffset}'), '${dateFormatMap[granularity]}')`);
        let periodFilter = Prisma.empty;
        if (period) {
            const days = PERIOD_DAYS[period];
            if (!days) {
                throw createAppError("VALIDATION_ERROR", `getTeamMatchTimeSeries called with invalid period=${period}`, "period không hợp lệ, dùng: 7d, 30d, 90d, 3m, 6m, 1y");
            }
            periodFilter = Prisma.sql `AND m.played_at >= DATE_SUB(${businessNow}, INTERVAL ${days} DAY)`;
        }
        const rows = await this.prisma.$queryRaw(Prisma.sql `
            SELECT
                ${bucketExpr} AS bucket,
                SUM(CASE WHEN mr.winner_team_id = ${teamId} THEN 1 ELSE 0 END) AS wins,
                SUM(CASE WHEN mr.winner_team_id IS NULL THEN 1 ELSE 0 END) AS draws,
                SUM(CASE WHEN mr.winner_team_id IS NOT NULL AND mr.winner_team_id != ${teamId} THEN 1 ELSE 0 END) AS losses,
                COUNT(*) AS matches_played
            FROM matches m
            JOIN match_results mr ON mr.match_id = m.id
            WHERE (m.home_team_id = ${teamId} OR m.away_team_id = ${teamId})
                AND m.status = 'finished'
                AND m.played_at IS NOT NULL
                ${periodFilter}
            GROUP BY bucket
            ORDER BY bucket ASC
        `);
        return {
            team_id: teamId,
            granularity,
            period: period ?? null,
            points: rows.map((r) => ({
                bucket: r.bucket,
                wins: Number(r.wins),
                draws: Number(r.draws),
                losses: Number(r.losses),
                matches_played: Number(r.matches_played),
            })),
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER STATS HIERARCHY
    // ═══════════════════════════════════════════════════════════════════════
    // Player Stats (toàn bộ sự nghiệp) → Tournament Player Stats → Season
    // Player Stats → Match Player Stats.
    //
    // KHÁC với team: goals/assists/cards theo season đã có sẵn cộng dồn
    // trong PlayerStatistic (không cần raw-aggregate qua match_events), nên
    // Tournament/Season Player Stats chỉ cần sum PlayerStatistic rows theo
    // filter tương ứng — không cần helper aggregate riêng như team.
    async getPlayerOverviewStats(playerId) {
        const player = await this.prisma.player.findUnique({
            where: { id: playerId },
            select: { id: true, user: { select: { name: true } } },
        });
        if (!player) {
            throw createAppError("NOT_FOUND", `Player id=${playerId} not found`, "Không tìm thấy cầu thủ");
        }
        const [agg, rows] = await Promise.all([
            this.prisma.playerStatistic.aggregate({
                where: { player_id: playerId },
                _sum: {
                    matches_played: true,
                    goals_scored: true,
                    assists: true,
                    yellow_cards: true,
                    red_cards: true,
                },
            }),
            this.prisma.playerStatistic.findMany({
                where: { player_id: playerId },
                select: { team_id: true, season_id: true, season: { select: { tournament_id: true } } },
            }),
        ]);
        const teamIds = new Set(rows.map((r) => r.team_id));
        const seasonIds = new Set(rows.map((r) => r.season_id));
        const tournamentIds = new Set(rows.map((r) => r.season.tournament_id));
        return {
            player_id: player.id,
            player_name: player.user.name,
            tournament_count: tournamentIds.size,
            team_count: teamIds.size,
            season_count: seasonIds.size,
            total_matches_played: agg._sum.matches_played ?? 0,
            total_goals: agg._sum.goals_scored ?? 0,
            total_assists: agg._sum.assists ?? 0,
            total_yellow_cards: agg._sum.yellow_cards ?? 0,
            total_red_cards: agg._sum.red_cards ?? 0,
        };
    }
    /**
     * TOURNAMENT PLAYER STATS — gộp mọi season của 1 giải đấu mà player đã
     * thi đấu (mirror getTeamTournamentStats, nhưng đơn giản hơn vì không
     * cần tính points/win-loss).
     */
    async getPlayerTournamentStats(playerId, tournamentId) {
        const [player, tournament, rows] = await Promise.all([
            this.prisma.player.findUnique({
                where: { id: playerId },
                select: { id: true, user: { select: { name: true } } },
            }),
            this.prisma.tournament.findUnique({ where: { id: tournamentId }, select: { id: true, name: true } }),
            this.prisma.playerStatistic.findMany({
                where: { player_id: playerId, season: { tournament_id: tournamentId } },
                select: {
                    season_id: true,
                    matches_played: true,
                    goals_scored: true,
                    assists: true,
                    yellow_cards: true,
                    red_cards: true,
                },
            }),
        ]);
        if (!player) {
            throw createAppError("NOT_FOUND", `Player id=${playerId} not found`, "Không tìm thấy cầu thủ");
        }
        if (!tournament) {
            throw createAppError("NOT_FOUND", `Tournament id=${tournamentId} not found`, "Không tìm thấy giải đấu");
        }
        const seasonIds = new Set(rows.map((r) => r.season_id));
        return {
            player_id: player.id,
            player_name: player.user.name,
            tournament_id: tournament.id,
            tournament_name: tournament.name,
            season_count: seasonIds.size,
            total_matches_played: rows.reduce((s, r) => s + r.matches_played, 0),
            total_goals: rows.reduce((s, r) => s + r.goals_scored, 0),
            total_assists: rows.reduce((s, r) => s + r.assists, 0),
            total_yellow_cards: rows.reduce((s, r) => s + r.yellow_cards, 0),
            total_red_cards: rows.reduce((s, r) => s + r.red_cards, 0),
        };
    }
    /**
     * SEASON PLAYER STATS — thống kê player trong 1 mùa giải cụ thể. Trả
     * kèm breakdown theo từng đội (đề phòng trường hợp đổi đội giữa mùa —
     * unique constraint [player_id, team_id, season_id] cho phép >1 row).
     */
    async getPlayerSeasonStats(playerId, seasonId) {
        const [player, season, rows] = await Promise.all([
            this.prisma.player.findUnique({
                where: { id: playerId },
                select: { id: true, user: { select: { name: true } } },
            }),
            this.prisma.season.findUnique({
                where: { id: seasonId },
                select: { id: true, name: true, tournament: { select: { id: true, name: true } } },
            }),
            this.prisma.playerStatistic.findMany({
                where: { player_id: playerId, season_id: seasonId },
                select: {
                    matches_played: true,
                    goals_scored: true,
                    assists: true,
                    yellow_cards: true,
                    red_cards: true,
                    team: { select: { id: true, name: true } },
                },
            }),
        ]);
        if (!player) {
            throw createAppError("NOT_FOUND", `Player id=${playerId} not found`, "Không tìm thấy cầu thủ");
        }
        if (!season) {
            throw createAppError("NOT_FOUND", `Season id=${seasonId} not found`, "Không tìm thấy mùa giải");
        }
        if (rows.length === 0) {
            throw createAppError("NOT_FOUND", `Player ${playerId} chưa có dữ liệu ở season ${seasonId}`, "Cầu thủ chưa thi đấu ở mùa giải này");
        }
        const teams = rows.map((r) => ({
            team_id: r.team.id,
            team_name: r.team.name,
            matches_played: r.matches_played,
            goals: r.goals_scored,
            assists: r.assists,
            yellow_cards: r.yellow_cards,
            red_cards: r.red_cards,
        }));
        return {
            player_id: player.id,
            player_name: player.user.name,
            season_id: season.id,
            season_name: season.name,
            tournament_id: season.tournament.id,
            tournament_name: season.tournament.name,
            total_matches_played: rows.reduce((s, r) => s + r.matches_played, 0),
            total_goals: rows.reduce((s, r) => s + r.goals_scored, 0),
            total_assists: rows.reduce((s, r) => s + r.assists, 0),
            total_yellow_cards: rows.reduce((s, r) => s + r.yellow_cards, 0),
            total_red_cards: rows.reduce((s, r) => s + r.red_cards, 0),
            teams,
        };
    }
    /**
     * MATCH PLAYER STATS — góc nhìn 1 cầu thủ trong 1 trận: có ra sân
     * không (lineup), đá bao nhiêu phút, ghi bàn/thẻ phạt trong trận đó.
     *
     * GIỚI HẠN: MatchEventType không có "assist" — số kiến tạo KHÔNG track
     * được theo từng trận, chỉ có tổng theo mùa (PlayerStatistic.assists,
     * xem getPlayerSeasonStats). Field `note` giải thích rõ điều này cho FE
     * tránh hiểu nhầm là bug thiếu dữ liệu.
     */
    async getPlayerMatchStats(playerId, matchId) {
        const [player, match, lineup] = await Promise.all([
            this.prisma.player.findUnique({
                where: { id: playerId },
                select: { id: true, user: { select: { name: true } } },
            }),
            this.prisma.match.findUnique({
                where: { id: matchId },
                select: {
                    id: true,
                    played_at: true,
                    home_team: { select: { id: true, name: true } },
                    away_team: { select: { id: true, name: true } },
                    events: {
                        where: { player_id: playerId },
                        select: { type: true, minute: true },
                    },
                },
            }),
            this.prisma.matchLineup.findUnique({
                where: { match_id_player_id: { match_id: matchId, player_id: playerId } },
                select: {
                    team_id: true,
                    lineup_type: true,
                    is_captain: true,
                    minute_in: true,
                    minute_out: true,
                    team: { select: { id: true, name: true } },
                },
            }),
        ]);
        if (!player) {
            throw createAppError("NOT_FOUND", `Player id=${playerId} not found`, "Không tìm thấy cầu thủ");
        }
        if (!match) {
            throw createAppError("NOT_FOUND", `Match id=${matchId} not found`, "Không tìm thấy trận đấu");
        }
        if (!lineup) {
            throw createAppError("NOT_FOUND", `Player ${playerId} không có trong đội hình match ${matchId}`, "Cầu thủ không thi đấu trận này");
        }
        const opponent = lineup.team_id === match.home_team.id ? match.away_team : match.home_team;
        // Ước lượng số phút thi đấu:
        // - starter: lấy minute_out nếu có (bị thay ra sớm); null = đá tới
        //   hết trận, FE tự hiểu theo ngữ cảnh (không biết tổng thời lượng
        //   trận ở tầng service này).
        // - substitute: minute_out - minute_in nếu có đủ cả 2 mốc.
        let minutesPlayed = null;
        if (lineup.lineup_type === "starter") {
            minutesPlayed = lineup.minute_out ?? null;
        }
        else if (lineup.minute_in != null && lineup.minute_out != null) {
            minutesPlayed = lineup.minute_out - lineup.minute_in;
        }
        return {
            player_id: player.id,
            player_name: player.user.name,
            match_id: match.id,
            team_id: lineup.team.id,
            team_name: lineup.team.name,
            opponent_team_id: opponent?.id ?? null,
            opponent_team_name: opponent?.name ?? null,
            played_at: match.played_at ? match.played_at.toISOString() : null,
            lineup_type: lineup.lineup_type,
            minutes_played: minutesPlayed,
            is_captain: lineup.is_captain,
            goals: match.events.filter((e) => e.type === "goal" || e.type === "penalty_scored").length,
            yellow_cards: match.events.filter((e) => e.type === "yellow_card" || e.type === "second_yellow").length,
            red_cards: match.events.filter((e) => e.type === "red_card").length,
            events: match.events.map((e) => ({ minute: e.minute, type: e.type })),
            note: "Kiến tạo (assist) không được ghi nhận theo từng trận trong hệ thống hiện tại — chỉ có tổng theo mùa, xem Season Player Stats.",
        };
    }
}
//# sourceMappingURL=statistics.service.js.map