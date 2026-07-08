import { PrismaClient } from "../generated/prisma/client.js";
import type { UserRegistrationStats, SeasonRevenueStats, TournamentOverviewStats, TeamDisciplineStats, TopScorerStats, TeamRegistrationStats, MvpWeights, BestPlayerStats, PlayerRankingMetric, PlayerRankingStats, PlayerCareerStats, SystemOverviewStats } from "../types/statistics.type.js";
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
}
//# sourceMappingURL=statistics.service.d.ts.map