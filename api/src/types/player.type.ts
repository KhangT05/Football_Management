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
export const PLAYER_SELECT_WITH_SEASONS = {
    ...PLAYER_SELECT,
    team_players: {
        where: { deleted_at: null },
        select: {
            id: true,
            team_id: true,
            jersey_number: true,
            position: true,
            role: true,
            status: true,
            approval_status: true,
            team: {
                select: {
                    id: true,
                    name: true,
                    season_teams: {
                        where: { deleted_at: null },
                        select: {
                            id: true,
                            status: true,
                            group_id: true,
                            season: {
                                select: { id: true, name: true, status: true },
                            },
                        },
                    },
                },
            },
        },
    },
} satisfies Prisma.PlayerSelect;

export type PlayerWithSeasonsRow = Prisma.PlayerGetPayload<{ select: typeof PLAYER_SELECT_WITH_SEASONS }>;

export interface PlayerSeasonInfo {
    season_id: number;
    season_name: string;
    season_status: string;
    team_id: number;
    team_name: string;
    season_team_status: string;
    group_id: number | null;
    jersey_number: number;
}
export type PlayerRow = Prisma.PlayerGetPayload<{ select: typeof PLAYER_SELECT }>;
export type TeamPlayerRow = Prisma.TeamPlayerGetPayload<{ select: typeof TEAM_PLAYER_SELECT }>;