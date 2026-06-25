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

  // ── Schedule endpoints (ĐÚNG theo backend) ─────────────────

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

  /**
   * @deprecated Backend không có endpoint này.
   * Dùng getScheduleBySeason(seasonId) thay thế.
   */
  getMatches: (_params = {}) => {
    console.warn('[matchApi] getMatches() đã deprecated — backend không có /matches endpoint. Dùng getScheduleBySeason(seasonId) thay thế.');
    return Promise.reject(new Error('API /matches không tồn tại trên backend. Dùng /schedules/seasons/{seasonId}/schedule.'));
  },

  /**
   * @deprecated Backend không có endpoint này.
   */
  getMatchById: (_id) => {
    console.warn('[matchApi] getMatchById() đã deprecated — backend không có /matches/{id} endpoint.');
    return Promise.reject(new Error('API /matches/{id} không tồn tại trên backend.'));
  },

  /**
   * @deprecated Backend không có endpoint này. Match được tạo qua generateSchedule.
   */
  create: (_data) => {
    console.warn('[matchApi] create() đã deprecated — tạo lịch qua generateSchedule(seasonId, body).');
    return Promise.reject(new Error('POST /matches không tồn tại. Dùng generateSchedule() hoặc autoSchedule().'));
  },

  /**
   * @deprecated Backend không có endpoint này. Dùng rescheduleMatch(matchId, body).
   */
  update: (_id, _data) => {
    console.warn('[matchApi] update() đã deprecated — dùng rescheduleMatch(matchId, body).');
    return Promise.reject(new Error('PATCH /matches/{id} không tồn tại. Dùng rescheduleMatch().'));
  },

  /**
   * @deprecated Backend không có endpoint này.
   */
  updateResult: (_id, _data) => {
    console.warn('[matchApi] updateResult() đã deprecated — backend chưa có Match Events API.');
    return Promise.reject(new Error('POST /matches/{id}/result chưa được implement trên backend.'));
  },

  /**
   * @deprecated Backend không có endpoint này.
   */
  delete: (_id) => {
    console.warn('[matchApi] delete() đã deprecated — backend không có DELETE /matches/{id}.');
    return Promise.reject(new Error('DELETE /matches/{id} không tồn tại trên backend.'));
  },
};
