import axios from 'axios';

/**
 * ============================================================
 * TOKEN STORAGE
 * ============================================================
 * - accessToken:  in-memory, mất khi F5 → bootstrap phải gọi refreshTokens()
 * - csrfToken:    localStorage
 * - refreshToken: httpOnly cookie, path=/api/v1/auth/refresh — browser tự gửi
 *
 * RESPONSE SHAPE (ApiResponseShape<T>):
 *   Backend: { status: bool, message: string, data: T, timestamp: string }
 *   Interceptor unwrap response.data → caller nhận object trên
 *   Payload nằm ở .data: const { accessToken } = res.data
 * ============================================================
 */
let _accessToken = null;

export function setAccessToken(token) { _accessToken = token; }
export function getAccessToken() { return _accessToken; }
export function clearAccessToken() { _accessToken = null; }

// ============================================================
// AXIOS INSTANCE
// ============================================================
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,   // gửi httpOnly refresh_token cookie tự động
  timeout: 15000,
});

// ============================================================
// REQUEST INTERCEPTOR
// ============================================================
axiosClient.interceptors.request.use(
  (config) => {
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// SINGLE-FLIGHT REFRESH
// ============================================================
// Mọi nơi cần refresh (401 retry + bootstrap authStore khi F5) PHẢI dùng hàm này.
// Backend dùng rotating refresh token (1 uuid dùng 1 lần) → 2 caller đồng thời
// sẽ race: 1 thành công, 1 fail, hoặc cả 2 "thành công" nhưng state lệch.
//
// _refreshPromise cache promise đang pending → caller thứ N nhận lại CÙNG promise,
// không tạo request mới. Clear trong finally để lần hết hạn tiếp theo hoạt động bình thường.
//
// Scope: dedupe trong 1 tab/JS context. Multi-tab race vẫn phải xử lý ở backend
// (del-before-issue pattern trong AuthService.refresh).
// ============================================================
let _refreshPromise = null;

export function refreshTokens() {
  if (_refreshPromise) return _refreshPromise;

  const csrfToken = localStorage.getItem('csrf_token');

  _refreshPromise = axios  // ← dùng axios gốc, KHÔNG dùng axiosClient
    .post(
      `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
      {},
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
      }
    )
    .then((res) => {
      // axios gốc KHÔNG unwrap → res.data = ApiResponseShape
      const newAccessToken = res.data?.data?.accessToken;
      const newCsrfToken = res.data?.data?.csrfToken;

      if (!newAccessToken) throw new Error('Refresh token không hợp lệ');

      setAccessToken(newAccessToken);
      if (newCsrfToken) localStorage.setItem('csrf_token', newCsrfToken);

      return newAccessToken;
    })
    .catch((err) => {
      clearAccessToken();
      localStorage.removeItem('csrf_token');
      throw err;
    })
    .finally(() => {
      _refreshPromise = null;
    });

  return _refreshPromise;
}

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
axiosClient.interceptors.response.use(
  (response) => {
    // File tải về (Excel export/template...) dùng responseType: 'blob'.
    // response.data lúc này ĐÃ LÀ Blob thật (axios tự parse theo responseType),
    // không phải ApiResponseShape { status, message, data } như API JSON khác.
    // Nếu unwrap thêm 1 lớp (trả response.data) thì caller nhận thẳng Blob,
    // và code component gọi `res.data` sẽ ra undefined (Blob không có field .data)
    // → new Blob([undefined]) tạo file 9 byte chứa chữ "undefined".
    if (response.config.responseType === 'blob') {
      return response; // giữ nguyên, để caller tự lấy đúng res.data (là Blob thật)
    }
    return response.data; // unwrap axios envelope → caller nhận ApiResponseShape<T>
  },

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokens(); // dedupe tự động
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (!window.location.pathname.includes('/dang-nhap')) {
          window.location.href = '/dang-nhap';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;