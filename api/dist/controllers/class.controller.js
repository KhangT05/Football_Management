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
import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { ClassService } from "../services/class.service.js";
import * as classSchema from "../dtos/class.schema.js";
let ClassController = class ClassController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    list() {
        return this.service.list();
    }
    findById(id) {
        return this.service.getByIdOrFail(id);
    }
    create(body) {
        this.setStatus(201);
        return this.service.create(body);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        await this.service.softDelete(id);
    }
};
__decorate([
    Get("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ClassController.prototype, "list", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassController.prototype, "findById", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("/"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ClassController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ClassController.prototype, "update", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ClassController.prototype, "softDelete", null);
ClassController = __decorate([
    Route("classes"),
    Tags("Classes"),
    __metadata("design:paramtypes", [ClassService])
], ClassController);
export { ClassController };
//# sourceMappingURL=class.controller.js.map