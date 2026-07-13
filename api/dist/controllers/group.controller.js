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
import { Controller, Get, Path, Tags, Route, Post, Delete, Body, Security, Put, Query } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
let GroupController = class GroupController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async findAllBySeason(seasonId) {
        return this.service.findAllBySeason(seasonId);
    }
    async findAllByPhase(phaseId) {
        return this.service.findAllByPhase(phaseId);
    }
    async createGroup(seasonId, body) {
        this.setStatus(201);
        return this.service.createGroup(seasonId, body.name);
    }
    /** organizing: tạo N group cùng lúc (Bảng A, B, C...) */
    async createGroupsBulk(seasonId, body) {
        this.setStatus(201);
        return this.service.createGroupsBulk(seasonId, body.count);
    }
    /** organizing: random draw toàn bộ approved team vào group của season */
    async drawGroups(seasonId, body) {
        return this.service.drawGroups(seasonId, body);
    }
    /** organizing: seeded draw theo pot (UEFA-style) */
    async drawGroupsSeeded(seasonId, body) {
        return this.service.drawGroupsSeeded(seasonId, body);
    }
    /** organizing: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    async clearDraw(seasonId) {
        this.setStatus(204);
        return this.service.clearDraw(seasonId);
    }
    /**
     * NEW: organizing có thể chủ động gọi finalize thay vì chờ tự động chạy lúc
     * updateStatus('ongoing') — hữu ích khi muốn xem trước kết quả re-draw
     * hoặc cần chạy lại finalize nhiều lần trong lúc season vẫn còn
     * 'registration_open' (VD: đóng đăng ký sớm bằng tay dù chưa qua
     * deadline, muốn chốt group ngay mà chưa muốn đổi season status).
     * minTeamsPerGroup/maxTeamsPerGroup optional, để FE tuỳ biến theo giải.
     */
    async autoFinalizeGroups(seasonId, body) {
        return this.service.autoFinalizeGroups(seasonId, {
            minTeamsPerGroup: body?.min_teams_per_group,
            maxTeamsPerGroup: body?.max_teams_per_group,
        });
    }
    async findByIdWithTeams(id) {
        return this.service.findByIdWithTeams(id);
    }
    /** organizing: deactivate group (soft-delete, chặn nếu đã có match) */
    async deactivateGroup(groupId) {
        this.setStatus(204);
        return this.service.deactivateGroup(groupId);
    }
    /** organizing: assign thủ công 1 team vào 1 group */
    async assignTeamToGroup(body) {
        this.setStatus(204);
        return this.service.assignTeamToGroup(body.season_team_id, body.group_id);
    }
    /** organizing: swap group giữa 2 team trong cùng phase */
    async swapTeams(body) {
        this.setStatus(204);
        return this.service.swapTeams(body.season_team_id_a, body.season_team_id_b);
    }
    /** Public: preview snake-draft distribution + warning trước khi confirm tạo group */
    async previewGroupSplit(seasonId, groupCount) {
        return this.service.previewGroupSplitBySeason(seasonId, groupCount);
    }
    /** organizing: tạo N group rỗng + draw approved team ngay trong 1 bước */
    async createAndDrawGroups(seasonId, body) {
        this.setStatus(201);
        return this.service.createAndDrawGroups(seasonId, body.group_count);
    }
    /** organizing: advance top-N mỗi group của phase (đã locked) sang round_robin tiếp theo cùng season */
    async advanceToNextRoundRobin(fromPhaseId, body) {
        this.setStatus(201);
        return this.service.advanceToNextRoundRobin(fromPhaseId, body.new_group_count);
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
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroup", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}/bulk"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createGroupsBulk", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}/draw"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroups", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}/draw/seeded"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroupsSeeded", null);
__decorate([
    Security("jwt", ["organizing"]),
    Delete("season/{seasonId}/draw"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "clearDraw", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}/finalize"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "autoFinalizeGroups", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findByIdWithTeams", null);
__decorate([
    Security("jwt", ["organizing"]),
    Delete("{groupId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "deactivateGroup", null);
__decorate([
    Security("jwt", ["organizing"]),
    Put("assign"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "assignTeamToGroup", null);
__decorate([
    Security("jwt", ["organizing"]),
    Put("swap"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "swapTeams", null);
__decorate([
    Get("season/{seasonId}/preview"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "previewGroupSplit", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("season/{seasonId}/create-and-draw"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "createAndDrawGroups", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("phase/{fromPhaseId}/advance"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "advanceToNextRoundRobin", null);
GroupController = __decorate([
    Route("groups"),
    Tags("Groups"),
    __metadata("design:paramtypes", [GroupService])
], GroupController);
export { GroupController };
//# sourceMappingURL=group.controller.js.map