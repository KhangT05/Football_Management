import { z } from "zod";
export const createTeamSchema = z.object({
    name: z.string().trim().min(1).max(100),
    coach_name: z.string().trim().max(100).nullable().optional(),
    logo: z.string().url().nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
    is_active: z.boolean().default(true),
});
export const updateTeamSchema = createTeamSchema.partial();
//# sourceMappingURL=team.schema.js.map