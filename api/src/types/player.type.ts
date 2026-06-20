import { Prisma } from "../generated/prisma/client.js";
import { QueryRequest } from "./queryable.type.js";

export interface ImportResult {
    success: number;
    failed: number;
    errors: { row: number; reason: string }[];
}

export interface ListTeamPlayersQuery extends QueryRequest {
    team_id: number;
}

// ─── Projection ───────────────────────────────────────────────────────────────
// Định nghĩa relation 1 lần, dùng select.player.user mọi nơi cần tránh N+1.

export const PLAYER_SELECT = {
    id: true,
    user_id: true,
    date_of_birth: true,
    position: true,
    height: true,
    weight: true,
    nationality: true,
    avatar: true,
    is_active: true,
    created_at: true,
    updated_at: true,
    user: {
        select: { id: true, name: true, email: true, phone: true },
    },
} satisfies Prisma.PlayerSelect;

export const TEAM_PLAYER_SELECT = {
    id: true,
    team_id: true,
    player_id: true,
    jersey_number: true,
    position: true,
    role: true,
    status: true,
    approval_status: true,
    is_active: true,
    created_at: true,
    updated_at: true,
    player: {
        select: PLAYER_SELECT,
    },
} satisfies Prisma.TeamPlayerSelect;

export type PlayerRow = Prisma.PlayerGetPayload<{ select: typeof PLAYER_SELECT }>;
export type TeamPlayerRow = Prisma.TeamPlayerGetPayload<{ select: typeof TEAM_PLAYER_SELECT }>;