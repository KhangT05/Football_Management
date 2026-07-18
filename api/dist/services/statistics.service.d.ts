import { LeaveReason, PrismaClient } from "../generated/prisma/client.js";
import type { UserRegistrationStats, SeasonRevenueStats, TournamentOverviewStats, TeamDisciplineStats, TopScorerStats, TeamRegistrationStats, MvpWeights, BestPlayerStats, PlayerRankingMetric, PlayerRankingStats, PlayerCareerStats, SystemOverviewStats, PlayerOverviewStats, TimeGranularity, TeamMatchTimeSeriesStats, TeamOverviewStats, TeamTournamentStats, TeamSeasonStats, TeamMatchStats, PlayerTournamentStats, PlayerSeasonStats, PlayerMatchStats, TeamAggregateStatsExtended, PlayerParticipationStats, TeamSeasonStatsBatch, TeamParticipationStats, PlayerDisciplineStatus, PlayerTeamsInPeriodStats, TeamFinanceEntry, PlayerPerformanceBatchEntry, TeamPlayerLeaveStats, PlayersWithoutTeamStats } from "../types/statistics.type.js";
export type PlayerFinanceEntry = {
    player_id: number;
    player_name: string;
    team_id: number;
    team_name: string;
    goals_scored: number;
    assists: number;
    yellow_cards: number;
    red_cards: number;
    bonus_earned: number;
    fine_owed: number;
    net_amount: number;
};
export type SeasonFinanceStats = {
    season_id: number;
    bonus_per_goal: number;
    bonus_per_assist: number;
    fine_per_yellow_card: number;
    fine_per_red_card: number;
    players: PlayerFinanceEntry[];
};
export declare class StatisticsService {
    private readonly prisma;
    private readonly userQueryable;
    constructor(prisma: PrismaClient);
    getUserRegistrationStats(period?: string): Promise<UserRegistrationStats>;
    getNewUserCount(period?: string): Promise<number>;
    getSeasonRevenue(seasonId?: number): Promise<SeasonRevenueStats>;
    getTournamentOverview(tournamentId: number): Promise<TournamentOverviewStats>;
    getTeamRegistrationStats(seasonId?: number): Promise<TeamRegistrationStats>;
    getTopScorers(seasonId: number, limit?: number): Promise<TopScorerStats>;
    getTeamDisciplineStats(seasonId: number): Promise<TeamDisciplineStats>;
    private static readonly RANKING_FIELD_MAP;
    private static readonly RANKING_WHERE_MAP;
    private static readonly RANKING_ORDER_MAP;
    getPlayerRanking(seasonId: number, metric: PlayerRankingMetric, limit?: number): Promise<PlayerRankingStats>;
    static readonly DEFAULT_MVP_WEIGHTS: MvpWeights;
    getBestPlayers(seasonId: number, limit?: number, weights?: MvpWeights): Promise<BestPlayerStats>;
    getPlayerFinanceStats(seasonId: number): Promise<SeasonFinanceStats>;
    getPlayerCareerStats(playerId: number): Promise<PlayerCareerStats>;
    getSystemOverviewStats(period?: string): Promise<SystemOverviewStats>;
    /**
     * Lấy toàn bộ trận đã có kết quả official của 1 đội, optionally filter
     * theo seasonId hoặc tournamentId, kèm rule điểm số (points_per_win/
     * draw/loss) của ĐÚNG season chứa trận đó — vì 1 tournament có thể có
     * nhiều season với rule khác nhau, không thể áp 1 rule chung khi gộp
     * nhiều season lại (Tournament Team Stats).
     */
    private _fetchTeamMatchesWithRule;
    private _aggregateTeamMatches;
    /**
     * Bản mở rộng của _fetchTeamMatchesWithRule — thêm played_at, match_id,
     * status, opponent_team_id/name để phục vụ home/away split, streak,
     * biggest win/loss, clean sheet, forfeit — mà không phải query lại lần 2.
     */
    private _fetchTeamMatchesDetailed;
    /**
     * Aggregate mở rộng — dùng chung cho all-time / tournament / season / period.
     * Input PHẢI đến từ _fetchTeamMatchesDetailed (đã sort played_at asc).
     */
    private _aggregateTeamMatchesExtended;
    /**
     * TEAM STATS — toàn bộ lịch sử của đội, không filter season/tournament.
     * Mở rộng so với bản cũ: thêm participations (danh sách giải/mùa đã
     * tham gia, kể cả mùa CHƯA đá trận nào — lấy từ SeasonTeam, độc lập với
     * phần win/draw/loss vốn chỉ tính trên match đã có kết quả).
     */
    getTeamOverviewStats(teamId: number): Promise<TeamOverviewStats>;
    getTeamOverviewStatsV2(teamId: number, period?: string): Promise<TeamOverviewStats & {
        extended: TeamAggregateStatsExtended;
    }>;
    getTeamTournamentStatsV2(teamId: number, tournamentId: number): Promise<TeamTournamentStats & {
        extended: TeamAggregateStatsExtended;
    }>;
    getTeamSeasonStatsV2(teamId: number, seasonId: number): Promise<TeamSeasonStats & {
        extended: TeamAggregateStatsExtended;
    }>;
    getTeamParticipationStats(teamId: number): Promise<TeamParticipationStats>;
    getTeamsSeasonStatsBatch(seasonId: number): Promise<TeamSeasonStatsBatch>;
    getPlayerParticipationStats(playerId: number): Promise<PlayerParticipationStats>;
    getPlayerDisciplineStatus(playerId: number, seasonId: number): Promise<PlayerDisciplineStatus>;
    /**
     * "Không tham gia team nào" hiểu là: hiện KHÔNG có record TeamPlayer sống
     * (team_players: none) — không phân biệt player mới toanh chưa từng vào
     * team nào với player đã từng vào rồi rời (ever_had_team phân biệt 2 case
     * này cho FE, tránh gộp nhầm "free agent mới" với "bị đá khỏi đội").
     */
    getPlayersWithoutTeam(): Promise<PlayersWithoutTeamStats>;
    /**
     * Rời team theo TeamPlayerHistory — filter optional theo season + reason.
     * reason_breakdown tính RIÊNG bằng groupBy trên toàn bộ where (không bị
     * cắt bởi limit của entries), entries chỉ để hiển thị chi tiết trang đầu.
     */
    getTeamPlayerLeaveStats(filter?: {
        seasonId?: number;
        reason?: LeaveReason;
        limit?: number;
    }): Promise<TeamPlayerLeaveStats>;
    getPlayerTeamsInPeriod(playerId: number, from: Date, to: Date): Promise<PlayerTeamsInPeriodStats>;
    /**
     * TOURNAMENT TEAM STATS — thống kê đội gộp qua TẤT CẢ season của 1 giải
     * đấu (vd Arsenal ở "Ngoại hạng Anh" tính từ mùa 2023 tới 2026).
     */
    getTeamTournamentStats(teamId: number, tournamentId: number): Promise<TeamTournamentStats>;
    /**
     * SEASON TEAM STATS — thống kê đội trong 1 mùa giải cụ thể
     * (vd "Arsenal mùa 2025: 38 trận, 82 điểm, 75 bàn").
     */
    getTeamSeasonStats(teamId: number, seasonId: number): Promise<TeamSeasonStats>;
    /**
     * MATCH TEAM STATS — góc nhìn 1 đội trong 1 trận cụ thể: đối thủ, kết
     * quả, danh sách người ghi bàn, thẻ phạt.
     */
    getTeamMatchStats(teamId: number, matchId: number): Promise<TeamMatchStats>;
    getTeamMatchTimeSeries(teamId: number, granularity?: TimeGranularity, period?: string): Promise<TeamMatchTimeSeriesStats>;
    getPlayerOverviewStats(playerId: number): Promise<PlayerOverviewStats>;
    /**
     * TOURNAMENT PLAYER STATS — gộp mọi season của 1 giải đấu mà player đã
     * thi đấu (mirror getTeamTournamentStats, nhưng đơn giản hơn vì không
     * cần tính points/win-loss).
     */
    getPlayerTournamentStats(playerId: number, tournamentId: number): Promise<PlayerTournamentStats>;
    /**
     * SEASON PLAYER STATS — thống kê player trong 1 mùa giải cụ thể. Trả
     * kèm breakdown theo từng đội (đề phòng trường hợp đổi đội giữa mùa —
     * unique constraint [player_id, team_id, season_id] cho phép >1 row).
     */
    getPlayerSeasonStats(playerId: number, seasonId: number): Promise<PlayerSeasonStats>;
    /**
     * MATCH PLAYER STATS — góc nhìn 1 cầu thủ trong 1 trận: có ra sân
     * không (lineup), đá bao nhiêu phút, ghi bàn/thẻ phạt trong trận đó.
     *
     * GIỚI HẠN: MatchEventType không có "assist" — số kiến tạo KHÔNG track
     * được theo từng trận, chỉ có tổng theo mùa (PlayerStatistic.assists,
     * xem getPlayerSeasonStats). Field `note` giải thích rõ điều này cho FE
     * tránh hiểu nhầm là bug thiếu dữ liệu.
     */
    getPlayerMatchStats(playerId: number, matchId: number): Promise<PlayerMatchStats>;
    /**
     * BATCH — thay N+1 getTeamFinanceStats() gọi từng team bằng 2 query
     * groupBy cho cả season, ghép theo team_id. Payment phải raw SQL vì
     * team_id không nằm trực tiếp trên bảng payments (phải qua season_teams).
     */
    getTeamsFinanceStatsBatch(seasonId: number): Promise<{
        season_id: number;
        teams: TeamFinanceEntry[];
    }>;
    /**
     * BATCH — thay N+1 getPlayerPerformanceStats() theo season. Lineup
     * (starter/sub/captain) phải raw SQL vì cần conditional SUM qua join
     * match→phase (Prisma groupBy không hỗ trợ CASE WHEN trong _count).
     */
    getPlayersPerformanceStatsBatch(seasonId: number): Promise<{
        season_id: number;
        players: PlayerPerformanceBatchEntry[];
    }>;
}
//# sourceMappingURL=statistics.service.d.ts.map