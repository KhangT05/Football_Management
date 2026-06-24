import { MatchEventType, MatchPeriod, MatchResultType } from '../generated/prisma/client.js';

// ─── Event input ──────────────────────────────────────────────────────────────

export interface RecordEventInput {
    playerId?: number;
    teamId?: number;
    type: MatchEventType;
    minute?: number;
    addedMinute?: number;
    note?: string;
    subOutPlayerId?: number;

    // Bắt buộc khi type=goal_disallowed và bàn bị huỷ là own_goal.
    // teamId không đủ phân biệt hướng trừ — cần wasOwnGoal để đảo đúng team.
    // Schema cần voided_event_id để tự suy ra nếu dùng feature này thường xuyên.
    wasOwnGoal?: boolean;
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

// ─── Pure helper — credit direction ──────────────────────────────────────────

/**
 * Xác định bàn thắng/trừ điểm có tính cho home hay không.
 * Dùng chung ở _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
 * để đảm bảo 2 nơi không viết 2 ternary khác nhau cho cùng business rule.
 *
 * own_goal:         team đá phản lưới → credit cho đối thủ
 * goal_disallowed:  nếu bàn bị huỷ là own_goal → đảo ngược (trừ về đúng bên đã được cộng)
 * goal/penalty_scored: team ghi → credit cho chính mình
 */
export function isCreditedToHomeTeam(
    homeTeamId: number,
    eventTeamId: number,
    type: MatchEventType,
    wasOwnGoal?: boolean,
): boolean {
    if (type === MatchEventType.own_goal) {
        return eventTeamId !== homeTeamId; // team đá phản → đối thủ được điểm
    }
    if (type === MatchEventType.goal_disallowed && wasOwnGoal) {
        return eventTeamId !== homeTeamId; // huỷ own_goal → trừ của đối thủ
    }
    return eventTeamId === homeTeamId;
}