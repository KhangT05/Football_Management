import axiosClient from './axiosClient';

/**
 * ============================================================
 * teamApi - API calls cho Teams (đội bóng)
 * ============================================================
 * Base: /api/v1/teams
 *
 * ⚠️  Backend chưa có Team controller — endpoints sẽ 404 cho đến
 *     khi backend implement. UI fallback về mock data khi lỗi.
 *
 * Team model (từ Prisma schema):
 * { id, name, coach_name?, logo?, description?,
 *   is_active, user_id?, created_at }
 *
 * TeamPlayer model:
 * { id, team_id, player_id, jersey_number, position,
 *   role: player|captain|vice_captain,
 *   status: active|injured|suspended,
 *   approval_status: pending|approved|rejected }
 * ============================================================
 */
export const teamApi = {

  /**
   * Lấy danh sách đội bóng (paginated)
   * GET /teams
   * @param {{ page?, per_page?, q?, sort?, direction? }} params
   */
  getTeams: (params = {}) => {
    return axiosClient.get('/teams', { params });
  },

  /**
   * Lấy chi tiết một đội bóng (kèm roster)
   * GET /teams/{id}
   * @param {number} id
   */
  getTeamById: (id) => {
    return axiosClient.get(`/teams/${id}`);
  },

  /**
   * Lấy đội bóng của user hiện tại (leader)
   * GET /teams/my
   */
  getMyTeam: () => {
    return axiosClient.get('/teams/my');
  },

  /**
   * Đăng ký đội bóng mới
   * POST /teams
   * @param {{ name, coach_name?, description?, logo?(File) }} data
   */
  registerTeam: (data) => {
    // Nếu có logo (File) → dùng FormData
    if (data.logo instanceof File) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) form.append(k, v);
      });
      return axiosClient.post('/teams', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosClient.post('/teams', data);
  },

  /**
   * Cập nhật thông tin đội bóng
   * PATCH /teams/{id}
   * @param {number} id
   * @param {{ name?, coach_name?, description?, is_active? }} data
   */
  update: (id, data) => {
    return axiosClient.patch(`/teams/${id}`, data);
  },

  /**
   * Xóa mềm đội bóng
   * DELETE /teams/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/teams/${id}`);
  },

  // ── Team Players ──────────────────────────────────────────

  /**
   * Lấy danh sách cầu thủ trong đội
   * GET /teams/{id}/players
   * @param {number} teamId
   * @param {{ page?, per_page?, approval_status? }} params
   */
  getPlayers: (teamId, params = {}) => {
    return axiosClient.get(`/teams/${teamId}/players`, { params });
  },

  /**
   * Thêm cầu thủ vào đội
   * POST /teams/{id}/players
   * @param {number} teamId
   * @param {{ player_id, jersey_number, position, role? }} data
   */
  addPlayer: (teamId, data) => {
    return axiosClient.post(`/teams/${teamId}/players`, data);
  },

  /**
   * Duyệt / từ chối cầu thủ (admin / leader)
   * PATCH /teams/{teamId}/players/{playerId}/approval
   * @param {number} teamId
   * @param {number} playerId
   * @param {'approved'|'rejected'} approval_status
   */
  approvePlayer: (teamId, playerId, approval_status) => {
    return axiosClient.patch(`/teams/${teamId}/players/${playerId}/approval`, { approval_status });
  },

  /**
   * Xóa cầu thủ khỏi đội
   * DELETE /teams/{teamId}/players/{playerId}
   */
  removePlayer: (teamId, playerId) => {
    return axiosClient.delete(`/teams/${teamId}/players/${playerId}`);
  },
};
