import { z } from "zod";
export declare const SeasonStatusSchema: z.ZodEnum<{
    upcoming: "upcoming";
    registration_open: "registration_open";
    ongoing: "ongoing";
    finished: "finished";
    cancelled: "cancelled";
}>;
export declare const createSeasonSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<{
        upcoming: "upcoming";
        registration_open: "registration_open";
        ongoing: "ongoing";
        finished: "finished";
        cancelled: "cancelled";
    }>>;
    start_date: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    end_date: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    registration_deadline: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    max_teams: z.ZodNumber;
    is_registration_open: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    is_active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    tournament_id: z.ZodNumber;
}, z.core.$strip>;
export declare const updateSeasonSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        upcoming: "upcoming";
        registration_open: "registration_open";
        ongoing: "ongoing";
        finished: "finished";
        cancelled: "cancelled";
    }>>>;
    start_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    end_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    registration_deadline: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    max_teams: z.ZodOptional<z.ZodNumber>;
    is_registration_open: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export declare const UpdateSeasonStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        upcoming: "upcoming";
        registration_open: "registration_open";
        ongoing: "ongoing";
        finished: "finished";
        cancelled: "cancelled";
    }>;
    cancel_reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateSeasonDto = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonDto = z.infer<typeof updateSeasonSchema>;
export type UpdateSeasonStatusDto = z.infer<typeof UpdateSeasonStatusSchema>;
//# sourceMappingURL=season.schema.d.ts.map