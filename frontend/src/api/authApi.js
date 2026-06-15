import axiosClient from './axiosClient';

/**
 * ============================================================
 * authApi - Các hàm gọi API liên quan đến xác thực người dùng
 * ============================================================
 * Base URL được cấu hình trong axiosClient (VITE_API_URL)
 * Tất cả response được unwrap bởi interceptor → trả về object { status, message, data, timestamp }
 * ============================================================
 */
export const authApi = {

  /**
   * Đăng nhập người dùng
   * POST /auth/login
   *
   * @param {{ email: string, password: string }} data - Thông tin đăng nhập
   * @returns {{ status, message, data: { accessToken, tokenType, expiresIn, csrfToken } }}
   *
   * Backend sẽ:
   * 1. Kiểm tra email + password
   * 2. Tạo access token (JWT, 15 phút) + refresh token UUID
   * 3. Set httpOnly cookie 'refresh_token' (30 ngày, path=/api/v1/auth/refresh)
   * 4. Trả accessToken + csrfToken trong body
   */
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * Đăng ký tài khoản mới
   * POST /auth/register
   *
   * @param {{ name: string, email: string, password: string }} data
   * @returns {{ status, message, data: { accessToken, tokenType, expiresIn, csrfToken } }}
   *
   * Backend trả về 201 Created + tự động login luôn (trả token tương tự login)
   * Frontend map: { ten, email, password } → { name, email, password }
   */
  register: (data) => {
    return axiosClient.post('/auth/register', {
      name: data.ten,      // Backend dùng 'name', form dùng 'ten'
      email: data.email,
      password: data.password,
    });
  },

  /**
   * Lấy thông tin profile người dùng đang đăng nhập
   * GET /auth/me
   *
   * Cần gửi kèm Authorization: Bearer <accessToken>
   * axiosClient.interceptors sẽ tự gắn header này từ biến in-memory
   *
   * @returns {{ status, message, data: { id, name, email, role, ... } }}
   */
  getProfile: () => {
    return axiosClient.get('/auth/me');
  },

  /**
   * Làm mới access token khi hết hạn
   * POST /auth/refresh
   *
   * Được gọi TỰ ĐỘNG bởi axiosClient response interceptor khi nhận 401
   * - Cookie refresh_token: trình duyệt tự gửi (httpOnly, withCredentials: true)
   * - Header X-CSRF-TOKEN: gửi từ localStorage để chống CSRF attack
   *
   * @param {string} csrfToken - CSRF token lấy từ localStorage
   * @returns {{ status, message, data: { accessToken, csrfToken, ... } }}
   */
  refreshToken: (csrfToken) => {
    return axiosClient.post(
      '/auth/refresh',
      {},
      {
        // Gửi CSRF token trong header để backend xác thực
        headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
      }
    );
  },

  /**
   * Đăng xuất người dùng
   * POST /auth/logout
   *
   * Cần Authorization: Bearer <accessToken> (Security('jwt') trong backend)
   * Backend sẽ:
   * 1. Xóa session Redis (invalidate refresh token)
   * 2. Clear httpOnly cookie 'refresh_token'
   * Frontend cần xóa: accessToken (memory) + csrfToken (localStorage)
   *
   * @returns {void} - Backend trả 204 No Content
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  /**
   * Đăng nhập qua mạng xã hội (Google / Github)
   * [CHƯA ĐƯỢC BACKEND IMPLEMENT]
   *
   * @param {'google'|'github'} provider - Nhà cung cấp OAuth
   * @returns {Promise} - Mock reject với thông báo
   */
  socialLogin: (provider) => {
    // Mock: giả lập độ trễ API và trả về lỗi thông báo chưa hỗ trợ
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject({
          response: {
            data: {
              message: `Tính năng kết nối ${provider === 'google' ? 'Google' : 'Github'} đang được Backend phát triển.`,
            },
          },
        });
      }, 1000);
    });
  },
};
