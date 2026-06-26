import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { setAccessToken, clearAccessToken, getAccessToken } from '../api/axiosClient';

/**
 * Map error từ backend sang message thân thiện với người dùng.
 */
function getErrorMessage(error, fallback) {
  const data = error?.response?.data;
  const status = error?.response?.status;
  const rawMsg = data?.message ?? '';

  if (status === 403 && rawMsg === 'Access denied') {
    return 'Email hoặc mật khẩu không chính xác.';
  }
  if (status === 409) {
    return data?.message || 'Email này đã được sử dụng.';
  }
  if (status === 429) {
    return 'Bạn đã thử quá nhiều lần. Vui lòng chờ 15 phút và thử lại.';
  }
  if (status === 422) {
    return data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  }
  return rawMsg || fallback;
}

/**
 * ============================================================
 * useAuthStore - Zustand store quản lý trạng thái xác thực
 * ============================================================
 * Token Storage:
 * - accessToken  → in-memory (biến trong axiosClient) - KHÔNG lưu localStorage
 * - csrfToken    → localStorage (cần gửi khi /refresh)
 * - refreshToken → httpOnly cookie (JS không truy cập được)
 *
 * isInitialized: true sau khi initializeAuth() hoàn thành.
 * App.jsx phải chờ isInitialized trước khi render routes để tránh
 * redirect sai khi F5 (access token đang được khôi phục từ refresh).
 * ============================================================
 */
const useAuthStore = create((set) => ({
  // ── State ─────────────────────────────────────────────────
  user: null,              // Thông tin user sau khi lấy từ /auth/me
  loading: false,          // Trạng thái đang xử lý (hiển thị spinner)
  error: null,             // Thông báo lỗi (hiển thị trên UI)

  /**
   * isInitialized: true sau khi initializeAuth() chạy xong.
   * Trong thời gian chưa khởi tạo xong, App.jsx render loader thay vì routes
   * → tránh AdminRoute/ProtectedRoute redirect sai khi F5.
   */
  isInitialized: false,

  /**
   * isAuthenticated: true nếu user object khác null.
   * Được set sau login/register/initializeAuth thành công.
   * Fallback: kiểm tra csrf_token trong localStorage khi chưa init xong.
   */
  isAuthenticated: false,

  /** Cập nhật thông tin user */
  setUser: (userData) => set({ user: userData }),

  // ── Actions ───────────────────────────────────────────────

  /**
   * Đăng nhập người dùng
   * POST /auth/login
   */
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      const { accessToken, csrfToken } = response.data ?? {};

      if (!accessToken) {
        throw new Error('Không nhận được access token từ server');
      }

      setAccessToken(accessToken);
      if (csrfToken) {
        localStorage.setItem('csrf_token', csrfToken);
      }

      let userProfile = null;
      try {
        const profileRes = await authApi.getProfile();
        userProfile = profileRes.data;
      } catch (profileErr) {
        console.warn('[authStore] Không lấy được profile user:', profileErr);
      }

      set({
        user: userProfile,
        isAuthenticated: true,
        isInitialized: true,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng nhập.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Đăng ký tài khoản mới
   * POST /auth/register
   */
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      const { accessToken, csrfToken } = response.data ?? {};

      if (accessToken) {
        setAccessToken(accessToken);
        if (csrfToken) {
          localStorage.setItem('csrf_token', csrfToken);
        }
        try {
          const profileRes = await authApi.getProfile();
          set({ user: profileRes.data, isAuthenticated: true, isInitialized: true });
        } catch {
          set({ isAuthenticated: true, isInitialized: true });
        }
      }

      set({ loading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng ký.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  /**
   * Đăng xuất người dùng
   * POST /auth/logout
   */
  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn('[authStore] Logout API call thất bại:', error);
    } finally {
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  /**
   * Khởi tạo lại session khi ứng dụng load (F5 / mở tab mới)
   * - accessToken bị mất (in-memory) → cần refresh
   * - httpOnly cookie refresh_token vẫn còn → gọi /auth/refresh để lấy token mới
   *
   * QUAN TRỌNG: Luôn set isInitialized = true ở cuối (kể cả khi fail)
   * để App.jsx biết là đã kiểm tra xong, có thể render routes.
   */
  initializeAuth: async () => {
    // Nếu đã có access token (không cần init lại)
    if (getAccessToken()) {
      set({ isInitialized: true, isAuthenticated: true });
      return;
    }

    const csrfToken = localStorage.getItem('csrf_token');

    // Nếu không có csrf_token → chắc chắn chưa login hoặc đã logout
    if (!csrfToken) {
      set({ isAuthenticated: false, isInitialized: true });
      return;
    }

    set({ loading: true });
    try {
      // Gọi /auth/refresh: cookie tự gửi, CSRF token gửi qua header
      const refreshRes = await authApi.refreshToken(csrfToken);

      // refreshRes đã được unwrap bởi axiosClient interceptor thành công
      // Nếu backend trả { status, message, data: { accessToken, csrfToken } }
      // thì interceptor unwrap → refreshRes = { status, message, data: {...} }
      const tokenData = refreshRes?.data ?? refreshRes;
      const accessToken = tokenData?.accessToken;
      const newCsrfToken = tokenData?.csrfToken;

      if (!accessToken) throw new Error('Không lấy được token mới');

      setAccessToken(accessToken);
      if (newCsrfToken) {
        localStorage.setItem('csrf_token', newCsrfToken);
      }

      // Lấy thông tin user
      const profileRes = await authApi.getProfile();
      const userProfile = profileRes?.data ?? profileRes;

      set({
        user: userProfile,
        isAuthenticated: true,
        isInitialized: true,
        loading: false,
      });
    } catch {
      // Refresh thất bại → session hết hạn
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      set({ user: null, isAuthenticated: false, isInitialized: true, loading: false });
    }
  },

  /**
   * Đăng nhập qua mạng xã hội (Google / Github)
   * [CHƯA ĐƯỢC BACKEND IMPLEMENT - đang mock]
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

  /** Xóa thông báo lỗi */
  clearError: () => set({ error: null }),
}));

export default useAuthStore;
