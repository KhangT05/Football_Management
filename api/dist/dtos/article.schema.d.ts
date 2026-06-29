import { z } from "zod";
export declare const createArticleSchema: z.ZodObject<{
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    cover_image: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        readonly draft: "draft";
        readonly published: "published";
        readonly archived: "archived";
    }>>;
    season_id: z.ZodOptional<z.ZodNumber>;
    match_id: z.ZodOptional<z.ZodNumber>;
    team_id: z.ZodOptional<z.ZodNumber>;
    published_at: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    media: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            readonly image: "image";
            readonly video: "video";
        }>;
        url: z.ZodString;
        caption: z.ZodOptional<z.ZodString>;
        order: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const updateArticleSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
    cover_image: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        readonly draft: "draft";
        readonly published: "published";
        readonly archived: "archived";
    }>>>;
    season_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    match_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    team_id: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    published_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    media: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<{
            readonly image: "image";
            readonly video: "video";
        }>;
        url: z.ZodString;
        caption: z.ZodOptional<z.ZodString>;
        order: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>>>;
}, z.core.$strip>;
export declare const updateArticleStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        readonly draft: "draft";
        readonly published: "published";
        readonly archived: "archived";
    }>;
}, z.core.$strip>;
export declare const addTagSchema: z.ZodObject<{
    tag: z.ZodString;
}, z.core.$strip>;
export declare const bulkAddTagsSchema: z.ZodObject<{
    tags: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const addArticleMediaSchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly image: "image";
        readonly video: "video";
    }>;
    url: z.ZodString;
    caption: z.ZodOptional<z.ZodString>;
    order: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export declare const bulkDeleteMediaSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export type CreateArticleDto = z.infer<typeof createArticleSchema>;
export type UpdateArticleDto = z.infer<typeof updateArticleSchema>;
export type UpdateArticleStatusDto = z.infer<typeof updateArticleStatusSchema>;
export type AddTagDto = z.infer<typeof addTagSchema>;
export type BulkAddTagsDto = z.infer<typeof bulkAddTagsSchema>;
export type AddArticleMediaDto = z.infer<typeof addArticleMediaSchema>;
export type BulkDeleteMediaDto = z.infer<typeof bulkDeleteMediaSchema>;
//# sourceMappingURL=article.schema.d.ts.map