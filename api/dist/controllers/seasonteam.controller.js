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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
let SeasonTeamController = class SeasonTeamController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async findAll(page = 1, per_page = 20, q, sort, direction) {
        return this.service.findAll({ page, per_page, q, sort, direction });
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    /** Team leader tự đăng ký vào season */
    async selfRegister(body, req) {
        this.setStatus(201);
        return this.service.selfRegister(body, req.user.user_id);
    }
    /** Admin add team trực tiếp */
    async adminAdd(body, req) {
        this.setStatus(201);
        return this.service.adminAdd(body, req.user.user_id);
    }
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body);
    }
    /** Assign team vào group sau draw */
    async assignGroup(id, body) {
        return this.service.assignGroup(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
};
__decorate([
    Get("/"),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "findAll", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "findById", null);
__decorate([
    Security("jwt", ["leader"]),
    Post("/register"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "selfRegister", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "adminAdd", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/status"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "updateStatus", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/group"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "assignGroup", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "softDelete", null);
SeasonTeamController = __decorate([
    Security("jwt", ['admin']),
    Route("seasonteams"),
    Tags("SeasonTeams"),
    __metadata("design:paramtypes", [SeasonTeamService])
], SeasonTeamController);
export { SeasonTeamController };
//# sourceMappingURL=seasonteam.controller.js.map