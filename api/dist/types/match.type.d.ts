import { MatchEventType, MatchPeriod, MatchResultType } from '../generated/prisma/client.js';
export interface RecordEventInput {
    playerId?: number;
    teamId?: number;
    type: MatchEventType;
    minute?: number;
    addedMinute?: number;
    period?: MatchPeriod;
    note?: string;
    subOutPlayerId?: number;
    wasOwnGoal?: boolean;
}
export interface AddEventInput extends Omit<RecordEventInput, 'period'> {
    period: MatchPeriod;
}
export interface FinalizeMatchInput {
    resultType?: MatchResultType;
    homeHalfTimeScore?: number;
    awayHalfTimeScore?: number;
    homePenaltyScore?: number;
    awayPenaltyScore?: number;
}
export interface ManualScoreInput {
    homeScore: number;
    awayScore: number;
    resultType: MatchResultType;
    homePenalty?: number;
    awayPenalty?: number;
}
export interface ResolveAppealInput {
    resolution: 'uphold' | 'overturn';
    newHomeScore?: number;
    newAwayScore?: number;
    note: string;
}
export declare const PERIOD_TRANSITIONS: Record<MatchPeriod, MatchPeriod[]>;
export declare const EXTRA_TIME_PERIODS: MatchPeriod[];
export declare const SCORE_DELTA_BY_TYPE: Partial<Record<MatchEventType, 1 | -1>>;
export type EditEventInput = Partial<RecordEventInput>;
export type EditScoreInput = {
    homeScore: number;
    awayScore: number;
    homePenalty?: number;
    awayPenalty?: number;
    homeExtraTime?: number;
    awayExtraTime?: number;
    homeHalfTime?: number;
    awayHalfTime?: number;
    resultType?: MatchResultType;
    notes?: string;
};
//# sourceMappingURL=match.type.d.ts.map