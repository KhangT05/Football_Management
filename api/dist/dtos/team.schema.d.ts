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
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
    } | null;
    user_id: number | null;
    class_id: number | null;
}
export declare const createTeamSchema: z.ZodObject<{
    name: z.ZodString;
    coach_name: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    logo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    class_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.core.$strip>;
export declare const updateTeamSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    coach_name: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    logo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    class_id: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
}, z.core.$strip>;
export declare const assignCaptainSchema: z.ZodObject<{
    user_id: z.ZodNumber;
}, z.core.$strip>;
export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
export type AssignCaptainDto = z.infer<typeof assignCaptainSchema>;
//# sourceMappingURL=team.schema.d.ts.map