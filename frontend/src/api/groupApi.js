import axiosClient from './axiosClient';

export const groupApi = {
  getByIdWithTeams: (id) => axiosClient.get(`/groups/${id}`),
  drawGroups: (phaseId, data) => axiosClient.post(`/groups/${phaseId}/draw`, data), // { teams_per_group }
  clearDraw: (phaseId) => axiosClient.delete(`/groups/${phaseId}/draw`),
};
