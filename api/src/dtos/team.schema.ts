import { z } from "zod";

export interface TeamDto {
    id: number;
    name: string;
    coach_name: string | null;
    logo: string | null;
    description: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    user?: { id: number; name: string; email: string; phone: string | null } | null;
    user_id: number | null;
}

export const createTeamSchema = z.object({
    name: z.string().trim().min(1).max(100),
    coach_name: z.string().trim().max(100).nullable().optional(),
    logo: z.string().url().nullable().optional(),
    description: z.string().max(2000).nullable().optional(),
    is_active: z.boolean().default(true),
});

export const updateTeamSchema = createTeamSchema.partial();

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;