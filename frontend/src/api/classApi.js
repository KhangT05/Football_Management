import axiosClient from './axiosClient';

export const classApi = {
  getAll: (params) => {
    return axiosClient.get('/classes', { params });
  },

  getById: (id) => {
    return axiosClient.get(`/classes/${id}`);
  },

  create: (data) => {
    return axiosClient.post('/classes', data);
  },

  update: (id, data) => {
    return axiosClient.patch(`/classes/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/classes/${id}`);
  },
};
