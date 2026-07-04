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
}
//# sourceMappingURL=statistics.controller.d.ts.map