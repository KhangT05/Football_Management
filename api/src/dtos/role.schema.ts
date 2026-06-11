import { z } from "zod";

export const createRoleSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
});

export const updateRoleSchema = createRoleSchema
    .partial()
    .extend({
        is_active: z.boolean().optional(),
    });

export type CreateRoleDto = z.infer<typeof createRoleSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;