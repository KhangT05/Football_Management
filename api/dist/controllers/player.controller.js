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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, UploadedFile, Consumes } from "tsoa";
import { PlayerService } from "../services/player.service.js";
const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
let PlayerController = class PlayerController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async findById(id) {
        return this.service.getPlayerByIdOrFail(id);
    }
    async create(body) {
        this.setStatus(201);
        return this.service.createPlayer(body);
    }
    async update(id, body) {
        return this.service.updatePlayer(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDeletePlayer(id);
    }
    // ─── Team Players ─────────────────────────────────────────────────────────
    async listTeamPlayers(team_id, page = 1, per_page = 20, sort, direction, position, status, approval_status) {
        return this.service.listTeamPlayers({
            team_id,
            page,
            per_page,
            sort,
            direction,
            ...(position && { position }),
            ...(status && { status }),
            ...(approval_status && { approval_status }),
        });
    }
    async getTeamPlayer(team_id, id) {
        const tp = await this.service.getTeamPlayerById(id, team_id);
        if (!tp) {
            this.setStatus(404);
            throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
        }
        return tp;
    }
    // FIX: bỏ user_id — chưa từng được dùng trong body, AuthRequest param là dead
    // param. Nếu cần audit "ai thêm player này", thêm cột created_by ở service,
    // không giữ param không dùng ở controller.
    async addPlayerToTeam(team_id, body) {
        this.setStatus(201);
        return this.service.addPlayerToTeam(team_id, body);
    }
    // FIX: bỏ pre-check getTeamPlayerById ở controller — TOCTOU + fragile
    // (an toàn phụ thuộc discipline của caller, không phải data layer).
    // service.updateTeamPlayer giờ tự scope theo team_id và tự 404.
    async updateTeamPlayer(team_id, id, body) {
        return this.service.updateTeamPlayer(id, team_id, body);
    }
    async approveTeamPlayer(team_id, id) {
        return this.service.approveTeamPlayer(id, team_id);
    }
    async rejectTeamPlayer(team_id, id) {
        return this.service.rejectTeamPlayer(id, team_id);
    }
    async bulkDeleteTeamPlayers(team_id, body) {
        return this.service.bulkDeleteTeamPlayers(team_id, body);
    }
    // ─── Excel ────────────────────────────────────────────────────────────────
    // FIX: thiếu @Security hoàn toàn — leak PII (email) không cần auth.
    async exportTeamPlayers(team_id) {
        const buffer = await this.service.exportTeamPlayersExcel(team_id);
        const res = this.res;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="team-${team_id}-players.xlsx"`);
        res.send(buffer);
    }
    // Không có PII, chỉ template rỗng — giữ public để leader tải mà không cần login trước.
    async downloadImportTemplate(minRows = 7) {
        const buffer = this.service.exportImportTemplate(minRows);
        const res = this.res;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="import-template.xlsx"');
        res.send(buffer);
    }
    // FIX: thiếu @Security hoàn toàn — bất kỳ ai cũng bulk-tạo Player/TeamPlayer
    // + gán role vào bất kỳ team_id nào không cần auth. Đây là lỗ hổng nghiêm
    // trọng nhất trong file, không phải cosmetic.
    async importTeamPlayers(team_id, file) {
        if (!file || file.size === 0) {
            this.setStatus(400);
            throw Object.assign(new Error("File is required"), { status: 400 });
        }
        if (file.size > MAX_IMPORT_FILE_BYTES) {
            this.setStatus(413);
            throw Object.assign(new Error(`File too large (max ${MAX_IMPORT_FILE_BYTES / 1024 / 1024}MB)`), { status: 413 });
        }
        return this.service.importTeamPlayersFromExcel(team_id, file.buffer);
    }
};
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "findById", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "update", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "softDelete", null);
__decorate([
    Get("{team_id}/team-players"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "listTeamPlayers", null);
__decorate([
    Get("{team_id}/team-players/{id}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{team_id}/team-players"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addPlayerToTeam", null);
__decorate([
    Security("jwt", ["organizing"]),
    Patch("{team_id}/team-players/{id}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{team_id}/team-players/{id}/approve"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "approveTeamPlayer", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("{team_id}/team-players/{id}/reject"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "rejectTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Delete("{team_id}/team-players"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "bulkDeleteTeamPlayers", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Get("{team_id}/team-players/export"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "exportTeamPlayers", null);
__decorate([
    Get("import-template"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "downloadImportTemplate", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{team_id}/team-players/import"),
    Consumes("multipart/form-data"),
    __param(0, Path()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "importTeamPlayers", null);
PlayerController = __decorate([
    Route("players"),
    Tags("Players"),
    __metadata("design:paramtypes", [PlayerService])
], PlayerController);
export { PlayerController };
//# sourceMappingURL=player.controller.js.map