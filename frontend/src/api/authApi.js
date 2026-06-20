import axiosClient from './axiosClient';

/**
 * ============================================================
 * authApi - Các hàm gọi API liên quan đến xác thực người dùng
 * ============================================================
 * Base URL: /api/v1 (qua Vite proxy → backend port 3000)
 *
 * Response shape chuẩn từ backend (sau khi axiosClient interceptor unwrap):
 *   { status, message, data: { accessToken, csrfToken, ... }, timestamp }
 *
 * axiosClient interceptor trả về object đó trực tiếp (response.data của axios).
 * Tức là: const res = await authApi.login() → res.data = { accessToken, ... }
 * ============================================================
 */
export const authApi = {

  /**
   * Đăng nhập
   * POST /auth/login
   * @param {{ email: string, password: string }} data
   * @returns {{ status, message, data: { accessToken, tokenType, expiresIn, csrfToken } }}
   *
   * Backend set httpOnly cookie refresh_token tự động.
   * Cookie có path=/api/v1/auth/refresh → chỉ gửi khi gọi /refresh.
   */
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },

  /**
   * Đăng ký tài khoản mới
   * POST /auth/register
   * @param {{ name: string, email: string, password: string }} data
   * @returns {{ status, message, data: { accessToken, tokenType, expiresIn, csrfToken } }}
   *
   * Backend map: name (min 1), email, password (min 8 chars)
   * Tự động login sau register — trả token giống login (201 Created)
   */
  register: (data) => {
    return axiosClient.post('/auth/register', {
      name: data.ten ?? data.name,  // form dùng 'ten', backend dùng 'name'
      email: data.email,
      password: data.password,
    });
  },

  /**
   * Lấy thông tin profile user hiện tại
   * GET /auth/me
   * @returns {{ status, message, data: { id, name, email } }}
   *
   * axiosClient interceptor tự gắn Authorization: Bearer <accessToken>
   */
  getProfile: () => {
    return axiosClient.get('/auth/me');
  },

  /**
   * Làm mới access token khi hết hạn
   * POST /auth/refresh
   *
   * Được gọi TỰ ĐỘNG bởi axiosClient response interceptor khi nhận 401.
   * - Cookie refresh_token: browser tự gửi (httpOnly, path=/api/v1/auth/refresh)
   * - Header X-CSRF-TOKEN: gửi từ localStorage để chống CSRF
   *
   * @param {string} csrfToken - CSRF token từ localStorage
   * @returns {{ status, message, data: { accessToken, csrfToken, ... } }}
   */
  refreshToken: (csrfToken) => {
    return axiosClient.post(
      '/auth/refresh',
      {},
      {
        headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
      }
    );
  },

  /**
   * Đăng xuất
   * POST /auth/logout
   * @returns void — Backend trả 204 No Content
   *
   * Backend: xóa Redis session + clear httpOnly cookie
   * Frontend: axiosClient gửi Authorization header tự động
   */
  logout: () => {
    return axiosClient.post('/auth/logout');
  },

  /**
   * Đăng nhập bằng mạng xã hội (Google / GitHub)
   * [Backend chưa implement OAuth — stub để không crash UI]
   *
   * Khi backend implement sẽ redirect sang provider OAuth flow.
   * @param {'google'|'github'} provider
   */
  socialLogin: (provider) => {
    // TODO: Implement khi backend có OAuth endpoints
    // return axiosClient.get(`/auth/oauth/${provider}`);
    return Promise.reject(new Error(`Đăng nhập ${provider} chưa được hỗ trợ.`));
  },
};
