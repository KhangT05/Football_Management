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

export interface SystemOverviewStats {
    tournament_count: number;
    season_count: number;
    team_count: number;
    user_count: number;
    total_revenue: number;   // net revenue toàn hệ thống (confirmed - refunded), KHÔNG tính pending
    new_user_count: number;  // người dùng mới trong `period`
    period_days: number;
}

export type TimeGranularity = "day" | "month" | "year";

export type TeamMatchTimeSeriesPoint = {
    bucket: string; // "2026-07-14" | "2026-07" | "2026" tuỳ granularity
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

// ═══════════════════════════════════════════════════════════════════════════
// STATS HIERARCHY
// ═══════════════════════════════════════════════════════════════════════════
//
// Team
// ├── Team Stats                  → TeamOverviewStats           (toàn bộ lịch sử)
// ├── Tournament Team Stats       → TeamTournamentStats         (theo giải đấu — gộp mọi season của giải)
// ├── Season Team Stats           → TeamSeasonStats             (theo 1 mùa giải cụ thể)
// └── Match Team Stats            → TeamMatchStats              (theo 1 trận cụ thể)
//
// Player
// ├── Player Stats                → PlayerOverviewStats         (toàn bộ sự nghiệp)
// ├── Tournament Player Stats     → PlayerTournamentStats       (theo giải đấu)
// ├── Season Player Stats         → PlayerSeasonStats           (theo mùa)
// └── Match Player Stats          → PlayerMatchStats            (theo trận)
//
// LƯU Ý: MatchEventType không có "assist" — số liệu kiến tạo chỉ có ở mức
// PlayerStatistic (theo season), KHÔNG track được theo từng trận đấu.
// PlayerMatchStats vì vậy không có field `assists`.

// ── Team: participations (dùng chung cho TeamOverviewStats) ────────────────
export type TeamParticipation = {
    season_id: number;
    season_name: string;
    season_status: string;
    tournament_id: number;
    tournament_name: string;
    registration_status: string; // SeasonTeam.status: pending/approved/active/eliminated/withdrawn
};

export type TeamOverviewStats = {
    team_id: number;
    team_name: string;
    tournament_count: number; // distinct tournament đã tham gia
    season_count: number;     // tổng số season (registration) đã tham gia
    participations: TeamParticipation[];
    total_matches_played: number;
    total_wins: number;
    total_draws: number;
    total_losses: number;
    win_rate: number; // %, làm tròn 1 chữ số thập phân
    total_goals_for: number;
    total_goals_against: number;
    goal_difference: number;
};

// Phần thống kê trận đấu dùng chung cho Tournament Team Stats & Season Team Stats
export type TeamAggregateStatsBase = {
    total_matches_played: number;
    total_wins: number;
    total_draws: number;
    total_losses: number;
    win_rate: number;
    total_goals_for: number;
    total_goals_against: number;
    goal_difference: number;
    total_points: number; // cộng dồn theo points_per_win/draw/loss của rule TỪNG season chứa trận đó
};

export type TeamTournamentStats = TeamAggregateStatsBase & {
    team_id: number;
    team_name: string;
    tournament_id: number;
    tournament_name: string;
    season_count: number; // số mùa của giải này mà đội đã tham gia
    seasons: { season_id: number; season_name: string }[];
};

export type TeamSeasonStats = TeamAggregateStatsBase & {
    team_id: number;
    team_name: string;
    season_id: number;
    season_name: string;
    tournament_id: number;
    tournament_name: string;
    group_name: string | null; // null nếu chưa được chia bảng (SeasonTeam.group_id null)
};

export type TeamMatchGoalEntry = {
    minute: number | null;
    player_id: number | null;
    player_name: string | null;
    type: string; // "goal" | "penalty_scored"
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
    result: "win" | "draw" | "loss" | "pending"; // pending = chưa có kết quả official
    goals: TeamMatchGoalEntry[];
    yellow_cards: number;
    red_cards: number;
};

// ── Player ───────────────────────────────────────────────────────────────
export type PlayerOverviewStats = {
    player_id: number;
    player_name: string;
    tournament_count: number; // distinct giải đã tham gia
    team_count: number;       // distinct đội đã khoác áo
    season_count: number;     // distinct mùa đã thi đấu
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
    season_count: number; // số mùa của giải này player đã thi đấu
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
    // Bình thường 1 player chỉ có 1 team/season (unique [player_id, team_id,
    // season_id] cho phép >1 row nếu đổi đội giữa mùa) — breakdown theo từng đội.
    teams: PlayerSeasonTeamBreakdown[];
};

export type PlayerMatchEventEntry = {
    minute: number | null;
    type: string; // MatchEventType
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
    minutes_played: number | null; // null nếu không xác định được (thiếu minute_in/out)
    is_captain: boolean;
    goals: number;
    yellow_cards: number;
    red_cards: number;
    events: PlayerMatchEventEntry[];
    note: string; // giải thích giới hạn dữ liệu (vd không có assist theo trận)
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM — PARTICIPATION (tham gia giải/mùa)
// ═══════════════════════════════════════════════════════════════════════
export type TeamParticipationStats = {
    team_id: number;
    team_name: string;
    tournament_count: number; // distinct tournament đã tham gia
    season_count: number;     // tổng số lần đăng ký mùa giải
    status_breakdown: {
        pending: number;
        approved: number;
        active: number;
        eliminated: number;
        withdrawn: number;
    };
    participations: TeamParticipation[]; // đã có sẵn type này
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM — PERFORMANCE EXTENDED (home/away, clean sheet, streak, biggest result)
// ═══════════════════════════════════════════════════════════════════════
export type TeamHomeAwaySplit = {
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
};

export type TeamBiggestResult = {
    match_id: number;
    opponent_team_id: number;
    opponent_team_name: string;
    goals_for: number;
    goals_against: number;
    played_at: string | null;
} | null;

export type TeamStreakEntry = { type: "W" | "D" | "L"; count: number } | null;

export type TeamAggregateStatsExtended = TeamAggregateStatsBase & {
    home: TeamHomeAwaySplit;
    away: TeamHomeAwaySplit;
    clean_sheets: number; // số trận không thủng lưới
    forfeit_wins: number; // thắng do đối thủ bỏ cuộc
    forfeit_losses: number; // thua do đội nhà bỏ cuộc
    biggest_win: TeamBiggestResult;
    biggest_loss: TeamBiggestResult;
    current_streak: TeamStreakEntry; // chuỗi trận gần nhất (theo played_at)
    avg_goals_for_per_match: number;
    avg_goals_against_per_match: number;
};

// Filter dùng chung cho mọi tầng (toàn thời gian / theo giải / theo mùa / theo khoảng ngày)
export type TeamStatsFilter = {
    seasonId?: number;
    tournamentId?: number;
    period?: string; // '7d'|'30d'|'90d'|'3m'|'6m'|'1y'
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM — SQUAD (đội hình / nhân sự)
// ═══════════════════════════════════════════════════════════════════════
export type TeamSquadPositionBreakdown = {
    goalkeeper: number;
    defender: number;
    midfielder: number;
    forward: number;
};

export type TeamSquadStats = {
    team_id: number;
    team_name: string;
    current_player_count: number;
    position_breakdown: TeamSquadPositionBreakdown;
    average_age: number | null; // null nếu chưa có cầu thủ nào
    joined_in_period: number;  // số cầu thủ gia nhập trong period
    left_in_period: number;    // số cầu thủ rời đội trong period
    period_days: number | null;
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM — FINANCE (tài chính đội)
// ═══════════════════════════════════════════════════════════════════════
export type TeamFinanceStats = {
    team_id: number;
    team_name: string;
    season_id: number | null; // null = toàn bộ lịch sử
    total_registration_fee_paid: number; // sum Payment.amount status=confirmed
    total_registration_fee_refunded: number;
    total_bonus_payable: number; // sum PlayerStatistic bonus (goal+assist) của toàn đội
    total_fine_owed: number;     // sum PlayerStatistic.total_fine_owed của toàn đội
};

// ═══════════════════════════════════════════════════════════════════════
// TEAM — BATCH (bảng so sánh nhiều đội trong 1 mùa)
// ═══════════════════════════════════════════════════════════════════════
export type TeamSeasonStatsBatchEntry = TeamAggregateStatsBase & {
    team_id: number;
    team_name: string;
};
export type TeamSeasonStatsBatch = {
    season_id: number;
    teams: TeamSeasonStatsBatchEntry[];
};

// ═══════════════════════════════════════════════════════════════════════
// PLAYER — PARTICIPATION
// ═══════════════════════════════════════════════════════════════════════
export type PlayerTeamTenure = {
    team_id: number;
    team_name: string;
    joined_at: string;       // TeamPlayer.created_at
    left_at: string | null;  // TeamPlayer.deleted_at, null = vẫn còn ở đội
    jersey_number: number;
    role: string;
};

export type PlayerParticipationStats = {
    player_id: number;
    player_name: string;
    tournament_count: number;
    season_count: number;
    team_count: number; // distinct đội đã khoác áo (career, kể cả đã rời)
    current_team: { team_id: number; team_name: string } | null;
    team_history: PlayerTeamTenure[]; // sort theo joined_at desc
};

// ═══════════════════════════════════════════════════════════════════════
// PLAYER — PERFORMANCE EXTENDED
// ═══════════════════════════════════════════════════════════════════════
export type PlayerPerformanceStats = {
    player_id: number;
    player_name: string;
    season_id: number | null; // null = toàn bộ sự nghiệp
    total_matches_played: number;
    total_starter_count: number;
    total_substitute_count: number;
    total_captain_count: number;
    total_minutes_played: number;
    avg_minutes_per_match: number;
    total_goals: number;
    total_assists: number;
    avg_goals_per_match: number;
    total_yellow_cards: number;
    total_red_cards: number;
};

// ═══════════════════════════════════════════════════════════════════════
// PLAYER — DISCIPLINE STATUS (trạng thái hiện tại, không phải lịch sử)
// ═══════════════════════════════════════════════════════════════════════
export type PlayerDisciplineStatus = {
    player_id: number;
    player_name: string;
    season_id: number;
    is_suspended: boolean;
    suspension_matches_remaining: number;
    yellow_cards_since_reset: number;
    accumulated_yellow_cards: number;
    total_fine_owed: number;
};

// ═══════════════════════════════════════════════════════════════════════
// PLAYER — TEAMS/SEASONS TRONG 1 KHOẢNG THỜI GIAN
// ═══════════════════════════════════════════════════════════════════════
// LƯU Ý: bucket theo overlap giữa [from, to] và [Season.start_date,
// Season.end_date]. Nếu season chưa có start_date/end_date (null), season
// đó bị loại khỏi kết quả — không đoán mò ngày.
export type PlayerTeamsInPeriodEntry = {
    team_id: number;
    team_name: string;
    season_id: number;
    season_name: string;
};
export type PlayerTeamsInPeriodStats = {
    player_id: number;
    from: string;
    to: string;
    entries: PlayerTeamsInPeriodEntry[];
    distinct_team_count: number;
    distinct_season_count: number;
};

export type TeamFinanceEntry = {
    team_id: number;
    team_name: string;
    total_registration_fee_paid: number;
    total_registration_fee_refunded: number;
    total_bonus_payable: number;
    total_fine_owed: number;
};


export type PlayerPerformanceBatchEntry = {
    player_id: number;
    player_name: string;
    total_matches_played: number;
    total_starter_count: number;
    total_substitute_count: number;
    total_captain_count: number;
    total_minutes_played: number;
    avg_minutes_per_match: number;
    total_goals: number;
    total_assists: number;
    avg_goals_per_match: number;
    total_yellow_cards: number;
    total_red_cards: number;
};