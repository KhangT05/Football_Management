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
    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    async findByIdWithTeams(id) {
        return this.service.findByIdWithTeams(id);
    }
    /** Admin: random draw toàn bộ approved team vào các group của phase */
    async drawGroups(phaseId, body) {
        return this.service.drawGroups(phaseId, body);
    }
    /** Admin: seeded draw theo pot (UEFA-style) */
    async drawGroupsSeeded(phaseId, body) {
        return this.service.drawGroupsSeeded(phaseId, body);
    }
    /** Admin: xoá toàn bộ kết quả draw của phase (reset group_id về null) */
    async clearDraw(phaseId) {
        this.setStatus(204);
        return this.service.clearDraw(phaseId);
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
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "findByIdWithTeams", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{phaseId}/draw"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroups", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("{phaseId}/draw/seeded"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "drawGroupsSeeded", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{phaseId}/draw"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], GroupController.prototype, "clearDraw", null);
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