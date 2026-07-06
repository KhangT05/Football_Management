import { z } from "zod";
import { MediaType, ArticleStatus } from "../generated/prisma/client.js";
// ─── Media ────────────────────────────────────────────────────────────────────
const mediaItemSchema = z.object({
    type: z.nativeEnum(MediaType),
    url: z.string().url(),
    caption: z.string().optional(),
    order: z.number().int().min(0).default(0),
});
// ─── Article ──────────────────────────────────────────────────────────────────
export const createArticleSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug chỉ chứa lowercase, số, dấu gạch ngang"),
    content: z.string().min(1),
    cover_image: z.string().url().optional(), // dùng khi KHÔNG upload file, truyền sẵn URL
    status: z.nativeEnum(ArticleStatus).default(ArticleStatus.draft),
    season_id: z.number().int().positive().optional(),
    match_id: z.number().int().positive().optional(),
    team_id: z.number().int().positive().optional(),
    published_at: z.string().datetime().optional(),
    tags: z.array(z.string().min(1).max(50)).max(20).optional(),
    media: z.array(mediaItemSchema).max(50).optional(),
});
export const updateArticleSchema = createArticleSchema.partial();
export const updateArticleStatusSchema = z.object({
    status: z.nativeEnum(ArticleStatus),
});
// ─── Multipart form fields (khi có upload cover_image) ────────────────────────
// Vì multer/tsoa @FormField chỉ nhận string/number/boolean, các field số/JSON
// phải gửi dạng string rồi coerce/parse tay ở controller.
export const createArticleFormSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
    content: z.string().min(1),
    status: z.nativeEnum(ArticleStatus).default(ArticleStatus.draft),
    season_id: z.coerce.number().int().positive().optional(),
    match_id: z.coerce.number().int().positive().optional(),
    team_id: z.coerce.number().int().positive().optional(),
    published_at: z.string().datetime().optional(),
    tags: z.string().optional(), // JSON string: '["a","b"]'
    media: z.string().optional(), // JSON string: '[{"type":"image","url":"..."}]'
});
export const updateArticleFormSchema = createArticleFormSchema.partial();
// ─── Tag ──────────────────────────────────────────────────────────────────────
export const addTagSchema = z.object({
    tag: z.string().min(1).max(50),
});
export const bulkAddTagsSchema = z.object({
    tags: z.array(z.string().min(1).max(50)).min(1).max(20),
});
// ─── Media ────────────────────────────────────────────────────────────────────
export const addArticleMediaSchema = mediaItemSchema;
export const bulkDeleteMediaSchema = z.object({
    ids: z.array(z.number().int().positive()).min(1),
});
//# sourceMappingURL=article.schema.js.map