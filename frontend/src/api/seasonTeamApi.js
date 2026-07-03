import axiosClient from './axiosClient';

export const seasonTeamApi = {
  getAll: (params) => axiosClient.get('/seasonteams', { params }),
  getById: (id) => axiosClient.get(`/seasonteams/${id}`),
  register: (data) => axiosClient.post('/seasonteams/register', data),
  adminAdd: (data) => axiosClient.post('/seasonteams', data),
  updateStatus: (id, data) => axiosClient.patch(`/seasonteams/${id}/status`, data), // { status, note }
  approve: (id) => axiosClient.patch(`/seasonteams/${id}/approve`),
  assignGroup: (id, data) => axiosClient.patch(`/seasonteams/${id}/group`, data),   // { group_id }
  transferSeason: (id, data) => axiosClient.patch(`/seasonteams/${id}/transfer`, data), // { season_id }
  delete: (id) => axiosClient.delete(`/seasonteams/${id}`),
};
