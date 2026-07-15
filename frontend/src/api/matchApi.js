import axiosClient from './axiosClient';


export const matchApi = {

  getScheduleBySeason: (seasonId, params = {}) =>
    axiosClient.get(`/schedules/seasons/${seasonId}/schedule`, { params }),

  getTeamSchedule: (seasonId, teamId, params = {}) =>
    axiosClient.get(`/schedules/seasons/${seasonId}/teams/${teamId}/schedule`, { params }),

  getGroupStageRoundsSummary: (seasonId, groupIds) =>
    axiosClient.get(`/schedules/seasons/${seasonId}/rounds-summary`, {
      params: groupIds?.length ? { groupIds: groupIds.join(',') } : {},
    }),

  generateSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/generate`, body),

  generateFromGroups: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/generate-from-groups`, body),

  autoSchedule: (seasonId, body) =>
    axiosClient.post(`/schedules/seasons/${seasonId}/schedule`, body),

  rescheduleMatch: (matchId, body) =>
    axiosClient.patch(`/schedules/matches/${matchId}/reschedule`, body),

  getKnockoutBracket: (phaseId) =>
    axiosClient.get(`/phases/${phaseId}/knockout/bracket`),

  // ── Match lifecycle ──────────────────────────────────────────────────────────

  startMatch: (id) =>
    axiosClient.post(`/matches/${id}/start`),

  transitionPeriod: (id, body) =>
    axiosClient.post(`/matches/${id}/period`, body),

  recordEvent: (id, body) =>
    axiosClient.post(`/matches/${id}/events`, body),

  finalizeMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/finalize`, body),

  confirmOfficial: (id, body) =>
    axiosClient.post(`/matches/${id}/confirm-official`, body),

  forfeitMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/forfeit`, body),

  abandonMatch: (id, body) =>
    axiosClient.post(`/matches/${id}/abandon`, body),

  submitManualScore: (id, body) =>
    axiosClient.post(`/matches/${id}/manual-score`, body),

  adminRecordResult: (id, body) =>
    axiosClient.post(`/matches/${id}/admin-result`, body),

  // ── Match result / correction ────────────────────────────────────────────────

  getMatchById: (id) =>
    axiosClient.get(`/matches/${id}/result`),

  getMatchResult: (id) =>
    axiosClient.get(`/matches/${id}/result`),

  getMatchEvents: (id, params = {}) =>
    axiosClient.get(`/matches/${id}/events`, { params }),

  getMatchReport: (matchId) =>
    axiosClient.get(`/matches/${matchId}/report`, { responseType: 'blob' }),

  getMatchReportData: (matchId) =>
    axiosClient.get(`/matches/${matchId}/report/data`),

  editScore: (id, body) =>
    axiosClient.patch(`/matches/${id}/score`, body),

  // ── Advanced Match Controls (Appeals, Protests, Corrections) ─────────────

  appeal: (id, body) =>
    axiosClient.post(`/matches/${id}/appeal`, body),

  protest: (id, body) =>
    axiosClient.post(`/matches/${id}/protest`, body),

  resolveAppeal: (id, body) =>
    axiosClient.post(`/matches/${id}/resolve-appeal`, body),

  addCorrectionEvent: (id, body) =>
    axiosClient.post(`/matches/${id}/correction/events`, body),

  editCorrectionEvent: (id, eventId, body) =>
    axiosClient.patch(`/matches/${id}/correction/events/${eventId}`, body),

  deleteCorrectionEvent: (id, eventId) =>
    axiosClient.delete(`/matches/${id}/correction/events/${eventId}`),

  // ── TODO ─────────────────────────────────────────────────────────────────────

  // voidResult — CHƯA IMPLEMENT.

  // ── Deprecated ───────────────────────────────────────────────────────────────

  getMatches: () => {
    console.warn('[matchApi] getMatches() deprecated. Dùng getScheduleBySeason(seasonId).');
    return Promise.reject(new Error('API /matches không tồn tại.'));
  },

  create: () =>
    Promise.reject(new Error('POST /matches không tồn tại. Dùng generateSchedule() hoặc autoSchedule().')),

  update: () =>
    Promise.reject(new Error('PATCH /matches/{id} không tồn tại. Dùng rescheduleMatch().')),

  delete: () =>
    Promise.reject(new Error('DELETE /matches/{id} không tồn tại trên backend.')),
};