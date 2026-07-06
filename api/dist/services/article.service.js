import { Queryable } from "../libs/queryable.js";
import { createAppError } from "../common/app.error.js";
import { storageService } from "./storage.service.js";
import { ARTICLE_BASE_WHERE, ARTICLE_FULL_INCLUDE, ARTICLE_LIST_INCLUDE } from "../types/article.type.js";
export class ArticleService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.article, {
            searchFields: ["title", "slug"],
            sortable: ["id", "title", "published_at", "created_at"],
            defaultSort: { column: "created_at", direction: "desc" },
            filterable: ["status", "user_id", "season_id", "match_id", "team_id"],
            defaultPerPage: 20,
            maxPerPage: 100,
            ...ARTICLE_LIST_INCLUDE,
            beforeBuild: (where) => {
                where.push(ARTICLE_BASE_WHERE);
            },
        });
    }
    // ─── Read ──────────────────────────────────────────────────────────────────
    async findAll(req = {}) {
        const { tag, ...baseReq } = req;
        return this.query.run(baseReq, tag
            ? {
                beforeBuild: (where) => {
                    where.push(ARTICLE_BASE_WHERE);
                    where.push({ tags: { some: { tag } } });
                },
            }
            : undefined);
    }
    findById(id) {
        return this.prisma.article.findFirst({
            where: { id, ...ARTICLE_BASE_WHERE },
            ...ARTICLE_FULL_INCLUDE,
        });
    }
    async findByIdOrFail(id) {
        const article = await this.findById(id);
        if (!article)
            throw createAppError("NOT_FOUND", `Article ${id} not found`);
        return article;
    }
    findBySlug(slug) {
        return this.prisma.article.findFirst({
            where: { slug, ...ARTICLE_BASE_WHERE },
            ...ARTICLE_FULL_INCLUDE,
        });
    }
    async findBySlugOrFail(slug) {
        const article = await this.findBySlug(slug);
        if (!article)
            throw createAppError("NOT_FOUND", `Article slug "${slug}" not found`);
        return article;
    }
    // ─── Write ─────────────────────────────────────────────────────────────────
    /**
     * Upload cover_image → lưu url vào DB trong cùng 1 flow (giống tournament.updateWithLogo).
     * Nếu coverFile được truyền, nó override cover_image trong dto (nếu có).
     */
    async create(userId, data, coverFile) {
        const slugExists = await this.prisma.article.findUnique({
            where: { slug: data.slug },
            select: { id: true },
        });
        if (slugExists)
            throw createAppError("CONFLICT", `Slug "${data.slug}" already exists`);
        const { tags, media, published_at, cover_image, ...fields } = data;
        let coverImage = cover_image;
        if (coverFile) {
            const result = await storageService.upload({ namespace: "articles", kind: "cover", file: coverFile });
            coverImage = result.url;
        }
        // published_at: explicit value > auto-now khi status=published > undefined
        const publishedAt = published_at
            ? new Date(published_at)
            : fields.status === "published"
                ? new Date()
                : undefined;
        return this.prisma.article.create({
            data: {
                ...fields,
                user_id: userId,
                ...(coverImage !== undefined && { cover_image: coverImage }),
                ...(publishedAt && { published_at: publishedAt }),
                // bulk insert tags + media trong cùng 1 query — 1 round-trip
                ...(tags?.length && {
                    tags: {
                        createMany: {
                            data: tags.map((tag) => ({ tag })),
                            skipDuplicates: true,
                        },
                    },
                }),
                ...(media?.length && {
                    media: {
                        createMany: { data: media },
                    },
                }),
            },
            ...ARTICLE_FULL_INCLUDE,
        });
    }
    async update(id, data, coverFile) {
        await this.findByIdOrFail(id);
        const { tags, media, published_at, slug, status, cover_image, ...fields } = data;
        if (slug) {
            const conflict = await this.prisma.article.findFirst({
                where: { slug, id: { not: id } },
                select: { id: true },
            });
            if (conflict)
                throw createAppError("CONFLICT", `Slug "${slug}" already exists`);
        }
        let coverImage = cover_image;
        if (coverFile) {
            const result = await storageService.upload({ namespace: "articles", kind: "cover", file: coverFile });
            coverImage = result.url;
        }
        const publishedAt = published_at
            ? new Date(published_at)
            : status === "published"
                ? new Date()
                : undefined;
        return this.prisma.$transaction(async (tx) => {
            // tags: replace-all nếu truyền (bulk delete + bulk insert)
            if (tags !== undefined) {
                await tx.articleTag.deleteMany({ where: { article_id: id } });
                if (tags.length) {
                    await tx.articleTag.createMany({
                        data: tags.map((tag) => ({ article_id: id, tag })),
                        skipDuplicates: true,
                    });
                }
            }
            // media: replace-all nếu truyền
            if (media !== undefined) {
                await tx.articleMedia.deleteMany({ where: { article_id: id } });
                if (media.length) {
                    await tx.articleMedia.createMany({
                        data: media.map((m) => ({ ...m, article_id: id })),
                    });
                }
            }
            const patch = Object.fromEntries(Object.entries({ ...fields, slug, status }).filter(([, v]) => v !== undefined));
            return tx.article.update({
                where: { id },
                data: {
                    ...patch,
                    ...(coverImage !== undefined && { cover_image: coverImage }),
                    ...(publishedAt && { published_at: publishedAt }),
                },
                ...ARTICLE_FULL_INCLUDE,
            });
        });
    }
    async updateStatus(id, status) {
        await this.findByIdOrFail(id);
        return this.prisma.article.update({
            where: { id },
            data: {
                status,
                ...(status === "published" && { published_at: new Date() }),
            },
            ...ARTICLE_FULL_INCLUDE,
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.prisma.article.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
    // ─── Tags ──────────────────────────────────────────────────────────────────
    async listDistinctTags() {
        const rows = await this.prisma.articleTag.findMany({
            distinct: ["tag"],
            select: { tag: true },
            orderBy: { tag: "asc" },
        });
        return rows.map((r) => r.tag);
    }
    async addTag(articleId, dto) {
        await this.findByIdOrFail(articleId);
        await this.prisma.articleTag.upsert({
            where: { article_id_tag: { article_id: articleId, tag: dto.tag } },
            create: { article_id: articleId, tag: dto.tag },
            update: {},
        });
    }
    async bulkAddTags(articleId, dto) {
        await this.findByIdOrFail(articleId);
        const result = await this.prisma.articleTag.createMany({
            data: dto.tags.map((tag) => ({ article_id: articleId, tag })),
            skipDuplicates: true,
        });
        return { count: result.count };
    }
    async removeTag(articleId, tag) {
        await this.findByIdOrFail(articleId);
        const exists = await this.prisma.articleTag.findUnique({
            where: { article_id_tag: { article_id: articleId, tag } },
            select: { id: true },
        });
        if (!exists)
            throw createAppError("NOT_FOUND", `Tag "${tag}" not found on article ${articleId}`);
        await this.prisma.articleTag.delete({
            where: { article_id_tag: { article_id: articleId, tag } },
        });
    }
    // ─── Media ─────────────────────────────────────────────────────────────────
    async getMedia(articleId) {
        await this.findByIdOrFail(articleId);
        return this.prisma.articleMedia.findMany({
            where: { article_id: articleId },
            orderBy: { order: "asc" },
        });
    }
    async addMedia(articleId, dto) {
        await this.findByIdOrFail(articleId);
        return this.prisma.articleMedia.create({
            data: { ...dto, article_id: articleId },
        });
    }
    /** Upload file media (ảnh/video) → lưu vào ArticleMedia trong 1 flow */
    async addMediaFile(articleId, file, extra) {
        await this.findByIdOrFail(articleId);
        const result = await storageService.upload({ namespace: "articles", kind: "media", file });
        return this.prisma.articleMedia.create({
            data: {
                article_id: articleId,
                type: extra?.type ?? "image",
                url: result.url,
                caption: extra?.caption,
                order: extra?.order ?? 0,
            },
        });
    }
    async deleteMedia(articleId, mediaId) {
        await this.findByIdOrFail(articleId);
        const exists = await this.prisma.articleMedia.findFirst({
            where: { id: mediaId, article_id: articleId },
            select: { id: true },
        });
        if (!exists)
            throw createAppError("NOT_FOUND", `Media ${mediaId} not found on article ${articleId}`);
        await this.prisma.articleMedia.delete({ where: { id: mediaId } });
    }
    async bulkDeleteMedia(articleId, dto) {
        await this.findByIdOrFail(articleId);
        const found = await this.prisma.articleMedia.findMany({
            where: { id: { in: dto.ids }, article_id: articleId },
            select: { id: true },
        });
        const foundIds = found.map((m) => m.id);
        const notFound = dto.ids.filter((id) => !foundIds.includes(id));
        const { count } = await this.prisma.articleMedia.deleteMany({
            where: { id: { in: foundIds } },
        });
        return { deleted: count, notFound };
    }
}
//# sourceMappingURL=article.service.js.map