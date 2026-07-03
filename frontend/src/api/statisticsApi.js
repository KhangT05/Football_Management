import axiosClient from './axiosClient';

export const statisticsApi = {
  getUserRegistrations: (days) => {
    return axiosClient.get('/statistics/users/registrations', { params: { days } });
  },

  getSeasonRevenue: (seasonId) => {
    return axiosClient.get('/statistics/seasons/revenue', { params: { season_id: seasonId } });
  },

  getTournamentOverview: (id) => {
    return axiosClient.get(`/statistics/tournaments/${id}/overview`);
  },

  getTeamRegistrations: (seasonId) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/teams/registrations`);
  },

  getTopScorers: (seasonId, limit) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/top-scorers`, { params: { limit } });
  },

  getTeamDiscipline: (seasonId) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/discipline`);
  }
};
