import axiosClient from './axiosClient';

/**
 * ============================================================
 * teamApi - API calls cho Teams (đội bóng)
 * ============================================================
 * Base: /api/v1/teams
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
   * PATCH /teams/{id} — multipart/form-data
   * @param {number} id
   * @param {{ name?, coach_name?, description?, logo?(File) }} data
   */
  update: (id, data) => {
    if (data.logo instanceof File) {
      const form = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v != null) form.append(k, v);
      });
      return axiosClient.patch(`/teams/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
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

  // ── Team Players ────────────────────────────────────────────────

  /**
   * Lấy danh sách cầu thủ trong đội
   * GET /players/{teamId}/team-players  (player.controller.ts)
   * @param {number} teamId
   * @param {{ page?, per_page?, approval_status?, position?, status? }} params
   */
  getPlayers: (teamId, params = {}) => {
    return axiosClient.get(`/players/${teamId}/team-players`, { params });
  },

  /**
   * Thêm cầu thủ vào đội
   * POST /players/{teamId}/team-players
   * @param {number} teamId
   * @param {{ player_id, jersey_number, position, role? }} data
   */
  addPlayer: (teamId, data) => {
    return axiosClient.post(`/players/${teamId}/team-players`, data);
  },

  /**
   * Duyệt cầu thủ (admin / leader)
   * POST /players/{teamId}/team-players/{id}/approve
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  approvePlayer: (teamId, teamPlayerId) => {
    return axiosClient.post(`/players/${teamId}/team-players/${teamPlayerId}/approve`);
  },

  /**
   * Từ chối cầu thủ
   * POST /players/{teamId}/team-players/{id}/reject
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  rejectPlayer: (teamId, teamPlayerId) => {
    return axiosClient.post(`/players/${teamId}/team-players/${teamPlayerId}/reject`);
  },

  /**
   * Xóa cầu thủ khỏi đội (bulk delete)
   * DELETE /players/{teamId}/team-players
   * @param {number} teamId
   * @param {{ ids: number[] }} data
   */
  removePlayer: (teamId, data) => {
    return axiosClient.delete(`/players/${teamId}/team-players`, { data });
  },
};
