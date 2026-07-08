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
let StatisticsController = class StatisticsController extends Controller {
    statisticsService;
    constructor(statisticsService) {
        super();
        this.statisticsService = statisticsService;
    }
    async getUserRegistrationStats(period) {
        return this.statisticsService.getUserRegistrationStats(period);
    }
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
    async getTopAssists(seasonId, limit) {
        return this.statisticsService.getPlayerRanking(seasonId, "assists", limit ?? 10);
    }
    async getTopYellowCards(seasonId, limit) {
        return this.statisticsService.getPlayerRanking(seasonId, "yellow_cards", limit ?? 10);
    }
    async getTopRedCards(seasonId, limit) {
        return this.statisticsService.getPlayerRanking(seasonId, "red_cards", limit ?? 10);
    }
    async getBestPlayers(seasonId, limit) {
        return this.statisticsService.getBestPlayers(seasonId, limit ?? 10);
    }
    async getPlayerCareerStats(playerId) {
        return this.statisticsService.getPlayerCareerStats(playerId);
    }
    async getSystemOverviewStats(period) {
        return this.statisticsService.getSystemOverviewStats(period);
    }
};
__decorate([
    Security("jwt", ["admin"]),
    Get("users/registrations"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getUserRegistrationStats", null);
__decorate([
    Get("seasons/revenue"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getSeasonRevenue", null);
__decorate([
    Get("tournaments/{id}/overview"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTournamentOverview", null);
__decorate([
    Get("seasons/{seasonId}/teams/registrations"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamRegistrationStats", null);
__decorate([
    Get("seasons/{seasonId}/top-scorers"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopScorers", null);
__decorate([
    Get("seasons/{seasonId}/discipline"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamDisciplineStats", null);
__decorate([
    Get("seasons/{seasonId}/top-assists"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopAssists", null);
__decorate([
    Get("seasons/{seasonId}/top-yellow-cards"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopYellowCards", null);
__decorate([
    Get("seasons/{seasonId}/top-red-cards"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTopRedCards", null);
__decorate([
    Get("seasons/{seasonId}/best-players"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getBestPlayers", null);
__decorate([
    Get("players/{playerId}/career"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerCareerStats", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("overview"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getSystemOverviewStats", null);
StatisticsController = __decorate([
    Route("statistics"),
    Tags("Statistics"),
    __metadata("design:paramtypes", [StatisticsService])
], StatisticsController);
export { StatisticsController };
//# sourceMappingURL=statistics.controller.js.map