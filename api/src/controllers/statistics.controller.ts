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
import { parseDaysParam } from "../helper/statistics.helper.js";

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
    async getUserRegistrationStats(@Query() days?: number) {
        const parsedDays = parseDaysParam(days);
        return this.statisticsService.getUserRegistrationStats(parsedDays);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // GET — SEASON REVENUE (ADMIN only — dữ liệu tài chính, không public)
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Không @Query season_id → trả tất cả season.
    // Có season_id → trả 1 season (array 1 phần tử, giữ shape đồng nhất).
    @Security("jwt", ["admin"])
    @Get("seasons/revenue")
    async getSeasonRevenue(@Query() season_id?: number) {
        return this.statisticsService.getSeasonRevenue(season_id);
    }

    @Security("jwt", ["admin"])
    @Get("tournaments/{id}/overview")
    async getTournamentOverview(@Path() id: number) {
        return this.statisticsService.getTournamentOverview(id);
    }
    @Security("jwt", ["admin", "organizer"])
    @Get("seasons/{seasonId}/teams/registrations")
    async getTeamRegistrationStats(@Path() seasonId?: number) {
        return this.statisticsService.getTeamRegistrationStats(seasonId);
    }

    @Security("jwt", ["admin", "organizer"])
    @Get("seasons/{seasonId}/top-scorers")
    async getTopScorers(@Path() seasonId: number, @Query() limit?: number) {
        return this.statisticsService.getTopScorers(seasonId, limit ?? 10);
    }

    @Security("jwt", ["admin", "organizer"])
    @Get("seasons/{seasonId}/discipline")
    async getTeamDisciplineStats(@Path() seasonId: number) {
        return this.statisticsService.getTeamDisciplineStats(seasonId);
    }
}