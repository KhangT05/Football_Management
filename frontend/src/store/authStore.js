import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { setAccessToken, clearAccessToken, getAccessToken, refreshTokens } from '../api/axiosClient';

/**
 * Map HTTP error → user-facing message.
 */
function getErrorMessage(error, fallback) {
  const data = error?.response?.data;
  const status = error?.response?.status;
  const rawMsg = data?.message ?? '';

  if (status === 403 && rawMsg === 'Access denied') return 'Email hoặc mật khẩu không chính xác.';
  if (status === 409) return data?.message || 'Email này đã được sử dụng.';
  if (status === 429) return 'Bạn đã thử quá nhiều lần. Vui lòng chờ 15 phút và thử lại.';
  if (status === 422) return data?.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
  return rawMsg || fallback;
}

/**
 * ============================================================
 * useAuthStore — Zustand store quản lý trạng thái xác thực
 * ============================================================
 * Token storage:
 *   accessToken  → in-memory (axiosClient) — mất khi F5, khôi phục qua /refresh
 *   csrfToken    → localStorage — gửi kèm X-CSRF-TOKEN header khi /refresh
 *   refreshToken → httpOnly cookie — browser tự gửi, JS không đọc được
 *
 * Roles: lấy từ /auth/me (DB) — KHÔNG probe API để đoán role.
 *
 * isInitialized: true sau initializeAuth() xong.
 * App phải chờ isInitialized trước khi render routes để tránh
 * redirect sai khi F5 (token đang được khôi phục).
 * ============================================================
 */
const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  isInitialized: false,
  isAuthenticated: false,

  setUser: (userData) => set({ user: userData }),

  // ── login ────────────────────────────────────────────────
  // POST /auth/login → set token → GET /auth/me (roles từ DB)
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.login(credentials);
      const { accessToken, csrfToken } = res.data;

      if (!accessToken) throw new Error('Không nhận được access token từ server');

      setAccessToken(accessToken);
      if (csrfToken) localStorage.setItem('csrf_token', csrfToken);

      let userProfile = null;
      try {
        const profileRes = await authApi.getProfile();
        userProfile = profileRes.data; // { id, name, email, roles }
      } catch (profileErr) {
        console.warn('[authStore] Không lấy được profile:', profileErr);
      }

      set({ user: userProfile, isAuthenticated: true, isInitialized: true, loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng nhập.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ── register ─────────────────────────────────────────────
  // POST /auth/register → set token → GET /auth/me
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await authApi.register(userData);
      const { accessToken, csrfToken } = res.data;

      if (accessToken) {
        setAccessToken(accessToken);
        if (csrfToken) localStorage.setItem('csrf_token', csrfToken);

        try {
          const profileRes = await authApi.getProfile();
          set({ user: profileRes.data, isAuthenticated: true, isInitialized: true });
        } catch {
          set({ isAuthenticated: true, isInitialized: true });
        }
      }

      set({ loading: false });
      return { success: true, data: res.data };
    } catch (error) {
      const errorMsg = getErrorMessage(error, 'Có lỗi xảy ra khi đăng ký.');
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  // ── logout ───────────────────────────────────────────────
  // POST /auth/logout → clear state (kể cả khi API fail)
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

  // ── initializeAuth ───────────────────────────────────────
  // Khôi phục session khi F5 / mở tab mới.
  //
  // Flow:
  //   1. accessToken in-memory còn → đã init (StrictMode double-call) → skip
  //   2. Không có csrf_token → chưa login hoặc đã logout → stop
  //   3. Gọi refreshTokens() — single-flight từ axiosClient, dedupe nếu
  //      interceptor 401 cũng đang refresh đồng thời
  //   4. GET /auth/me lấy profile + roles
  //
  // LUÔN set isInitialized = true ở cuối (kể cả khi fail).
  initializeAuth: async () => {
    if (getAccessToken()) {
      set({ isInitialized: true, isAuthenticated: true });
      return;
    }

    const csrfToken = localStorage.getItem('csrf_token');
    if (!csrfToken) {
      set({ isAuthenticated: false, isInitialized: true });
      return;
    }

    set({ loading: true });
    try {
      // single-flight — không race với interceptor 401 refresh
      await refreshTokens();

      const profileRes = await authApi.getProfile();
      set({
        user: profileRes.data,
        isAuthenticated: true,
        isInitialized: true,
        loading: false,
      });
    } catch {
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      set({ user: null, isAuthenticated: false, isInitialized: true, loading: false });
    }
  },

  // ── socialLogin ──────────────────────────────────────────
  // Backend chưa implement — stub tránh crash UI
  socialLogin: async (provider) => {
    set({ loading: true, error: null });
    try {
      await authApi.socialLogin(provider);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error?.message || `Có lỗi xảy ra khi kết nối ${provider}.`;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;