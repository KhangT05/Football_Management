import { createAppError } from "../common/app.error.js";
import { Prisma } from "../generated/prisma/client.js";
// Business timezone. MySQL server có thể chạy UTC → phải convert tường minh,
// không tin session timezone default (dễ lệch ranh giới ngày khi server ở UTC).
const BUSINESS_TZ_OFFSET = "+07:00";
export class StatisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    // ═══════════════════════════════════════════════════════════════════════
    // USER REGISTRATION — new users trong N ngày gần nhất, bucket theo ngày
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Yêu cầu index: @@index([created_at]) trên model User trong schema.prisma
    // (hiện tại thiếu — full scan khi table lớn, cần migration trước khi ship).
    //
    // Dùng raw query vì Prisma groupBy không hỗ trợ DATE()/CONVERT_TZ trên
    // computed expression — groupBy chỉ group theo column thật.
    async getUserRegistrationStats(days = 30) {
        if (days <= 0 || days > 365) {
            throw createAppError("VALIDATION_ERROR", `getUserRegistrationStats called with invalid days=${days}`, "days phải trong khoảng 1-365");
        }
        const rows = await this.prisma.$queryRaw `
            SELECT
                DATE(CONVERT_TZ(created_at, '+00:00', ${BUSINESS_TZ_OFFSET})) AS day,
                COUNT(*) AS count
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL ${days} DAY)
            GROUP BY DATE(CONVERT_TZ(created_at, '+00:00', ${BUSINESS_TZ_OFFSET}))
            ORDER BY day ASC
        `;
        // Lấp ngày trống = 0 (dashboard cần continuous series, không skip ngày không có user mới)
        const dayMap = new Map();
        for (const r of rows) {
            dayMap.set(r.day.toISOString().slice(0, 10), Number(r.count));
        }
        const daily = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
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
                COALESCE(SUM(CASE WHEN me.event_type = 'yellow_card' THEN 1 ELSE 0 END), 0) AS yellow_count,
                COALESCE(SUM(CASE WHEN me.event_type = 'red_card' THEN 1 ELSE 0 END), 0) AS red_count
            FROM teams t
            JOIN season_teams st ON st.team_id = t.id AND st.season_id = ${seasonId}
            LEFT JOIN match_events me ON me.team_id = t.id
                AND me.event_type IN ('yellow_card', 'red_card')
            LEFT JOIN matches m ON m.id = me.match_id
            LEFT JOIN phases ph ON ph.id = m.phase_id
            WHERE me.id IS NULL OR ph.season_id = ${seasonId}
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
}
//# sourceMappingURL=statistics.service.js.map