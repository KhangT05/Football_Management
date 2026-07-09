export declare const TEAM_STANDING_SELECT: {
    id: true;
    group_id: true;
    team_id: true;
    position: true;
    matches_played: true;
    wins: true;
    draws: true;
    losses: true;
    goals_for: true;
    goals_against: true;
    points: true;
};
export declare const PLAYER_STATISTIC_SELECT: {
    id: true;
    player_id: true;
    team_id: true;
    season_id: true;
    matches_played: true;
    goals_scored: true;
    assists: true;
    yellow_cards: true;
    red_cards: true;
    accumulated_yellow_cards: true;
    is_suspended: true;
    player: {
        select: {
            id: true;
            avatar: true;
            user: {
                select: {
                    name: true;
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
};
export interface TeamStandingRow {
    id: number;
    group_id: number;
    team_id: number;
    position: number;
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    points: number;
}
export interface PlayerStatisticRow {
    id: number;
    player_id: number;
    team_id: number;
    season_id: number;
    matches_played: number;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    accumulated_yellow_cards: number;
    is_suspended: boolean;
    player: {
        id: number;
        avatar: string | null;
        user: {
            name: string;
        };
    };
    team: {
        id: number;
        name: string;
        logo: string | null;
    };
}
export type StandingAccum = {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    yellowCards: number;
    redCards: number;
    points: number;
};
export type H2HRecord = {
    goalsFor: number;
    goalsAgainst: number;
    points: number;
};
//# sourceMappingURL=standing.type.d.ts.map