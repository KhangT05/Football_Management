import { MatchEventType, MatchPeriod, MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';
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
export declare const CORRECTION_WINDOW_MS: number;
export declare const MINUTE_BOUNDS: Partial<Record<MatchPeriod, [number, number]>>;
export declare const MAX_ADDED_MINUTE = 15;
export type DbClient = PrismaClient | Prisma.TransactionClient;
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
export interface AdminScorerInput {
    teamId: number;
    type: "goal" | "own_goal";
    minute: number;
    /**
     * Free-text, stored vào MatchEvent.note
     * Schema không có varchar player_name riêng
     */
    playerName?: string;
    /**
     * Default: null (không force default sai khi resultType = extra_time)
     */
    period?: MatchPeriod;
}
export interface AdminCardInput {
    playerId: number;
    teamId: number;
    /** substitution KHÔNG nằm trong scope này — chưa có UI/requirement rõ,
     * thêm sau nếu cần, tránh field rỗng không dùng */
    type: Extract<MatchEventType, 'yellow_card' | 'red_card' | 'second_yellow'>;
    minute: number;
    period?: MatchPeriod;
}
export interface AdminRecordResultInput {
    /** Source of truth — KHÔNG derive từ scorers */
    homeScore: number;
    awayScore: number;
    /** Metadata tùy chọn, không ảnh hưởng score computation */
    scorers?: AdminScorerInput[];
    /** Card events — KHÔNG đi qua recordEvent()'s per-write guard,
     * validate theo batch ở service layer (xem adminRecordResult) */
    cards?: AdminCardInput[];
    /** Default: full_time */
    resultType?: MatchResultType;
    homeHalfTimeScore?: number;
    awayHalfTimeScore?: number;
}
//# sourceMappingURL=match.type.d.ts.map