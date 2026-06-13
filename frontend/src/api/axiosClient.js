import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Gắn token vào header nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu API trả về trực tiếp data
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Xử lý lỗi (ví dụ token hết hạn)
    if (error.response && error.response.status === 401) {
      // Clear token, có thể redirect về login
      localStorage.removeItem('token');
      // window.location.href = '/quan-ly-giai-dau/dang-nhap'; // Tùy chỉnh đường dẫn nếu cần
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
