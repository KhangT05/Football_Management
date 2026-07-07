import { Prisma, SeasonTeamStatus, SeasonStatus } from "../generated/prisma/client.js";
export declare const withRelations: {
    include: {
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
        team: {
            select: {
                id: true;
                name: true;
                logo: true;
            };
        };
        user: {
            select: {
                id: true;
                name: true;
                email: true;
            };
        };
        group: {
            select: {
                id: true;
                name: true;
            };
        };
    };
};
export type SeasonTeamWithRelationsInternal = Prisma.SeasonTeamGetPayload<typeof withRelations>;
export interface SeasonTeamWithRelations {
    id: number;
    season_id: number;
    team_id: number;
    user_id: number | null;
    status: SeasonTeamStatus;
    group_id: number | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    is_active: boolean;
    seed: number | null;
    season: {
        id: number;
        name: string;
        status: SeasonStatus;
        tournament: {
            id: number;
            name: string;
            logo: string | null;
        };
    };
    team: {
        id: number;
        name: string;
        logo: string | null;
    };
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
    group: {
        id: number;
        name: string;
    } | null;
}
//# sourceMappingURL=seasonTeam.type.d.ts.map