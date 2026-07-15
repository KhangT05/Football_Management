import type { DbClient } from "./dbTypes.js";
export interface SuspensionRuleParams {
    yellowCardsSuspension: number;
    suspensionMatchCount: number;
    finePerYellowCard: number;
    finePerRedCard: number;
}
export declare function applySuspensionsAndFines(db: DbClient, seasonId: number, rule: SuspensionRuleParams): Promise<void>;
//# sourceMappingURL=suspensionSeeder.d.ts.map