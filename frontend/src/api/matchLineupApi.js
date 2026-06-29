import axiosClient from './axiosClient';

export const matchLineupApi = {
  /**
   * Lấy danh sách toàn bộ đội hình của trận đấu (cả 2 đội)
   * GET /matches/{matchId}/lineups
   */
  getMatchLineups: (matchId) =>
    axiosClient.get(`/matches/${matchId}/lineups`),

  /**
   * Lấy danh sách cầu thủ ra sân của 1 đội trong trận
   * GET /matches/{matchId}/lineups/teams/{teamId}
   */
  getLineup: (matchId, teamId) => 
    axiosClient.get(`/matches/${matchId}/lineups/teams/${teamId}`),

  /**
   * Cập nhật toàn bộ danh sách ra sân
   * POST /matches/{matchId}/lineups
   */
  updateLineup: (matchId, data) => 
    axiosClient.post(`/matches/${matchId}/lineups`, data),

  /**
   * Cập nhật thông tin 1 cầu thủ trong danh sách (thay người, đổi số áo)
   * PATCH /matches/{matchId}/lineups/teams/{teamId}/players/{playerId}
   */
  updatePlayerInLineup: (matchId, teamId, playerId, data) => 
    axiosClient.patch(`/matches/${matchId}/lineups/teams/${teamId}/players/${playerId}`, data),

  /**
   * Xóa cầu thủ khỏi danh sách
   * DELETE /matches/{matchId}/lineups/teams/{teamId}/players/{playerId}
   */
  removePlayerFromLineup: (matchId, teamId, playerId) => 
    axiosClient.delete(`/matches/${matchId}/lineups/teams/${teamId}/players/${playerId}`),
};
