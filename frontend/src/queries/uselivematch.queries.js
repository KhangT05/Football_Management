import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamApi, matchApi, matchLineupApi } from '../api';

// ASSUMPTION: playerStatisticApi chưa thấy trong api/ hiện có — cần bổ sung
// endpoint trả về PlayerStatistic.accumulated_yellow_cards theo season +
// list playerId, dùng cho cảnh báo treo thẻ (xem computeSuspensionWarnings).
// Nếu chưa có, hook dưới fail-soft (trả Map rỗng), KHÔNG chặn luồng chính.
let playerStatisticApi;
try {
    // eslint-disable-next-line global-require
    playerStatisticApi = require('../api').playerStatisticApi;
} catch {
    playerStatisticApi = null;
}

function unwrapListResponse(res, label) {
    const candidates = [res?.data?.data, res?.data, res];
    for (const c of candidates) {
        if (Array.isArray(c)) return c;
    }
    console.warn(`[useLiveMatchQueries] Không parse được response cho ${label}. Shape thực tế:`, res);
    return [];
}

export function useTeamPlayers(teamId) {
    return useQuery({
        queryKey: ['team-players', teamId],
        queryFn: async () => {
            const res = await teamApi.getPlayers(teamId, { per_page: 50 });
            return unwrapListResponse(res, `teamPlayers(${teamId})`);
        },
        enabled: !!teamId,
        staleTime: 60_000,
    });
}

export function useMatchLineups(matchId, homeTeamId, awayTeamId) {
    return useQuery({
        queryKey: ['match-lineups', matchId],
        queryFn: async () => {
            const res = await matchLineupApi.getMatchLineups(matchId);
            const all = unwrapListResponse(res, `lineups(${matchId})`);
            return {
                home: all.filter(l => Number(l.team_id) === Number(homeTeamId)),
                away: all.filter(l => Number(l.team_id) === Number(awayTeamId)),
            };
        },
        enabled: !!matchId && !!homeTeamId && !!awayTeamId,
        staleTime: 30_000,
    });
}

/**
 * accumulated_yellow_cards TRƯỚC trận hiện tại, theo playerId — dùng cho
 * cảnh báo treo thi đấu trận sau (TournamentRule.yellow_cards_suspension).
 * Fail-soft: nếu API chưa tồn tại hoặc lỗi, trả Map rỗng — không chặn form.
 */
export function usePlayerSuspensionStats(seasonId, playerIds) {
    return useQuery({
        queryKey: ['player-suspension-stats', seasonId, playerIds],
        queryFn: async () => {
            if (!playerStatisticApi?.getByPlayers) return new Map();
            try {
                const res = await playerStatisticApi.getByPlayers(seasonId, playerIds);
                const list = unwrapListResponse(res, 'playerSuspensionStats');
                return new Map(list.map(s => [String(s.player_id), s.accumulated_yellow_cards ?? 0]));
            } catch (err) {
                console.warn('[usePlayerSuspensionStats] fetch thất bại, bỏ qua cảnh báo:', err);
                return new Map();
            }
        },
        enabled: !!seasonId && playerIds.length > 0,
        staleTime: 60_000,
    });
}

export function useStartMatch(matchId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => matchApi.startMatch(matchId),
        onSuccess: () => qc.invalidateQueries({ queryKey: ['match-lineups', matchId] }),
    });
}

export function useTransitionPeriod(matchId) {
    return useMutation({
        // FIX: matchApi.transitionPeriod(id, body) forward `body` thẳng vào
        // axios POST — trước đây truyền `period` (string trần, vd
        // "second_half") làm body, nên request lên BE có JSON body là string
        // thay vì object, khiến `req.body.period` ở tầng validate luôn
        // undefined -> BE trả lỗi "Validation failed" chung chung (KHÔNG
        // phải lỗi nghiệp vụ CONFLICT như "không ongoing" mà service thực
        // sự throw). Phải bọc thành { period } để khớp DTO/schema của route
        // POST /matches/:id/period.
        mutationFn: (period) => matchApi.transitionPeriod(matchId, { period }),
    });
}

export function useRecordEvent(matchId) {
    return useMutation({
        mutationFn: (payload) => matchApi.recordEvent(matchId, payload),
    });
}

export function useAdminRecordResult(matchId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload) => matchApi.adminRecordResult(matchId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['match-lineups', matchId] });
        },
    });
}