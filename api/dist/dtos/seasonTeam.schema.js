import { z } from "zod";
import { SeasonTeamStatus, PlayerPosition, PlayerRole } from "../generated/prisma/client.js";
export const selfRegisterSeasonTeamSchema = z.object({
    season_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
});
export const adminAddSeasonTeamSchema = z.object({
    season_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
    status: z.nativeEnum(SeasonTeamStatus).optional(),
});
export const updateSeasonTeamStatusSchema = z.object({
    status: z.nativeEnum(SeasonTeamStatus),
});
export const assignGroupSchema = z.object({
    group_id: z.number().int().positive(),
});
export const TransferSeasonTeamSchema = z.object({
    season_id: z.number().int().positive(),
});
export const transferRosterPlayerAddSchema = z.object({
    player_id: z.number().int().positive(),
    jersey_number: z.number().int().min(1).max(99),
    position: z.nativeEnum(PlayerPosition),
    role: z.nativeEnum(PlayerRole).optional(),
});
export const transferSeasonRosterSchema = z.object({
    carry_player_ids: z.array(z.number().int().positive()).default([]),
    add_players: z.array(transferRosterPlayerAddSchema).default([]),
});
export const TransferSeasonTeamBodySchema = TransferSeasonTeamSchema.merge(transferSeasonRosterSchema);
//# sourceMappingURL=seasonTeam.schema.js.map