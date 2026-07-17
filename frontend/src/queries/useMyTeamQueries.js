import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    teamApi, playerApi, matchApi, seasonTeamApi, jerseyApi, userApi, statisticsApi,
} from '../api';
import { parseList, unwrap, normalizePlayer } from '../utils/teamHelpers';
import { myTeamKeys } from './keys';

// ── Danh sách đội của user (TeamSwitcher) ──────────────────────────────────
export function useMyTeams(userId) {
    return useQuery({
        queryKey: myTeamKeys.list(userId),
        queryFn: async () => {
            const res = await teamApi.getTeams({ per_page: 50 });
            const mine = parseList(res).filter((t) => t.user_id === userId);
            return mine.map((t) => ({
                id: t.id,
                name: t.name,
                logo: t.logo ?? null,
                colorHex: t.color_hex ?? '#334155',
                status: t.is_active ? 'approved' : 'pending',
            }));
        },
        enabled: !!userId,
        staleTime: 30_000,
    });
}

// ── Chi tiết 1 đội (enriched: season/jersey/fee) ───────────────────────────
async function fetchTeamDetail(teamId) {
    const teamsRes = await teamApi.getTeams({ per_page: 50 });
    const myTeam = parseList(teamsRes).find((t) => t.id === teamId);
    if (!myTeam) throw new Error('Không tìm thấy đội bóng.');

    let enriched = {
        id: myTeam.id,
        name: myTeam.name,
        emoji: '🛡️',
        status: myTeam.is_active ? 'approved' : 'pending',
        registrationStatus: null,
        activeSeasonId: null,
        activeSeasonTeamId: null,
        captain: myTeam.coach_name ?? '—',
        phone: myTeam.phone ?? '—',
        primaryColor: myTeam.primary_color ?? '—',
        colorHex: myTeam.color_hex ?? '#334155',
        registeredAt: myTeam.created_at ? new Date(myTeam.created_at).toLocaleDateString('vi-VN') : '—',
        season: '—',
        description: myTeam.description,
        logo: myTeam.logo,
        registrationFee: 0,
        bankInfo: null,
    };

    let allSeasons = [];
    try {
        const stAllRes = await seasonTeamApi.getAll({ team_id: teamId });
        const stAllList = parseList(stAllRes);
        allSeasons = stAllList.map((st) => st.season).filter(Boolean);

        const activeSt =
            stAllList.find((st) => ['registration_open', 'ongoing', 'upcoming'].includes(st.season?.status)) ||
            stAllList[0];
        const active = activeSt?.season ?? null;

        if (active) {
            let homeJersey = null;
            if (activeSt) {
                try {
                    const jRes = await jerseyApi.getBySeasonTeam(activeSt.id);
                    homeJersey = parseList(jRes).find((j) => j.type === 'home');
                } catch (e) {
                    console.warn('Cannot load jersey:', e);
                }
            }
            enriched = {
                ...enriched,
                season: active.name,
                activeSeasonId: active.id,
                activeSeasonTeamId: activeSt?.id ?? null,
                registrationStatus: activeSt?.status ?? null,
                primaryColor: homeJersey?.secondary_color || enriched.primaryColor,
                colorHex: homeJersey?.primary_color || enriched.colorHex,
                registrationFee: active.registration_fee != null ? Number(active.registration_fee) : 0,
                bankInfo: active.bank_id
                    ? { bank_id: active.bank_id, bank_account_no: active.bank_account_no, bank_account_name: active.bank_account_name }
                    : null,
            };
        }
    } catch (e) {
        console.warn('Cannot load season info:', e);
    }

    return { team: enriched, allSeasons };
}

export function useTeamDetail(teamId) {
    return useQuery({
        queryKey: myTeamKeys.detail(teamId),
        queryFn: () => fetchTeamDetail(teamId),
        enabled: !!teamId,
        staleTime: 30_000,
    });
}

// ── Players ─────────────────────────────────────────────────────────────
export function useTeamPlayers(teamId) {
    return useQuery({
        queryKey: myTeamKeys.players(teamId),
        queryFn: async () => {
            const res = await playerApi.listTeamPlayers(teamId, { per_page: 100 });
            return parseList(res).map(normalizePlayer);
        },
        enabled: !!teamId,
        staleTime: 15_000,
    });
}

// ── Matches theo season đang chọn ──────────────────────────────────────
export function useTeamMatches(teamId, seasonId, { enabled = true } = {}) {
    return useQuery({
        queryKey: myTeamKeys.matches(teamId, seasonId),
        queryFn: async () => {
            const res = await matchApi.getTeamSchedule(seasonId, teamId);
            return parseList(res);
        },
        enabled: enabled && !!teamId && !!seasonId,
    });
}

