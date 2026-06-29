import { ArticleStatus, PrismaClient } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { AddArticleMediaDto, AddTagDto, BulkAddTagsDto, BulkDeleteMediaDto, CreateArticleDto, UpdateArticleDto } from "../dtos/article.schema.js";
import { ArticleListItem, ArticleQueryRequest, SafeArticle } from "../types/article.type.js";
export declare class ArticleService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: ArticleQueryRequest): Promise<PaginatedResult<ArticleListItem>>;
    findById(id: number): Promise<SafeArticle | null>;
    findByIdOrFail(id: number): Promise<SafeArticle>;
    findBySlug(slug: string): Promise<SafeArticle | null>;
    findBySlugOrFail(slug: string): Promise<SafeArticle>;
    create(userId: number, data: CreateArticleDto): Promise<SafeArticle>;
    update(id: number, data: UpdateArticleDto): Promise<SafeArticle>;
    updateStatus(id: number, status: ArticleStatus): Promise<SafeArticle>;
    softDelete(id: number): Promise<void>;
    listDistinctTags(): Promise<string[]>;
    addTag(articleId: number, dto: AddTagDto): Promise<void>;
    /** Bulk add — createMany skipDuplicates, 1 round-trip */
    bulkAddTags(articleId: number, dto: BulkAddTagsDto): Promise<{
        count: number;
    }>;
    removeTag(articleId: number, tag: string): Promise<void>;
    getMedia(articleId: number): Promise<{
        type: import("../generated/prisma/enums.js").MediaType;
        id: number;
        created_at: Date;
        order: number;
        url: string;
        caption: string | null;
        article_id: number;
    }[]>;
    addMedia(articleId: number, dto: AddArticleMediaDto): Promise<{
        type: import("../generated/prisma/enums.js").MediaType;
        id: number;
        created_at: Date;
        order: number;
        url: string;
        caption: string | null;
        article_id: number;
    }>;
    deleteMedia(articleId: number, mediaId: number): Promise<void>;
    bulkDeleteMedia(articleId: number, dto: BulkDeleteMediaDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
}
//# sourceMappingURL=article.service.d.ts.map