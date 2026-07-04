import { Group } from "../generated/prisma/client.js";
export interface DrawGroupsOptions {
    teams_per_group: number;
}
export interface DrawAssignment {
    group_id: number;
    team_id: number;
}
export interface AssignTeamToGroupBody {
    season_team_id: number;
    group_id: number;
}
export interface SwapTeamsBody {
    season_team_id_a: number;
    season_team_id_b: number;
}
export type GroupWithTeams = Group & {
    phase: {
        id: number;
        name: string;
        season_id: number;
        format: string;
        is_active: boolean;
    };
    season_teams: {
        id: number;
        status: string;
        team: {
            id: number;
            name: string;
            logo: string | null;
        };
    }[];
};
export interface CreateGroupBody {
    name: string;
}
export interface CreateGroupsBulkBody {
    /** Số group cần tạo — map thành "Bảng A".."Bảng Z", max 26 */
    count: number;
}
//# sourceMappingURL=group.type.d.ts.map