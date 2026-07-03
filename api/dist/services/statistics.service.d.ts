import { PrismaClient } from "../generated/prisma/client.js";
import type { UserRegistrationStats, SeasonRevenueStats, TournamentOverviewStats, TeamDisciplineStats, TopScorerStats, TeamRegistrationStats } from "../types/statistics.type.js";
export declare class StatisticsService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getUserRegistrationStats(days?: number): Promise<UserRegistrationStats>;
    getSeasonRevenue(seasonId?: number): Promise<SeasonRevenueStats>;
    getTournamentOverview(tournamentId: number): Promise<TournamentOverviewStats>;
    getTeamRegistrationStats(seasonId?: number): Promise<TeamRegistrationStats>;
    getTopScorers(seasonId: number, limit?: number): Promise<TopScorerStats>;
    getTeamDisciplineStats(seasonId: number): Promise<TeamDisciplineStats>;
}
//# sourceMappingURL=statistics.service.d.ts.map