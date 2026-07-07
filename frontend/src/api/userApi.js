import axiosClient from './axiosClient';

/**
 * ============================================================
 * userApi - API calls cho Users
 * ============================================================
 * Base: /api/v1/users
 * Tất cả endpoints cần JWT.
 *
 * SafeUser type (password bị omit):
 * { id, name, email, phone?, is_active, email_verified,
 *   email_verified_at?, created_at, updated_at? }
 *
 * PaginatedResult<SafeUser>:
 * { data: SafeUser[], meta: { total, page, per_page, last_page } }
 * ============================================================
 */
export const userApi = {

  /**
   * Lấy danh sách users (chỉ user is_active=true)
   * GET /users
   * @param {{ page?, per_page?, q?, sort?, direction? }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get('/users', { params });
  },

  /**
   * Lấy thông tin chi tiết user
   * GET /users/{id}
   * @param {number} id
   */
  getUserById: (id) => {
    return axiosClient.get(`/users/${id}`);
  },

  /**
   * Tạo user mới (admin only)
   * POST /users
   * @param {{ name: string, email: string, password: string, phone: string }} data
   */
  create: (data) => {
    return axiosClient.post('/users', data);
  },

  /**
   * Cập nhật thông tin user
   * PATCH /users/{id}
   * @param {number} id
   * @param {{ name?, phone?, role_ids?: number[] }} data
   *
   * Lưu ý: role_ids gán roles cho user (NOT password — tách riêng)
   */
  updateProfile: (id, data) => {
    return axiosClient.patch(`/users/${id}`, data);
  },

  /**
   * Xóa mềm user (set is_active = false)
   * DELETE /users/{id}
   * @param {number} id
   */
  softDelete: (id) => {
    return axiosClient.delete(`/users/${id}`);
  },

  /**
   * Cập nhật ảnh đại diện (avatar) của user
   * PATCH /users/{id}/avatar
   * @param {number} id
   * @param {File} file
   */
  updateAvatar: (id, file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return axiosClient.patch(`/users/${id}/avatar`, formData);
  },

  /**
   * Cập nhật mật khẩu cho user
   * PATCH /users/{id}/password
   * @param {number} id
   * @param {{ currentPassword, newPassword }} data
   */
  updatePassword: (id, data) => {
    return axiosClient.patch(`/users/${id}/password`, data);
  },
};
