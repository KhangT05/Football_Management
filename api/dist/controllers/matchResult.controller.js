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
import { Controller, Get, Path, Tags, Route, Post, Body, Security, Query, } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import { StandingsService } from "../services/standing.service.js";
import * as matchResultType from "../types/matchResult.type.js";
import { buildMatchEventsQueryRequest, buildPlayerStatsQueryRequest, buildStandingsQueryRequest } from "../helper/match.helper.js";
let MatchResultController = class MatchResultController extends Controller {
    matchResultService;
    constructor(matchResultService) {
        super();
        this.matchResultService = matchResultService;
    }
    async getMatchResult(id) {
        const result = await this.matchResultService.getMatchResult(id);
        return result;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — MATCH EVENTS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List events của 1 trận.
     *
     * Query params:
     *   Simple filters: ?type=goal&period=first_half
     *   Pagination: ?page=1&per_page=30
     *   Sort: ?sort=minute&direction=asc
     *   Search: ?q=keyword (if searchFields enabled)
     */
    async getMatchEvents(id, type, period, page, per_page, sort, direction, q) {
        // Build QueryRequest từ parsed query params
        const req = buildMatchEventsQueryRequest({
            type,
            period,
            page,
            per_page,
            sort,
            direction,
            q,
        });
        // Service gọi queryable.run(req)
        const result = await this.matchResultService.listMatchEvents(id, req);
        return result;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — MATCH PLAYER STATS (public, không pagination)
    // ═══════════════════════════════════════════════════════════════════════════
    async getMatchPlayerStats(id) {
        const stats = await this.matchResultService.getMatchPlayerStats(id);
        return stats;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // POST — CONFIRM RESULT (require auth)
    // ═══════════════════════════════════════════════════════════════════════════
    async confirmResult(id, body) {
        const result = await this.matchResultService.confirmResult(id, body.input, body.scheduleOptions);
        this.setStatus(201);
        return result;
    }
};
__decorate([
    Get("{id}/result"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchResult", null);
__decorate([
    Get("{id}/events"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchEvents", null);
__decorate([
    Get("{id}/result/stats"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchPlayerStats", null);
__decorate([
    Security("jwt"),
    Post("{id}/result/confirm"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "confirmResult", null);
MatchResultController = __decorate([
    Route("matches"),
    Tags("Match Result"),
    __metadata("design:paramtypes", [MatchResultService])
], MatchResultController);
export { MatchResultController };
// ─── Season-level controllers ─────────────────────────────────────────────────
let SeasonStatsController = class SeasonStatsController extends Controller {
    standingsService;
    constructor(standingsService) {
        super();
        this.standingsService = standingsService;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — STANDINGS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Bảng xếp hạng của season.
     *
     * Query params:
     *   ?groupId=1 (filter by group)
     *   ?page=1&per_page=20 (pagination)
     *   ?sort=position&direction=asc (sort)
     */
    async getStandings(seasonId, groupId, page, per_page, sort, direction) {
        const req = buildStandingsQueryRequest({
            groupId,
            page,
            per_page,
            sort,
            direction,
        });
        const result = await this.standingsService.listStandings(seasonId, req);
        return result;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — PLAYER STATS (paginated)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Thống kê cầu thủ trong season.
     *
     * Query params:
     *   ?teamId=1 (filter by team)
     *   ?page=1&per_page=20
     *   ?sort=goals_scored&direction=desc
     */
    async getPlayerStats(seasonId, teamId, page, per_page, sort, direction) {
        const req = buildPlayerStatsQueryRequest({
            teamId,
            page,
            per_page,
            sort,
            direction,
        });
        const result = await this.standingsService.listPlayerStats(seasonId, req);
        return result;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — SUSPENDED PLAYERS (public)
    // ═══════════════════════════════════════════════════════════════════════════
    async getSuspendedPlayers(seasonId) {
        const players = await this.standingsService.getSuspendedPlayers(seasonId);
        return players;
    }
};
__decorate([
    Get("{seasonId}/standings"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SeasonStatsController.prototype, "getStandings", null);
__decorate([
    Get("{seasonId}/player-stats"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SeasonStatsController.prototype, "getPlayerStats", null);
__decorate([
    Get("{seasonId}/suspended-players"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonStatsController.prototype, "getSuspendedPlayers", null);
SeasonStatsController = __decorate([
    Route("seasons"),
    Tags("Standings & Player Stats"),
    __metadata("design:paramtypes", [StandingsService])
], SeasonStatsController);
export { SeasonStatsController };
//# sourceMappingURL=matchResult.controller.js.map