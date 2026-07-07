import axiosClient from './axiosClient';

/**
 * ============================================================
 * seasonApi - API calls cho Seasons
 * ============================================================
 * Base: /api/v1/seasons
 * Cần JWT. Response unwrapped bởi axiosClient interceptor.
 *
 * Response shape (sau interceptor unwrap):
 *   { status, message, data: { data: Season[], meta: {...} }, timestamp }
 *
 * Season gồm: tournament_id (FK), start/end dates, status, max_teams...
 * ============================================================
 */
export const seasonApi = {

  /**
   * Lấy danh sách mùa giải (có phân trang, kèm user info)
   * GET /seasons
   * @param {{ page?, per_page?, q?, sort?, direction? }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get('/seasons', { params });
  },

  /**
   * Lấy chi tiết một mùa giải (kèm user info)
   * GET /seasons/{id}
   * @param {number} id
   */
  getById: (id) => {
    return axiosClient.get(`/seasons/${id}`);
  },

  /**
   * Tạo mùa giải mới (yêu cầu role admin)
   * POST /seasons
   * @param {{
   *   name: string,
   *   description?: string,
   *   status?: 'upcoming'|'registration_open'|'ongoing'|'finished'|'cancelled',
   *   start_date: string|Date,
   *   end_date: string|Date,
   *   registration_deadline: string|Date,
   *   max_teams: number,
   *   is_registration_open?: boolean,
   *   is_active?: boolean,
   *   tournament_id: number
   * }} data
   */
  create: (data) => {
    return axiosClient.post('/seasons', data);
  },

  /**
   * Cập nhật mùa giải
   * PATCH /seasons/{id}
   * @param {number} id
   * @param {Partial<CreateSeasonDto>} data
   */
  update: (id, data) => {
    return axiosClient.patch(`/seasons/${id}`, data);
  },

  /**
   * Cập nhật trạng thái mùa giải (admin)
   * PATCH /seasons/{id}/status
   * @param {number} id
   * @param {{ status: string, cancel_reason?: string }} data
   */
  updateStatus: (id, data) => {
    return axiosClient.patch(`/seasons/${id}/status`, data);
  },

  /**
   * Lấy bảng xếp hạng của mùa giải
   * GET /seasons/{id}/standings
   * @param {number} id
   */
  getStandings: (id) => {
    return axiosClient.get(`/seasons/${id}/standings`);
  },

  /**
   * Lấy danh sách thống kê cầu thủ (Bảng xếp hạng cầu thủ)
   * GET /seasons/{id}/player-stats
   * @param {number} id
   * @param {{ page?, per_page?, sort?, direction?, teamId? }} params
   */
  getPlayerStats: (id, params = {}) => {
    return axiosClient.get(`/seasons/${id}/player-stats`, { params });
  },

  /**
   * Xóa mềm mùa giải
   * DELETE /seasons/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/seasons/${id}`);
  },

  /**
   * Khôi phục mùa giải đã xóa
   * PATCH /seasons/{id}/restore
   * @param {number} id
   */
  restore: (id) => {
    return axiosClient.patch(`/seasons/${id}/restore`);
  },
};

