import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matchLineupApi } from '../api';

export const lineupKeys = {
    detail: (matchId, teamId) => ['lineup', matchId, teamId],
};

export function useLineupQuery(matchId, teamId) {
    return useQuery({
        queryKey: lineupKeys.detail(matchId, teamId),
        queryFn: async () => {
            const res = await matchLineupApi.getLineup(matchId, teamId);
            const data = typeof res?.status === 'boolean' ? res.data : res;
            return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        },
        enabled: !!matchId && !!teamId,
        staleTime: 30_000, // chấp nhận stale 30s khi mở/đóng modal liên tục trong session — 
        // rủi ro: 2 admin sửa đồng thời trong cửa sổ này sẽ overwrite lẫn nhau (last-write-wins, giống BE)
    });
}

export function useRegisterLineupMutation(matchId, teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => matchLineupApi.updateLineup(matchId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: lineupKeys.detail(matchId, teamId) });
            qc.invalidateQueries({ queryKey: ['lineup', matchId] }); // view tổng 2 team nếu có cache riêng
        },
    });
}