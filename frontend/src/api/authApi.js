import axiosClient from './axiosClient';

/**
 * ============================================================
 * authApi — gọi các endpoint xác thực
 * ============================================================
 * axiosClient interceptor đã unwrap axios envelope (response.data).
 * Tất cả hàm trả về:
 *   { status: boolean, message: string, data: T, timestamp: string }
 *
 * Caller lấy payload qua .data:
 *   const res = await authApi.login(creds)
 *   const { accessToken, csrfToken } = res.data
 * ============================================================
 */
export const authApi = {
  /**
   * POST /auth/login
   * Backend set httpOnly refresh_token cookie (path=/api/v1/auth/refresh) tự động.
   * @param {{ email: string, password: string }} data
   * @returns {ApiResponse<AuthPayload>}
   */
  login: (data) =>
    axiosClient.post('/auth/login', data),

  /**
   * POST /auth/register — tự động login sau register, trả token giống login (201)
   * Backend field: name (min 1), email, password (min 8)
   * @param {{ ten?: string, name?: string, email: string, password: string }} data
   * @returns {ApiResponse<AuthPayload>}
   */
  register: (data) =>
    axiosClient.post('/auth/register', {
      name: data.ten ?? data.name,
      email: data.email,
      password: data.password,
    }),

  /**
   * GET /auth/me
   * Trả user profile kèm roles từ DB.
   * axiosClient tự gắn Authorization header.
   * @returns {ApiResponse<UserProfile>}
   */
  getProfile: () =>
    axiosClient.get('/auth/me'),

  /**
   * POST /auth/refresh
   * httpOnly cookie tự gửi — chỉ cần gửi csrfToken qua header.
   * Được gọi tự động bởi axiosClient interceptor khi 401,
   * VÀ thủ công bởi authStore.initializeAuth() khi F5.
   * @param {string|null} csrfToken
   * @returns {ApiResponse<AuthPayload>}
   */
  refreshToken: (csrfToken) =>
    axiosClient.post(
      '/auth/refresh',
      {},
      { headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {} }
    ),

  /**
   * POST /auth/logout → 204 No Content
   * Backend xóa Redis session + clear httpOnly cookie.
   */
  logout: () =>
    axiosClient.post('/auth/logout'),

  /**
   * POST /auth/forgot-password
   * Gửi email khôi phục mật khẩu.
   * @param {{ email: string }} data
   */
  forgotPassword: (data) =>
    axiosClient.post('/auth/forgot-password', data),

  /**
   * POST /auth/reset-password
   * Đặt lại mật khẩu mới thông qua token.
   * @param {{ token: string, newPassword: string }} data
   */
  resetPassword: (data) =>
    axiosClient.post('/auth/reset-password', data),

  /**
   * OAuth social login — backend chưa implement, stub tránh crash UI.
   * @param {'google'|'github'} provider
   */
  socialLogin: (provider) =>
    Promise.reject(new Error(`Đăng nhập ${provider} chưa được hỗ trợ.`)),
};