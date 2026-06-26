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
/**
 * Xác định bàn thắng/trừ điểm có tính cho home hay không.
 * Dùng chung ở _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
 * để đảm bảo 2 nơi không viết 2 ternary khác nhau cho cùng business rule.
 *
 * own_goal:         team đá phản lưới → credit cho đối thủ
 * goal_disallowed:  nếu bàn bị huỷ là own_goal → đảo ngược (trừ về đúng bên đã được cộng)
 * goal/penalty_scored: team ghi → credit cho chính mình
 */
export declare function isCreditedToHomeTeam(homeTeamId: number, eventTeamId: number, type: MatchEventType, wasOwnGoal?: boolean): boolean;
//# sourceMappingURL=match.type.d.ts.map