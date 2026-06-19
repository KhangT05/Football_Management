import { PrismaClient } from "../generated/prisma/client.js";
export declare function seedTournaments(db: PrismaClient, adminUserId: number): Promise<{
    tournamentId: number;
    seasonId: number;
}>;
//# sourceMappingURL=tournamentSeeder.d.ts.map