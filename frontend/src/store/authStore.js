import { create } from 'zustand';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
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
 * Helper để lấy full profile (kèm phone, avatar) và gán roles.
 */
async function enrichUserProfile(baseProfile) {
  if (!baseProfile) return null;
  let fullProfile = { ...baseProfile };
  
  try {
    const res = await userApi.getUserById(fullProfile.id);
    const data = res.data ?? res;
    fullProfile = { ...fullProfile, ...data };
    
    // Convert role objects to string array if necessary for authStore
    if (Array.isArray(fullProfile.roles)) {
      fullProfile.roles = fullProfile.roles.map(r => typeof r === 'string' ? r : r?.name).filter(Boolean);
    }
  } catch (err) {
    console.warn('[authStore] Không thể lấy full profile:', err);
  }
  
  // Fallback if backend doesn't return roles
  if (!fullProfile.roles || fullProfile.roles.length === 0) {
    if (fullProfile.is_admin) {
      fullProfile.roles = ['admin'];
    } else if (fullProfile.role) {
      fullProfile.roles = [fullProfile.role];
    } else {
      fullProfile.roles = ['user'];
    }
  }
  
  return fullProfile;
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
        userProfile = profileRes.data;
        userProfile = await enrichUserProfile(userProfile);
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
          const userProfile = await enrichUserProfile(profileRes.data);
          set({ user: userProfile, isAuthenticated: true, isInitialized: true });
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
      await refreshTokens();

      const profileRes = await authApi.getProfile();
      let userProfile = profileRes?.data ?? profileRes;

      userProfile = await enrichUserProfile(userProfile);

      set({
        user: userProfile,
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