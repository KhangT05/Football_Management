// dtos/jersey.schema.ts
import { z } from "zod";
import { JerseyType } from "../generated/prisma/client.js";
// ─── Color validation ───────────────────────────────────────────────────────
const hexColor = z
    .string()
    .regex(/^#?[0-9A-Fa-f]{6}$/, "Invalid hex color format")
    .transform((val) => (val.startsWith("#") ? val : `#${val}`));
// ─── TeamJersey ────────────────────────────────────────────────────────────
/**
 * Update team jersey (approved state).
 * Triggered by admin or after season approval.
 */
export const updateTeamJerseySchema = z.object({
    type: z.nativeEnum(JerseyType),
    primary_color: hexColor,
    secondary_color: hexColor.nullable().optional(),
});
// ─── SeasonTeamJersey ──────────────────────────────────────────────────────
/**
 * Submit season jersey for approval.
 * Status defaults to 'submitted'.
 * primary_color + secondary_color required (different from TeamJersey fallback).
 */
export const upsertSeasonTeamJerseySchema = z.object({
    type: z.nativeEnum(JerseyType),
    primary_color: hexColor,
    secondary_color: hexColor.nullable().optional(),
    image_url: z.string().url().nullable().optional(),
});
/**
 * Admin approves season jersey.
 * Atomic: approve season + update TeamJersey.
 */
export const approveSeasonTeamJerseySchema = z.object({
    type: z.nativeEnum(JerseyType),
});
/**
 * Admin rejects season jersey submission.
 */
export const rejectSeasonTeamJerseySchema = z.object({
    type: z.nativeEnum(JerseyType),
    reason: z.string().min(1).max(500),
});
//# sourceMappingURL=jersey.schema.js.map