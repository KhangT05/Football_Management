import { Controller } from "tsoa";
import { StatisticsService } from "../services/statistics.service.js";
import { LeaveReason } from "../generated/prisma/client.js";
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
    getNewUserCount(period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y"): Promise<number>;
    getPlayersWithoutTeam(): Promise<import("../types/statistics.type.js").PlayersWithoutTeamStats>;
    getTeamPlayerLeaveStats(season_id?: number, reason?: LeaveReason, limit?: number): Promise<import("../types/statistics.type.js").TeamPlayerLeaveStats>;
    getTeamTournamentStats(teamId: number, tournamentId: number): Promise<import("../types/statistics.type.js").TeamTournamentStats>;
    getTeamSeasonStats(teamId: number, seasonId: number): Promise<import("../types/statistics.type.js").TeamSeasonStats>;
    getTeamMatchStats(teamId: number, matchId: number): Promise<import("../types/statistics.type.js").TeamMatchStats>;
    getPlayerTournamentStats(playerId: number, tournamentId: number): Promise<import("../types/statistics.type.js").PlayerTournamentStats>;
    getPlayerSeasonStats(playerId: number, seasonId: number): Promise<import("../types/statistics.type.js").PlayerSeasonStats>;
    getPlayerMatchStats(playerId: number, matchId: number): Promise<import("../types/statistics.type.js").PlayerMatchStats>;
    getPlayerFinanceStats(seasonId: number): Promise<import("../services/statistics.service.js").SeasonFinanceStats>;
    getTeamOverviewStatsV2(teamId: number, period?: "7d" | "30d" | "90d" | "3m" | "6m" | "1y"): Promise<import("../types/statistics.type.js").TeamOverviewStats & {
        extended: import("../types/statistics.type.js").TeamAggregateStatsExtended;
    }>;
    getTeamTournamentStatsV2(teamId: number, tournamentId: number): Promise<import("../types/statistics.type.js").TeamAggregateStatsBase & {
        team_id: number;
        team_name: string;
        tournament_id: number;
        tournament_name: string;
        season_count: number;
        seasons: {
            season_id: number;
            season_name: string;
        }[];
    } & {
        extended: import("../types/statistics.type.js").TeamAggregateStatsExtended;
    }>;
    getTeamSeasonStatsV2(teamId: number, seasonId: number): Promise<import("../types/statistics.type.js").TeamAggregateStatsBase & {
        team_id: number;
        team_name: string;
        season_id: number;
        season_name: string;
        tournament_id: number;
        tournament_name: string;
        group_name: string | null;
    } & {
        extended: import("../types/statistics.type.js").TeamAggregateStatsExtended;
    }>;
    getTeamParticipationStats(teamId: number): Promise<import("../types/statistics.type.js").TeamParticipationStats>;
    getTeamsFinanceStatsBatch(seasonId: number): Promise<{
        season_id: number;
        teams: import("../types/statistics.type.js").TeamFinanceEntry[];
    }>;
    getTeamsSeasonStatsBatch(seasonId: number): Promise<import("../types/statistics.type.js").TeamSeasonStatsBatch>;
    getPlayerParticipationStats(playerId: number): Promise<import("../types/statistics.type.js").PlayerParticipationStats>;
    getPlayersPerformanceStatsBatch(seasonId: number): Promise<{
        season_id: number;
        players: import("../types/statistics.type.js").PlayerPerformanceBatchEntry[];
    }>;
    getPlayerDisciplineStatus(playerId: number, seasonId: number): Promise<import("../types/statistics.type.js").PlayerDisciplineStatus>;
    getPlayerTeamsInPeriod(playerId: number, from: string, to: string): Promise<import("../types/statistics.type.js").PlayerTeamsInPeriodStats>;
    getTeamFinanceStats(teamId: number, season_id: number): Promise<import("../types/statistics.type.js").TeamFinanceEntry>;
}
//# sourceMappingURL=statistics.controller.d.ts.map