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
      
      const token = response.data?.accessToken;

      if (token) {
        localStorage.setItem('token', token);
        
        // Fetch user profile immediately after login
        let userProfile = null;
        try {
          const profileRes = await authApi.getProfile();
          userProfile = profileRes.data;
        } catch (err) {
          console.error("Failed to fetch user profile", err);
        }

        set({
          user: userProfile,
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
      return { success: true, data: response.data };
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

  socialLogin: async (provider) => {
    set({ loading: true, error: null });
    try {
      const response = await authApi.socialLogin(provider);
      // Logic for successful social login when backend is ready
      // const token = response.data?.accessToken;
      // ... same logic as login
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || `Có lỗi xảy ra khi kết nối ${provider}.`;
      set({ error: errorMsg, loading: false });
      return { success: false, error: errorMsg };
    }
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
