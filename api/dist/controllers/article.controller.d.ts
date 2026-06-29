import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
import { ArticleMedia } from "../generated/prisma/client.js";
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
    create(body: articleSchema.CreateArticleDto, req: AuthRequest): Promise<SafeArticle>;
    update(id: number, body: articleSchema.UpdateArticleDto): Promise<SafeArticle>;
    updateStatus(id: number, body: articleSchema.UpdateArticleStatusDto): Promise<SafeArticle>;
    softDelete(id: number): Promise<void>;
    /** Distinct tags toàn hệ thống — dùng cho autocomplete */
    listTags(): Promise<string[]>;
    /** Add 1 tag vào article */
    addTag(article_id: number, body: articleSchema.AddTagDto): Promise<void>;
    /** Bulk add nhiều tags vào article — 1 round-trip */
    bulkAddTags(article_id: number, body: articleSchema.BulkAddTagsDto): Promise<{
        count: number;
    }>;
    /** Remove 1 tag khỏi article */
    removeTag(article_id: number, tag: string): Promise<void>;
    getMedia(article_id: number): Promise<ArticleMedia[]>;
    /** Add 1 media item — dùng sau khi upload lên Cloudinary */
    addMedia(article_id: number, body: articleSchema.AddArticleMediaDto): Promise<ArticleMedia>;
    /** Delete 1 media item */
    deleteMedia(article_id: number, media_id: number): Promise<void>;
    /** Bulk delete media — truyền ids[] */
    bulkDeleteMedia(article_id: number, body: articleSchema.BulkDeleteMediaDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
}
export {};
//# sourceMappingURL=article.controller.d.ts.map