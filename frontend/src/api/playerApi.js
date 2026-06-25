import axiosClient from './axiosClient';

/**
 * ============================================================
 * playerApi - API calls cho Players (cầu thủ)
 * ============================================================
 * Base routes: /api/v1/players  (player.controller.ts)
 *
 * Player CRUD:
 *   GET    /players/{id}                                → Chi tiết cầu thủ
 *   POST   /players                                     → Tạo cầu thủ mới
 *   PATCH  /players/{id}                               → Cập nhật cầu thủ
 *   DELETE /players/{id}                               → Xóa mềm
 *
 * Team Players (roster):
 *   GET    /players/{teamId}/team-players              → Danh sách cầu thủ của đội
 *   GET    /players/{teamId}/team-players/{id}         → Chi tiết 1 team-player
 *   POST   /players/{teamId}/team-players              → Thêm cầu thủ vào đội
 *   PATCH  /players/{teamId}/team-players/{id}         → Cập nhật team-player
 *   DELETE /players/{teamId}/team-players              → Bulk delete (body: { ids: number[] })
 *   POST   /players/{teamId}/team-players/{id}/approve → Duyệt cầu thủ
 *   POST   /players/{teamId}/team-players/{id}/reject  → Từ chối cầu thủ
 *
 * Excel:
 *   GET    /players/{teamId}/team-players/export       → Export Excel
 *   GET    /players/import-template                    → Download template
 *
 * ⚠️  Lưu ý quan trọng về quy trình thêm cầu thủ:
 *   Bước 1: Tạo Player (POST /players) — tạo record cầu thủ trong DB
 *   Bước 2: Thêm vào đội (POST /players/{teamId}/team-players) — gắn player vào team
 * ============================================================
 */
export const playerApi = {

  // ── Player CRUD ─────────────────────────────────────────────

  /**
   * Lấy chi tiết cầu thủ
   * GET /players/{id}
   * @param {number} id
   */
  getById: (id) => axiosClient.get(`/players/${id}`),

  /**
   * Tạo cầu thủ mới (Bước 1 trước khi thêm vào đội)
   * POST /players
   * @param {{ name: string, date_of_birth?: string, nationality?: string }} data
   */
  create: (data) => axiosClient.post('/players', data),

  /**
   * Cập nhật thông tin cầu thủ
   * PATCH /players/{id}
   * @param {number} id
   * @param {Partial<CreatePlayerDto>} data
   */
  update: (id, data) => axiosClient.patch(`/players/${id}`, data),

  /**
   * Xóa mềm cầu thủ
   * DELETE /players/{id}
   * @param {number} id
   */
  softDelete: (id) => axiosClient.delete(`/players/${id}`),

  // ── Team Players ─────────────────────────────────────────────

  /**
   * Lấy danh sách cầu thủ trong đội (paginated)
   * GET /players/{teamId}/team-players
   * @param {number} teamId
   * @param {{ page?, per_page?, position?, status?, approval_status?, sort?, direction? }} params
   */
  listTeamPlayers: (teamId, params = {}) =>
    axiosClient.get(`/players/${teamId}/team-players`, { params }),

  /**
   * Chi tiết 1 team-player record
   * GET /players/{teamId}/team-players/{id}
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  getTeamPlayer: (teamId, teamPlayerId) =>
    axiosClient.get(`/players/${teamId}/team-players/${teamPlayerId}`),

  /**
   * Thêm cầu thủ (đã tồn tại) vào đội — Bước 2
   * POST /players/{teamId}/team-players
   * @param {number} teamId
   * @param {{ player_id: number, jersey_number: number, position: string, role?: string }} data
   */
  addToTeam: (teamId, data) =>
    axiosClient.post(`/players/${teamId}/team-players`, data),

  /**
   * Cập nhật thông tin team-player (số áo, vị trí, trạng thái)
   * PATCH /players/{teamId}/team-players/{id}
   * @param {number} teamId
   * @param {number} teamPlayerId
   * @param {object} data
   */
  updateTeamPlayer: (teamId, teamPlayerId, data) =>
    axiosClient.patch(`/players/${teamId}/team-players/${teamPlayerId}`, data),

  /**
   * Duyệt cầu thủ vào đội
   * POST /players/{teamId}/team-players/{id}/approve
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  approve: (teamId, teamPlayerId) =>
    axiosClient.post(`/players/${teamId}/team-players/${teamPlayerId}/approve`),

  /**
   * Từ chối cầu thủ
   * POST /players/{teamId}/team-players/{id}/reject
   * @param {number} teamId
   * @param {number} teamPlayerId
   */
  reject: (teamId, teamPlayerId) =>
    axiosClient.post(`/players/${teamId}/team-players/${teamPlayerId}/reject`),

  /**
   * Bulk delete cầu thủ khỏi đội
   * DELETE /players/{teamId}/team-players
   * @param {number} teamId
   * @param {{ ids: number[] }} data
   */
  bulkRemoveFromTeam: (teamId, data) =>
    axiosClient.delete(`/players/${teamId}/team-players`, { data }),

  // ── Excel ─────────────────────────────────────────────────

  /**
   * Export danh sách cầu thủ của đội ra Excel
   * GET /players/{teamId}/team-players/export
   * @param {number} teamId
   */
  exportTeamPlayers: (teamId) =>
    axiosClient.get(`/players/${teamId}/team-players/export`, { responseType: 'blob' }),

  /**
   * Download template import cầu thủ
   * GET /players/import-template
   */
  downloadImportTemplate: () =>
    axiosClient.get('/players/import-template', { responseType: 'blob' }),
};
