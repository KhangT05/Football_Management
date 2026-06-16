import { z } from "zod";
export const SeasonStatusSchema = z.enum([
    "upcoming",
    "registration_open",
    "ongoing",
    "finished",
    "cancelled",
]);
const baseSeasonSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    status: SeasonStatusSchema.default("upcoming"),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    registration_deadline: z.coerce.date(),
    max_teams: z.number().int().positive(),
    is_registration_open: z.boolean().default(false),
    is_active: z.boolean().default(true),
    tournament_id: z.number().int().positive(),
});
export const createSeasonSchema = baseSeasonSchema;
export const updateSeasonSchema = baseSeasonSchema.partial();
//# sourceMappingURL=season.schema.js.map