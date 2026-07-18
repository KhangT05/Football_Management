import { Prisma } from "../generated/prisma/client.js";
import { QueryRequest } from "./queryable.type.js";

export interface ImportResult {
    success: number;
    failed: number;
    skipped: number; // MỚI: player đã có trong đội — không phải lỗi, không phải success
    errors: { row: number; reason: string }[];
    skippedRows: { row: number; reason: string }[]; // MỚI
}

// FIX: TeamPlayer không có team_id trực tiếp — chỉ có season_team_id.
// Roster luôn scoped theo 1 lần tham dự season cụ thể (SeasonTeam).
export interface ListTeamPlayersQuery extends QueryRequest {
    season_team_id: number;
}

// ─── Projection ───────────────────────────────────────────────────────────────

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
        select: { id: true, name: true, email: true, student_code: true, phone: true },
    },
} satisfies Prisma.PlayerSelect;

export const PLAYER_PUBLIC_SELECT = {
    id: true, date_of_birth: true, position: true, height: true,
    weight: true, nationality: true, avatar: true,
    user: { select: { id: true, name: true, student_code: true } },
} satisfies Prisma.PlayerSelect;

export type PlayerPublicRow = Prisma.PlayerGetPayload<{ select: typeof PLAYER_PUBLIC_SELECT }>;

// FIX: bỏ team_id/is_active/deleted_at (không tồn tại trên TeamPlayer).
// Thêm season_team_id + season_team.team_id để resolve team khi cần.
export const TEAM_PLAYER_SELECT = {
    id: true,
    season_team_id: true,
    player_id: true,
    jersey_number: true,
    position: true,
    role: true,
    status: true,
    approval_status: true,
    created_at: true,
    updated_at: true,
    joined_at: true,
    season_team: {
        select: {
            id: true,
            team_id: true,
            season_id: true,
        },
    },
    player: {
        select: PLAYER_SELECT,
    },
} satisfies Prisma.TeamPlayerSelect;

// FIX: đi đúng chiều team_players -> season_team -> {team, season.tournament, group}
// thay vì team_players -> team -> season_teams (sai quan hệ, và trả về mọi
// season của team thay vì đúng season của team_player đang xét).
export const PLAYER_SELECT_WITH_SEASONS = {
    ...PLAYER_SELECT,
    team_players: {
        select: {
            id: true,
            season_team_id: true,
            jersey_number: true,
            position: true,
            role: true,
            status: true,
            approval_status: true,
            season_team: {
                select: {
                    id: true,
                    status: true,
                    group_id: true,
                    group: {
                        select: { id: true, name: true },
                    },
                    team: {
                        select: { id: true, name: true },
                    },
                    season: {
                        select: {
                            id: true,
                            name: true,
                            status: true,
                            tournament: {
                                select: { id: true, name: true, logo: true },
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
    tournament_id: number;
    tournament_name: string;
    tournament_logo: string | null;
    group_name: string | null;
    team_id: number;
    team_name: string;
    season_team_status: string;
    group_id: number | null;
    jersey_number: number;
}

export type PlayerRow = Prisma.PlayerGetPayload<{ select: typeof PLAYER_SELECT }>;
export type TeamPlayerRow = Prisma.TeamPlayerGetPayload<{ select: typeof TEAM_PLAYER_SELECT }>;