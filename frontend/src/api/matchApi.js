import axiosClient from './axiosClient';

/**
 * ============================================================
 * scheduleApi / matchApi - API calls cho Matches (trận đấu)
 * ============================================================
 * ⚠️  Backend KHÔNG có /matches endpoint riêng biệt.
 *     Matches được quản lý thông qua schedule.controller.ts:
 *
 * ✅ GET  /schedules/seasons/{seasonId}/schedule          → Lấy lịch thi đấu theo mùa giải
 * ✅ GET  /schedules/seasons/{seasonId}/teams/{teamId}/schedule → Lịch của 1 đội
 * ✅ POST /schedules/seasons/{seasonId}/generate          → Tạo lịch tự động (admin)
 * ✅ POST /schedules/seasons/{seasonId}/schedule          → Auto schedule (admin)
 * ✅ PATCH /schedules/matches/{matchId}/reschedule        → Đổi lịch trận (admin)
 * ✅ GET  /phases/{phaseId}/knockout/bracket              → Bracket knockout
 *
 * ❌ POST /matches    — KHÔNG TỒN TẠI trên backend
 * ❌ PATCH /matches/{id} — KHÔNG TỒN TẠI trên backend
 * ❌ DELETE /matches/{id} — KHÔNG TỒN TẠI trên backend
 * ❌ GET /matches/{id} — KHÔNG TỒN TẠI trên backend
 * ============================================================
 */
export const matchApi = {

  /**
   * Lấy lịch thi đấu theo mùa giải (paginated)
   * GET /schedules/seasons/{seasonId}/schedule
   * @param {number} seasonId
   * @param {{ page?, per_page?, sort?, direction? }} params
   */
  getScheduleBySeason: (seasonId, params = {}) => {
    return axiosClient.get(`/schedules/seasons/${seasonId}/schedule`, { params });
  },

  /**
   * Lấy lịch thi đấu của 1 đội trong mùa giải
   * GET /schedules/seasons/{seasonId}/teams/{teamId}/schedule
   * @param {number} seasonId
   * @param {number} teamId
   * @param {{ page?, per_page?, sort?, direction? }} params
   */
  getTeamSchedule: (seasonId, teamId, params = {}) => {
    return axiosClient.get(`/schedules/seasons/${seasonId}/teams/${teamId}/schedule`, { params });
  },

  /**
   * Tạo lịch thi đấu tự động (admin only)
   * POST /schedules/seasons/{seasonId}/generate
   * @param {number} seasonId
   * @param {object} body — GenerateScheduleDto
   */
  generateSchedule: (seasonId, body) => {
    return axiosClient.post(`/schedules/seasons/${seasonId}/generate`, body);
  },

  /**
   * Auto schedule matches sau khi lịch được tạo (admin only)
   * POST /schedules/seasons/{seasonId}/schedule
   * @param {number} seasonId
   * @param {object} body — AutoScheduleDto { venueIds, matchTimes }
   */
  autoSchedule: (seasonId, body) => {
    return axiosClient.post(`/schedules/seasons/${seasonId}/schedule`, body);
  },

  /**
   * Đổi lịch một trận cụ thể (admin only)
   * PATCH /schedules/matches/{matchId}/reschedule
   * @param {number} matchId
   * @param {{ scheduled_at: string, venue_id?: number }} body
   */
  rescheduleMatch: (matchId, body) => {
    return axiosClient.patch(`/schedules/matches/${matchId}/reschedule`, body);
  },

  /**
   * Lấy bracket knockout
   * GET /phases/{phaseId}/knockout/bracket
   * @param {number} phaseId
   */
  getKnockoutBracket: (phaseId) => {
    return axiosClient.get(`/phases/${phaseId}/knockout/bracket`);
  },

  // ── Legacy stubs (giữ để không break code cũ, nhưng KHÔNG hoạt động) ──

  // ── Match Lifecycle (match.controller.ts) ────────────────────
  
  startMatch: (id) => axiosClient.post(`/matches/${id}/start`),
  transitionPeriod: (id, body) => axiosClient.post(`/matches/${id}/period`, body),
  recordEvent: (id, body) => axiosClient.post(`/matches/${id}/events`, body),
  finalizeMatch: (id, body) => axiosClient.post(`/matches/${id}/finalize`, body),
  confirmOfficial: (id, body) => axiosClient.post(`/matches/${id}/confirm-official`, body),
  forfeitMatch: (id, body) => axiosClient.post(`/matches/${id}/forfeit`, body),
  abandonMatch: (id, body) => axiosClient.post(`/matches/${id}/abandon`, body),
  submitManualScore: (id, body) => axiosClient.post(`/matches/${id}/manual-score`, body),

  // ── Match Results (matchResult.controller.ts) ────────────────

  getMatchById: (id) => axiosClient.get(`/matches/${id}/result`),
  getMatchEvents: (id, params = {}) => axiosClient.get(`/matches/${id}/events`, { params }),

  // ── Legacy stubs (deprecated) ────────────────────────────────

  getMatches: (_params = {}) => {
    console.warn('[matchApi] getMatches() đã deprecated. Dùng getScheduleBySeason(seasonId).');
    return Promise.reject(new Error('API /matches không tồn tại.'));
  },
  create: (_data) => {
    return Promise.reject(new Error('POST /matches không tồn tại. Dùng generateSchedule() hoặc autoSchedule().'));
  },
  update: (_id, _data) => {
    return Promise.reject(new Error('PATCH /matches/{id} không tồn tại. Dùng rescheduleMatch().'));
  },
  delete: (_id) => {
    return Promise.reject(new Error('DELETE /matches/{id} không tồn tại trên backend.'));
  },
};
