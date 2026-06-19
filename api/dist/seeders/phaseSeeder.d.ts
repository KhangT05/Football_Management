import { PrismaClient } from "../generated/prisma/client.js";
export interface PhaseGroupResult {
    groupStagePhaseId: number;
    knockoutPhaseIds: {
        [key: string]: number;
    };
    groupIds: [number, number];
}
export declare function seedPhasesAndGroups(db: PrismaClient, seasonId: number, teamIds: number[]): Promise<PhaseGroupResult>;
//# sourceMappingURL=phaseSeeder.d.ts.map