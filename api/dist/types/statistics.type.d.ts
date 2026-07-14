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
export type PlayerRankingMetric = "goals" | "assists" | "yellow_cards" | "red_cards";
export type PlayerRankingEntry = {
    player_id: number;
    player_name: string;
    team_id: number;
    team_name: string;
    value: number;
    matches_played: number;
};
export type PlayerRankingStats = {
    season_id: number;
    limit: number;
    metric: PlayerRankingMetric;
    players: PlayerRankingEntry[];
};
export type MvpWeights = {
    goal: number;
    assist: number;
    yellow: number;
    red: number;
};
export type BestPlayerEntry = PlayerRankingEntry & {
    score: number;
};
export type BestPlayerStats = {
    season_id: number;
    limit: number;
    weights: MvpWeights;
    players: BestPlayerEntry[];
};
export interface PlayerCareerStatEntry {
    season_id: number;
    season_name: string;
    matches_played: number;
    goals: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
}
export interface PlayerCareerStatsByTournament {
    tournament_id: number;
    tournament_name: string;
    seasons: PlayerCareerStatEntry[];
}
export interface PlayerCareerStats {
    player_id: number;
    player_name: string;
    tournaments: PlayerCareerStatsByTournament[];
}
export interface SystemOverviewStats {
    tournament_count: number;
    season_count: number;
    team_count: number;
    user_count: number;
    total_revenue: number;
    new_user_count: number;
    period_days: number;
}
export type TimeGranularity = "day" | "month" | "year";
export type TeamMatchTimeSeriesPoint = {
    bucket: string;
    wins: number;
    draws: number;
    losses: number;
    matches_played: number;
};
export type TeamMatchTimeSeriesStats = {
    team_id: number;
    granularity: TimeGranularity;
    period: string | null;
    points: TeamMatchTimeSeriesPoint[];
};
export type TeamParticipation = {
    season_id: number;
    season_name: string;
    season_status: string;
    tournament_id: number;
    tournament_name: string;
    registration_status: string;
};
export type TeamOverviewStats = {
    team_id: number;
    team_name: string;
    tournament_count: number;
    season_count: number;
    participations: TeamParticipation[];
    total_matches_played: number;
    total_wins: number;
    total_draws: number;
    total_losses: number;
    win_rate: number;
    total_goals_for: number;
    total_goals_against: number;
    goal_difference: number;
};
export type TeamAggregateStatsBase = {
    total_matches_played: number;
    total_wins: number;
    total_draws: number;
    total_losses: number;
    win_rate: number;
    total_goals_for: number;
    total_goals_against: number;
    goal_difference: number;
    total_points: number;
};
export type TeamTournamentStats = TeamAggregateStatsBase & {
    team_id: number;
    team_name: string;
    tournament_id: number;
    tournament_name: string;
    season_count: number;
    seasons: {
        season_id: number;
        season_name: string;
    }[];
};
export type TeamSeasonStats = TeamAggregateStatsBase & {
    team_id: number;
    team_name: string;
    season_id: number;
    season_name: string;
    tournament_id: number;
    tournament_name: string;
    group_name: string | null;
};
export type TeamMatchGoalEntry = {
    minute: number | null;
    player_id: number | null;
    player_name: string | null;
    type: string;
};
export type TeamMatchStats = {
    team_id: number;
    team_name: string;
    match_id: number;
    season_id: number;
    season_name: string;
    phase_id: number;
    phase_name: string;
    played_at: string | null;
    opponent_team_id: number;
    opponent_team_name: string;
    is_home: boolean;
    goals_for: number;
    goals_against: number;
    result: "win" | "draw" | "loss" | "pending";
    goals: TeamMatchGoalEntry[];
    yellow_cards: number;
    red_cards: number;
};
export type PlayerOverviewStats = {
    player_id: number;
    player_name: string;
    tournament_count: number;
    team_count: number;
    season_count: number;
    total_matches_played: number;
    total_goals: number;
    total_assists: number;
    total_yellow_cards: number;
    total_red_cards: number;
};
export type PlayerTournamentStats = {
    player_id: number;
    player_name: string;
    tournament_id: number;
    tournament_name: string;
    season_count: number;
    total_matches_played: number;
    total_goals: number;
    total_assists: number;
    total_yellow_cards: number;
    total_red_cards: number;
};
export type PlayerSeasonTeamBreakdown = {
    team_id: number;
    team_name: string;
    matches_played: number;
    goals: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
};
export type PlayerSeasonStats = {
    player_id: number;
    player_name: string;
    season_id: number;
    season_name: string;
    tournament_id: number;
    tournament_name: string;
    total_matches_played: number;
    total_goals: number;
    total_assists: number;
    total_yellow_cards: number;
    total_red_cards: number;
    teams: PlayerSeasonTeamBreakdown[];
};
export type PlayerMatchEventEntry = {
    minute: number | null;
    type: string;
};
export type PlayerMatchStats = {
    player_id: number;
    player_name: string;
    match_id: number;
    team_id: number;
    team_name: string;
    opponent_team_id: number | null;
    opponent_team_name: string | null;
    played_at: string | null;
    lineup_type: "starter" | "substitute";
    minutes_played: number | null;
    is_captain: boolean;
    goals: number;
    yellow_cards: number;
    red_cards: number;
    events: PlayerMatchEventEntry[];
    note: string;
};
//# sourceMappingURL=statistics.type.d.ts.map