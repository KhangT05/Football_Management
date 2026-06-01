import { create } from 'zustand';
import { authApi } from '../api/authApi';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      // Giả sử API trả về { token: '...', user: {...} }
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        set({
          user: response.user || null,
          isAuthenticated: true,
          loading: false,
        });
        return { success: true };
      }
      return { success: false, error: 'Đăng nhập thất bại. Không tìm thấy token.' };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đăng nhập.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.register(userData);
      set({ loading: false });
      return { success: true, data: response };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký.';
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
