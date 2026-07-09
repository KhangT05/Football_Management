import axiosClient from './axiosClient';
/**
 * ============================================================
 * tournamentRuleApi - API calls cho Tournament Rules
 * ============================================================
 * Base: /api/v1/tournamentrules
 * Cần JWT.
 *
 * TournamentRuleDto:
 * { id, tournament_id, is_active, name, format, round_robin_stages,
 *   points_per_win, points_per_draw, points_per_loss, forfeit_score,
 *   yellow_cards_suspension, suspension_match_count,
 *   fine_per_yellow_card, fine_per_red_card,
 *   bonus_per_goal, bonus_per_assist,
 *   max_players_per_team, min_players_per_team,
 *   teams_advance_per_group, tiebreaker_order[],
 *   created_at, updated_at, user?, tournament? }
 *
 * Tiebreaker options:
 * 'goal_diff' | 'goals_scored' | 'head_to_head' |
 * 'goals_conceded' | 'yellow_cards' | 'red_cards'
 *
 * format (SeasonFormat):
 * 'round_robin' | 'knockout' | 'round_robin_knockout' | 'multi_round_robin_knockout'
 * round_robin_stages bị BE validate cứng theo format (xem TournamentRuleService):
 *   knockout -> phải = 0 | round_robin_knockout -> phải = 1
 *   multi_round_robin_knockout -> phải >= 2 | round_robin -> phải >= 1
 * ============================================================
 */
export const tournamentRuleApi = {
  /**
   * Lấy tất cả tournament rules (KHÔNG lọc theo tournament — BE findAll() không
   * nhận filter param nào, trả về rule của MỌI giải đấu). Dùng getByTournament()
   * nếu cần rule của 1 giải cụ thể.
   * GET /tournamentrules
   * @returns {TournamentRuleDto[]}
   */
  getAll: (params = {}) => {
    return axiosClient.get('/tournamentrules', { params });
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
   * Lấy danh sách rule đang active (is_active=true, deleted_at=null) của MỘT
   * giải đấu cụ thể. Route riêng ở BE (service.listByTournament()).
   * GET /tournamentrules/tournament/{tournamentId}
   * @param {number} tournamentId
   * @returns {TournamentRuleDto[]}
   */
  getByTournament: (tournamentId) => {
    return axiosClient.get(`/tournamentrules/tournament/${tournamentId}`);
  },
  /**
   * Tạo rule mới
   * POST /tournamentrules
   * @param {{
   *   tournament_id: number,
   *   name?: string,
   *   format?: 'round_robin'|'knockout'|'round_robin_knockout'|'multi_round_robin_knockout',
   *   round_robin_stages?: number,
   *   points_per_win?: number,
   *   points_per_draw?: number,
   *   points_per_loss?: number,
   *   forfeit_score?: number,
   *   yellow_cards_suspension?: number,
   *   suspension_match_count?: number,
   *   fine_per_yellow_card?: number,
   *   fine_per_red_card?: number,
   *   bonus_per_goal?: number,
   *   bonus_per_assist?: number,
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
   * Cập nhật rule. LƯU Ý: rule có thể đang dùng chung cho nhiều season
   * (TournamentRule.seasons: Season[]). BE tự chặn (409 CONFLICT) nếu:
   *  - đổi points_per_win/draw/loss/yellow_cards_suspension mà rule đã có
   *    match official (trừ khi force=true) -> ảnh hưởng standings đã tính.
   *  - đổi format/round_robin_stages mà rule đã có season sinh phase/bracket.
   * PATCH /tournamentrules/{id}
   * @param {number} id
   * @param {Partial<CreateTournamentRuleDto>} data
   * @param {boolean} [force] - true để ghi đè cảnh báo retroactive ở trên
   */
  update: (id, data, force = false) => {
    return axiosClient.patch(`/tournamentrules/${id}`, data, { params: force ? { force: true } : undefined });
  },
  /**
   * Xóa mềm rule
   * DELETE /tournamentrules/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/tournamentrules/${id}`);
  },
  /**
   * Khôi phục rule đã xóa mềm
   * PATCH /tournamentrules/{id}/restore
   * @param {number} id
   */
  restore: (id) => {
    return axiosClient.patch(`/tournamentrules/${id}/restore`);
  },
};