// ── Eligibility đăng ký giải ────────────────────────────────────────────
export function useSeasonEligibility(teamId) {
    return useQuery({
        queryKey: myTeamKeys.eligibility(teamId),
        queryFn: async () => {
            const res = await seasonTeamApi.getRegistrationEligibility(teamId);
            return parseList(res);
        },
        enabled: !!teamId,
        staleTime: 20_000,
    });
}

// ── Stats toàn thời gian (tab Thống kê) ────────────────────────────────
export function useTeamStats(teamId, granularity, { enabled = true } = {}) {
    return useQuery({
        queryKey: myTeamKeys.stats(teamId, granularity),
        queryFn: async () => {
            const [ov, ts, ext, part, fin] = await Promise.allSettled([
                statisticsApi.getTeamOverview(teamId),
                statisticsApi.getTeamMatchTimeSeries(teamId, { granularity }),
                statisticsApi.getTeamOverviewExtended(teamId),
                statisticsApi.getTeamParticipations(teamId),
                statisticsApi.getTeamFinance(teamId),
            ]);
            const val = (r) => (r.status === 'fulfilled' ? unwrap(r.value) : null);
            return {
                overview: val(ov),
                timeSeries: val(ts)?.points ?? [],
                extended: val(ext)?.extended ?? null,
                participations: val(part),
                finance: val(fin),
            };
        },
        enabled: enabled && !!teamId,
    });
}

// ── Phong độ từng cầu thủ (dynamic parallel) ───────────────────────────
export function usePlayersPerformance(players) {
    const results = useQueries({
        queries: players.map((p) => ({
            queryKey: myTeamKeys.playerPerf(p.player_id),
            queryFn: async () => {
                const res = await statisticsApi.getPlayerPerformance(p.player_id);
                const data = unwrap(res);
                return data ? { ...data, player_name: p.name } : null;
            },
            enabled: !!p.player_id,
        })),
    });
    return {
        data: results.map((r) => r.data).filter(Boolean),
        isLoading: results.some((r) => r.isLoading),
    };
}

// ── Mutations ───────────────────────────────────────────────────────────
export function useRegisterSeasonMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (seasonId) => seasonTeamApi.register({ season_id: seasonId, team_id: teamId }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.eligibility(teamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.detail(teamId) });
        },
    });
}

export function useUpdatePlayerPositionMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ playerId, position }) =>
            playerApi.updateTeamPlayer(Number(playerId), teamId, { position }),
        onMutate: async ({ playerId, position }) => {
            await qc.cancelQueries({ queryKey: myTeamKeys.players(teamId) });
            const prev = qc.getQueryData(myTeamKeys.players(teamId));
            qc.setQueryData(myTeamKeys.players(teamId), (old) =>
                old?.map((p) => (p.id === Number(playerId) ? { ...p, position } : p))
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(myTeamKeys.players(teamId), ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(teamId) }),
    });
}

export function useAddPlayerMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (values) =>
            playerApi.createForTeam(teamId, {
                name: values.name.trim(),
                user_email: values.email.trim(),
                student_code: values.student_code?.trim() || undefined,
                date_of_birth: values.date_of_birth || undefined,
                position: values.position,
                jersey_number: parseInt(values.number, 10),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.players(teamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.detail(teamId) });
        },
    });
}

export function useEditPlayerMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ editingPlayer, values }) => {
            if (values.name && editingPlayer.user_id) {
                try {
                    await userApi.updateProfile(editingPlayer.user_id, { name: values.name.trim() });
                } catch (e) {
                    console.error('Failed to update User name', e);
                }
            }
            return playerApi.updateTeamPlayer(teamId, editingPlayer.id, {
                jersey_number: parseInt(values.number, 10),
                position: values.position,
                role: values.role,
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(teamId) }),
    });
}

export function useDeletePlayerMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (playerId) => playerApi.bulkRemoveFromTeam(teamId, { ids: [playerId] }),
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(teamId) }),
    });
}

export function useImportExcelMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return playerApi.importTeamPlayers(teamId, formData);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(teamId) }),
    });
}

export function useUpdateTeamMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ values, activeSeasonTeamId }) => {
            await teamApi.update(teamId, values);
            if (activeSeasonTeamId && values.color_hex) {
                try {
                    await jerseyApi.upsert(activeSeasonTeamId, { type: 'home', primary_color: values.color_hex });
                } catch (e) {
                    console.warn('Could not update jersey color:', e);
                }
            }
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.detail(teamId) }),
    });
}

export function useDeleteTeamMutation(userId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamId) => teamApi.delete(teamId),
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.list(userId) }),
    });
}