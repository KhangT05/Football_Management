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
    start_date: z.ZodCoercedDate<unknown>;
    end_date: z.ZodCoercedDate<unknown>;
    registration_deadline: z.ZodCoercedDate<unknown>;
    max_teams: z.ZodNumber;
    is_registration_open: z.ZodDefault<z.ZodBoolean>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    tournament_id: z.ZodNumber;
}, z.core.$strip>;
export declare const updateSeasonSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        upcoming: "upcoming";
        registration_open: "registration_open";
        ongoing: "ongoing";
        finished: "finished";
        cancelled: "cancelled";
    }>>>;
    start_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    end_date: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    registration_deadline: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    max_teams: z.ZodOptional<z.ZodNumber>;
    is_registration_open: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    tournament_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateSeasonDto = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonDto = z.infer<typeof updateSeasonSchema>;
//# sourceMappingURL=season.schema.d.ts.map