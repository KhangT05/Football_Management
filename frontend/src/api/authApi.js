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
};
