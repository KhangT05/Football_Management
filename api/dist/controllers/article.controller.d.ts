import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
import { ArticleMedia, ArticleStatus } from "../generated/prisma/client.js";
import { ArticleService } from "../services/article.service.js";
import * as articleSchema from "../dtos/article.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ArticleListItem, SafeArticle } from "../types/article.type.js";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
export declare class ArticleController extends Controller {
    private readonly service;
    constructor(service: ArticleService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc", status?: string, season_id?: number, match_id?: number, team_id?: number, user_id?: number, tag?: string): Promise<PaginatedResult<ArticleListItem>>;
    findById(id: number): Promise<SafeArticle>;
    findBySlug(slug: string): Promise<SafeArticle>;
    /**
     * Tạo article kèm upload cover_image (multipart/form-data).
     * tags/media gửi dạng JSON string trong form field.
     */
    create(req: AuthRequest, title: string, slug: string, content: string, status: ArticleStatus | undefined, season_id: string | undefined, match_id: string | undefined, team_id: string | undefined, published_at: string | undefined, tags: string | undefined, media: string | undefined, coverFile?: Express.Multer.File): Promise<SafeArticle>;
    update(id: number, title: string | undefined, slug: string | undefined, content: string | undefined, status: ArticleStatus | undefined, season_id: string | undefined, match_id: string | undefined, team_id: string | undefined, published_at: string | undefined, tags: string | undefined, media: string | undefined, coverFile?: Express.Multer.File): Promise<SafeArticle>;
    updateStatus(id: number, body: articleSchema.UpdateArticleStatusDto): Promise<SafeArticle>;
    softDelete(id: number): Promise<void>;
    listTags(): Promise<string[]>;
    addTag(article_id: number, body: articleSchema.AddTagDto): Promise<void>;
    bulkAddTags(article_id: number, body: articleSchema.BulkAddTagsDto): Promise<{
        count: number;
    }>;
    removeTag(article_id: number, tag: string): Promise<void>;
    getMedia(article_id: number): Promise<ArticleMedia[]>;
    /** Add media item bằng URL có sẵn (không upload file) */
    addMedia(article_id: number, body: articleSchema.AddArticleMediaDto): Promise<ArticleMedia>;
    /** Add media item bằng cách upload file trực tiếp */
    uploadMedia(article_id: number, caption: string | undefined, order: string | undefined, type: "image" | "video" | undefined, file: Express.Multer.File): Promise<ArticleMedia>;
    deleteMedia(article_id: number, media_id: number): Promise<void>;
    bulkDeleteMedia(article_id: number, body: articleSchema.BulkDeleteMediaDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
}
export {};
//# sourceMappingURL=article.controller.d.ts.map