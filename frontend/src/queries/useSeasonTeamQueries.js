// queries/useSeasonTeamQueries.js
import { useQuery } from '@tanstack/react-query';
import { seasonTeamApi } from '../api';

const unwrap = (res) => (typeof res?.status === 'boolean' ? res.data : res);

// ── Đội bóng tham gia 1 mùa giải (LeaderboardTeams) ──
export function useSeasonTeams(seasonId, { enabled = true } = {}) {
    return useQuery({
        queryKey: ['season-teams', seasonId],
        queryFn: async () => {
            const res = await seasonTeamApi.getAll({ season_id: seasonId, per_page: 200 });
            const payload = unwrap(res);
            return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
        },
        enabled: enabled && !!seasonId,
        staleTime: 60_000,
    });
}