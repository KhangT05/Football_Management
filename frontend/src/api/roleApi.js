import axiosClient from './axiosClient';

export const roleApi = {
  getRoles: (params) => {
    return axiosClient.get('/roles', { params });
  },

  getRoleById: (id) => {
    return axiosClient.get(`/roles/${id}`);
  },

  createRole: (data) => {
    return axiosClient.post('/roles', data);
  },

  updateRole: (id, data) => {
    return axiosClient.patch(`/roles/${id}`, data);
  },

  deleteRole: (id) => {
    return axiosClient.delete(`/roles/${id}`);
  }
};
