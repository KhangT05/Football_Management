export const TEAM_STANDING_SELECT = {
    id: true,
    group_id: true,
    team_id: true,
    position: true,
    matches_played: true,
    wins: true,
    draws: true,
    losses: true,
    goals_for: true,
    goals_against: true,
    points: true,
};
export const PLAYER_STATISTIC_SELECT = {
    id: true,
    player_id: true,
    team_id: true,
    season_id: true,
    matches_played: true,
    goals_scored: true,
    assists: true,
    yellow_cards: true,
    red_cards: true,
    accumulated_yellow_cards: true,
    is_suspended: true,
    player: { select: { id: true, avatar: true, user: { select: { name: true } } } },
    team: { select: { id: true, name: true, logo: true } },
};
//# sourceMappingURL=standing.type.js.map