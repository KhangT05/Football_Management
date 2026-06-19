import { z } from "zod";
import { SeasonTeamStatus, Prisma } from "../generated/prisma/client.js";

export const selfRegisterSeasonTeamSchema = z.object({
    season_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
});

export const adminAddSeasonTeamSchema = z.object({
    season_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
    status: z.nativeEnum(SeasonTeamStatus).optional().default(SeasonTeamStatus.approved),
});

export const updateSeasonTeamStatusSchema = z.object({
    status: z.nativeEnum(SeasonTeamStatus),
});

export const assignGroupSchema = z.object({
    group_id: z.number().int().positive(),
});

export type SelfRegisterSeasonTeamDto = z.infer<typeof selfRegisterSeasonTeamSchema>;
export type AdminAddSeasonTeamDto = z.infer<typeof adminAddSeasonTeamSchema>;
export type UpdateSeasonTeamStatusDto = z.infer<typeof updateSeasonTeamStatusSchema>;
export type AssignGroupDto = z.infer<typeof assignGroupSchema>;