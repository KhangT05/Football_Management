import { z } from "zod";
export declare const createArticletagSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateArticletagSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    is_active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type CreateArticletagDto = z.infer<typeof createArticletagSchema>;
export type UpdateArticletagDto = z.infer<typeof updateArticletagSchema>;
//# sourceMappingURL=articletag.schema.d.ts.map