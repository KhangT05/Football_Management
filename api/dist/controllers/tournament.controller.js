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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, UploadedFile, FormField } from "tsoa";
import { TournamentService } from "../services/tournament.service.js";
import { storageService } from "../services/storage.service.js";
let TournamentController = class TournamentController extends Controller {
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
    async create(name, description, max_teams, logo, req) {
        this.setStatus(201);
        let logo_url;
        if (logo) {
            const result = await storageService.upload({
                namespace: "tournaments",
                kind: "logo",
                file: logo,
            });
            logo_url = result.url;
        }
        return this.service.create({
            name,
            description,
            logo: logo_url,
            max_teams: parseInt(max_teams, 10),
            is_active: true,
        }, req.user.user_id);
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
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "findAll", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "findById", null);
__decorate([
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, FormField()),
    __param(1, FormField()),
    __param(2, FormField()),
    __param(3, UploadedFile("logo")),
    __param(4, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "create", null);
__decorate([
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "update", null);
__decorate([
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "softDelete", null);
TournamentController = __decorate([
    Security("jwt"),
    Route("tournaments"),
    Tags("Tournaments"),
    __metadata("design:paramtypes", [TournamentService])
], TournamentController);
export { TournamentController };
//# sourceMappingURL=tournament.controller.js.map