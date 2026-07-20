import { z } from "zod";
import { Season } from "../generated/prisma/client.js";
export declare const SeasonStatusSchema: z.ZodEnum<{
    upcoming: "upcoming";
    registration_open: "registration_open";
    ongoing: "ongoing";
    finished: "finished";
    cancelled: "cancelled";
}>;
export declare const PitchType: z.ZodEnum<{
    san_5: "san_5";
    san_7: "san_7";
    san_11: "san_11";
}>;
export declare const CancelSeasonSchema: z.ZodObject<{
    cancel_reason: z.ZodString;
}, z.core.$strip>;
export declare const createSeasonSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    start_date: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    end_date: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    registration_deadline: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    max_teams: z.ZodNumber;
    is_registration_open: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    is_active: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    tournament_id: z.ZodNumber;
    tournament_rule_id: z.ZodNumber;
    group_count: z.ZodDefault<z.ZodNumber>;
    pitch_type: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        san_5: "san_5";
        san_7: "san_7";
        san_11: "san_11";
    }>>>;
    bank_id: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bank_account_no: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    bank_account_name: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateSeasonSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    group_count: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    start_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    end_date: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    registration_deadline: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    max_teams: z.ZodOptional<z.ZodNumber>;
    is_registration_open: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
    bank_id: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    bank_account_no: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    bank_account_name: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    pitch_type: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        san_5: "san_5";
        san_7: "san_7";
        san_11: "san_11";
    }>>>>;
    tournament_rule_id: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const UpdateSeasonStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        upcoming: "upcoming";
        registration_open: "registration_open";
        ongoing: "ongoing";
        finished: "finished";
    }>;
}, z.core.$strip>;
export type SeasonListItem = Pick<Season, "id" | "name" | "status" | "start_date" | "end_date" | "registration_deadline" | "max_teams" | 'cancel_reason' | 'is_registration_open' | 'group_count' | 'pitch_type' | 'bank_id' | 'bank_account_no' | 'bank_account_name'> & {
    tournament: {
        id: number;
        name: string;
    };
    _count: {
        phases: number;
    };
};
export declare const BulkSeasonTeamActionSchema: z.ZodObject<{
    ids: z.ZodPipe<z.ZodArray<z.ZodNumber>, z.ZodTransform<number[], number[]>>;
}, z.core.$strip>;
export type BulkSeasonTeamActionDto = z.infer<typeof BulkSeasonTeamActionSchema>;
export type CreateSeasonDto = z.infer<typeof createSeasonSchema>;
export type UpdateSeasonDto = z.infer<typeof updateSeasonSchema>;
export type UpdateSeasonStatusDto = z.infer<typeof UpdateSeasonStatusSchema>;
export type CancelSeasonDto = z.infer<typeof CancelSeasonSchema>;
//# sourceMappingURL=season.schema.d.ts.map