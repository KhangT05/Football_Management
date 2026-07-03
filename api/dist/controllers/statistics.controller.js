var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Path, Tags, Route, Security, Query, } from "tsoa";
import { StatisticsService } from "../services/statistics.service.js";
import { parseDaysParam } from "../helper/statistics.helper.js";
let StatisticsController = class StatisticsController extends Controller {
    statisticsService;
    constructor(statisticsService) {
        super();
        this.statisticsService = statisticsService;
    }
    async getUserRegistrationStats(days) {
        const parsedDays = parseDaysParam(days);
        return this.statisticsService.getUserRegistrationStats(parsedDays);
    }
    // ═══════════════════════════════════════════════════════════════════════
    // GET — SEASON REVENUE (ADMIN only — dữ liệu tài chính, không public)
    // ═══════════════════════════════════════════════════════════════════════
    //
    // Không @Query season_id → trả tất cả season.
    // Có season_id → trả 1 season (array 1 phần tử, giữ shape đồng nhất).
    async getSeasonRevenue(season_id) {
        return this.statisticsService.getSeasonRevenue(season_id);
    }
    async getTournamentOverview(id) {
        return this.statisticsService.getTournamentOverview(id);
    }
    async getTeamRegistrationStats(seasonId) {
        return this.statisticsService.getTeamRegistrationStats(seasonId);
    }
    async getTopScorers(seasonId, limit) {
        return this.statisticsService.getTopScorers(seasonId, limit ?? 10);
    }
    async getTeamDisciplineStats(seasonId) {
        return this.statisticsService.getTeamDisciplineStats(seasonId);
    }
};
__decorate([
    Security("jwt", ["admin"]),
    Get("users/registrations"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getUserRegistrationStats", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("seasons/revenue"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getSeasonRevenue", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("tournaments/{id}/overview"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTournamentOverview", null);
__decorate([
    Security("jwt", ["admin", "organizer"]),
    Get("seasons/{seasonId}/teams/registrations"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamRegistrationStats", null);
__decorate([
    Security("jwt", ["admin", "organizer"]),
    Get("seasons/{seasonId}/top-scorers"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopScorers", null);
__decorate([
    Security("jwt", ["admin", "organizer"]),
    Get("seasons/{seasonId}/discipline"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamDisciplineStats", null);
StatisticsController = __decorate([
    Route("statistics"),
    Tags("Statistics"),
    __metadata("design:paramtypes", [StatisticsService])
], StatisticsController);
export { StatisticsController };
//# sourceMappingURL=statistics.controller.js.map