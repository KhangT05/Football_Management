import { useQuery } from '@tanstack/react-query';
import { teamApi } from '../api';

export function useTeamRoster(seasonTeamId) {
    return useQuery({
        queryKey: ['team-roster', seasonTeamId],
        queryFn: () => teamApi.getRoster(seasonTeamId),
        enabled: !!seasonTeamId,
        staleTime: 5 * 60 * 1000,
    });
}