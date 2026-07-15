import { Prisma } from "../generated/prisma/client.js";
import { QueryRequest } from "./queryable.type.js";
export interface ImportResult {
    success: number;
    failed: number;
    errors: {
        row: number;
        reason: string;
    }[];
}
export interface ListTeamPlayersQuery extends QueryRequest {
    team_id: number;
}
export declare const PLAYER_SELECT: {
    id: true;
    user_id: true;
    date_of_birth: true;
    position: true;
    height: true;
    weight: true;
    nationality: true;
    avatar: true;
    is_active: true;
    created_at: true;
    updated_at: true;
    user: {
        select: {
            id: true;
            name: true;
            email: true;
            student_code: true;
            phone: true;
        };
    };
};
export declare const PLAYER_PUBLIC_SELECT: {
    id: true;
    date_of_birth: true;
    position: true;
    height: true;
    weight: true;
    nationality: true;
    avatar: true;
    user: {
        select: {
            id: true;
            name: true;
            student_code: true;
        };
    };
};
export type PlayerPublicRow = Prisma.PlayerGetPayload<{
    select: typeof PLAYER_PUBLIC_SELECT;
}>;
export declare const TEAM_PLAYER_SELECT: {
    id: true;
    team_id: true;
    player_id: true;
    jersey_number: true;
    position: true;
    role: true;
    status: true;
    approval_status: true;
    is_active: true;
    created_at: true;
    updated_at: true;
    player: {
        select: {
            id: true;
            user_id: true;
            date_of_birth: true;
            position: true;
            height: true;
            weight: true;
            nationality: true;
            avatar: true;
            is_active: true;
            created_at: true;
            updated_at: true;
            user: {
                select: {
                    id: true;
                    name: true;
                    email: true;
                    student_code: true;
                    phone: true;
                };
            };
        };
    };
};
export declare const PLAYER_SELECT_WITH_SEASONS: {
    team_players: {
        where: {
            deleted_at: null;
        };
        select: {
            id: true;
            team_id: true;
            jersey_number: true;
            position: true;
            role: true;
            status: true;
            approval_status: true;
            team: {
                select: {
                    id: true;
                    name: true;
                    season_teams: {
                        where: {
                            deleted_at: null;
                        };
                        select: {
                            id: true;
                            status: true;
                            group_id: true;
                            group: {
                                select: {
                                    id: true;
                                    name: true;
                                };
                            };
                            season: {
                                select: {
                                    id: true;
                                    name: true;
                                    status: true;
                                    tournament: {
                                        select: {
                                            id: true;
                                            name: true;
                                            logo: true;
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    id: true;
    user_id: true;
    date_of_birth: true;
    position: true;
    height: true;
    weight: true;
    nationality: true;
    avatar: true;
    is_active: true;
    created_at: true;
    updated_at: true;
    user: {
        select: {
            id: true;
            name: true;
            email: true;
            student_code: true;
            phone: true;
        };
    };
};
export type PlayerWithSeasonsRow = Prisma.PlayerGetPayload<{
    select: typeof PLAYER_SELECT_WITH_SEASONS;
}>;
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
export type PlayerRow = Prisma.PlayerGetPayload<{
    select: typeof PLAYER_SELECT;
}>;
export type TeamPlayerRow = Prisma.TeamPlayerGetPayload<{
    select: typeof TEAM_PLAYER_SELECT;
}>;
//# sourceMappingURL=player.type.d.ts.map