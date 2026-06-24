import { MatchResultType, MatchStatus } from '../generated/prisma/client.js';
export interface ConfirmResultInput {
    homeScore: number;
    awayScore: number;
    resultType: MatchResultType;
    homeHalfTimeScore?: number;
    awayHalfTimeScore?: number;
    homeExtraTime?: number;
    awayExtraTime?: number;
    homePenalty?: number;
    awayPenalty?: number;
    notes?: string;
}
export interface ConfirmResultOutput {
    matchResultId: number;
    winnerTeamId: number | null;
    standingUpdated: boolean;
    knockoutAdvanced: boolean;
    newMatchId?: number;
}
export interface WinnerResolution {
    winnerTeamId: number | null;
    homeFinal: number;
    awayFinal: number;
}
export declare const STATUS_BY_RESULT_TYPE: Partial<Record<MatchResultType, MatchStatus>>;
//# sourceMappingURL=matchResult.type.d.ts.map