import { MatchEventType, MatchPeriod } from '../generated/prisma/client.js';
// ─── State machine constants ──────────────────────────────────────────────────
// Transition hợp lệ giữa các period trong match ongoing.
// penalty_shootout không có transition ra — terminal period.
export const PERIOD_TRANSITIONS = {
    first_half: [MatchPeriod.second_half],
    second_half: [MatchPeriod.extra_time_first, MatchPeriod.penalty_shootout],
    extra_time_first: [MatchPeriod.extra_time_second],
    extra_time_second: [MatchPeriod.penalty_shootout],
    penalty_shootout: [],
};
// Period thuộc extra time — dùng để tách ET goals ra khỏi 90p khi compute score
export const EXTRA_TIME_PERIODS = [
    MatchPeriod.extra_time_first,
    MatchPeriod.extra_time_second,
];
// Score delta theo event type — dùng chung cho live-display counter và finalize aggregate.
// Tách ra constant để _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
// không thể drift logic với nhau.
//
// own_goal: delta = 1 nhưng credit bị đảo ở isCreditedToHomeTeam → không cần delta âm
// goal_disallowed: delta = -1 → trừ bàn đã cộng sai
export const SCORE_DELTA_BY_TYPE = {
    [MatchEventType.goal]: 1,
    [MatchEventType.own_goal]: 1,
    [MatchEventType.penalty_scored]: 1,
    [MatchEventType.goal_disallowed]: -1,
};
//# sourceMappingURL=match.type.js.map