import axiosClient from './axiosClient';

/**
 * ============================================================
 * matchApi - API calls cho Matches (trận đấu)
 * ============================================================
 * Base: /api/v1/matches
 *
 * ⚠️  Backend chưa có Match controller — các endpoints này sẽ
 *     trả 404 cho đến khi backend implement.
 *     UI nên fallback về mock data khi nhận lỗi.
 *
 * Match model (từ Prisma schema):
 * { id, phase_id, group_id?, home_team_id, away_team_id,
 *   scheduled_at?, played_at?, home_score?, away_score?,
 *   status: scheduled|ongoing|finished|cancelled|forfeited,
 *   round?, leg?, venue_id?, referee?,
 *   season_id?, is_published, is_active }
 * ============================================================
 */
export const matchApi = {

  /**
   * Lấy danh sách trận đấu (paginated)
   * GET /matches
   * @param {{ page?, per_page?, q?, status?, season_id?, phase_id? }} params
   */
  getMatches: (params = {}) => {
    return axiosClient.get('/matches', { params });
  },

  /**
   * Lấy chi tiết một trận đấu (kèm events)
   * GET /matches/{id}
   * @param {number} id
   */
  getMatchById: (id) => {
    return axiosClient.get(`/matches/${id}`);
  },

  /**
   * Tạo trận đấu mới (admin)
   * POST /matches
   * @param {{ phase_id, home_team_id, away_team_id, scheduled_at?, venue_id?, group_id? }} data
   */
  create: (data) => {
    return axiosClient.post('/matches', data);
  },

  /**
   * Cập nhật trận đấu (lịch, sân, trọng tài...)
   * PATCH /matches/{id}
   * @param {number} id
   * @param {object} data
   */
  update: (id, data) => {
    return axiosClient.patch(`/matches/${id}`, data);
  },

  /**
   * Cập nhật kết quả trận đấu + match events
   * POST /matches/{id}/result
   * @param {number} id
   * @param {{ home_score, away_score, events?: MatchEvent[] }} data
   */
  updateResult: (id, data) => {
    return axiosClient.post(`/matches/${id}/result`, data);
  },

  /**
   * Xóa mềm trận đấu
   * DELETE /matches/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/matches/${id}`);
  },
};
