import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { setAccessToken, clearAccessToken, getAccessToken } from '../api/axiosClient';

/**
 * Map error từ backend sang message thân thiện với người dùng.
 *
 * Backend che mọi lỗi auth (UNAUTHORIZED, NOT_FOUND) thành 403 "Access denied"
 * để tránh leak thông tin (kẻ tấn công không biết email có tồn tại hay không).
 * Frontend cần dịch ngược lại thành message rõ ràng cho user.
 *
 * @param {unknown} error - Lỗi từ axios (error.response.data là body API)
 * @param {string} fallback - Thông báo mặc định nếu không map được
 */
function getErrorMessage(error, fallback) {
  const data = error?.response?.data;   // { status, code, message, ... }
  const status = error?.response?.status;
  const rawMsg = data?.message ?? '';

  // 403 "Access denied" = backend che lỗi login/auth → email/password sai
  if (status === 403 && rawMsg === 'Access denied') {
    return 'Email hoặc mật khẩu không chính xác.';
  }

  // 409 Conflict = email đã tồn tại (register)
  if (status === 409) {
    return data?.message || 'Email này đã được sử dụng.';
  }

  // 429 Too Many Requests = vượt quá giới hạn thử
  if (status === 429) {
    return 'Bạn đã thử quá nhiều lần. Vui lòng chờ 15 phút và thử lại.';
  }

  // 422 Validation error = dữ liệu gửi lên sai format
  if (status === 422) {
    return data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  }

  // Các lỗi khác: hiển thị message từ server hoặc fallback
  return rawMsg || fallback;
}

/**
 * ============================================================
 * useAuthStore - Zustand store quản lý trạng thái xác thực
 * ============================================================
 * Theo mô hình bảo mật (auth.md):
 *
 * Token Storage:
 * - accessToken  → in-memory (biến trong axiosClient) - KHÔNG lưu localStorage
 * - csrfToken    → localStorage (cần gửi khi /refresh)
 * - refreshToken → httpOnly cookie (JS không truy cập được)
 *
 * isAuthenticated: phụ thuộc vào csrf_token trong localStorage
 * (dùng làm hint ban đầu; thực tế xác nhận khi gọi /auth/me thành công)
 * ============================================================
 */
const useAuthStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────
  user: null,              // Thông tin user sau khi lấy từ /auth/me
  loading: false,          // Trạng thái đang xử lý (hiển thị spinner)
  error: null,             // Thông báo lỗi (hiển thị trên UI)

  /** Cập nhật thông tin user */
  setUser: (userData) => set({ user: userData }),


  /**
   * isAuthenticated: true nếu có csrf_token trong localStorage
   * csrf_token chỉ được set sau khi login/register thành công
   * và bị xóa khi logout hoặc refresh thất bại
   */
  isAuthenticated: !!localStorage.getItem('csrf_token'),

  // ── Actions ───────────────────────────────────────────────

  /**
   * Đăng nhập người dùng
   * POST /auth/login
   *
   * Flow:
   * 1. Gọi API login → nhận { accessToken, csrfToken } trong body
   * 2. Backend set httpOnly cookie refresh_token tự động
   * 3. Lưu accessToken vào memory (axiosClient)
   * 4. Lưu csrfToken vào localStorage (dùng khi gọi /refresh)
   * 5. Gọi /auth/me để lấy thông tin user
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {{ success: boolean, error?: string }}
   */
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      // Gọi POST /auth/login → API trả ApiResponseShape<TokenResponseDto>
      // axiosClient interceptor đã unwrap → ta nhận trực tiếp { status, message, data }
      const response = await authApi.login(credentials);

      // Backend trả data: { accessToken, tokenType, expiresIn, csrfToken }
      const { accessToken, csrfToken } = response.data ?? {};

      if (!accessToken) {
        throw new Error('Không nhận được access token từ server');
      }

      // Lưu access token vào memory (trong axiosClient) - KHÔNG lưu localStorage
      setAccessToken(accessToken);

      // Lưu CSRF token vào localStorage (cần gửi kèm header khi /refresh)
      if (csrfToken) {
        localStorage.setItem('csrf_token', csrfToken);
      }

      // Lấy thông tin profile user ngay sau khi login (GET /auth/me)
      let userProfile = null;
      try {
        const profileRes = await authApi.getProfile();
        // profileRes.data là object user (id, name, email, role, ...)
        userProfile = profileRes.data;
      } catch (profileErr) {
        // Không fetch được profile không phải lỗi nghiêm trọng, vẫn cho login
        console.warn('[authStore] Không lấy được profile user:', profileErr);
      }

      set({
        user: userProfile,
        isAuthenticated: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      // Map lỗi backend (có thể bị che) sang message thân thiện bằng tiếng Việt
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng nhập.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Đăng ký tài khoản mới
   * POST /auth/register
   *
   * Backend tạo account + tự động issue token (giống login)
   * Frontend KHÔNG cần tự login lại sau register
   *
   * @param {{ ten: string, email: string, password: string }} userData
   * @returns {{ success: boolean, error?: string }}
   */
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      // authApi.register sẽ map { ten } → { name } cho backend
      const response = await authApi.register(userData);

      // Backend register cũng trả token (201 + TokenResponseDto)
      const { accessToken, csrfToken } = response.data ?? {};

      // Nếu có token → tự động đăng nhập sau register
      if (accessToken) {
        setAccessToken(accessToken);
        if (csrfToken) {
          localStorage.setItem('csrf_token', csrfToken);
        }

        // Lấy profile ngay sau register
        try {
          const profileRes = await authApi.getProfile();
          set({ user: profileRes.data, isAuthenticated: true });
        } catch {
          // Không fetch được profile vẫn OK
        }
      }

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      // Map lỗi backend sang message thân thiện:
      // - 409 = email đã tồn tại → "Email này đã được sử dụng."
      // - 422 = dữ liệu không hợp lệ → "Dữ liệu không hợp lệ..."
      // - 429 = rate limit → "Vui lòng chờ 15 phút..."
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng ký.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Đăng xuất người dùng
   * POST /auth/logout
   *
   * Flow:
   * 1. Gọi API /auth/logout → backend xóa Redis session + clear cookie
   * 2. Xóa access token khỏi memory
   * 3. Xóa CSRF token khỏi localStorage
   * 4. Reset state về mặc định
   */
  logout: async () => {
    try {
      // Gọi backend trước để invalidate refresh token trong Redis
      // (ngay cả khi fail, vẫn clear client-side)
      await authApi.logout();
    } catch (error) {
      console.warn('[authStore] Logout API call thất bại (có thể token đã hết hạn):', error);
    } finally {
      // Luôn xóa token phía client dù API có lỗi hay không
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  /**
   * Khởi tạo lại session khi ứng dụng load
   * Dùng khi user F5 / mở tab mới → access token bị mất (in-memory)
   * nhưng cookie refresh_token vẫn còn → có thể lấy token mới
   *
   * Flow:
   * 1. Kiểm tra có csrf_token không (hint rằng có thể còn session)
   * 2. Gọi /auth/refresh để lấy access token mới
   * 3. Lấy profile user
   */
  initializeAuth: async () => {
    const csrfToken = localStorage.getItem('csrf_token');

    // Nếu không có csrf_token → chắc chắn chưa login hoặc đã logout
    if (!csrfToken) {
      set({ isAuthenticated: false });
      return;
    }

    // Nếu đã có access token trong memory (không cần init lại)
    if (getAccessToken()) return;

    set({ loading: true });
    try {
      // Gọi /auth/refresh: cookie tự gửi, CSRF token gửi qua header
      const refreshRes = await authApi.refreshToken(csrfToken);
      const { accessToken, csrfToken: newCsrfToken } = refreshRes.data ?? {};

      if (!accessToken) throw new Error('Không lấy được token mới');

      // Cập nhật token mới
      setAccessToken(accessToken);
      if (newCsrfToken) {
        localStorage.setItem('csrf_token', newCsrfToken);
      }

      // Lấy thông tin user
      const profileRes = await authApi.getProfile();
      set({
        user: profileRes.data,
        isAuthenticated: true,
        loading: false,
      });
    } catch {
      // Refresh thất bại → session hết hạn, buộc login lại
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  /**
   * Đăng nhập qua mạng xã hội (Google / Github)
   * [CHƯA ĐƯỢC BACKEND IMPLEMENT - đang mock]
   *
   * @param {'google'|'github'} provider
   */
  socialLogin: async (provider) => {
    set({ loading: true, error: null });
    try {
      await authApi.socialLogin(provider);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || `Có lỗi xảy ra khi kết nối ${provider}.`;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  /** Xóa thông báo lỗi (dùng trước khi submit form) */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
