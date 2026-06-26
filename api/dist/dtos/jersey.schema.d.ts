import { z } from "zod";
/**
 * Update team jersey (approved state).
 * Triggered by admin or after season approval.
 */
export declare const updateTeamJerseySchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly home: "home";
        readonly away: "away";
        readonly third: "third";
        readonly goalkeeper: "goalkeeper";
    }>;
    primary_color: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    secondary_color: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
}, z.core.$strip>;
export type UpdateTeamJerseyDto = z.infer<typeof updateTeamJerseySchema>;
/**
 * Submit season jersey for approval.
 * Status defaults to 'submitted'.
 * primary_color + secondary_color required (different from TeamJersey fallback).
 */
export declare const upsertSeasonTeamJerseySchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly home: "home";
        readonly away: "away";
        readonly third: "third";
        readonly goalkeeper: "goalkeeper";
    }>;
    primary_color: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    secondary_color: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type UpsertSeasonTeamJerseyDto = z.infer<typeof upsertSeasonTeamJerseySchema>;
/**
 * Admin approves season jersey.
 * Atomic: approve season + update TeamJersey.
 */
export declare const approveSeasonTeamJerseySchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly home: "home";
        readonly away: "away";
        readonly third: "third";
        readonly goalkeeper: "goalkeeper";
    }>;
}, z.core.$strip>;
export type ApproveSeasonTeamJerseyDto = z.infer<typeof approveSeasonTeamJerseySchema>;
/**
 * Admin rejects season jersey submission.
 */
export declare const rejectSeasonTeamJerseySchema: z.ZodObject<{
    type: z.ZodEnum<{
        readonly home: "home";
        readonly away: "away";
        readonly third: "third";
        readonly goalkeeper: "goalkeeper";
    }>;
    reason: z.ZodString;
}, z.core.$strip>;
export type RejectSeasonTeamJerseyDto = z.infer<typeof rejectSeasonTeamJerseySchema>;
//# sourceMappingURL=jersey.schema.d.ts.map