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
import { Body, Controller, Delete, Get, Patch, Path, Post, Query, Route, Security, SuccessResponse, Tags, Request, } from "tsoa";
import { ArticleService } from "../services/article.service.js";
import * as articleSchema from "../dtos/article.schema.js";
let ArticleController = class ArticleController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    // ─── Article CRUD ──────────────────────────────────────────────────────────
    async findAll(page = 1, per_page = 20, q, sort, direction, status, season_id, match_id, team_id, user_id, tag) {
        return this.service.findAll({
            page,
            per_page,
            q,
            sort,
            direction,
            status,
            season_id,
            match_id,
            team_id,
            user_id,
            tag,
        });
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    async findBySlug(slug) {
        return this.service.findBySlugOrFail(slug);
    }
    async create(body, req) {
        this.setStatus(201);
        return this.service.create(req.user.user_id, body);
    }
    async update(id, body) {
        return this.service.update(id, body);
    }
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body.status);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    // ─── Tags ──────────────────────────────────────────────────────────────────
    /** Distinct tags toàn hệ thống — dùng cho autocomplete */
    async listTags() {
        return this.service.listDistinctTags();
    }
    /** Add 1 tag vào article */
    async addTag(article_id, body) {
        this.setStatus(201);
        return this.service.addTag(article_id, body);
    }
    /** Bulk add nhiều tags vào article — 1 round-trip */
    async bulkAddTags(article_id, body) {
        this.setStatus(201);
        return this.service.bulkAddTags(article_id, body);
    }
    /** Remove 1 tag khỏi article */
    async removeTag(article_id, tag) {
        this.setStatus(204);
        return this.service.removeTag(article_id, tag);
    }
    // ─── Media ─────────────────────────────────────────────────────────────────
    async getMedia(article_id) {
        return this.service.getMedia(article_id);
    }
    /** Add 1 media item — dùng sau khi upload lên Cloudinary */
    async addMedia(article_id, body) {
        this.setStatus(201);
        return this.service.addMedia(article_id, body);
    }
    /** Delete 1 media item */
    async deleteMedia(article_id, media_id) {
        this.setStatus(204);
        return this.service.deleteMedia(article_id, media_id);
    }
    /** Bulk delete media — truyền ids[] */
    async bulkDeleteMedia(article_id, body) {
        return this.service.bulkDeleteMedia(article_id, body);
    }
};
__decorate([
    Security("jwt", ["admin", "organizing", "guest"]),
    Get("/"),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __param(8, Query()),
    __param(9, Query()),
    __param(10, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, String, Number, Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findAll", null);
__decorate([
    Security("jwt", ["admin", "organizing", "guest"]),
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findById", null);
__decorate([
    Security("jwt", ["admin", "organizing", "guest"]),
    Get("slug/{slug}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findBySlug", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "update", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}/status"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "updateStatus", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "softDelete", null);
__decorate([
    Security("jwt", ["admin", "organizing", "guest"]),
    Get("tags"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "listTags", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{article_id}/tags"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "addTag", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{article_id}/tags/bulk"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "bulkAddTags", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Delete("{article_id}/tags/{tag}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "removeTag", null);
__decorate([
    Security("jwt", ["admin", "organizing", "guest"]),
    Get("{article_id}/media"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "getMedia", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Post("{article_id}/media"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "addMedia", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Delete("{article_id}/media/{media_id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "deleteMedia", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Delete("{article_id}/media"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "bulkDeleteMedia", null);
ArticleController = __decorate([
    Route("articles"),
    Tags("Articles"),
    __metadata("design:paramtypes", [ArticleService])
], ArticleController);
export { ArticleController };
//# sourceMappingURL=article.controller.js.map