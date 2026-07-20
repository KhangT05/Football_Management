// src/hooks/useMatchDetailQueries.ts
import { useQuery, useQueries, skipToken } from '@tanstack/react-query';
import { z } from 'zod';
import { matchApi, matchLineupApi, teamApi, jerseyApi } from '../api';
import useAuthStore from '../store/authStore';

const unwrap = (res) => res?.data?.data ?? res?.data ?? res;

// GET /matches/{id} — endpoint match-info thuần, xác nhận hoạt động qua
// network log (request "1" -> 200/304). Field list là best-effort dựa trên
// những gì component đang dùng; confirm response thật để siết chặt hơn.
const matchInfoSchema = z.object({
    id: z.number(),
    home_team_id: z.number(),
    away_team_id: z.number(),
    status: z.string(),
    scheduled_at: z.string().nullable(),
    venue: z.object({ name: z.string() }).nullable().optional(),
    home_team: z.any().nullable().optional(),
    away_team: z.any().nullable().optional(),
    home_season_team_id: z.number().nullable().optional(),
    away_season_team_id: z.number().nullable().optional(),
});

const matchResultSchema = z.object({
    match_id: z.number(),
    home_final_score: z.number().nullable(),
    away_final_score: z.number().nullable(),
    home_extra_time_score: z.number().nullable().optional(),
    away_extra_time_score: z.number().nullable().optional(),
    home_penalty_score: z.number().nullable().optional(),
    away_penalty_score: z.number().nullable().optional(),
    winner_team_id: z.number().nullable().optional(),
    result_type: z.string().nullable().optional(),
    status: z.string().optional(),
});

const matchEventSchema = z.object({
    id: z.number(),
    team_id: z.number(),
    type: z.string(),
    minute: z.number().nullable(),
    added_minute: z.number().nullable().optional(),
    player_id: z.number().nullable().optional(),
});

const lineupEntrySchema = z.object({
    id: z.number(),
    team_id: z.number(),
    player_id: z.number(),
    lineup_type: z.enum(['starter', 'substitute']),
    position: z.string().nullable(),
    jersey_number: z.number().nullable(),
    is_captain: z.boolean().optional(),
});

async function fetchRosterNames(teamId) {
    if (!teamId) return [];
    const res = await teamApi.getPlayers(teamId, { approval_status: 'approved', per_page: 100 });
    const payload = unwrap(res);
    const list = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    return list
        .map(tp => ({ player_id: tp.player_id, name: tp.player?.user?.name ?? tp.player?.name ?? null }))
        .filter(p => p.name);
}

function pickJersey(res) {
    const p = unwrap(res);
    const list = Array.isArray(p) ? p : [];
    return list.find(j => j.type === 'home') ?? list.find(j => j.type === 'away') ?? list[0] ?? null;
}

export function useMatchDetail(matchId) {
    const matchQuery = useQuery({
        queryKey: ['match', matchId, 'info'],
        queryFn: async () => {
            const res = await matchApi.getMatchById(matchId);
            return matchInfoSchema.parse(unwrap(res));
        },
        enabled: !!matchId,
        staleTime: 30_000,
    });

    const match = matchQuery.data;
    const isFatalError = matchQuery.isError;

    // /result là nguồn RIÊNG, độc lập với match info — lỗi ở đây (403/404/
    // bất kỳ status nào) KHÔNG được throw lên React Query như fatal error.
    // fallback null + không retry: server trả 403 ổn định qua nhiều lần gọi
    // (xem network log), retry chỉ tốn request vô ích.
    const resultQuery = useQuery({
        queryKey: ['match', matchId, 'result'],
        queryFn: async () => {
            try {
                const res = await matchApi.getMatchResult(matchId);
                return matchResultSchema.parse(unwrap(res));
            } catch (err) {
                console.warn(
                    `[useMatchDetail] /result lỗi cho match ${matchId}:`,
                    err?.response?.status, err?.response?.data?.message
                );
                return null;
            }
        },
        enabled: !!matchId,
        retry: false,
        staleTime: 15_000,
    });

    const eventsQuery = useQuery({
        queryKey: ['match', matchId, 'events'],
        queryFn: async () => {
            const res = await matchApi.getMatchEvents(matchId, { per_page: 100, sort: 'minute', direction: 'asc' });
            const list = unwrap(res)?.data ?? unwrap(res) ?? [];
            return list.map(e => matchEventSchema.parse(e));
        },
        enabled: !!matchId,
        staleTime: 15_000,
    });

    const lineupsQuery = useQuery({
        queryKey: ['match', matchId, 'lineups'],
        queryFn: async () => {
            const res = await matchLineupApi.getMatchLineups(matchId);
            const list = Array.isArray(unwrap(res)) ? unwrap(res) : [];
            return list.map(l => lineupEntrySchema.parse(l));
        },
        enabled: !!matchId,
        staleTime: 15_000,
    });

    const rosterQueries = useQueries({
        queries: [match?.home_team_id, match?.away_team_id].map(teamId => ({
            queryKey: ['team', teamId, 'roster-approved'],
            queryFn: teamId ? () => fetchRosterNames(teamId) : skipToken,
            enabled: !!teamId,
            staleTime: 60_000,
        })),
    });

    const homeSeasonTeamId = match?.home_season_team_id ?? match?.home_team?.season_team_id ?? null;
    const awaySeasonTeamId = match?.away_season_team_id ?? match?.away_team?.season_team_id ?? null;

    const jerseyQueries = useQueries({
        queries: [homeSeasonTeamId, awaySeasonTeamId].map(id => ({
            queryKey: ['jersey', 'season-team', id],
            queryFn: id ? () => jerseyApi.getBySeasonTeam(id).then(pickJersey) : skipToken,
            enabled: !!id,
            staleTime: 60_000,
        })),
    });

    const playerNames = {};
    rosterQueries.forEach(q => (q.data ?? []).forEach(p => { playerNames[p.player_id] = p.name; }));

    return {
        match,
        matchStatus: matchQuery.status,
        matchError: matchQuery.error,
        isFatalError,
        isLoading: matchQuery.isPending,
        matchResult: resultQuery.data ?? null,
        events: eventsQuery.data ?? [],
        lineups: lineupsQuery.data ?? [],
        playerNames,
        jerseys: { home: jerseyQueries[0]?.data ?? null, away: jerseyQueries[1]?.data ?? null },
    };
}

export function useIsMatchLeader(match) {
    const user = useAuthStore(s => s.user);
    const isAuthenticated = useAuthStore(s => s.isAuthenticated);

    const q = useQuery({
        queryKey: ['teams', 'my-leadership', match?.home_team_id, match?.away_team_id, user?.id],
        queryFn: async () => {
            const res = await teamApi.getTeams({ per_page: 50 });
            const teams = unwrap(res)?.data ?? [];
            return teams.some(t =>
                (t.id === match.home_team_id || t.id === match.away_team_id) && t.user_id === user.id
            );
        },
        enabled: isAuthenticated && !!match && !!user,
        staleTime: 60_000,
    });
    return q.data ?? false;
}