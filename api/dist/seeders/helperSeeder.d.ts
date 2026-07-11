import { PlayerPosition } from "../generated/prisma/client.js";
export declare const randInt: (min: number, max: number) => number;
export declare const pick: <T>(arr: readonly T[]) => T | undefined;
export declare const pickOrThrow: <T>(arr: readonly T[], context: string) => T;
export declare function randomGoals(): number;
export interface SimResult {
    homeScore: number;
    awayScore: number;
    isDraw: boolean;
}
export declare function simulateGroupMatch(): SimResult;
export interface KnockoutSimResult {
    homeScore: number;
    awayScore: number;
    wentToExtraTime: boolean;
    wentToPenalty: boolean;
    homePenalty?: number;
    awayPenalty?: number;
    winnerIsHome: boolean;
}
export declare const atOrThrow: <T>(arr: readonly T[], idx: number, context: string) => T;
export declare function simulateKnockoutMatch(): KnockoutSimResult;
export declare function generatePlayerName(seedIndex: number): string;
export declare function generatePlayerEmail(teamSlug: string, seedIndex: number): string;
export declare function slugifyTeamName(name: string): string;
export declare function buildSquadPositions(): PlayerPosition[];
//# sourceMappingURL=helperSeeder.d.ts.map