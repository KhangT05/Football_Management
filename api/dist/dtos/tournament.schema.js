// models/tournament.model.ts
import { z } from "zod";
export const createTournamentSchema = z.object({
    name: z.string().max(255),
    description: z.string().optional(),
    logo: z.string().optional(),
    max_teams: z.number().int().positive(),
    is_active: z.boolean().default(true),
});
export const updateTournamentSchema = createTournamentSchema.partial();
//# sourceMappingURL=tournament.schema.js.map