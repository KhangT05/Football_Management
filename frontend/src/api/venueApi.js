import axiosClient from './axiosClient';

/**
 * ============================================================
 * venueApi - API calls cho Venues (sân thi đấu)
 * ============================================================
 * Base: /api/v1/venues
 * Cần JWT.
 * ============================================================
 */
export const venueApi = {

  /**
   * Lấy danh sách sân (có phân trang)
   * GET /venues
   * @param {{ page?, per_page?, q?, sort?, direction? }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get('/venues', { params });
  },

  /**
   * Lấy chi tiết một sân
   * GET /venues/{id}
   * @param {number} id
   */
  getById: (id) => {
    return axiosClient.get(`/venues/${id}`);
  },

  /**
   * Tạo sân mới
   * POST /venues
   * @param {{ name: string, address?: string }} data
   */
  create: (data) => {
    return axiosClient.post('/venues', data);
  },

  /**
   * Cập nhật sân
   * PATCH /venues/{id}
   * @param {number} id
   * @param {{ name?, address?, is_active? }} data
   */
  update: (id, data) => {
    return axiosClient.patch(`/venues/${id}`, data);
  },

  /**
   * Xóa mềm sân
   * DELETE /venues/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/venues/${id}`);
  },
};
