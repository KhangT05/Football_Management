export interface UserRegistrationPoint {
    day: string; // YYYY-MM-DD, bucketed theo business timezone
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
    confirmed_revenue: number; // sum(amount) where status = confirmed
    refunded_amount: number;   // sum(refund_amount) where status = refunded
    net_revenue: number;       // confirmed - refunded
    pending_amount: number;    // sum(amount) where status = pending, KHÔNG tính vào revenue
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
    disciplinary_points: number; // yellow=1, red=3 — convention, sửa theo luật giải thật
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

export type MvpWeights = { goal: number; assist: number; yellow: number; red: number };

export type BestPlayerEntry = PlayerRankingEntry & { score: number };

export type BestPlayerStats = {
    season_id: number;
    limit: number;
    weights: MvpWeights;
    players: BestPlayerEntry[];
};

export interface PlayerCareerStatEntry {
    season_id: number;
    season_name: string; // hiển thị như cột "Năm" trong ảnh (vd "2025-2026")
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