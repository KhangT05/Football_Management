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
    // TEAM STATS HIERARCHY (tournament / season / match level)
    // ═══════════════════════════════════════════════════════════════════════
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
    @Security("jwt", ["admin"])
    @Get("seasons/{seasonId}/finance")
    async getPlayerFinanceStats(@Path() seasonId: number) {
        return this.statisticsService.getPlayerFinanceStats(seasonId);
    }
}