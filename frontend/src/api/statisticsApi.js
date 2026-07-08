import axiosClient from './axiosClient';

export const statisticsApi = {
  getUserRegistrations: (period) => {
    return axiosClient.get('/statistics/users/registrations', { params: { period } });
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

  getTopAssists: (seasonId, limit) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/top-assists`, { params: { limit } });
  },

  getTopYellowCards: (seasonId, limit) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/top-yellow-cards`, { params: { limit } });
  },

  getTopRedCards: (seasonId, limit) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/top-red-cards`, { params: { limit } });
  },

  getBestPlayers: (seasonId, limit) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/best-players`, { params: { limit } });
  },

  getTeamDiscipline: (seasonId) => {
    return axiosClient.get(`/statistics/seasons/${seasonId}/discipline`);
  },

  getPlayerCareer: (playerId) => {
    return axiosClient.get(`/seasons/players/${playerId}/career-stats`);
  }
};
