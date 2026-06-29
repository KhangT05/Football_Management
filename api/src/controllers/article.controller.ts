import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Path,
    Post,
    Query,
    Route,
    Security,
    SuccessResponse,
    Tags,
    Request,
} from "tsoa";
import type { Request as ExRequest } from "express";
import { ArticleMedia } from "../generated/prisma/client.js";
import { ArticleService } from "../services/article.service.js";
import * as articleSchema from "../dtos/article.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ArticleListItem, SafeArticle } from "../types/article.type.js";

type AuthRequest = ExRequest & { user: { user_id: number } };

@Route("articles")
@Tags("Articles")
export class ArticleController extends Controller {
    constructor(private readonly service: ArticleService) {
        super();
    }

    // ─── Article CRUD ──────────────────────────────────────────────────────────

    @Security("jwt", ["admin", "organizing", "guest"])
    @Get("/")
    async findAll(
        @Query() page = 1,
        @Query() per_page = 20,
        @Query() q?: string,
        @Query() sort?: string,
        @Query() direction?: "asc" | "desc",
        @Query() status?: string,
        @Query() season_id?: number,
        @Query() match_id?: number,
        @Query() team_id?: number,
        @Query() user_id?: number,
        @Query() tag?: string
    ): Promise<PaginatedResult<ArticleListItem>> {
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

    @Security("jwt", ["admin", "organizing", "guest"])
    @Get("{id}")
    async findById(@Path() id: number): Promise<SafeArticle> {
        return this.service.findByIdOrFail(id);
    }

    @Security("jwt", ["admin", "organizing", "guest"])
    @Get("slug/{slug}")
    async findBySlug(@Path() slug: string): Promise<SafeArticle> {
        return this.service.findBySlugOrFail(slug);
    }

    @Security("jwt", ["admin", "organizing"])
    @Post("/")
    @SuccessResponse(201, "Created")
    async create(
        @Body() body: articleSchema.CreateArticleDto,
        @Request() req: AuthRequest
    ): Promise<SafeArticle> {
        this.setStatus(201);
        return this.service.create(req.user.user_id, body);
    }

    @Security("jwt", ["admin", "organizing"])
    @Patch("{id}")
    async update(
        @Path() id: number,
        @Body() body: articleSchema.UpdateArticleDto
    ): Promise<SafeArticle> {
        return this.service.update(id, body);
    }

    @Security("jwt", ["admin", "organizing"])
    @Patch("{id}/status")
    async updateStatus(
        @Path() id: number,
        @Body() body: articleSchema.UpdateArticleStatusDto
    ): Promise<SafeArticle> {
        return this.service.updateStatus(id, body.status);
    }

    @Security("jwt", ["admin"])
    @Delete("{id}")
    @SuccessResponse(204, "Deleted")
    async softDelete(@Path() id: number): Promise<void> {
        this.setStatus(204);
        return this.service.softDelete(id);
    }

    // ─── Tags ──────────────────────────────────────────────────────────────────

    /** Distinct tags toàn hệ thống — dùng cho autocomplete */
    @Security("jwt", ["admin", "organizing", "guest"])
    @Get("tags")
    async listTags(): Promise<string[]> {
        return this.service.listDistinctTags();
    }

    /** Add 1 tag vào article */
    @Security("jwt", ["admin", "organizing"])
    @Post("{article_id}/tags")
    @SuccessResponse(201, "Created")
    async addTag(
        @Path() article_id: number,
        @Body() body: articleSchema.AddTagDto
    ): Promise<void> {
        this.setStatus(201);
        return this.service.addTag(article_id, body);
    }

    /** Bulk add nhiều tags vào article — 1 round-trip */
    @Security("jwt", ["admin", "organizing"])
    @Post("{article_id}/tags/bulk")
    @SuccessResponse(201, "Created")
    async bulkAddTags(
        @Path() article_id: number,
        @Body() body: articleSchema.BulkAddTagsDto
    ): Promise<{ count: number }> {
        this.setStatus(201);
        return this.service.bulkAddTags(article_id, body);
    }

    /** Remove 1 tag khỏi article */
    @Security("jwt", ["admin", "organizing"])
    @Delete("{article_id}/tags/{tag}")
    @SuccessResponse(204, "Deleted")
    async removeTag(
        @Path() article_id: number,
        @Path() tag: string
    ): Promise<void> {
        this.setStatus(204);
        return this.service.removeTag(article_id, tag);
    }

    // ─── Media ─────────────────────────────────────────────────────────────────

    @Security("jwt", ["admin", "organizing", "guest"])
    @Get("{article_id}/media")
    async getMedia(@Path() article_id: number): Promise<ArticleMedia[]> {
        return this.service.getMedia(article_id);
    }

    /** Add 1 media item — dùng sau khi upload lên Cloudinary */
    @Security("jwt", ["admin", "organizing"])
    @Post("{article_id}/media")
    @SuccessResponse(201, "Created")
    async addMedia(
        @Path() article_id: number,
        @Body() body: articleSchema.AddArticleMediaDto
    ): Promise<ArticleMedia> {
        this.setStatus(201);
        return this.service.addMedia(article_id, body);
    }

    /** Delete 1 media item */
    @Security("jwt", ["admin", "organizing"])
    @Delete("{article_id}/media/{media_id}")
    @SuccessResponse(204, "Deleted")
    async deleteMedia(
        @Path() article_id: number,
        @Path() media_id: number
    ): Promise<void> {
        this.setStatus(204);
        return this.service.deleteMedia(article_id, media_id);
    }

    /** Bulk delete media — truyền ids[] */
    @Security("jwt", ["admin", "organizing"])
    @Delete("{article_id}/media")
    async bulkDeleteMedia(
        @Path() article_id: number,
        @Body() body: articleSchema.BulkDeleteMediaDto
    ): Promise<{ deleted: number; notFound: number[] }> {
        return this.service.bulkDeleteMedia(article_id, body);
    }
}