import { PrismaClient } from "../generated/prisma/client.js";
export interface TournamentSeedResult {
    tournamentId: number;
    tournamentRuleId: number;
}
export declare function seedWorldCupTournament(db: PrismaClient, organizerUserId: number): Promise<TournamentSeedResult>;
//# sourceMappingURL=tournamentSeeder.d.ts.map