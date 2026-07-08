import { createAppError } from "../common/app.error.js";
import { Prisma } from "../generated/prisma/client.js";
import { PERIOD_DAYS, Queryable } from "../libs/queryable.js";
const BUSINESS_TZ_OFFSET_HOURS = 7;
const businessNow = new Date(Date.now() + BUSINESS_TZ_OFFSET_HOURS * 60 * 60 * 1000);
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
    //
    // Yêu cầu index: @@index([created_at]) trên model User trong schema.prisma
    // (hiện tại thiếu — full scan khi table lớn, cần migration trước khi ship).
    //
    // Dùng raw query vì Prisma groupBy không hỗ trợ DATE()/CONVERT_TZ trên
    // computed expression — groupBy chỉ group theo column thật. Queryable
    // KHÔNG thay được ở đây: nó filter theo period nhưng không bucket theo
    // ngày, đây là hai bài toán khác nhau.
    //
    // period: preset chung với Queryable ("7d" | "30d" | "90d" | "3m" | "6m" | "1y").
    // Lưu ý "3m"/"6m" là rolling window cố định (90/180 ngày), KHÔNG phải
    // calendar-aligned month — xem PERIOD_DAYS trong queryable.ts.
    async getUserRegistrationStats(period = "30d") {
        const days = PERIOD_DAYS[period];
        if (!days) {
            throw createAppError("VALIDATION_ERROR", `getUserRegistrationStats called with invalid period=${period}`, "period không hợp lệ, dùng: 7d, 30d, 90d, 3m, 6m, 1y");
        }
        // Format đúng chuẩn CONVERT_TZ ('+07:00'), không truyền số giờ thô
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
        // Lấp ngày trống = 0 (dashboard cần continuous series, không skip ngày không có user mới)
        const dayMap = new Map();
        for (const r of rows) {
            dayMap.set(r.day.toISOString().slice(0, 10), Number(r.count));
        }
        const daily = [];
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(businessNow);
            d.setUTCDate(d.getUTCDate() - i); // dùng UTC methods vì đã shift thủ công
            const key = d.toISOString().slice(0, 10);
            daily.push({ day: key, count: dayMap.get(key) ?? 0 });
        }
        return {
            range_days: days,
            total_new_users: daily.reduce((sum, p) => sum + p.count, 0),
            daily,
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // NEW USER COUNT — KPI card, không cần breakdown theo ngày.
    // Dùng Queryable.count() thay vì raw query: không fetch rows, chỉ 1 COUNT.
    // ═══════════════════════════════════════════════════════════════════════
    async getNewUserCount(period = "30d") {
        return this.userQueryable.count({ period });
    }
    // ═══════════════════════════════════════════════════════════════════════
    // SEASON REVENUE — net revenue = confirmed - refunded, KHÔNG tính pending
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Payment không FK thẳng vào Season (chỉ có season_team_id), nên phải
    // join qua season_teams. groupBy 2-level relation Prisma không support,
    // dùng raw + CASE WHEN để tránh N+1 (query riêng từng season).
    //
    // Decimal → Number: chấp nhận rounding error cho mục đích display/dashboard.
    // Nếu cần chính xác tuyệt đối cho báo cáo tài chính/kế toán, giữ nguyên
    // Decimal string ở tầng response, không convert ở service layer.
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
    // ═══════════════════════════════════════════════════════════════════════
    // TEAM REGISTRATION FUNNEL — dùng Prisma groupBy (status là column thật,
    // không cần raw SQL như 2 method trên)
    // ═══════════════════════════════════════════════════════════════════════
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
    // TOP SCORERS — raw query, aggregate trong DB (không load event về app rồi
    // count ở JS — với giải nhiều mùa/nhiều trận, số row match_events có thể
    // lớn, count-in-app sẽ tốn memory + network vô ích)
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Yêu cầu index: @@index([season_id]) trên phases (join chain
    // match_events -> matches -> phases -> season_id), và
    // @@index([match_id, event_type]) trên match_events — thiếu cả hai sẽ
    // full scan match_events khi giải chạy nhiều mùa.
    async getTopScorers(seasonId, limit = 10) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getTopScorers called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.$queryRaw `
            SELECT
                pl.id AS player_id,
                pl.name AS player_name,
                t.id AS team_id,
                t.name AS team_name,
                COUNT(*) AS goal_count
            FROM match_events me
            JOIN matches m ON m.id = me.match_id
            JOIN phases ph ON ph.id = m.phase_id
            JOIN players pl ON pl.id = me.player_id
            JOIN teams t ON t.id = me.team_id
            WHERE ph.season_id = ${seasonId}
                AND me.event_type = 'goal'
            GROUP BY pl.id, pl.name, t.id, t.name
            ORDER BY goal_count DESC, pl.name ASC
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
    // ═══════════════════════════════════════════════════════════════════════
    // TEAM DISCIPLINE — yellow/red card tổng hợp theo đội, phục vụ Ban Tổ Chức
    // theo dõi kỷ luật giải
    // ═══════════════════════════════════════════════════════════════════════
    //
    // LEFT JOIN + WHERE (me.id IS NULL OR ph.season_id = seasonId) để vừa giữ
    // đội không có thẻ nào (count = 0) vừa scope đúng theo season — team_id
    // trên match_events không tự scope theo season nếu đội đá nhiều mùa.
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
    // PLAYER RANKING (goals/assists/yellow/red) — đọc từ PlayerStatistic
    // (đã denormalized), KHÔNG re-aggregate match_events. Giả định:
    // PlayerStatistic được service khác update transactional khi ghi nhận
    // match event, bao gồm cả case sửa/hủy event (VAR, nhập nhầm thẻ).
    // Nếu assumption này sai → ranking sẽ lệch so với match_events thật,
    // cần raw-query lại như getTopScorers bản cũ.
    // ═══════════════════════════════════════════════════════════════════════
    //
    // FIX: bản cũ dùng computed key `[field]: ...` + `as Prisma.XxxInput` để
    // build where/orderBy động theo metric. Cast đó che generic inference của
    // findMany() — TS rơi về overload generic hơn, làm `include.player`/`team`
    // không resolve đúng shape (player_name: never, value: number|undefined).
    // Fix: whitelist tường minh where/orderBy theo từng metric — giữ full
    // type inference, và compiler tự bắt lỗi nếu thêm metric mới mà quên map.
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
    // tie-break: hiệu suất cao hơn (ít trận hơn) xếp trước — cố định, không
    // phải input từ client nên không đi qua Queryable.applySort()
    static RANKING_ORDER_MAP = {
        goals: [{ goals_scored: "desc" }, { matches_played: "asc" }],
        assists: [{ assists: "desc" }, { matches_played: "asc" }],
        yellow_cards: [{ yellow_cards: "desc" }, { matches_played: "asc" }],
        red_cards: [{ red_cards: "desc" }, { matches_played: "asc" }],
    };
    async getPlayerRanking(seasonId, metric, limit = 10) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getPlayerRanking called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.playerStatistic.findMany({
            where: StatisticsService.RANKING_WHERE_MAP[metric](seasonId),
            orderBy: StatisticsService.RANKING_ORDER_MAP[metric],
            take: limit,
            include: {
                player: { select: { id: true, name: true } },
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
                player_name: r.player.name,
                team_id: r.team.id,
                team_name: r.team.name,
                value: r[field],
                matches_played: r.matches_played,
            })),
        };
    }
    // ═══════════════════════════════════════════════════════════════════════
    // BEST PLAYER (MVP) — weighted score, KHÔNG có business rule chuẩn nào
    // được xác nhận, đây là công thức mặc định tạm thời. Cần BTC confirm
    // trọng số thật trước khi công bố công khai (ảnh hưởng danh dự/giải thưởng).
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Sort trong app (không phải raw SQL ORDER BY theo computed expression)
    // vì:
    // 1. Prisma không support ORDER BY computed expression multi-field.
    // 2. Số row = số cầu thủ trong 1 season (roster size, vài trăm max),
    //    KHÔNG phải match_events (có thể hàng chục nghìn row/mùa) — load
    //    hết về app rồi sort O(n log n) trong memory là chấp nhận được ở
    //    scale này. Nếu sau này ranking xuyên nhiều mùa/giải, phải raw SQL.
    static DEFAULT_MVP_WEIGHTS = { goal: 4, assist: 3, yellow: -1, red: -3 };
    async getBestPlayers(seasonId, limit = 10, weights = StatisticsService.DEFAULT_MVP_WEIGHTS) {
        if (limit <= 0 || limit > 100) {
            throw createAppError("VALIDATION_ERROR", `getBestPlayers called with invalid limit=${limit}`, "limit phải trong khoảng 1-100");
        }
        const rows = await this.prisma.playerStatistic.findMany({
            where: { season_id: seasonId, matches_played: { gt: 0 } },
            include: {
                player: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
            },
        });
        const scored = rows
            .map((r) => ({
            player_id: r.player.id,
            player_name: r.player.name,
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
    // PLAYER CAREER STATS — thống kê 1 cầu thủ qua các mùa, group theo giải
    // đấu, giống bảng "Thống kê" theo tab của Pedri trên Google (tab = giải,
    // hàng = mùa/năm).
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Đọc từ PlayerStatistic (denormalized) như getPlayerRanking/getBestPlayers
    // — cùng assumption: PlayerStatistic được service khác update transactional
    // khi ghi nhận match event.
    //
    // Số row = số season cầu thủ từng thi đấu (nhỏ, vài chục max) nên group
    // theo tournament làm trong app, không cần raw SQL.
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
    // ═══════════════════════════════════════════════════════════════════════
    // SYSTEM OVERVIEW — KPI cards cho dashboard tổng quan ("Vận hành hệ thống"
    // + "Tài chính & Tăng trưởng"). Gộp 1 endpoint để dashboard chỉ cần 1 call
    // thay vì bắn 6 request riêng lẻ lúc load trang.
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Các count (tournament/season/team) chỉ cần Prisma.count đơn giản —
    // không raw SQL vì không group/bucket gì cả.
    //
    // total_revenue: khác getSeasonRevenue() ở chỗ đây là SUM trực tiếp trên
    // payments TOÀN HỆ THỐNG, không group theo season nên không cần join
    // season_teams -> seasons.
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
}
//# sourceMappingURL=statistics.service.js.map