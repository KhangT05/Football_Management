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
// controllers/match-lineup.controller.ts
import { Controller, Path, Tags, Route, Post, Patch, Delete, Body, SuccessResponse, Security, Get, } from "tsoa";
import { MatchLineupService } from "../services/matchlineup.service.js";
// ─── Controller ───────────────────────────────────────────────────────────────
// Route: /matches/:id/lineups
//
// Auth:
//   GET                  → public (guest)
//   POST (register)      → jwt [admin, leader]  — đăng ký lineup cho team, trước 1h
//   PATCH (update entry) → jwt [admin]           — sửa từng entry, trước 10p
//   DELETE (remove)      → jwt [admin]           — xóa entry, trước 10p
//
// Time guards enforce tại service layer.
// team_id ownership (leader chỉ được register cho team mình) → middleware/guard ngoài controller.
let MatchLineupController = class MatchLineupController extends Controller {
    lineupService;
    constructor(lineupService) {
        super();
        this.lineupService = lineupService;
    }
    // ─── Read ─────────────────────────────────────────────────────────────────
    /**
     * Lấy toàn bộ lineup của trận — cả 2 team.
     */
    async getLineups(matchId) {
        return this.lineupService.getByMatch(matchId);
    }
    /**
     * Lấy lineup của 1 team trong trận.
     */
    async getTeamLineup(matchId, teamId) {
        return this.lineupService.getByTeam(matchId, teamId);
    }
    // ─── Register ─────────────────────────────────────────────────────────────
    /**
     * Đăng ký lineup cho team — bulk replace, idempotent.
     * Chỉ được gọi trước giờ thi đấu ít nhất 1 giờ.
     * Admin: bất kỳ team nào.
     * Leader: chỉ team của mình (ownership check tại middleware).
     */
    async registerLineup(matchId, body) {
        return this.lineupService.register({ ...body, match_id: matchId });
    }
    // ─── Update ───────────────────────────────────────────────────────────────
    /**
     * Sửa 1 player entry trong lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    async updateLineupEntry(matchId, teamId, playerId, body) {
        return this.lineupService.updateEntry({
            ...body,
            match_id: matchId,
            team_id: teamId,
            player_id: playerId,
        });
    }
    // ─── Delete ───────────────────────────────────────────────────────────────
    /**
     * Xóa 1 player khỏi lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    async removeLineupEntry(matchId, teamId, playerId) {
        this.setStatus(204);
        return this.lineupService.removeEntry(matchId, teamId, playerId);
    }
};
__decorate([
    Get("{matchId}/lineups"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchLineupController.prototype, "getLineups", null);
__decorate([
    Get("{matchId}/lineups/teams/{teamId}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MatchLineupController.prototype, "getTeamLineup", null);
__decorate([
    Security("jwt", ["admin", "leader"]),
    Post("{matchId}/lineups"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchLineupController.prototype, "registerLineup", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{matchId}/lineups/teams/{teamId}/players/{playerId}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Path()),
    __param(3, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Object]),
    __metadata("design:returntype", Promise)
], MatchLineupController.prototype, "updateLineupEntry", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{matchId}/lineups/teams/{teamId}/players/{playerId}"),
    SuccessResponse(204, "Removed"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], MatchLineupController.prototype, "removeLineupEntry", null);
MatchLineupController = __decorate([
    Route("matches"),
    Tags("Match Lineup"),
    __metadata("design:paramtypes", [MatchLineupService])
], MatchLineupController);
export { MatchLineupController };
//# sourceMappingURL=matchlineup.controller.js.map