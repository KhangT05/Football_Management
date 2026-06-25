import axiosClient from './axiosClient';

/**
 * ============================================================
 * tournamentApi - API calls cho Tournaments
 * ============================================================
 * Base: /api/v1/tournaments
 * Tất cả endpoints cần JWT (axiosClient tự gắn Authorization header).
 *
 * Response shape (sau interceptor unwrap):
 *   findAll → { data: Tournament[], meta: { total, page, per_page, last_page } }
 *   findById → Tournament object
 *   create/update → Tournament object
 * ============================================================
 */
export const tournamentApi = {

  /**
   * Lấy danh sách giải đấu (có phân trang)
   * GET /tournaments
   * @param {{ page?, per_page?, q?, sort?, direction? }} params
   */
  getAll: (params = {}) => {
    return axiosClient.get('/tournaments', { params });
  },

  /**
   * Lấy chi tiết một giải đấu (kèm thông tin người tạo)
   * GET /tournaments/{id}
   * @param {number} id
   */
  getById: (id) => {
    return axiosClient.get(`/tournaments/${id}`);
  },

  /**
   * Tạo giải đấu mới (có thể upload logo)
   * POST /tournaments — multipart/form-data
   * @param {{ name: string, description?: string, logo?: File }} data
   *
   * Lưu ý: endpoint dùng @FormField + @UploadedFile nên phải dùng FormData,
   * KHÔNG gửi application/json.
   */
  create: (data) => {
    const form = new FormData();
    form.append('name', data.name);
    if (data.description) form.append('description', data.description);
    if (data.logo instanceof File) form.append('logo', data.logo);

    return axiosClient.post('/tournaments', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Cập nhật giải đấu
   * PATCH /tournaments/{id} — multipart/form-data (backend dùng @FormField)
   * @param {number} id
   * @param {{ name?, description?, logo?(File), is_active? }} data
   *
   * Lưu ý: Backend PATCH /tournaments/{id} không dùng @FormField (chỉ POST dùng)
   * → PATCH có thể dùng JSON nếu không có logo File mới
   */
  update: (id, data) => {
    if (data.logo instanceof File) {
      const form = new FormData();
      if (data.name) form.append('name', data.name);
      if (data.description) form.append('description', data.description);
      if (data.is_active !== undefined) form.append('is_active', String(data.is_active));
      form.append('logo', data.logo);
      return axiosClient.patch(`/tournaments/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return axiosClient.patch(`/tournaments/${id}`, data);
  },

  /**
   * Xóa mềm giải đấu
   * DELETE /tournaments/{id}
   * @param {number} id
   */
  delete: (id) => {
    return axiosClient.delete(`/tournaments/${id}`);
  },
};
