import { z } from "zod";
export const createClassSchema = z.object({
    name: z.string().trim().min(1).max(100),
    is_active: z.boolean().optional(),
});
export const updateClassSchema = createClassSchema.partial();
//# sourceMappingURL=class.schema.js.map