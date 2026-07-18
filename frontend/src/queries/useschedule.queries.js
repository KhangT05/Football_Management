import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupApi, matchApi } from '../api';

export const scheduleKeys = {
    groups: (seasonId) => ['schedule', 'groups', seasonId],
    matches: (seasonId) => ['schedule', 'season-matches', seasonId],
    roundsSummary: (seasonId, groupIds) => [
        'schedule', 'rounds', seasonId, [...(groupIds ?? [])].sort((a, b) => a - b),
    ],
    unscheduledMatches: (seasonId, groupId, round) => [
        'schedule', 'unscheduled-matches', seasonId, groupId, round,
    ],
    availableSlots: (seasonId, matchId, window) => [
        'schedule', 'available-slots', seasonId, matchId, window,
    ],
};

// ─── NEW: danh sách trận đấu của season — nguồn cho ScheduleTab ───────────
export function useSeasonMatches(seasonId) {
    return useQuery({
        queryKey: scheduleKeys.matches(seasonId),
        queryFn: async () => {
            const res = await matchApi.getScheduleBySeason(seasonId, { per_page: 300 });
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(payload?.data) ? payload.data : [];
        },
        enabled: !!seasonId,
        staleTime: 15_000,
    });
}

export function useSeasonGroups(seasonId) {
    return useQuery({
        queryKey: scheduleKeys.groups(seasonId),
        queryFn: async () => {
            const res = await groupApi.listBySeason(seasonId);
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(payload?.groups) ? payload.groups : [];
        },
        enabled: !!seasonId,
        staleTime: 30_000,
    });
}

// FIX: tên method đúng + unwrap axios response
export function useRoundsSummary(seasonId, groupIds) {
    return useQuery({
        queryKey: scheduleKeys.roundsSummary(seasonId, groupIds),
        queryFn: async () => {
            const res = await matchApi.getGroupStageRoundsSummary(seasonId, groupIds);
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(payload) ? payload : [];
        },
        enabled: !!seasonId && (groupIds?.length ?? 0) > 0,
        staleTime: 10_000,
    });
}

// FIX: method này chưa tồn tại trong matchApi — cần thêm ở api/match.api.js:
//   getUnscheduledMatches: (seasonId, groupId, round) =>
//     axiosClient.get(`/schedules/seasons/${seasonId}/groups/${groupId}/rounds/${round}/unscheduled-matches`),
export function useUnscheduledMatches(seasonId, groupId, round) {
    return useQuery({
        queryKey: scheduleKeys.unscheduledMatches(seasonId, groupId, round),
        queryFn: async () => {
            const res = await matchApi.getUnscheduledMatches(seasonId, groupId, round);
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(payload) ? payload : [];
        },
        enabled: !!seasonId && !!groupId && !!round,
    });
}

// FIX: method này cũng chưa tồn tại — cần thêm ở api/match.api.js:
//   getAvailableSlots: (seasonId, matchId, body) =>
//     axiosClient.post(`/schedules/seasons/${seasonId}/matches/${matchId}/available-slots`, body),
export function useAvailableSlots(seasonId, matchId, scheduleWindow) {
    return useQuery({
        queryKey: scheduleKeys.availableSlots(seasonId, matchId, scheduleWindow),
        queryFn: async () => {
            const res = await matchApi.getAvailableSlots(seasonId, matchId, scheduleWindow);
            const payload = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(payload) ? payload : [];
        },
        enabled: !!seasonId && !!matchId && !!scheduleWindow?.venueIds?.length,
        staleTime: 5_000,
    });
}

export function useGenerateFromGroups(seasonId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => matchApi.generateFromGroups(seasonId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['schedule', 'rounds', seasonId] });
            qc.invalidateQueries({ queryKey: ['schedule', 'unscheduled-matches', seasonId] });
            qc.invalidateQueries({ queryKey: scheduleKeys.matches(seasonId) });
            qc.invalidateQueries({ queryKey: ['schedule', 'defaults', seasonId] });
        },
    });
}

// FIX: sai tên method — generate() không tồn tại, đúng là generateSchedule()
export function useGenerateNewGroups(seasonId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => matchApi.generateSchedule(seasonId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: scheduleKeys.groups(seasonId) });
            qc.invalidateQueries({ queryKey: scheduleKeys.matches(seasonId) });
            qc.invalidateQueries({ queryKey: ['schedule', 'defaults', seasonId] });
        },
    });
}

// FIX: sai tên method — reschedule() không tồn tại, đúng là rescheduleMatch()
export function useRescheduleMatch(seasonId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, payload }) => matchApi.rescheduleMatch(matchId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['schedule', 'rounds', seasonId] });
            qc.invalidateQueries({ queryKey: ['schedule', 'unscheduled-matches', seasonId] });
            qc.invalidateQueries({ queryKey: scheduleKeys.matches(seasonId) });
        },
    });
}

export function useManualAssignMatch(seasonId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ matchId, venueId, scheduledAt }) =>
            matchApi.rescheduleMatch(matchId, { venueId, scheduledAt: new Date(scheduledAt) }),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({ queryKey: ['schedule', 'unscheduled-matches', seasonId] });
            qc.invalidateQueries({ queryKey: ['schedule', 'rounds', seasonId] });
            qc.invalidateQueries({ queryKey: ['schedule', 'available-slots', seasonId, variables.matchId] });
            qc.invalidateQueries({ queryKey: scheduleKeys.matches(seasonId) });
        },
    });
}

export function useScheduleDefaults(seasonId) {
    return useQuery({
        queryKey: ['schedule', 'defaults', seasonId],
        queryFn: () => matchApi.getScheduleDefaults(seasonId),
        enabled: !!seasonId,
        staleTime: 60_000,
    });
}

export function useSaveScheduleDefaults(seasonId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => matchApi.saveScheduleDefaults(seasonId, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['schedule', 'defaults', seasonId] }),
    });
}