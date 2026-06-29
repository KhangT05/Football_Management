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
    form.append('name', data.name || '');
    // Luôn gửi description dù rỗng để tránh TSOA ValidateError do API khai báo @FormField() description: string (bắt buộc)
    form.append('description', data.description || '');
    
    if (data.logo instanceof File) {
      form.append('logo', data.logo);
    }

    return axiosClient.post('/tournaments', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /**
   * Cập nhật giải đấu
   * PATCH /tournaments/{id} — backend dùng @Body() (chỉ nhận JSON)
   * @param {number} id
   * @param {{ name?, description?, logo?(File), is_active? }} data
   *
   * Lưu ý: Backend PATCH /tournaments/{id} đang dùng @Body() JSON, 
   * KHÔNG hỗ trợ @FormField cho Upload File. 
   * Do đó Frontend tạm loại bỏ File khi update để tránh lỗi 500 ValidateError.
   */
  update: (id, data) => {
    // Loại bỏ logo File nếu có, vì backend chưa hỗ trợ nhận form-data qua PATCH endpoint
    const { logo, ...jsonPayload } = data;
    if (logo instanceof File) {
      console.warn('Backend chưa hỗ trợ upload logo qua endpoint PATCH (cần đổi sang @FormField). Logo File sẽ bị bỏ qua.');
    }
    return axiosClient.patch(`/tournaments/${id}`, jsonPayload);
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
