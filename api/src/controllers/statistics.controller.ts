import {
    Controller,
    Get,
    Path,
    Tags,
    Route,
    Security,
    Query,
} from "tsoa";

import { StatisticsService } from "../services/statistics.service.js";
import { LeaveReason } from "../generated/prisma/client.js";

@Route("statistics")
@Tags("Statistics")
export class StatisticsController extends Controller {
    constructor(
        private readonly statisticsService: StatisticsService,
    ) {
        super();
    }

    @Security("jwt", ["admin"])
    @Get("users/registrations")
    async getUserRegistrationStats(@Query() period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y") {
        return this.statisticsService.getUserRegistrationStats(period);
    }

    @Get("seasons/revenue")
    async getSeasonRevenue(@Query() season_id?: number) {
        return this.statisticsService.getSeasonRevenue(season_id);
    }

    @Get("tournaments/{id}/overview")
    async getTournamentOverview(@Path() id: number) {
        return this.statisticsService.getTournamentOverview(id);
    }


    @Get("seasons/{seasonId}/teams/registrations")
    async getTeamRegistrationStats(@Path() seasonId: number) {
        return this.statisticsService.getTeamRegistrationStats(seasonId);
    }

    @Get("seasons/{seasonId}/top-scorers")
    async getTopScorers(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getTopScorers(seasonId, limit ?? 10);
    }

    @Get("seasons/{seasonId}/discipline")
    async getTeamDisciplineStats(@Path() seasonId: number) {
        return this.statisticsService.getTeamDisciplineStats(seasonId);
    }

    @Get("seasons/{seasonId}/top-assists")
    async getTopAssists(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getPlayerRanking(seasonId, "assists", limit ?? 10);
    }


    @Get("seasons/{seasonId}/top-yellow-cards")
    async getTopYellowCards(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getPlayerRanking(seasonId, "yellow_cards", limit ?? 10);
    }


    @Get("seasons/{seasonId}/top-red-cards")
    async getTopRedCards(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getPlayerRanking(seasonId, "red_cards", limit ?? 10);
    }


    @Get("seasons/{seasonId}/best-players")
    async getBestPlayers(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getBestPlayers(seasonId, limit ?? 10);
    }

    @Get("players/{playerId}/career")
    async getPlayerCareerStats(@Path() playerId: number) {
        return this.statisticsService.getPlayerCareerStats(playerId);
    }

    @Security("jwt", ["admin"])
    @Get("overview")
    async getSystemOverviewStats(@Query() period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y") {
        return this.statisticsService.getSystemOverviewStats(period);
    }

    @Get("teams/{teamId}/overview")
    async getTeamOverviewStats(@Path() teamId: number) {
        return this.statisticsService.getTeamOverviewStats(teamId);
    }

    @Get("teams/{teamId}/matches/timeseries")
    async getTeamMatchTimeSeries(
        @Path() teamId: number,
        @Query() granularity?: "day" | "month" | "year",
        @Query() period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y",
    ) {
        return this.statisticsService.getTeamMatchTimeSeries(teamId, granularity ?? "month", period);
    }

