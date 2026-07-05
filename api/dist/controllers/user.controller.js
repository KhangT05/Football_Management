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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security } from "tsoa";
import { UserService } from "../services/user.service.js";
import { createAppError } from "../common/app.error.js";
let UserController = class UserController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async lookupByEmail(email) {
        const user = await this.service.findSafeByEmail(email);
        if (!user)
            throw createAppError("NOT_FOUND", `User with email ${email} not found`);
        return user;
    }
    async findAll(page = 1, per_page = 20, q, sort, direction) {
        return this.service.findAll({ page, per_page, q, sort, direction });
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    async create(body) {
        this.setStatus(201);
        return this.service.create(body);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    async restore(id) {
        return this.service.restore(id);
    }
};
__decorate([
    Get("lookup"),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "lookupByEmail", null);
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
], UserController.prototype, "findAll", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
__decorate([
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "softDelete", null);
__decorate([
    Patch("{id}/restore"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "restore", null);
UserController = __decorate([
    Security("jwt", ["admin", "user", "organizing"]),
    Route("users"),
    Tags("Users"),
    __metadata("design:paramtypes", [UserService])
], UserController);
export { UserController };
//# sourceMappingURL=user.controller.js.map