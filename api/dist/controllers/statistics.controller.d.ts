import { Controller } from "tsoa";
import { StatisticsService } from "../services/statistics.service.js";
export declare class StatisticsController extends Controller {
    private readonly statisticsService;
    constructor(statisticsService: StatisticsService);
    getUserRegistrationStats(period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y"): Promise<import("../types/statistics.type.js").UserRegistrationStats>;
    getSeasonRevenue(season_id?: number): Promise<import("../types/statistics.type.js").SeasonRevenueStats>;
    getTournamentOverview(id: number): Promise<import("../types/statistics.type.js").TournamentOverviewStats>;
    getTeamRegistrationStats(seasonId: number): Promise<import("../types/statistics.type.js").TeamRegistrationStats>;
    getTopScorers(seasonId: number, limit?: number): Promise<import("../types/statistics.type.js").TopScorerStats>;
    getTeamDisciplineStats(seasonId: number): Promise<import("../types/statistics.type.js").TeamDisciplineStats>;
    getTopAssists(seasonId: number, limit?: number): Promise<import("../types/statistics.type.js").PlayerRankingStats>;
    getTopYellowCards(seasonId: number, limit?: number): Promise<import("../types/statistics.type.js").PlayerRankingStats>;
    getTopRedCards(seasonId: number, limit?: number): Promise<import("../types/statistics.type.js").PlayerRankingStats>;
    getBestPlayers(seasonId: number, limit?: number): Promise<import("../types/statistics.type.js").BestPlayerStats>;
    getPlayerCareerStats(playerId: number): Promise<import("../types/statistics.type.js").PlayerCareerStats>;
    getSystemOverviewStats(period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y"): Promise<import("../types/statistics.type.js").SystemOverviewStats>;
    getTeamOverviewStats(teamId: number): Promise<import("../types/statistics.type.js").TeamOverviewStats>;
    getTeamMatchTimeSeries(teamId: number, granularity?: "day" | "month" | "year", period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y"): Promise<import("../types/statistics.type.js").TeamMatchTimeSeriesStats>;
    getPlayerOverviewStats(playerId: number): Promise<import("../types/statistics.type.js").PlayerOverviewStats>;
    getTeamTournamentStats(teamId: number, tournamentId: number): Promise<import("../types/statistics.type.js").TeamTournamentStats>;
    getTeamSeasonStats(teamId: number, seasonId: number): Promise<import("../types/statistics.type.js").TeamSeasonStats>;
    getTeamMatchStats(teamId: number, matchId: number): Promise<import("../types/statistics.type.js").TeamMatchStats>;
    getPlayerTournamentStats(playerId: number, tournamentId: number): Promise<import("../types/statistics.type.js").PlayerTournamentStats>;
    getPlayerSeasonStats(playerId: number, seasonId: number): Promise<import("../types/statistics.type.js").PlayerSeasonStats>;
    getPlayerMatchStats(playerId: number, matchId: number): Promise<import("../types/statistics.type.js").PlayerMatchStats>;
    getPlayerFinanceStats(seasonId: number): Promise<import("../services/statistics.service.js").SeasonFinanceStats>;
}
//# sourceMappingURL=statistics.controller.d.ts.map