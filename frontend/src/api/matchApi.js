import axiosClient from './axiosClient';

/**
 * matchApi - API calls cho matches
 * Backend hiện tại chưa có match endpoints → fallback về mock data ở tầng UI
 * Khi backend ready, uncomment các call thực sự
 */
export const matchApi = {
  /**
   * Lấy danh sách trận đấu
   * GET /matches?status=upcoming|completed
   */
  getMatches: (params = {}) => {
    return axiosClient.get('/matches', { params });
  },

  /**
   * Lấy chi tiết một trận đấu
   * GET /matches/:id
   */
  getMatchById: (id) => {
    return axiosClient.get(`/matches/${id}`);
  },
};
