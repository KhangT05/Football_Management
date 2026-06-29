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
//# sourceMappingURL=articletag.schema.js.map