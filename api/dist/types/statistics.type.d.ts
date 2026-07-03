export interface UserRegistrationPoint {
    day: string;
    count: number;
}
export interface UserRegistrationStats {
    range_days: number;
    total_new_users: number;
    daily: UserRegistrationPoint[];
}
export interface SeasonRevenue {
    season_id: number;
    season_name: string;
    confirmed_revenue: number;
    refunded_amount: number;
    net_revenue: number;
    pending_amount: number;
    payment_count: number;
}
export interface SeasonRevenueStats {
    seasons: SeasonRevenue[];
    total_net_revenue: number;
}
export interface TournamentOverviewStats {
    tournament_id: number;
    tournament_name: string;
    season_count: number;
    active_season_count: number;
    total_matches: number;
    finished_matches: number;
    ongoing_matches: number;
}
export interface TeamRegistrationFunnel {
    season_id: number;
    season_name: string;
    pending_count: number;
    approved_count: number;
    active_count: number;
    eliminated_count: number;
    withdrawn_count: number;
    total_count: number;
}
export interface TeamRegistrationStats {
    seasons: TeamRegistrationFunnel[];
}
export interface TopScorerEntry {
    player_id: number;
    player_name: string;
    team_id: number;
    team_name: string;
    goal_count: number;
}
export interface TopScorerStats {
    season_id: number;
    limit: number;
    scorers: TopScorerEntry[];
}
export interface TeamDisciplineEntry {
    team_id: number;
    team_name: string;
    yellow_card_count: number;
    red_card_count: number;
    disciplinary_points: number;
}
export interface TeamDisciplineStats {
    season_id: number;
    teams: TeamDisciplineEntry[];
}
//# sourceMappingURL=statistics.type.d.ts.map