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
import { Controller, Get, Path, Tags, Route, Post, Delete, Body, Security, Put } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
let GroupController = class GroupController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    // ---- literal-prefixed routes trước, tránh nhầm lẫn với {id} single-segment ----
    /** Public: list group của season — service tự resolve phase round_robin active, không tự tạo */
    async findAllBySeason(seasonId) {
        return this.service.findAllBySeason(seasonId);
    }
    /**
     * Public: list group theo phase cụ thể — dùng khi FE đã biết phaseId
     * (VD sau khi tạo phase mới, hoặc UI quản lý nhiều phase cùng season).
     * FIX: trước đây gọi nhầm findAllBySeason(phaseId) — sai semantic,
     * vì findAllBySeason filter theo season_id + format + is_active,
     * không phải theo phase_id trực tiếp. Nếu 1 season có >1 active
     * round_robin phase (multi-phase-with-groups), route này sẽ trả sai
     * data. Tách hẳn method riêng trong service.
     */
    async findAllByPhase(phaseId) {
        return this.service.findAllByPhase(phaseId);
    }
    // ---- admin creation/draw ops: scope theo seasonId, service tự get-or-create phase ----
    /** Admin: tạo 1 group — service tự get-or-create phase round_robin của season */
    async createGroup(seasonId, body) {
        this.setStatus(201);
        return this.service.createGroup(seasonId, body.name);
    }
    /** Admin: tạo N group cùng lúc (Bảng A, B, C...) */
    async createGroupsBulk(seasonId, body) {
        this.setStatus(201);
        return this.service.createGroupsBulk(seasonId, body.count);
    }
    /** Admin: random draw toàn bộ approved team vào group của season */
    async drawGroups(seasonId, body) {
        return this.service.drawGroups(seasonId, body);
    }
    /** Admin: seeded draw theo pot (UEFA-style) */
    async drawGroupsSeeded(seasonId, body) {
        return this.service.drawGroupsSeeded(seasonId, body);
    }
    /** Admin: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    async clearDraw(seasonId) {
        this.setStatus(204);
        return this.service.clearDraw(seasonId);
    }
    // ---- group/team-scoped (single-segment {id} — luôn khai báo SAU các route literal-prefixed ở trên) ----
    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    async findByIdWithTeams(id) {
        return this.service.findByIdWithTeams(id);
    }
    /** Admin: deactivate group (soft-delete, chặn nếu đã có match) */
    async deactivateGroup(groupId) {
        this.setStatus(204);
        return this.service.deactivateGroup(groupId);
    }
    /** Admin: assign thủ công 1 team vào 1 group */
    async assignTeamToGroup(body) {
        this.setStatus(204);
        return this.service.assignTeamToGroup(body.season_team_id, body.group_id);
    }
    /** Admin: swap group giữa 2 team trong cùng phase */
    async swapTeams(body) {
        this.setStatus(204);
        return this.service.swapTeams(body.season_team_id_a, body.season_team_id_b);
    }
};
__decorate([
    Get("season/{seasonId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findAllBySeason", null);
__decorate([
    Get("phase/{phaseId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findAllByPhase", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("season/{seasonId}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("season/{seasonId}/bulk"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroupsBulk", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("season/{seasonId}/draw"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroups", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("season/{seasonId}/draw/seeded"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroupsSeeded", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("season/{seasonId}/draw"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "clearDraw", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findByIdWithTeams", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{groupId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deactivateGroup", null);
__decorate([
    Security("jwt", ["admin"]),
    Put("assign"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "assignTeamToGroup", null);
__decorate([
    Security("jwt", ["admin"]),
    Put("swap"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "swapTeams", null);
GroupController = __decorate([
    Route("groups"),
    Tags("Groups"),
    __metadata("design:paramtypes", [GroupService])
], GroupController);
export { GroupController };
//# sourceMappingURL=group.controller.js.map