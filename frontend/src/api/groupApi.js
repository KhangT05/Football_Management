import axiosClient from './axiosClient';

export const groupApi = {
  getByIdWithTeams: (id) => axiosClient.get(`/groups/${id}`),
  drawGroups: (phaseId, data) => axiosClient.post(`/groups/${phaseId}/draw`, data),
  clearDraw: (phaseId) => axiosClient.delete(`/groups/${phaseId}/draw`),
  drawSeeded: (phaseId, data) => axiosClient.post(`/groups/${phaseId}/draw/seeded`, data),
  assignTeam: (data) => axiosClient.put(`/groups/assign`, data),
  swapTeams: (data) => axiosClient.put(`/groups/swap`, data),
};
