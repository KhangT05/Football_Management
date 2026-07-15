import axiosClient from './axiosClient';

/**
 * statisticsApi — map 1:1 với StatisticsController (statistics.controller.ts)
 * và các method mở rộng trong StatisticsService (statistics.service.ts).
 *
 * Nhóm theo cấp độ dữ liệu (không phải theo quyền — phân quyền xử lý ở BE):
 *  - KPI / overview hệ thống, mùa giải
 *  - Rankings (top scorer/assist/card/best player)
 *  - Team stats hierarchy: overview → tournament → season → match (+ /extended)
 *  - Player stats hierarchy: overview → tournament → season → match
 *  - Team/Player participation, finance, performance, discipline
 *  - Batch (toàn season) — tránh N+1 khi hiển thị bảng nhiều dòng
 */
export const statisticsApi = {
  // ═══ SYSTEM / KPI ═══
  getSystemOverview: (period) =>
    axiosClient.get('/statistics/overview', { params: { period } }),
  getUserRegistrations: (period) =>
    axiosClient.get('/statistics/users/registrations', { params: { period } }),
  getSeasonRevenue: (seasonId) =>
    axiosClient.get('/statistics/seasons/revenue', { params: { season_id: seasonId } }),
  getTournamentOverview: (id) =>
    axiosClient.get(`/statistics/tournaments/${id}/overview`),

  // ═══ SEASON — teams / rankings / discipline ═══
  getTeamRegistrations: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/teams/registrations`),
  getTopScorers: (seasonId, limit) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/top-scorers`, { params: { limit } }),
  getTopAssists: (seasonId, limit) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/top-assists`, { params: { limit } }),
  getTopYellowCards: (seasonId, limit) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/top-yellow-cards`, { params: { limit } }),
  getTopRedCards: (seasonId, limit) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/top-red-cards`, { params: { limit } }),
  getBestPlayers: (seasonId, limit) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/best-players`, { params: { limit } }),
  getTeamDiscipline: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/discipline`),
  getPlayerFinanceStats: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/finance`),

  // ═══ TEAM STATS HIERARCHY ═══
  getTeamOverview: (teamId) =>
    axiosClient.get(`/statistics/teams/${teamId}/overview`),
  getTeamTournamentStats: (teamId, tournamentId) =>
    axiosClient.get(`/statistics/teams/${teamId}/tournaments/${tournamentId}`),
  getTeamSeasonStats: (teamId, seasonId) =>
    axiosClient.get(`/statistics/teams/${teamId}/seasons/${seasonId}`),
  getTeamMatchStats: (teamId, matchId) =>
    axiosClient.get(`/statistics/teams/${teamId}/matches/${matchId}`),
  // granularity: 'day'|'month'|'year' (default 'month'); period optional —
  // không truyền = toàn bộ lịch sử.
  getTeamMatchTimeSeries: (teamId, { granularity, period } = {}) =>
    axiosClient.get(`/statistics/teams/${teamId}/matches/timeseries`, {
      params: { granularity, period },
    }),

  // ─── TEAM V2 (extended: home/away split, streak, biggest win/loss, clean sheets) ───
  getTeamOverviewExtended: (teamId, period) =>
    axiosClient.get(`/statistics/teams/${teamId}/overview/extended`, { params: { period } }),
  getTeamTournamentStatsExtended: (teamId, tournamentId) =>
    axiosClient.get(`/statistics/teams/${teamId}/tournaments/${tournamentId}/extended`),
  getTeamSeasonStatsExtended: (teamId, seasonId) =>
    axiosClient.get(`/statistics/teams/${teamId}/seasons/${seasonId}/extended`),

  // ─── TEAM — participation & finance ───
  getTeamParticipations: (teamId) =>
    axiosClient.get(`/statistics/teams/${teamId}/participations`),
  getTeamFinance: (teamId, seasonId) =>
    axiosClient.get(`/statistics/teams/${teamId}/finance`, { params: { season_id: seasonId } }),

  // Batch — toàn bộ team trong 1 season, thay N+1 call theo từng team.
  getTeamsSeasonStatsBatch: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/teams/batch`),
  getTeamsFinanceBatch: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/teams/finance-batch`),

  // ═══ PLAYER STATS HIERARCHY ═══
  getPlayerOverview: (playerId) =>
    axiosClient.get(`/statistics/players/${playerId}/overview`),
  getPlayerTournamentStats: (playerId, tournamentId) =>
    axiosClient.get(`/statistics/players/${playerId}/tournaments/${tournamentId}`),
  getPlayerSeasonStats: (playerId, seasonId) =>
    axiosClient.get(`/statistics/players/${playerId}/seasons/${seasonId}`),
  getPlayerMatchStats: (playerId, matchId) =>
    axiosClient.get(`/statistics/players/${playerId}/matches/${matchId}`),
  getPlayerCareer: (playerId) =>
    axiosClient.get(`/statistics/players/${playerId}/career`),

  // ─── PLAYER — participation, performance, discipline, teams-in-period ───
  getPlayerParticipations: (playerId) =>
    axiosClient.get(`/statistics/players/${playerId}/participations`),
  getPlayerPerformance: (playerId, seasonId) =>
    axiosClient.get(`/statistics/players/${playerId}/performance`, { params: { season_id: seasonId } }),
  getPlayerDisciplineStatus: (playerId, seasonId) =>
    axiosClient.get(`/statistics/players/${playerId}/seasons/${seasonId}/discipline`),
  // from/to: truyền ISO string hoặc Date — tự convert bên dưới
  getPlayerTeamsInPeriod: (playerId, from, to) =>
    axiosClient.get(`/statistics/players/${playerId}/teams-in-period`, {
      params: {
        from: from instanceof Date ? from.toISOString() : from,
        to: to instanceof Date ? to.toISOString() : to,
      },
    }),

  // Batch — toàn bộ player trong 1 season.
  getPlayersPerformanceStatsBatch: (seasonId) =>
    axiosClient.get(`/statistics/seasons/${seasonId}/players/performance-batch`),

  // ═══ STANDINGS (không thuộc StatisticsController nhưng cùng domain) ═══
  getActiveStandings: (seasonId) =>
    axiosClient.get(`/seasons/${seasonId}/standings`),
};

export default statisticsApi;