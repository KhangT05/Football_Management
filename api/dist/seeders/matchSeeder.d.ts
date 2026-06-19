import { PrismaClient } from "../generated/prisma/client.js";
import { TeamSeedResult } from "./teamSeeder.js";
import { PhaseGroupResult } from "./phaseSeeder.js";
export declare function seedMatches(db: PrismaClient, seasonId: number, phaseResult: PhaseGroupResult, teams: TeamSeedResult[], venueId: number, adminUserId: number): Promise<void>;
//# sourceMappingURL=matchSeeder.d.ts.map