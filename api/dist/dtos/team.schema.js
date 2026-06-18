import { z } from "zod";
export const createTeamSchema = z.object({
    name: z.string().trim().min(1).max(100),
    coach_name: z.string().trim().max(100).nullable().optional(),
    logo: z.string().nullable().optional(), // match DB field
    description: z.string().max(2000).nullable().optional(),
});
export const updateTeamSchema = createTeamSchema.partial();
export const assignCaptainSchema = z.object({
    user_id: z.number().int().positive(),
});
//# sourceMappingURL=team.schema.js.map