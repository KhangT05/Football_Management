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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Request, Query } from "tsoa";
import { createTournamentRuleSchema, updateTournamentRuleSchema, } from "../dtos/tournamentRule.schema.js";
import { createAppError } from "../common/app.error.js";
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
        const parsed = createTournamentRuleSchema.safeParse(body);
        if (!parsed.success) {
            throw createAppError("VALIDATION_ERROR", parsed.error.issues.map(i => i.message).join("; "));
        }
        this.setStatus(201);
        return this.service.create(parsed.data, req.user.user_id);
    }
    async update(id, body, force) {
        const parsed = updateTournamentRuleSchema.safeParse(body);
        if (!parsed.success) {
            throw createAppError("VALIDATION_ERROR", parsed.error.issues.map(i => i.message).join("; "));
        }
        return this.service.update(id, parsed.data, force ?? false);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    async restore(id) {
        return this.service.restore(id);
    }
    async listByTournament(tournamentId) {
        return this.service.listByTournament(tournamentId);
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
    Security("jwt", ["admin", "organizing"]),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "create", null);
__decorate([
    Patch("{id}"),
    Security("jwt", ["admin", "organizing"]),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Boolean]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "update", null);
__decorate([
    Delete("{id}"),
    Security("jwt", ["admin", "organizing"]),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "softDelete", null);
__decorate([
    Patch("{id}/restore"),
    Security("jwt", ["admin", "organizing"]),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "restore", null);
__decorate([
    Get("tournament/{tournamentId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentRuleController.prototype, "listByTournament", null);
TournamentRuleController = __decorate([
    Route("tournamentrules"),
    Tags("TournamentRules"),
    __metadata("design:paramtypes", [TournamentRuleService])
], TournamentRuleController);
export { TournamentRuleController };
//# sourceMappingURL=tournamentrule.controller.js.map