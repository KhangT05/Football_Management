// ── TeamStanding ──────────────────────────────────────────────
export const standingListSelect = {
    id: true,
    position: true,
    matches_played: true,
    wins: true,
    draws: true,
    losses: true,
    goals_for: true,
    goals_against: true,
    points: true,
    team_id: true,
    group_id: true,
    team: {
        select: { id: true, name: true, logo: true },
    },
};
// recomputeGroupStandings chỉ cần raw numbers — không join team
export const standingForRecomputeSelect = {
    id: true,
    team_id: true,
    group_id: true,
    matches_played: true,
    wins: true,
    draws: true,
    losses: true,
    goals_for: true,
    goals_against: true,
    points: true,
    position: true,
};
//# sourceMappingURL=standing.queries.js.map