import { PrismaClient } from "../generated/prisma/client.js";
import { GroupLetter } from "./worldcup.js";
export interface GroupPhaseSeedResult {
    groupStagePhaseId: number;
    groupIdByLetter: Record<GroupLetter, number>;
}
export declare function seedGroupStage(db: PrismaClient, seasonId: number, teamIdByName: Record<string, number>, seasonTeamIdByTeamId: Record<number, number>): Promise<GroupPhaseSeedResult>;
//# sourceMappingURL=groupPhaseSeeder.d.ts.map