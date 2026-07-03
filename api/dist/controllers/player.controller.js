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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, UploadedFile, Consumes } from "tsoa";
import { PlayerService } from "../services/player.service.js";
const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024; // 5MB
let PlayerController = class PlayerController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    // ─── Player CRUD ──────────────────────────────────────────────────────────
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
    async addPlayerToTeam(team_id, body, req) {
        this.setStatus(201);
        return this.service.addPlayerToTeam(team_id, body, req.user.user_id);
    }
    async updateTeamPlayer(team_id, id, body) {
        const exists = await this.service.getTeamPlayerById(id, team_id);
        if (!exists) {
            this.setStatus(404);
            throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
        }
        return this.service.updateTeamPlayer(id, body);
    }
    async approveTeamPlayer(team_id, id) {
        const exists = await this.service.getTeamPlayerById(id, team_id);
        if (!exists) {
            this.setStatus(404);
            throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
        }
        return this.service.approveTeamPlayer(id);
    }
    async rejectTeamPlayer(team_id, id) {
        const exists = await this.service.getTeamPlayerById(id, team_id);
        if (!exists) {
            this.setStatus(404);
            throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
        }
        return this.service.rejectTeamPlayer(id);
    }
    async bulkDeleteTeamPlayers(team_id, body) {
        return this.service.bulkDeleteTeamPlayers(team_id, body);
    }
    // ─── Excel ────────────────────────────────────────────────────────────────
    async exportTeamPlayers(team_id) {
        const buffer = await this.service.exportTeamPlayersExcel(team_id);
        const res = this.res;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename="team-${team_id}-players.xlsx"`);
        res.send(buffer);
    }
    async downloadImportTemplate(minRows = 7) {
        const buffer = this.service.exportImportTemplate(minRows);
        const res = this.res;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", 'attachment; filename="import-template.xlsx"');
        res.send(buffer);
    }
    // FIX: endpoint import trước đây thiếu hoàn toàn — service.importTeamPlayersFromExcel()
    // không có route nào gọi tới, flow import không thể trigger qua API.
    async importTeamPlayers(team_id, file) {
        if (!file || file.size === 0) {
            this.setStatus(400);
            throw Object.assign(new Error("File is required"), { status: 400 });
        }
        // Guard trước khi vào XLSX.read (đồng bộ, block CPU) — reject sớm file quá khổ.
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
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "create", null);
__decorate([
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "update", null);
__decorate([
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
    Post("{team_id}/team-players"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addPlayerToTeam", null);
__decorate([
    Patch("{team_id}/team-players/{id}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateTeamPlayer", null);
__decorate([
    Post("{team_id}/team-players/{id}/approve"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "approveTeamPlayer", null);
__decorate([
    Post("{team_id}/team-players/{id}/reject"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "rejectTeamPlayer", null);
__decorate([
    Delete("{team_id}/team-players"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "bulkDeleteTeamPlayers", null);
__decorate([
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
    Post("{team_id}/team-players/import"),
    Consumes("multipart/form-data"),
    __param(0, Path()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "importTeamPlayers", null);
PlayerController = __decorate([
    Security("jwt", ["admin", "user", "organizing", "guest"]),
    Route("players"),
    Tags("Players"),
    __metadata("design:paramtypes", [PlayerService])
], PlayerController);
export { PlayerController };
//# sourceMappingURL=player.controller.js.map