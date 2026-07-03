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
import * as tsoa from "tsoa";
import { TeamService } from "../services/team.service.js";
import { storageService } from "../services/storage.service.js";
let TeamController = class TeamController extends tsoa.Controller {
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
    async create(name, req, coach_name, description, logo) {
        this.setStatus(201);
        let logo_url;
        if (logo) {
            const result = await storageService.upload({
                namespace: "teams",
                kind: "logo",
                file: logo,
            });
            logo_url = result.url; // lưu URL, accept publicId leak khi update
        }
        return this.service.create({ name, coach_name, description, logo: logo_url }, req.user.user_id);
    }
    async update(id, name, coach_name, description, logoFile) {
        let logo;
        if (logoFile) {
            const result = await storageService.upload({
                namespace: "teams",
                kind: "logo",
                file: logoFile,
            });
            logo = result.url;
        }
        return this.service.update(id, {
            ...(name !== undefined && { name }),
            ...(coach_name !== undefined && { coach_name }),
            ...(description !== undefined && { description }),
            ...(logo !== undefined && { logo }),
        });
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    // GET  /teams/{id}/captain
    async getCaptain(id) {
        await this.service.findByIdOrFail(id); // validate team exists
        return this.service.getCaptain(id);
    }
    async restore(id) {
        return this.service.restore(id);
    }
};
__decorate([
    tsoa.Get("/"),
    __param(0, tsoa.Query()),
    __param(1, tsoa.Query()),
    __param(2, tsoa.Query()),
    __param(3, tsoa.Query()),
    __param(4, tsoa.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findAll", null);
__decorate([
    tsoa.Get("{id}"),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findById", null);
__decorate([
    tsoa.Post("/"),
    tsoa.SuccessResponse(201, "Created"),
    __param(0, tsoa.FormField()),
    __param(1, tsoa.Request()),
    __param(2, tsoa.FormField()),
    __param(3, tsoa.FormField()),
    __param(4, tsoa.UploadedFile("logo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "create", null);
__decorate([
    tsoa.Patch("{id}"),
    __param(0, tsoa.Path()),
    __param(1, tsoa.FormField()),
    __param(2, tsoa.FormField()),
    __param(3, tsoa.FormField()),
    __param(4, tsoa.UploadedFile("logo")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "update", null);
__decorate([
    tsoa.Delete("{id}"),
    tsoa.SuccessResponse(204, "Deleted"),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "softDelete", null);
__decorate([
    tsoa.Get("{id}/captain"),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getCaptain", null);
__decorate([
    tsoa.Security("jwt", ["admin", "organizing"]) // override: guest/user không được restore
    ,
    tsoa.Patch("{id}/restore"),
    tsoa.SuccessResponse(200, "OK"),
    __param(0, tsoa.Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "restore", null);
TeamController = __decorate([
    tsoa.Security("jwt", ["admin", "user", "organizing", "guest"]),
    tsoa.Route("teams"),
    tsoa.Tags("Teams"),
    __metadata("design:paramtypes", [TeamService])
], TeamController);
export { TeamController };
//# sourceMappingURL=team.controller.js.map