import { PrismaClient } from "../generated/prisma/client.js";
import type { UserRegistrationStats, SeasonRevenueStats, TournamentOverviewStats, TeamDisciplineStats, TopScorerStats, TeamRegistrationStats, MvpWeights, BestPlayerStats, PlayerRankingMetric, PlayerRankingStats, PlayerCareerStats } from "../types/statistics.type.js";
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
    getPlayerCareerStats(playerId: number): Promise<PlayerCareerStats>;
}
//# sourceMappingURL=statistics.service.d.ts.map