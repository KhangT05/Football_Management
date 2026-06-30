import axiosClient from './axiosClient';

export const jerseyApi = {
  getBySeasonTeam: (seasonTeamId) => {
    return axiosClient.get(`/jerseys/season-teams/${seasonTeamId}`);
  },

  upsert: (seasonTeamId, data) => {
    return axiosClient.put(`/jerseys/season-teams/${seasonTeamId}`, data);
  },

  delete: (seasonTeamId, type) => {
    return axiosClient.delete(`/jerseys/season-teams/${seasonTeamId}`, { params: { type } });
  }
};
