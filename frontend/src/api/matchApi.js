import axiosClient from './axiosClient';

/**
 * ============================================================
 * matchApi — API calls cho Matches
 * ============================================================
 *
 * Schedule endpoints (schedule.controller.ts):
 * ✅ GET  /schedules/seasons/{seasonId}/schedule
 * ✅ GET  /schedules/seasons/{seasonId}/teams/{teamId}/schedule
 * ✅ POST /schedules/seasons/{seasonId}/generate
 * ✅ POST /schedules/seasons/{seasonId}/schedule
 * ✅ PATCH /schedules/matches/{matchId}/reschedule
 * ✅ GET  /phases/{phaseId}/knockout/bracket
 *
 * Match lifecycle (match.controller.ts):
 * ✅ POST /matches/{id}/start
 * ✅ POST /matches/{id}/period
 * ✅ POST /matches/{id}/events          → recordEvent
 * ✅ POST /matches/{id}/finalize
 * ✅ POST /matches/{id}/confirm-official
 * ✅ POST /matches/{id}/forfeit
 * ✅ POST /matches/{id}/abandon
 * ✅ POST /matches/{id}/manual-score
 * ✅ POST /matches/{id}/admin-result    → adminRecordResult
 *
 * Match result (matchResult.controller.ts):
 * ✅ GET  /matches/{id}/result          → getMatchById
 * ✅ GET  /matches/{id}/events          → getMatchEvents
 * ✅ PATCH /matches/{id}/score          → editScore (correction window, manual path only)
 *
 * ❌ POST /matches/{id}/void-result  — CHƯA IMPLEMENT
 *      Schema (MatchResultStatus) không có void status.
 *      Cần quyết định: DELETE match_result + reset status, hay is_active=false.
 * ❌ POST   /matches    — không tồn tại
 * ❌ PATCH  /matches/{id} — không tồn tại
 * ❌ DELETE /matches/{id} — không tồn tại
 * ❌ GET    /matches/{id} — không tồn tại (dùng /matches/{id}/result)
 * ============================================================
 */

