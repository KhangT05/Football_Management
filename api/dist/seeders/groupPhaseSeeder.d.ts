import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
export interface GroupPhaseSeedResult {
    groupStagePhaseId: number;
    groupIdByLetter: Record<GroupLetter, number>;
}
export declare function seedGroupStage(db: DbClient, seasonId: number, teamIdByName: Record<string, number>, seasonTeamIdByTeamId: Record<number, number>, groups: Record<GroupLetter, string[]>): Promise<GroupPhaseSeedResult>;
//# sourceMappingURL=groupPhaseSeeder.d.ts.map