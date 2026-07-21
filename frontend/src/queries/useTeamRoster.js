import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api';

export function useTeamRoster(seasonTeamId) {
    return useQuery({
        queryKey: ['team-roster', seasonTeamId],
        queryFn: async () => {
            // GET /players/{teamId}/team-players trả PaginatedResult<TeamPlayerDto>
            // ({ data, total, page, per_page }) — không phải mảng thô.
            const res = await teamApi.getPlayers(seasonTeamId, {
                approval_status: 'approved',
                per_page: 100, // roster tối đa 20 cầu thủ/team theo rule hiện tại, 100 đủ margin
            });
            const body = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
        },
        enabled: !!seasonTeamId,
        staleTime: 5 * 60 * 1000,
    });
}