export const matchApi = {

  // ── Schedule ────────────────────────────────────────────────────────────────

  getScheduleBySeason: (seasonId, params = {}) =>
    axiosClient.get(`/schedules/seasons/${seasonId}/schedule`, { params }),

  getTeamSchedule: (seasonId, teamId, params = {}) =>
    axiosClient.get(`/schedules/seasons/${seasonId}/teams/${teamId}/schedule`, { params }),

  generateSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/generate`, body),

  autoSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/schedule`, body),

  rescheduleMatch: (matchId, body) =>
    axiosClient.patch(`/schedules/matches/${matchId}/reschedule`, body),

  getKnockoutBracket: (phaseId) =>
    axiosClient.get(`/phases/${phaseId}/knockout/bracket`),

  // ── Match lifecycle ──────────────────────────────────────────────────────────

  startMatch: (id) =>
    axiosClient.post(`/matches/${id}/start`),

  transitionPeriod: (id, body) =>
    axiosClient.post(`/matches/${id}/period`, body),

  /**
   * Record single event — live path (ongoing / pending_official).
   * Card/sub từ admin UI gửi qua đây sau adminRecordResult (audit trail, fire-and-forget).
   * Backend guard reject nếu match đã finished — expected, không phải error.
   *
   * body: { teamId, type: MatchEventType, minute, note? }
   * type dùng MatchEventType enum từ MatchDetailModal.jsx — không hardcode string.
   */
  recordEvent: (id, body) =>
    axiosClient.post(`/matches/${id}/events`, body),

  finalizeMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/finalize`, body),

  confirmOfficial: (id, body) =>
    axiosClient.post(`/matches/${id}/confirm-official`, body),

  forfeitMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/forfeit`, body),

  abandonMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/abandon`, body),

  submitManualScore: (id, body) =>
    axiosClient.post(`/matches/${id}/manual-score`, body),

  /**
   * Admin finalize kết quả cho match ở bất kỳ trạng thái hợp lệ nào.
   * Allowed: scheduled / postponed / bye / ongoing / pending_official / needs_review
   * Score = body.homeScore / awayScore — KHÔNG compute từ events.
   * scorers[] → insert MatchEvent làm audit trail / player stats.
   *
   * body: {
   *   homeScore: number,
   *   awayScore: number,
   *   scorers?: Array<{ teamId, type: 'goal'|'own_goal', minute, playerName? }>,
   *   resultType?: MatchResultType,   // default: full_time
   *   homeHalfTimeScore?: number,
   *   awayHalfTimeScore?: number,
   * }
   * → POST /matches/{id}/admin-result (201)
   */
  adminRecordResult: (id, body) =>
    axiosClient.post(`/matches/${id}/admin-result`, body),

  // ── Match result / correction ────────────────────────────────────────────────

  getMatchById: (id) =>
    axiosClient.get(`/matches/${id}/result`),

  getMatchReport: (id) =>
    axiosClient.get(`/matches/${id}/report`, { responseType: 'blob' }),

  getMatchEvents: (id, params = {}) =>
    axiosClient.get(`/matches/${id}/events`, { params }),

  /**
   * Correction window — chỉ dùng sau khi match finished, trong 15p.
   * Manual path only: backend reject nếu match có events.
   * Nếu có events → dùng addEvent / editEvent / deleteEvent thay vì.
   *
   * body: {
   *   homeScore: number,
   *   awayScore: number,
   *   homeExtraTime?: number,
   *   awayExtraTime?: number,
   *   homePenalty?: number,
   *   awayPenalty?: number,
   *   homeHalfTime?: number,
   *   awayHalfTime?: number,
   *   resultType?: MatchResultType,
   *   notes?: string,
   * }
   * → PATCH /matches/{id}/score
   */
  editScore: (id, body) =>
    axiosClient.patch(`/matches/${id}/score`, body),

  // ── Advanced Match Controls (Appeals, Protests, Corrections) ─────────────

  appeal: (id, body) =>
    axiosClient.post(`/matches/${id}/appeal`, body),

  protest: (id, body) =>
    axiosClient.post(`/matches/${id}/protest`, body),

  resolveAppeal: (id, body) =>
    axiosClient.post(`/matches/${id}/resolve-appeal`, body),

  addCorrectionEvent: (id, body) =>
    axiosClient.post(`/matches/${id}/correction/events`, body),

  editCorrectionEvent: (id, eventId, body) =>
    axiosClient.patch(`/matches/${id}/correction/events/${eventId}`, body),

  deleteCorrectionEvent: (id, eventId) =>
    axiosClient.delete(`/matches/${id}/correction/events/${eventId}`),

  // ── TODO ─────────────────────────────────────────────────────────────────────

  // voidResult — CHƯA IMPLEMENT.
  // Schema MatchResultStatus không có void status.
  // UI đang disable nút Hủy KQ cho đến khi backend implement.
  // voidResult: (id) => axiosClient.post(`/matches/${id}/void-result`),

  // ── Deprecated ───────────────────────────────────────────────────────────────

  getMatches: () => {
    console.warn('[matchApi] getMatches() deprecated. Dùng getScheduleBySeason(seasonId).');
    return Promise.reject(new Error('API /matches không tồn tại.'));
  },

  create: () =>
    Promise.reject(new Error('POST /matches không tồn tại. Dùng generateSchedule() hoặc autoSchedule().')),

  update: () =>
    Promise.reject(new Error('PATCH /matches/{id} không tồn tại. Dùng rescheduleMatch().')),

  delete: () =>
    Promise.reject(new Error('DELETE /matches/{id} không tồn tại trên backend.')),

  generateSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/generate`, body),

  generateFromGroups: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/generate-from-groups`, body),

  autoSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/schedule`, body),
};
