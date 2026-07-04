import axiosClient from './axiosClient';

export const groupApi = {
  getByIdWithTeams: (id) => axiosClient.get(`/groups/${id}`),
  listBySeason: (seasonId) => axiosClient.get(`/groups/season/${seasonId}`),
  createGroup: (seasonId, name) => axiosClient.post(`/groups/season/${seasonId}`, { name }),
  createGroupsBulk: (seasonId, count) => axiosClient.post(`/groups/season/${seasonId}/bulk`, { count }),
  deactivateGroup: (groupId) => axiosClient.delete(`/groups/${groupId}`),
  drawGroups: (seasonId, data) => axiosClient.post(`/groups/season/${seasonId}/draw`, data),
  clearDraw: (seasonId) => axiosClient.delete(`/groups/season/${seasonId}/draw`),
  drawSeeded: (seasonId, data) => axiosClient.post(`/groups/season/${seasonId}/draw/seeded`, data),
  assignTeam: (data) => axiosClient.put(`/groups/assign`, data),
  swapTeams: (data) => axiosClient.put(`/groups/swap`, data),
};