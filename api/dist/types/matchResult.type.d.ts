import { MatchResultType, MatchStatus } from '../generated/prisma/client.js';
import { ScheduleOptions } from './schedule.type.js';
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
export interface ConfirmOfficialBody {
    /**
     * resultType: MatchResultType — full_time | extra_time | penalty | forfeit | walkover
     * - full_time: homeScore + awayScore bắt buộc
     * - extra_time: thêm homeExtraTime + awayExtraTime (cumulative 90+ET)
     * - penalty: thêm homePenalty + awayPenalty (không được hoà)
     * - forfeit / walkover: score theo forfeit_score trong TournamentRule
     */
    input: ConfirmResultInput;
    scheduleOptions: ScheduleOptions;
}
export type StandingAccum = {
    teamId: number;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    yellowCards: number;
    redCards: number;
    points: number;
};
export type H2HRecord = {
    goalsFor: number;
    goalsAgainst: number;
    points: number;
};
//# sourceMappingURL=matchResult.type.d.ts.map