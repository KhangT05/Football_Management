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
import { LeaveReason } from "../generated/prisma/client.js";
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
    async getTeamOverviewStats(teamId) {
        return this.statisticsService.getTeamOverviewStats(teamId);
    }
    async getTeamMatchTimeSeries(teamId, granularity, period) {
        return this.statisticsService.getTeamMatchTimeSeries(teamId, granularity ?? "month", period);
    }
    async getPlayerOverviewStats(playerId) {
        return this.statisticsService.getPlayerOverviewStats(playerId);
    }
    // ═══════════════════════════════════════════════════════════════════════
    // BỔ SUNG — các method service chưa có route
    // ═══════════════════════════════════════════════════════════════════════
    // Đếm số user mới trong N ngày (khác getUserRegistrationStats ở chỗ
    // đây chỉ trả về 1 số, không bucket theo ngày — dùng cho KPI card).
    async getNewUserCount(period) {
        return this.statisticsService.getNewUserCount(period);
    }
    // Danh sách player hiện không thuộc team nào (free agent).
    async getPlayersWithoutTeam() {
        return this.statisticsService.getPlayersWithoutTeam();
    }
    // Thống kê player rời team, filter theo season/reason — internal reporting.
    async getTeamPlayerLeaveStats(season_id, reason, limit) {
        return this.statisticsService.getTeamPlayerLeaveStats({
            seasonId: season_id,
            reason,
            limit,
        });
    }
    async getTeamTournamentStats(teamId, tournamentId) {
        return this.statisticsService.getTeamTournamentStats(teamId, tournamentId);
    }
    async getTeamSeasonStats(teamId, seasonId) {
        return this.statisticsService.getTeamSeasonStats(teamId, seasonId);
    }
    async getTeamMatchStats(teamId, matchId) {
        return this.statisticsService.getTeamMatchStats(teamId, matchId);
    }
    async getPlayerTournamentStats(playerId, tournamentId) {
        return this.statisticsService.getPlayerTournamentStats(playerId, tournamentId);
    }
    async getPlayerSeasonStats(playerId, seasonId) {
        return this.statisticsService.getPlayerSeasonStats(playerId, seasonId);
    }
    async getPlayerMatchStats(playerId, matchId) {
        return this.statisticsService.getPlayerMatchStats(playerId, matchId);
    }
    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER FINANCE (thưởng/phạt theo season)
    // ═══════════════════════════════════════════════════════════════════════
    async getPlayerFinanceStats(seasonId) {
        return this.statisticsService.getPlayerFinanceStats(seasonId);
    }
    // StatisticsController — thêm vào class hiện có
    // ═══ TEAM V2 (extended: home/away split, streak, biggest win/loss, clean sheets) ═══
    async getTeamOverviewStatsV2(teamId, period) {
        return this.statisticsService.getTeamOverviewStatsV2(teamId, period);
    }
    async getTeamTournamentStatsV2(teamId, tournamentId) {
        return this.statisticsService.getTeamTournamentStatsV2(teamId, tournamentId);
    }
    async getTeamSeasonStatsV2(teamId, seasonId) {
        return this.statisticsService.getTeamSeasonStatsV2(teamId, seasonId);
    }
    // ═══ TEAM — participation & finance ═══
    async getTeamParticipationStats(teamId) {
        return this.statisticsService.getTeamParticipationStats(teamId);
    }
    async getTeamsFinanceStatsBatch(seasonId) {
        return this.statisticsService.getTeamsFinanceStatsBatch(seasonId);
    }
    // Batch team stats 1 season — thay thế N+1 call getTeamSeasonStats cho từng đội.
    async getTeamsSeasonStatsBatch(seasonId) {
        return this.statisticsService.getTeamsSeasonStatsBatch(seasonId);
    }
    // ═══ PLAYER — participation, performance, discipline, teams-in-period ═══
    async getPlayerParticipationStats(playerId) {
        return this.statisticsService.getPlayerParticipationStats(playerId);
    }
    async getPlayersPerformanceStatsBatch(seasonId) {
        return this.statisticsService.getPlayersPerformanceStatsBatch(seasonId);
    }
    async getPlayerDisciplineStatus(playerId, seasonId) {
        return this.statisticsService.getPlayerDisciplineStatus(playerId, seasonId);
    }
    // Assumption: reporting nội bộ (đối soát cầu thủ đổi đội theo khoảng thời gian) — khoá admin.
    async getPlayerTeamsInPeriod(playerId, from, to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            // tsoa không tự validate format ISO cho string query — validate tay ở đây
            this.setStatus(400);
            throw new Error("from/to phải là ISO date string hợp lệ");
        }
        return this.statisticsService.getPlayerTeamsInPeriod(playerId, fromDate, toDate);
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
__decorate([
    Get("teams/{teamId}/overview"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamOverviewStats", null);
__decorate([
    Get("teams/{teamId}/matches/timeseries"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamMatchTimeSeries", null);
__decorate([
    Get("players/{playerId}/overview"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerOverviewStats", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("users/registrations/count"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getNewUserCount", null);
__decorate([
    Get("players/without-team"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayersWithoutTeam", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("players/leaves"),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamPlayerLeaveStats", null);
__decorate([
    Get("teams/{teamId}/tournaments/{tournamentId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamTournamentStats", null);
__decorate([
    Get("teams/{teamId}/seasons/{seasonId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamSeasonStats", null);
__decorate([
    Get("teams/{teamId}/matches/{matchId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamMatchStats", null);
__decorate([
    Get("players/{playerId}/tournaments/{tournamentId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerTournamentStats", null);
__decorate([
    Get("players/{playerId}/seasons/{seasonId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerSeasonStats", null);
__decorate([
    Get("players/{playerId}/matches/{matchId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerMatchStats", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("seasons/{seasonId}/finance"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerFinanceStats", null);
__decorate([
    Get("teams/{teamId}/overview/extended"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamOverviewStatsV2", null);
__decorate([
    Get("teams/{teamId}/tournaments/{tournamentId}/extended"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamTournamentStatsV2", null);
__decorate([
    Get("teams/{teamId}/seasons/{seasonId}/extended"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamSeasonStatsV2", null);
__decorate([
    Get("teams/{teamId}/participations"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamParticipationStats", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("seasons/{seasonId}/teams/finance-batch"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamsFinanceStatsBatch", null);
__decorate([
    Get("seasons/{seasonId}/teams/batch"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getTeamsSeasonStatsBatch", null);
__decorate([
    Get("players/{playerId}/participations"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerParticipationStats", null);
__decorate([
    Get("seasons/{seasonId}/players/performance-batch"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayersPerformanceStatsBatch", null);
__decorate([
    Get("players/{playerId}/seasons/{seasonId}/discipline"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerDisciplineStatus", null);
__decorate([
    Security("jwt", ["admin"]),
    Get("players/{playerId}/teams-in-period"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], StatisticsController.prototype, "getPlayerTeamsInPeriod", null);
StatisticsController = __decorate([
    Route("statistics"),
    Tags("Statistics"),
    __metadata("design:paramtypes", [StatisticsService])
], StatisticsController);
export { StatisticsController };
//# sourceMappingURL=statistics.controller.js.map