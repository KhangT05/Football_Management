import axiosClient from './axiosClient';

export const userApi = {
  /**
   * Cập nhật thông tin người dùng
   * PATCH /users/{id}
   * @param {number} id - User ID
   * @param {Object} data - Dữ liệu cần cập nhật (name, phone, v.v.)
   */
  updateProfile: (id, data) => {
    return axiosClient.patch(`/users/${id}`, data);
  },

  /**
   * Lấy thông tin chi tiết user
   * GET /users/{id}
   */
  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  }
};
