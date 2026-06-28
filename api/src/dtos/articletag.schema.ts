import { z } from "zod";

export const createArticletagSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export const updateArticletagSchema = createArticletagSchema
    .partial()
    .extend({
        is_active: z.boolean().optional(),
    });

export type CreateArticletagDto = z.infer<typeof createArticletagSchema>;
export type UpdateArticletagDto = z.infer<typeof updateArticletagSchema>;