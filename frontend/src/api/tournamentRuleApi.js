import axiosClient from './axiosClient';

/**
 * ============================================================
 * tournamentRuleApi - API calls cho Tournament Rules
 * ============================================================
 * Base: /api/v1/tournamentrules
 * Cần JWT.
 *
 * TournamentRuleDto:
 * { id, tournament_id, is_active, points_per_win, points_per_draw,
 *   points_per_loss, forfeit_score, yellow_cards_suspension,
 *   max_players_per_team, min_players_per_team,
 *   teams_advance_per_group, tiebreaker_order[],
 *   created_at, updated_at, user?, tournament? }
 *
 * Tiebreaker options:
 * 'goal_diff' | 'goals_scored' | 'head_to_head' |
 * 'goals_conceded' | 'yellow_cards' | 'red_cards'
 * ============================================================
 */
export const tournamentRuleApi = {

  /**
   * Lấy tất cả tournament rules
   * GET /tournamentrules
   * @returns {TournamentRuleDto[]}
   */
  getAll: () => {
    return axiosClient.get('/tournamentrules');
  },

  /**
   * Lấy chi tiết một rule
   * GET /tournamentrules/{id}
   * @param {number} id
   */
  getById: (id) => {
    return axiosClient.get(`/tournamentrules/${id}`);
  },

  /**
   * Tạo rule mới
   * POST /tournamentrules
   * @param {{
   *   tournament_id: number,
   *   points_per_win?: number,
   *   points_per_draw?: number,
   *   points_per_loss?: number,
   *   forfeit_score?: number,
   *   yellow_cards_suspension?: number,
   *   max_players_per_team?: number,
   *   min_players_per_team?: number,
   *   teams_advance_per_group?: number,
   *   tiebreaker_order?: string[],
   * }} data
   */
  create: (data) => {
    return axiosClient.post('/tournamentrules', data);
  },

  /**
   * Cập nhật rule
   * PATCH /tournamentrules/{id}
   * @param {number} id
   * @param {Partial<CreateTournamentRuleDto>} data
   */
  update: (id, data) => {
    return axiosClient.patch(`/tournamentrules/${id}`, data);
  },

  /**
   * Xóa mềm rule
   * DELETE /tournamentrules/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/tournamentrules/${id}`);
  },
};
