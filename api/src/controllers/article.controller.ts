import {
    Body,
    Controller,
    Delete,
    FormField,
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
    UploadedFile,
} from "tsoa";
import type { Request as ExRequest } from "express";
import { ArticleMedia, ArticleStatus } from "../generated/prisma/client.js";
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
            page, per_page, q, sort, direction, status,
            season_id, match_id, team_id, user_id, tag,
        });
    }

    @Get("{id}")
    async findById(@Path() id: number): Promise<SafeArticle> {
        return this.service.findByIdOrFail(id);
    }

    @Get("slug/{slug}")
    async findBySlug(@Path() slug: string): Promise<SafeArticle> {
        return this.service.findBySlugOrFail(slug);
    }

    /**
     * Tạo article kèm upload cover_image (multipart/form-data).
     * tags/media gửi dạng JSON string trong form field.
     */
    @Security("jwt", ["admin", "organizing"])
    @Post("/")
    @SuccessResponse(201, "Created")
    async create(
        @Request() req: AuthRequest,
        @FormField() title: string,
        @FormField() slug: string,
        @FormField() content: string,
        @FormField() status: ArticleStatus | undefined,
        @FormField() season_id: string | undefined,
        @FormField() match_id: string | undefined,
        @FormField() team_id: string | undefined,
        @FormField() published_at: string | undefined,
        @FormField() tags: string | undefined,
        @FormField() media: string | undefined,
        @UploadedFile("cover_image") coverFile?: Express.Multer.File
    ): Promise<SafeArticle> {
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

    @Security("jwt", ["admin", "organizing"])
    @Patch("{id}")
    async update(
        @Path() id: number,
        @FormField() title: string | undefined,
        @FormField() slug: string | undefined,
        @FormField() content: string | undefined,
        @FormField() status: ArticleStatus | undefined,
        @FormField() season_id: string | undefined,
        @FormField() match_id: string | undefined,
        @FormField() team_id: string | undefined,
        @FormField() published_at: string | undefined,
        @FormField() tags: string | undefined,
        @FormField() media: string | undefined,
        @UploadedFile("cover_image") coverFile?: Express.Multer.File
    ): Promise<SafeArticle> {
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

    @Get("tags")
    async listTags(): Promise<string[]> {
        return this.service.listDistinctTags();
    }

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

    @Get("{article_id}/media")
    async getMedia(@Path() article_id: number): Promise<ArticleMedia[]> {
        return this.service.getMedia(article_id);
    }

    /** Add media item bằng URL có sẵn (không upload file) */
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

    /** Add media item bằng cách upload file trực tiếp */
    @Security("jwt", ["admin", "organizing"])
    @Post("{article_id}/media/upload")
    @SuccessResponse(201, "Created")
    async uploadMedia(
        @Path() article_id: number,
        @FormField() caption: string | undefined,
        @FormField() order: string | undefined,
        @FormField() type: "image" | "video" | undefined,
        @UploadedFile("file") file: Express.Multer.File
    ): Promise<ArticleMedia> {
        this.setStatus(201);
        return this.service.addMediaFile(article_id, file, {
            caption,
            order: order ? Number(order) : undefined,
            type,
        });
    }

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

    @Security("jwt", ["admin", "organizing"])
    @Delete("{article_id}/media")
    async bulkDeleteMedia(
        @Path() article_id: number,
        @Body() body: articleSchema.BulkDeleteMediaDto
    ): Promise<{ deleted: number; notFound: number[] }> {
        return this.service.bulkDeleteMedia(article_id, body);
    }
}