import { PrismaClient } from "../generated/prisma/client.js";
import { TeamSeedResult } from "./teamSeeder.js";
export declare function seedSeasons(db: PrismaClient, adminUserId: number, tournamentId: number, allTeams: TeamSeedResult[]): Promise<void>;
//# sourceMappingURL=season.seeder.d.ts.map