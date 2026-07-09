import { z } from "zod"
import { Season, SeasonStatus } from "../generated/prisma/client.js";

export const SeasonStatusSchema = z.enum([
    "upcoming",
    "registration_open",
    "ongoing",
    "finished",
    "cancelled",
])
export const CancelSeasonSchema = z.object({
    cancel_reason: z.string().trim().min(1, "cancel_reason is required").max(500),
});
const baseSeasonSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    status: SeasonStatusSchema.default("upcoming"),
    start_date: z.coerce.date().optional().nullable(),
    end_date: z.coerce.date().optional().nullable(),
    registration_deadline: z.coerce.date().optional().nullable(),
    max_teams: z.number().int().positive(),
    is_registration_open: z.boolean().optional().default(false),
    is_active: z.boolean().optional().default(true),
    tournament_id: z.number().int().positive(),
    tournament_rule_id: z.number().int().positive(),
    group_count: z.number().int().min(1).default(1),
})

export const createSeasonSchema = baseSeasonSchema
export const updateSeasonSchema = baseSeasonSchema
    .omit({ tournament_id: true })
    .partial();
export const UpdateSeasonStatusSchema = z.object({
    status: SeasonStatusSchema.exclude(["cancelled"]),
    cancel_reason: z.string().max(500).optional(),
});

export type SeasonListItem = Pick<
    Season,
    | "id"
    | "name"
    | "status"
    | "start_date"
    | "end_date"
    | "registration_deadline"
    | "max_teams" | 'cancel_reason' | 'is_registration_open' | 'group_count'
> & {
    tournament: {
        id: number;
        name: string;
    };
    _count: {
        phases: number;
    };

    tournament_rule: {
        id: number;
        name: string;
    };
};

export type CreateSeasonDto = z.infer<typeof createSeasonSchema>
export type UpdateSeasonDto = z.infer<typeof updateSeasonSchema>
export type UpdateSeasonStatusDto = z.infer<typeof UpdateSeasonStatusSchema>
export type CancelSeasonDto = z.infer<typeof CancelSeasonSchema>;