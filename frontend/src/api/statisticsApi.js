import axiosClient from './axiosClient';

export const statisticsApi = {
  // Gộp 6 KPI card (giải đấu / mùa giải / đội bóng / người dùng / doanh thu / user mới)
  // thành 1 call duy nhất — khớp với GET /statistics/overview ở backend.
  getSystemOverview: (period) => {
    return axiosClient.get('/statistics/overview', { params: { period } });
  },
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
  // FIX: route thật ở controller là GET /statistics/players/{playerId}/career,
  // không phải /seasons/players/{playerId}/career-stats
  getPlayerCareer: (playerId) => {
    return axiosClient.get(`/statistics/players/${playerId}/career`);
  },
};