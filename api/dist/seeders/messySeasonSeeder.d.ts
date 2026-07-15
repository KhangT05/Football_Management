import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
import type { CreatedMatchInfo } from "./groupMatchSeeder.js";
export interface MessyGroupStageResult {
    createdMatches: CreatedMatchInfo[];
    scheduledGroupLetters: GroupLetter[];
    draftGroupLetters: GroupLetter[];
    scheduleFailedGroupLetters: GroupLetter[];
}
export declare function seedMessyGroupStageMatches(db: DbClient, groupStagePhaseId: number, groupIdByLetter: Record<GroupLetter, number>, teamIdByName: Record<string, number>, seasonId: number, venueIds: number[], groups: Record<GroupLetter, string[]>, rulePoints: {
    win: number;
    draw: number;
    loss: number;
}, forfeitScore: number): Promise<MessyGroupStageResult>;
/** Chạy matchDetailSeeder (lineup/jersey/event) CHỈ cho các trận đã có tỉ số chính thức. */
export declare function seedMatchDetailsForMessyMatches(db: DbClient, createdMatches: CreatedMatchInfo[], seasonTeamIdByTeamId: Record<number, number>): Promise<void>;
//# sourceMappingURL=messySeasonSeeder.d.ts.map