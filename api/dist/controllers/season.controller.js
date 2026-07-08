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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, } from "tsoa";
import { SeasonService } from "../services/season.service.js";
import { StandingsService } from "../services/standing.service.js";
import * as seasonSchema from "../dtos/season.schema.js";
import { buildPlayerStatsQueryRequest, buildStandingsQueryRequest } from "../helper/match.helper.js";
// ─── SeasonController ─────────────────────────────────────────────────────────
// Route: /seasons/*
//
// Auth phân tầng (method-level, không class-level):
//   GET /seasons                          → public (guest)
//   GET /seasons/{id}                     → public
//   GET /seasons/{id}/standings           → public — overview toàn season (World Cup style)
//   GET /seasons/{id}/standings/{groupId} → public — standings chi tiết 1 group
//   GET /seasons/{id}/player-stats        → public
//   GET /seasons/{id}/suspended-players   → public
//   POST / PATCH / DELETE                 → jwt [admin]
//
// Lý do merge SeasonStatsController vào đây:
//   - Cả hai đều dùng @Route("seasons") → 2 class cùng prefix gây nhầm lẫn + tsoa conflict
//   - SeasonStatsController không có Security riêng → class-level jwt của SeasonController
//     sẽ accidentally block các GET standings (public endpoints)
//   - Một prefix = một controller là convention rõ ràng hơn
let SeasonController = class SeasonController extends Controller {
    service;
    standingsService;
    constructor(service, standingsService) {
        super();
        this.service = service;
        this.standingsService = standingsService;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — LIST SEASONS (public)
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * List seasons có thể xem standings.
     * Chỉ trả ongoing / finished / cancelled — loại upcoming và registration_open.
     *
     * Query params:
     *   ?status=ongoing|finished|cancelled  (default: tất cả 3 status)
     *   ?tournamentId=1
     *   ?page=1&per_page=20
     *   ?q=keyword&sort=start_date&direction=desc
     */
    async listSeasons(page = 1, per_page = 20, q, sort, direction, status, tournamentId) {
        return this.standingsService.listSeasons({ status, tournamentId, page, per_page, q, sort, direction });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — SEASON BY ID (public)
    // ═══════════════════════════════════════════════════════════════════════════
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // POST — CREATE (admin only)
    // ═══════════════════════════════════════════════════════════════════════════
    async create(body, req) {
        this.setStatus(201);
        return this.service.create(body, req.user.user_id);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // PATCH — UPDATE (admin only)
    // ═══════════════════════════════════════════════════════════════════════════
    async update(id, body) {
        return this.service.update(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    /**
   * Hủy season. Chỉ hợp lệ khi status hiện tại là upcoming/registration_open/ongoing
   * (theo STATUS_TRANSITIONS). cancel_reason bắt buộc — dùng cho audit/thông báo.
   */
    async cancelSeason(id, body) {
        return this.service.cancel(id, body);
    }
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body.status, { cancel_reason: body.cancel_reason });
    }
    async getGroupStandings(id, groupId, page, per_page, sort, direction) {
        const req = buildStandingsQueryRequest({ page, per_page, sort, direction });
        return this.standingsService.listGroupStandings(groupId, req, id);
    }
    async getPlayerStats(id, teamId, page, per_page, sort, direction) {
        const req = buildPlayerStatsQueryRequest({ teamId, page, per_page, sort, direction });
        return this.standingsService.listPlayerStats(id, req);
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GET — SUSPENDED PLAYERS (public)
    // ═══════════════════════════════════════════════════════════════════════════
    async getSuspendedPlayers(id) {
        return this.standingsService.getSuspendedPlayers(id);
    }
};
__decorate([
    Get(),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "listSeasons", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "findById", null);
__decorate([
    Security("jwt", ["admin"]),
    Post(),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "update", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "softDelete", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/cancel"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "cancelSeason", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/status"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "updateStatus", null);
__decorate([
    Get("{id}/standings/{groupId}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "getGroupStandings", null);
__decorate([
    Get("{id}/player-stats"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "getPlayerStats", null);
__decorate([
    Get("{id}/suspended-players"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonController.prototype, "getSuspendedPlayers", null);
SeasonController = __decorate([
    Route("seasons"),
    Tags("Seasons"),
    __metadata("design:paramtypes", [SeasonService,
        StandingsService])
], SeasonController);
export { SeasonController };
//# sourceMappingURL=season.controller.js.map