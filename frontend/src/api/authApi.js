import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => {
    // data: { email, password }
    return axiosClient.post('/auth/login', data);
  },
  register: (data) => {
    // map ten to name as expected by backend RegisterDto
    return axiosClient.post('/auth/register', { name: data.ten, email: data.email, password: data.password });
  },
  getProfile: () => {
    return axiosClient.get('/auth/me');
  },
  socialLogin: (provider) => {
    // provider: 'google' | 'github'
    // Mock API call to simulate waiting for Backend implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          response: {
            data: {
              message: `Tính năng kết nối ${provider === 'google' ? 'Google' : 'Github'} đang được Backend phát triển.`
            }
          }
        });
      }, 1000);
    });
  },
};
