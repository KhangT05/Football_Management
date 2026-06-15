import axiosClient from './axiosClient';

/**
 * teamApi - API calls cho teams
 */
export const teamApi = {
  /**
   * Lấy danh sách đội bóng
   * GET /teams
   */
  getTeams: (params = {}) => {
    return axiosClient.get('/teams', { params });
  },

  /**
   * Lấy chi tiết một đội bóng (kèm roster)
   * GET /teams/:id
   */
  getTeamById: (id) => {
    return axiosClient.get(`/teams/${id}`);
  },

  /**
   * Đăng ký đội bóng mới
   * POST /teams
   */
  registerTeam: (data) => {
    return axiosClient.post('/teams', data);
  },

  /**
   * Lấy đội bóng của user hiện tại
   * GET /teams/my
   */
  getMyTeam: () => {
    return axiosClient.get('/teams/my');
  },
};
