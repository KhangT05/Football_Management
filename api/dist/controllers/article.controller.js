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
import { Body, Controller, Delete, FormField, Get, Patch, Path, Post, Query, Route, Security, SuccessResponse, Tags, Request, UploadedFile, } from "tsoa";
import { ArticleService } from "../services/article.service.js";
import * as articleSchema from "../dtos/article.schema.js";
let ArticleController = class ArticleController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async findAll(page = 1, per_page = 20, q, sort, direction, status, season_id, match_id, team_id, user_id, tag) {
        return this.service.findAll({
            page, per_page, q, sort, direction, status,
            season_id, match_id, team_id, user_id, tag,
        });
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    async findBySlug(slug) {
        return this.service.findBySlugOrFail(slug);
    }
    /**
     * Tạo article kèm upload cover_image (multipart/form-data).
     * tags/media gửi dạng JSON string trong form field.
     */
    async create(req, title, slug, content, status, season_id, match_id, team_id, published_at, tags, media, coverFile) {
        const dto = articleSchema.createArticleSchema.parse({
            title,
            slug,
            content,
            status,
            season_id: season_id ? Number(season_id) : undefined,
            match_id: match_id ? Number(match_id) : undefined,
            team_id: team_id ? Number(team_id) : undefined,
            published_at,
            tags: tags ? JSON.parse(tags) : undefined,
            media: media ? JSON.parse(media) : undefined,
        });
        this.setStatus(201);
        return this.service.create(req.user.user_id, dto, coverFile);
    }
    async update(id, title, slug, content, status, season_id, match_id, team_id, published_at, tags, media, coverFile) {
        const dto = articleSchema.updateArticleSchema.parse({
            title,
            slug,
            content,
            status,
            season_id: season_id ? Number(season_id) : undefined,
            match_id: match_id ? Number(match_id) : undefined,
            team_id: team_id ? Number(team_id) : undefined,
            published_at,
            tags: tags ? JSON.parse(tags) : undefined,
            media: media ? JSON.parse(media) : undefined,
        });
        return this.service.update(id, dto, coverFile);
    }
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body.status);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    async listTags() {
        return this.service.listDistinctTags();
    }
    async addTag(article_id, body) {
        this.setStatus(201);
        return this.service.addTag(article_id, body);
    }
    async bulkAddTags(article_id, body) {
        this.setStatus(201);
        return this.service.bulkAddTags(article_id, body);
    }
    async removeTag(article_id, tag) {
        this.setStatus(204);
        return this.service.removeTag(article_id, tag);
    }
    async getMedia(article_id) {
        return this.service.getMedia(article_id);
    }
    /** Add media item bằng URL có sẵn (không upload file) */
    async addMedia(article_id, body) {
        this.setStatus(201);
        return this.service.addMedia(article_id, body);
    }
    /** Add media item bằng cách upload file trực tiếp */
    async uploadMedia(article_id, caption, order, type, file) {
        this.setStatus(201);
        return this.service.addMediaFile(article_id, file, {
            caption,
            order: order ? Number(order) : undefined,
            type,
        });
    }
    async deleteMedia(article_id, media_id) {
        this.setStatus(204);
        return this.service.deleteMedia(article_id, media_id);
    }
    async bulkDeleteMedia(article_id, body) {
        return this.service.bulkDeleteMedia(article_id, body);
    }
};
__decorate([
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
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "findById", null);
__decorate([
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
    __param(0, Request()),
    __param(1, FormField()),
    __param(2, FormField()),
    __param(3, FormField()),
    __param(4, FormField()),
    __param(5, FormField()),
    __param(6, FormField()),
    __param(7, FormField()),
    __param(8, FormField()),
    __param(9, FormField()),
    __param(10, FormField()),
    __param(11, UploadedFile("cover_image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, FormField()),
    __param(2, FormField()),
    __param(3, FormField()),
    __param(4, FormField()),
    __param(5, FormField()),
    __param(6, FormField()),
    __param(7, FormField()),
    __param(8, FormField()),
    __param(9, FormField()),
    __param(10, FormField()),
    __param(11, UploadedFile("cover_image")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object, Object]),
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
    Post("{article_id}/media/upload"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, FormField()),
    __param(2, FormField()),
    __param(3, FormField()),
    __param(4, UploadedFile("file")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ArticleController.prototype, "uploadMedia", null);
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