    @Get("players/{playerId}/overview")
    async getPlayerOverviewStats(@Path() playerId: number) {
        return this.statisticsService.getPlayerOverviewStats(playerId);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // BỔ SUNG — các method service chưa có route
    // ═══════════════════════════════════════════════════════════════════════

    // Đếm số user mới trong N ngày (khác getUserRegistrationStats ở chỗ
    // đây chỉ trả về 1 số, không bucket theo ngày — dùng cho KPI card).
    @Security("jwt", ["admin"])
    @Get("users/registrations/count")
    async getNewUserCount(@Query() period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y") {
        return this.statisticsService.getNewUserCount(period);
    }

    // Danh sách player hiện không thuộc team nào (free agent).
    @Get("players/without-team")
    async getPlayersWithoutTeam() {
        return this.statisticsService.getPlayersWithoutTeam();
    }

    // Thống kê player rời team, filter theo season/reason — internal reporting.
    @Security("jwt", ["admin"])
    @Get("players/leaves")
    async getTeamPlayerLeaveStats(
        @Query() season_id?: number,
        @Query() reason?: LeaveReason,
        @Query() limit?: number,
    ) {
        return this.statisticsService.getTeamPlayerLeaveStats({
            seasonId: season_id,
            reason,
            limit,
        });
    }

    @Get("teams/{teamId}/tournaments/{tournamentId}")
    async getTeamTournamentStats(@Path() teamId: number, @Path() tournamentId: number) {
        return this.statisticsService.getTeamTournamentStats(teamId, tournamentId);
    }

    @Get("teams/{teamId}/seasons/{seasonId}")
    async getTeamSeasonStats(@Path() teamId: number, @Path() seasonId: number) {
        return this.statisticsService.getTeamSeasonStats(teamId, seasonId);
    }

    @Get("teams/{teamId}/matches/{matchId}")
    async getTeamMatchStats(@Path() teamId: number, @Path() matchId: number) {
        return this.statisticsService.getTeamMatchStats(teamId, matchId);
    }

    @Get("players/{playerId}/tournaments/{tournamentId}")
    async getPlayerTournamentStats(@Path() playerId: number, @Path() tournamentId: number) {
        return this.statisticsService.getPlayerTournamentStats(playerId, tournamentId);
    }

    @Get("players/{playerId}/seasons/{seasonId}")
    async getPlayerSeasonStats(@Path() playerId: number, @Path() seasonId: number) {
        return this.statisticsService.getPlayerSeasonStats(playerId, seasonId);
    }

    @Get("players/{playerId}/matches/{matchId}")
    async getPlayerMatchStats(@Path() playerId: number, @Path() matchId: number) {
        return this.statisticsService.getPlayerMatchStats(playerId, matchId);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER FINANCE (thưởng/phạt theo season)
    // ═══════════════════════════════════════════════════════════════════════
    @Security("jwt", ["admin", "leader"])
    @Get("seasons/{seasonId}/finance")
    async getPlayerFinanceStats(@Path() seasonId: number) {
        return this.statisticsService.getPlayerFinanceStats(seasonId);
    }
    // StatisticsController — thêm vào class hiện có

    // ═══ TEAM V2 (extended: home/away split, streak, biggest win/loss, clean sheets) ═══
    @Get("teams/{teamId}/overview/extended")
    async getTeamOverviewStatsV2(
        @Path() teamId: number,
        @Query() period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y",
    ) {
        return this.statisticsService.getTeamOverviewStatsV2(teamId, period);
    }

    @Get("teams/{teamId}/tournaments/{tournamentId}/extended")
    async getTeamTournamentStatsV2(@Path() teamId: number, @Path() tournamentId: number) {
        return this.statisticsService.getTeamTournamentStatsV2(teamId, tournamentId);
    }

    @Get("teams/{teamId}/seasons/{seasonId}/extended")
    async getTeamSeasonStatsV2(@Path() teamId: number, @Path() seasonId: number) {
        return this.statisticsService.getTeamSeasonStatsV2(teamId, seasonId);
    }

    // ═══ TEAM — participation & finance ═══
    @Get("teams/{teamId}/participations")
    async getTeamParticipationStats(@Path() teamId: number) {
        return this.statisticsService.getTeamParticipationStats(teamId);
    }

    @Security("jwt", ["admin"])
    @Get("seasons/{seasonId}/teams/finance-batch")
    async getTeamsFinanceStatsBatch(@Path() seasonId: number) {
        return this.statisticsService.getTeamsFinanceStatsBatch(seasonId);
    }

    // Batch team stats 1 season — thay thế N+1 call getTeamSeasonStats cho từng đội.
    @Get("seasons/{seasonId}/teams/batch")
    async getTeamsSeasonStatsBatch(@Path() seasonId: number) {
        return this.statisticsService.getTeamsSeasonStatsBatch(seasonId);
    }

    // ═══ PLAYER — participation, performance, discipline, teams-in-period ═══
    @Get("players/{playerId}/participations")
    async getPlayerParticipationStats(@Path() playerId: number) {
        return this.statisticsService.getPlayerParticipationStats(playerId);
    }

    @Get("seasons/{seasonId}/players/performance-batch")
    async getPlayersPerformanceStatsBatch(@Path() seasonId: number) {
        return this.statisticsService.getPlayersPerformanceStatsBatch(seasonId);
    }

    @Get("players/{playerId}/seasons/{seasonId}/discipline")
    async getPlayerDisciplineStatus(@Path() playerId: number, @Path() seasonId: number) {
        return this.statisticsService.getPlayerDisciplineStatus(playerId, seasonId);
    }

    // Assumption: reporting nội bộ (đối soát cầu thủ đổi đội theo khoảng thời gian) — khoá admin.
    @Security("jwt", ["admin"])
    @Get("players/{playerId}/teams-in-period")
    async getPlayerTeamsInPeriod(
        @Path() playerId: number,
        @Query() from: string,
        @Query() to: string,
    ) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            // tsoa không tự validate format ISO cho string query — validate tay ở đây
            this.setStatus(400);
            throw new Error("from/to phải là ISO date string hợp lệ");
        }
        return this.statisticsService.getPlayerTeamsInPeriod(playerId, fromDate, toDate);
    }

    @Security("jwt", ["admin", "leader"])
    @Get("teams/{teamId}/finance")
    async getTeamFinanceStats(@Path() teamId: number, @Query() season_id: number) {
        return this.statisticsService.getTeamFinanceStats(teamId, season_id);
    }
}