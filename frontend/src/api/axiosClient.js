import axios from 'axios';

/**
 * ============================================================
 * TOKEN STORAGE - Theo mô hình bảo mật của backend (auth.md)
 * ============================================================
 * - accessToken:  lưu in-memory (biến JS) → không thể bị XSS đọc qua localStorage
 * - csrfToken:    lưu localStorage → cần gửi kèm header X-CSRF-TOKEN khi /refresh
 * - refreshToken: httpOnly cookie → trình duyệt tự gửi, JS không đọc được
 *
 * Tại sao KHÔNG lưu accessToken vào localStorage?
 * → XSS attack có thể đọc mọi giá trị trong localStorage
 * → In-memory token biến mất khi tab đóng → bắt buộc refresh token mới (đúng thiết kế)
 * ============================================================
 */
let _accessToken = null;  // Biến in-memory lưu JWT access token (15 phút TTL)
let _isRefreshing = false; // Cờ ngăn gửi nhiều request refresh đồng thời
let _failedQueue = [];     // Hàng đợi các request bị thất bại khi đang refresh token

/**
 * Xử lý hàng đợi request bị block trong khi token đang được refresh
 * @param {Error|null} error - Lỗi nếu refresh thất bại
 * @param {string|null} token - Token mới nếu refresh thành công
 */
function processQueue(error, token = null) {
  _failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  _failedQueue = [];
}

// ============================================================
// GETTER / SETTER cho accessToken (dùng trong authStore)
// ============================================================

/** Lưu access token vào memory */
export function setAccessToken(token) {
  _accessToken = token;
}

/** Lấy access token hiện tại */
export function getAccessToken() {
  return _accessToken;
}

/** Xóa access token (khi logout) */
export function clearAccessToken() {
  _accessToken = null;
}

// ============================================================
// TẠO AXIOS INSTANCE
// ============================================================
const axiosClient = axios.create({
  /**
   * Dùng đường dẫn tương đối thay vì URL tuyệt đối:
   * - Browser gửi request đến cùng origin (http://localhost:3001/api/v1/...)
   * - Vite proxy server-side forward sang http://localhost:3000/api/v1/...
   * - Không có cross-origin request → không bị CORS block
   *
   * KHÔNG dùng: 'http://localhost:3000/api/v1' (sẽ bị CORS block nếu port khác nhau)
   */
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials = true: Cho phép trình duyệt tự gửi httpOnly cookie
  // (bao gồm refresh_token cookie mà backend set)
  withCredentials: true,
});


// ============================================================
// REQUEST INTERCEPTOR - Gắn access token vào mọi request
// ============================================================
axiosClient.interceptors.request.use(
  (config) => {
    // Nếu có access token in-memory, gắn vào Authorization header
    if (_accessToken) {
      config.headers.Authorization = `Bearer ${_accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================================
// RESPONSE INTERCEPTOR - Xử lý token hết hạn & tự động refresh
// ============================================================
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về trực tiếp response.data vì API luôn wrap trong { status, message, data, timestamp }
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // ── Xử lý lỗi 401 Unauthorized ──────────────────────────
    // Nếu server trả 401 VÀ request này chưa được retry
    // VÀ đây không phải endpoint refresh (tránh vòng lặp vô hạn)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (_isRefreshing) {
        // Đang có request khác đang refresh → đưa vào hàng đợi chờ token mới
        return new Promise((resolve, reject) => {
          _failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // Sau khi refresh xong, retry request với token mới
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Đánh dấu đang refresh và request này sẽ được retry
      originalRequest._retry = true;
      _isRefreshing = true;

      try {
        // Gọi /auth/refresh:
        // - Cookie refresh_token được trình duyệt tự gửi (httpOnly)
        // - Cần gửi CSRF token trong header X-CSRF-TOKEN để chống CSRF attack
        const csrfToken = localStorage.getItem('csrf_token');
        const refreshRes = await axiosClient.post('/auth/refresh', {}, {
          headers: csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {},
        });

        // API trả về { status, message, data: { accessToken, csrfToken, ... } }
        const newAccessToken = refreshRes.data?.accessToken;
        const newCsrfToken = refreshRes.data?.csrfToken;

        if (!newAccessToken) throw new Error('Refresh token không hợp lệ');

        // Cập nhật token mới vào memory và localStorage
        setAccessToken(newAccessToken);
        if (newCsrfToken) {
          localStorage.setItem('csrf_token', newCsrfToken);
        }

        // Xử lý các request đang chờ trong hàng đợi
        processQueue(null, newAccessToken);

        // Retry request ban đầu với access token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại (token hết hạn / Redis miss) → đẩy lỗi cho tất cả request đang chờ
        processQueue(refreshError, null);

        // Xóa toàn bộ trạng thái auth → buộc user đăng nhập lại
        clearAccessToken();
        localStorage.removeItem('csrf_token');

        // Redirect về trang login nếu không phải đang ở đó rồi
        if (!window.location.pathname.includes('/dang-nhap')) {
          window.location.href = '/quan-ly-giai-dau/dang-nhap';
        }

        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
