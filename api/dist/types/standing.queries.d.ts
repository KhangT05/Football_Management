import { Prisma } from '../generated/prisma/client.js';
export declare const standingListSelect: {
    id: true;
    position: true;
    matches_played: true;
    wins: true;
    draws: true;
    losses: true;
    goals_for: true;
    goals_against: true;
    points: true;
    team_id: true;
    group_id: true;
    team: {
        select: {
            id: true;
            name: true;
            logo: true;
        };
    };
};
export declare const standingForRecomputeSelect: {
    id: true;
    team_id: true;
    group_id: true;
    matches_played: true;
    wins: true;
    draws: true;
    losses: true;
    goals_for: true;
    goals_against: true;
    points: true;
    position: true;
};
export type StandingList = Prisma.TeamStandingGetPayload<{
    select: typeof standingListSelect;
}>;
export type StandingForRecompute = Prisma.TeamStandingGetPayload<{
    select: typeof standingForRecomputeSelect;
}>;
//# sourceMappingURL=standing.queries.d.ts.map