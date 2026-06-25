import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Post,
    Body,
    Security,
    Query,
} from "tsoa";

import { MatchResultService } from "../services/matchresult.service.js";
import { MatchLifecycleService } from "../services/match.service.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { ScheduleOptions } from "../types/schedule.type.js";

// ─── Inline DTOs ──────────────────────────────────────────────────────────────

interface ConfirmOfficialBody {
    scheduleOptions: ScheduleOptions;
}

// ─── Controller ───────────────────────────────────────────────────────────────
// KHÔNG đặt @Security ở class level — GET endpoints là public (guest xem được).
// Các write endpoints tự annotate @Security riêng.
//
// Read:
//   GET /matches/:id/result          → MatchResult (score, winner, ET, penalty)
//   GET /matches/:id/events          → list events của trận
//   GET /matches/:id/result/stats    → player stats của trận
//   GET /seasons/:seasonId/standings → bảng xếp hạng theo group
//   GET /seasons/:seasonId/stats     → thống kê cầu thủ trong season

@Route("matches")
@Tags("Match Result")
export class MatchResultController extends Controller {
    constructor(
        private readonly matchResultService: MatchResultService,
        private readonly lifecycleService: MatchLifecycleService,
        private readonly prisma: PrismaClient,
    ) {
        super();
    }

    // ─── GET — public (không cần JWT) ─────────────────────────────────────────

    /**
     * Xem kết quả chính thức của trận đấu.
     * Trả về score 90p, ET, penalty, winner, result_type, status (official/protested...).
     */
    @Get("{id}/result")
    async getMatchResult(@Path() id: number) {
        const result = await this.prisma.matchResult.findUnique({
            where: { match_id: id },
            include: {
                winner_team: { select: { id: true, name: true } },
            },
        });
        if (!result) {
            this.setStatus(404);
            throw Object.assign(new Error(`Match ${id} chưa có kết quả`), { status: 404 });
        }
        return result;
    }

    /**
     * List toàn bộ events của trận (goal, thẻ, thay người...).
     * Hỗ trợ filter theo type và period.
     */
    @Get("{id}/events")
    async getMatchEvents(
        @Path() id: number,
        @Query() type?: string,
        @Query() period?: string,
    ) {
        return this.prisma.matchEvent.findMany({
            where: {
                match_id: id,
                ...(type && { type: type as any }),
                ...(period && { period: period as any }),
            },
            orderBy: [{ period: "asc" }, { minute: "asc" }, { added_minute: "asc" }],
            include: {
                match: { select: { home_team_id: true, away_team_id: true } },
            },
        });
    }

    /**
     * Thống kê cầu thủ của 1 trận cụ thể (goals, cards per player).
     * Aggregate từ match_events — không phải PlayerStatistic (đó là season-level).
     */
    @Get("{id}/result/stats")
    async getMatchPlayerStats(@Path() id: number) {
        return this.prisma.matchEvent.groupBy({
            by: ["player_id", "team_id", "type"],
            where: {
                match_id: id,
                player_id: { not: null },
            },
            _count: { type: true },
        });
    }
}

// // ─── Season-level read endpoints ──────────────────────────────────────────────
// // Tách route riêng vì prefix là /seasons thay vì /matches.

// @Route("seasons")
// @Tags("Match Result")
// export class SeasonStatsController extends Controller {
//     constructor(private readonly prisma: PrismaClient) {
//         super();
//     }

//     /**
//      * Bảng xếp hạng tất cả groups trong season.
//      * Hỗ trợ filter theo group_id cụ thể.
//      */
//     @Get("{seasonId}/standings")
//     async getStandings(
//         @Path() seasonId: number,
//         @Query() groupId?: number,
//     ) {
//         return this.prisma.teamStanding.findMany({
//             where: {
//                 group: {
//                     phase: { season_id: seasonId },
//                     ...(groupId && { id: groupId }),
//                 },
//                 is_active: true,
//             },
//             orderBy: [
//                 { group_id: "asc" },
//                 { position: "asc" },
//             ],
//             include: {
//                 team: { select: { id: true, name: true } },
//                 group: { select: { id: true, name: true } },
//             },
//         });
//     }

//     /**
//      * Thống kê cầu thủ trong season.
//      * Hỗ trợ sort theo goals_scored, yellow_cards, red_cards.
//      * Dùng cho top scorer / disciplinary table.
//      */
//     @Get("{seasonId}/player-stats")
//     async getPlayerStats(
//         @Path() seasonId: number,
//         @Query() sort: "goals_scored" | "yellow_cards" | "red_cards" | "matches_played" = "goals_scored",
//         @Query() direction: "asc" | "desc" = "desc",
//         @Query() page = 1,
//         @Query() per_page = 20,
//         @Query() teamId?: number,
//     ) {
//         const skip = (page - 1) * per_page;

//         const [data, total] = await Promise.all([
//             this.prisma.playerStatistic.findMany({
//                 where: {
//                     season_id: seasonId,
//                     ...(teamId && { team_id: teamId }),
//                 },
//                 orderBy: { [sort]: direction },
//                 skip,
//                 take: per_page,
//                 include: {
//                     player: { select: { id: true, name: true } },
//                     team: { select: { id: true, name: true } },
//                 },
//             }),
//             this.prisma.playerStatistic.count({
//                 where: {
//                     season_id: seasonId,
//                     ...(teamId && { team_id: teamId }),
//                 },
//             }),
//         ]);

//         return {
//             data,
//             meta: { total, page, per_page, total_pages: Math.ceil(total / per_page) },
//         };
//     }

//     /**
//      * Danh sách cầu thủ đang bị treo giò trong season.
//      */
//     @Get("{seasonId}/suspended-players")
//     async getSuspendedPlayers(@Path() seasonId: number) {
//         return this.prisma.playerStatistic.findMany({
//             where: { season_id: seasonId, is_suspended: true },
//             include: {
//                 player: { select: { id: true, name: true } },
//                 team: { select: { id: true, name: true } },
//             },
//             orderBy: { team_id: "asc" },
//         });
//     }
// }