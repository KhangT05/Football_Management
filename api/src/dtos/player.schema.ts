import { z } from "zod";
import {
    ApprovalStatus,
    PlayerPosition,
    PlayerRole,
    PlayerStatus
} from "../generated/prisma/client.js";

export const PlayerPositionEnum = z.nativeEnum(PlayerPosition);
export const PlayerRoleEnum = z.nativeEnum(PlayerRole);
export const PlayerStatusEnum = z.nativeEnum(PlayerStatus);
export const ApprovalStatusEnum = z.nativeEnum(ApprovalStatus);

export interface PlayerDto {
    id: number;
    date_of_birth: Date;
    position: PlayerPosition;
    height: number | null;
    weight: number | null;
    nationality: string | null;
    avatar: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    user?: { id: number; name: string; email: string; phone: string | null } | null;
    user_id: number;
}

export interface TeamPlayerDto {
    id: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: PlayerPosition;
    role: PlayerRole;
    status: PlayerStatus;
    approval_status: ApprovalStatus;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    player?: PlayerDto | null;
}

export const createPlayerSchema = z.object({
    user_id: z.number().int().positive(),
    date_of_birth: z.coerce.date(),
    position: PlayerPositionEnum,
    height: z.number().positive().max(999.99).nullable().optional(),
    weight: z.number().positive().max(999.99).nullable().optional(),
    nationality: z.string().trim().max(100).nullable().optional(),
    avatar: z.string().nullable().optional(),
});

export const updatePlayerSchema = createPlayerSchema.omit({ user_id: true }).partial();

export const addPlayerToTeamSchema = z.object({
    player_id: z.number().int().positive(),
    jersey_number: z.number().int().min(1).max(99),
    position: PlayerPositionEnum,
    role: PlayerRoleEnum.default(PlayerRole.player),
});

export const updateTeamPlayerSchema = z.object({
    jersey_number: z.number().int().min(1).max(99).optional(),
    position: PlayerPositionEnum.optional(),
    role: PlayerRoleEnum.optional(),
    status: PlayerStatusEnum.optional(),
    approval_status: ApprovalStatusEnum.optional(),
    is_active: z.boolean().optional(),
});

export const bulkDeleteSchema = z.object({
    ids: z.array(z.number().int().positive()).min(1).max(100),
});

export const importPlayerRowSchema = z.object({
    user_email: z.string().email(),
    date_of_birth: z.coerce.date(),
    position: PlayerPositionEnum,
    height: z.number().positive().max(999.99).nullable().optional(),
    weight: z.number().positive().max(999.99).nullable().optional(),
    nationality: z.string().trim().max(100).nullable().optional(),
    jersey_number: z.number().int().min(1).max(99).optional(),
});

// ============================================================
// TYPES
// ============================================================
export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
export type AddPlayerToTeamDto = z.infer<typeof addPlayerToTeamSchema>;
export type UpdateTeamPlayerDto = z.infer<typeof updateTeamPlayerSchema>;
export type BulkDeleteDto = z.infer<typeof bulkDeleteSchema>;
export type ImportPlayerRowDto = z.infer<typeof importPlayerRowSchema>;