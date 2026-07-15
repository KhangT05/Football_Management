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
    class_id: number | null;
}

export const createTeamSchema = z.object({
    name: z.string().trim().min(1).max(100),
    coach_name: z.string().trim().max(100).nullable().optional(),
    logo: z.string().nullable().optional(),  // match DB field
    description: z.string().max(2000).nullable().optional(),
    class_id: z.number().int().positive().nullable().optional(),
});

export const updateTeamSchema = createTeamSchema.partial();
export const assignCaptainSchema = z.object({
    user_id: z.number().int().positive(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
export type AssignCaptainDto = z.infer<typeof assignCaptainSchema>;