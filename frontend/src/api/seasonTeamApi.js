import axiosClient from './axiosClient';

export const seasonTeamApi = {
  getAll: (params) => axiosClient.get('/seasonteams', { params }),
  getById: (id) => axiosClient.get(`/seasonteams/${id}`),
  register: (data) => axiosClient.post('/seasonteams/register', data),
  adminAdd: (data) => axiosClient.post('/seasonteams', data),
  updateStatus: (id, data) => axiosClient.patch(`/seasonteams/${id}/status`, data), // { status, note }
  assignGroup: (id, data) => axiosClient.patch(`/seasonteams/${id}/group`, data),   // { group_id }
  delete: (id) => axiosClient.delete(`/seasonteams/${id}`),
};
