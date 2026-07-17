// queries/useTeamQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi } from '../api/teamApi';
import { matchApi } from '../api/matchApi';
import { teamKeys } from './keys';

const unwrap = (res) => (typeof res?.status === 'boolean' ? res.data : res);
const parsePage = (res) => {
    const p = unwrap(res);
    return Array.isArray(p?.data) ? p.data : Array.isArray(p) ? p : [];
};

// ── Danh sách đội (ManageTeams, LeaderboardTeams, dropdown ManageMatches) ──
export function useTeams(params = {}) {
    return useQuery({
        queryKey: teamKeys.list(params),
        queryFn: async () => {
            const res = await teamApi.getTeams({ per_page: 100, ...params });
            const payload = unwrap(res);
            const items = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
            return { items, meta: payload?.meta ?? {} };
        },
        staleTime: 60_000, // thay CACHE_TTL_MS cũ
    });
}

// ── Fallback public teams theo season (Guest, không có JWT) ──
export function usePublicTeamsBySeason(seasonId, { enabled = true } = {}) {
    return useQuery({
        queryKey: ['public-teams', 'season', seasonId],
        queryFn: async () => {
            const { seasonApi } = await import('../api/seasonApi');
            const { groupApi } = await import('../api/groupApi');

            const stRes = await seasonApi.getStandings(seasonId);
            const groupsData = Array.isArray(unwrap(stRes)) ? unwrap(stRes) : [];

            const teamMap = new Map();
            await Promise.all(groupsData.map(async (g) => {
                if (!g.groupId) return;
                const detail = await groupApi.getByIdWithTeams(g.groupId).catch(() => null);
                const payload = unwrap(detail);
                payload?.seasonTeams?.forEach(st => {
                    if (st.team && !teamMap.has(st.team.id)) teamMap.set(st.team.id, st.team);
                });
            }));

            return Array.from(teamMap.values());
        },
        enabled: enabled && !!seasonId,
        staleTime: 60_000,
    });
}

// ── Chi tiết 1 đội (team + players + matches) — thay fetchTeamDetail ──
export function useTeamDetail(teamId) {
    return useQuery({
        queryKey: teamKeys.detail(teamId),
        queryFn: async () => {
            const [teamRes, playersRes, matchesRes] = await Promise.all([
                teamApi.getTeamById(teamId),
                teamApi.getPlayers(teamId, { per_page: 50 }).catch(() => null),
                matchApi.getTeamSchedule(null, teamId, { per_page: 20 }).catch(() => null),
            ]);
            return {
                team: unwrap(teamRes),
                players: playersRes ? parsePage(playersRes) : [],
                matches: matchesRes ? parsePage(matchesRes) : [],
            };
        },
        enabled: !!teamId,
        staleTime: 60_000,
    });
}

// ── Players riêng của 1 đội (ManageTeams table) ──
export function useTeamPlayers(teamId, params = {}) {
    return useQuery({
        queryKey: teamKeys.players(teamId, params),
        queryFn: async () => {
            const res = await teamApi.listTeamPlayers?.(teamId, { per_page: 50, ...params })
                ?? (await import('../api/playerApi')).playerApi.listTeamPlayers(teamId, { per_page: 50, ...params });
            return parsePage(res);
        },
        enabled: !!teamId,
        staleTime: 30_000, // thay PLAYERS_CACHE_TTL_MS
    });
}

// ── Mutations ──
export function useCreateTeam() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => teamApi.registerTeam(data),
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.all }),
    });
}

export function useUpdateTeam(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data) => teamApi.update(teamId, data),
        onSuccess: (res) => {
            const payload = unwrap(res);
            qc.setQueryData(teamKeys.detail(teamId), (old) =>
                old ? { ...old, team: { ...old.team, ...payload } } : old
            );
            qc.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}

export function useDeleteTeam() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamId) => teamApi.delete(teamId),
        onSuccess: (_res, teamId) => {
            qc.removeQueries({ queryKey: teamKeys.detail(teamId) });
            qc.invalidateQueries({ queryKey: teamKeys.all });
        },
    });
}