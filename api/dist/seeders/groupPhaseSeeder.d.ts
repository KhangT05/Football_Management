import { GroupLetter } from "./worldcup.js";
import type { DbClient } from "./dbTypes.js";
export interface GroupPhaseSeedResult {
    groupStagePhaseId: number;
    groupIdByLetter: Record<GroupLetter, number>;
}
export declare function seedGroupStage(db: DbClient, seasonId: number, teamIdByName: Record<string, number>, seasonTeamIdByTeamId: Record<number, number>): Promise<GroupPhaseSeedResult>;
//# sourceMappingURL=groupPhaseSeeder.d.ts.map