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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Request } from "tsoa";
import { TournamentRuleService } from "../services/tournamentRule.service.js";
let TournamentRuleController = class TournamentRuleController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async findAll() {
        return this.service.findAll();
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    async create(body, req) {
        this.setStatus(201);
        return this.service.create(body, req.user.user_id);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
};
__decorate([
    Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "findAll", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "findById", null);
__decorate([
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "create", null);
__decorate([
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "update", null);
__decorate([
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "softDelete", null);
TournamentRuleController = __decorate([
    Security("jwt", ["admin", "user", "organizing", "guest"]),
    Route("tournamentrules"),
    Tags("TournamentRules"),
    __metadata("design:paramtypes", [TournamentRuleService])
], TournamentRuleController);
export { TournamentRuleController };
//# sourceMappingURL=tournamentrule.controller.js.map