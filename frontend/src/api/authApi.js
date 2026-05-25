import axiosClient from './axiosClient';

export const authApi = {
  login: (data) => {
    // data: { email, password }
    return axiosClient.post('/auth/login', data);
  },
  register: (data) => {
    // data: { ten, mssv, email, password }
    return axiosClient.post('/auth/register', data);
  },
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },
};
