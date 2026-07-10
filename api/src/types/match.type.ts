import { MatchEventType, MatchPeriod, MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';

// ─── Event input ──────────────────────────────────────────────────────────────

export interface RecordEventInput {
    playerId?: number;
    teamId?: number;
    type: MatchEventType;
    minute?: number;
    addedMinute?: number;
    // period optional ở live recording (lấy từ match.current_period),
    // bắt buộc ở correction window (match đã finished, không có current_period).
    period?: MatchPeriod;
    note?: string;
    subOutPlayerId?: number;

    // Bắt buộc khi type=goal_disallowed và bàn bị huỷ là own_goal.
    // teamId không đủ phân biệt hướng trừ — cần wasOwnGoal để đảo đúng team.
    // Schema cần voided_event_id để tự suy ra nếu dùng feature này thường xuyên.
    wasOwnGoal?: boolean;
}

// AddEventInput: period bắt buộc vì match đã finished khi correction chạy.
// Tách khỏi RecordEventInput thay vì Partial/Omit để type error rõ ràng hơn.
export interface AddEventInput extends Omit<RecordEventInput, 'period'> {
    period: MatchPeriod;
}

export interface FinalizeMatchInput {
    resultType?: MatchResultType;   // default: full_time
    homeHalfTimeScore?: number;     // snapshot half-time — optional, chỉ dùng cho display
    awayHalfTimeScore?: number;
    homePenaltyScore?: number;      // bắt buộc nếu resultType = penalty
    awayPenaltyScore?: number;
}

// Manual score — fallback khi referee không nhập events realtime.
// Dùng khi không có referee app hoặc internet trong trận.
// Constraint: submitManualScore() guard sẽ reject nếu match đã có events
// để tránh conflict giữa event-computed score và manual input.
export interface ManualScoreInput {
    homeScore: number;
    awayScore: number;
    resultType: MatchResultType;

    // Penalty tiebreaker — bắt buộc nếu resultType = penalty
    homePenalty?: number;
    awayPenalty?: number;

    // Half-time không collect ở manual path (referee chỉ nhớ tỉ số cuối)
    // → finalize_home_half_time / finalize_away_half_time sẽ để null
}

export interface ResolveAppealInput {
    resolution: 'uphold' | 'overturn';
    newHomeScore?: number;  // bắt buộc nếu overturn
    newAwayScore?: number;
    note: string;
}

// ─── State machine constants ──────────────────────────────────────────────────

// Transition hợp lệ giữa các period trong match ongoing.
// penalty_shootout không có transition ra — terminal period.
export const PERIOD_TRANSITIONS: Record<MatchPeriod, MatchPeriod[]> = {
    first_half: [MatchPeriod.second_half],
    second_half: [MatchPeriod.extra_time_first, MatchPeriod.penalty_shootout],
    extra_time_first: [MatchPeriod.extra_time_second],
    extra_time_second: [MatchPeriod.penalty_shootout],
    penalty_shootout: [],
};

// Period thuộc extra time — dùng để tách ET goals ra khỏi 90p khi compute score
export const EXTRA_TIME_PERIODS: MatchPeriod[] = [
    MatchPeriod.extra_time_first,
    MatchPeriod.extra_time_second,
];

// Score delta theo event type — dùng chung cho live-display counter và finalize aggregate.
// Tách ra constant để _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
// không thể drift logic với nhau.
//
// own_goal: delta = 1 nhưng credit bị đảo ở isCreditedToHomeTeam → không cần delta âm
// goal_disallowed: delta = -1 → trừ bàn đã cộng sai
export const SCORE_DELTA_BY_TYPE: Partial<Record<MatchEventType, 1 | -1>> = {
    [MatchEventType.goal]: 1,
    [MatchEventType.own_goal]: 1,
    [MatchEventType.penalty_scored]: 1,
    [MatchEventType.goal_disallowed]: -1,
};
export const CORRECTION_WINDOW_MS = 15 * 60 * 1000;

export const MINUTE_BOUNDS: Partial<Record<MatchPeriod, [number, number]>> = {
    [MatchPeriod.first_half]: [0, 45],
    [MatchPeriod.second_half]: [45, 90],
    [MatchPeriod.extra_time_first]: [90, 105],
    [MatchPeriod.extra_time_second]: [105, 120],
};
export const MAX_ADDED_MINUTE = 15;

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
    homeExtraTimeScore?: number;
    awayExtraTimeScore?: number;
    homePenaltyScore?: number;
    awayPenaltyScore?: number;
}
