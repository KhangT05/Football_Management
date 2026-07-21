import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    teamApi, playerApi, matchApi, seasonTeamApi, jerseyApi, userApi, statisticsApi,
} from '../api';
import { parseList, unwrap, normalizePlayer } from '../utils/teamHelpers';
import { myTeamKeys } from './keys';

// ── Danh sách đội của user (TeamSwitcher) ──────────────────────────────────
// FIX (pagination bug): trước đây gọi teamApi.getTeams({ per_page: 50, ... })
// và dừng lại — nếu user có > 50 team (hoặc filter user_id không loại bớt đủ
// để dưới 50), các team ở trang 2 trở đi KHÔNG BAO GIỜ được fetch về. Bug lộ
// ra rõ nhất khi total > per_page (thấy trong meta.has_next = true) nhưng FE
// coi mảng nhận được là "toàn bộ" — TeamSwitcher search client-side trên
// mảng thiếu này nên tìm không ra team nằm ở trang sau.
//
// Sửa bằng cách loop hết các trang (meta.has_next) thay vì tin per_page=50
// là đủ. Không hardcode per_page lớn hơn vì maxPerPage phía server có thể
// đổi bất cứ lúc nào (hiện tại là 100, xem TeamService) — loop là cách bền
// vững nhất, không phụ thuộc giả định về maxPerPage.
export function useMyTeams(userId) {
    return useQuery({
        queryKey: myTeamKeys.list(userId),
        queryFn: async () => {
            let page = 1;
            let all = [];
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const res = await teamApi.getTeams({
                    per_page: 100,
                    page,
                    user_id: userId,
                    sort: 'id',
                    direction: 'desc',
                });
                const list = parseList(res);
                all = all.concat(list);

                const meta = res?.data?.meta ?? res?.meta ?? null;
                if (!meta?.has_next) break;
                page += 1;
            }

            return all.map((t) => ({
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
// FIX (wrong team lookup bug): trước đây gọi teamApi.getTeams({ per_page: 50 })
// rồi .find(t => t.id === teamId) — 2 vấn đề chồng nhau:
//   1) Không filter theo user_id -> quét TOÀN BỘ team trong hệ thống (82 team).
//   2) Chỉ lấy 50 record đầu (trang 1) -> team nào có id rơi ngoài 50 record
//      đầu (do sort mặc định theo id asc ở TeamService) sẽ KHÔNG được tìm
//      thấy -> myTeam = undefined -> throw "Không tìm thấy đội bóng." ngay
//      cả khi team đó tồn tại và user đang sở hữu.
// Kết quả quan sát được: activeTeam = null, activeSeasonTeamId = undefined,
// useTeamPlayers bị enabled:false -> UI hiện toàn bộ field rỗng + roster 0
// dù DB có đủ dữ liệu.
//
// Sửa: gọi thẳng GET /teams/{id} qua teamApi.getTeamById — không giới hạn
// bởi trang/số lượng team trong hệ thống.
//
// FIX (season_team auto-pick bug): trước đây tự chọn 1 season_team bằng
// heuristic dựa theo STATUS CỦA SEASON (registration_open/ongoing/upcoming),
// không quan tâm status của chính season_team đó. Hệ quả: nếu team vừa
// tự đăng ký (status='pending', chưa có roster) vào 1 mùa giải MỚI đang mở
// đăng ký, season_team pending này bị chọn TRƯỚC season_team cũ đã
// approved/active (có roster thật, vd 23 cầu thủ) — vì season của nó thoả
// điều kiện .find() trước. UI hiển thị "chưa có cầu thủ" dù team thực sự có
// roster đầy đủ ở 1 season khác.
//
// Sửa triệt để: KHÔNG tự đoán season_team nào là "đúng" nữa. Trả nguyên
// danh sách `seasonTeams` về cho component, để component tự chọn mặc định
// hợp lý (ưu tiên approved/active) NHƯNG cho phép người dùng đổi sang xem
// season_team khác một cách tường minh — giống hệt cách TeamSwitcher cho
// đổi giữa các team.
async function fetchTeamDetail(teamId) {
    const teamRes = await teamApi.getTeamById(teamId);
    const myTeam = unwrap(teamRes);
    if (!myTeam) throw new Error('Không tìm thấy đội bóng.');

    const enriched = {
        id: myTeam.id,
        name: myTeam.name,
        emoji: '🛡️',
        status: myTeam.is_active ? 'approved' : 'pending',
        captain: myTeam.coach_name ?? '—',
        phone: myTeam.phone ?? '—',
        primaryColor: myTeam.primary_color ?? '—',
        colorHex: myTeam.color_hex ?? '#334155',
        registeredAt: myTeam.created_at ? new Date(myTeam.created_at).toLocaleDateString('vi-VN') : '—',
        description: myTeam.description,
        logo: myTeam.logo,
    };

    let seasonTeams = [];
    try {
        const stAllRes = await seasonTeamApi.getAll({ team_id: teamId });
        seasonTeams = parseList(stAllRes); // mỗi item: { id, status, season: {...}, group, ... }
    } catch (e) {
        console.warn('Cannot load season info:', e);
    }

    return { team: enriched, seasonTeams };
}

export function useTeamDetail(teamId) {
    return useQuery({
        queryKey: myTeamKeys.detail(teamId),
        queryFn: () => fetchTeamDetail(teamId),
        enabled: !!teamId,
        staleTime: 30_000,
    });
}

export function useTeamPlayers(seasonTeamId) {
    return useQuery({
        queryKey: myTeamKeys.players(seasonTeamId),
        queryFn: async () => {
            const res = await playerApi.listTeamPlayers(seasonTeamId, { per_page: 100 });
            return parseList(res).map(normalizePlayer);
        },
        enabled: !!seasonTeamId,
        staleTime: 15_000,
    });
}

export function useTeamHistoryPlayers(teamId, seasonTeams) {
    return useQuery({
        queryKey: myTeamKeys.historyPlayers(teamId),
        queryFn: async () => {
            if (!teamId || !seasonTeams || seasonTeams.length === 0) return [];
            const res = await teamApi.getHistoryPlayers(teamId);
            const resData = res.data || res;
            const allPlayers = Array.isArray(resData) ? resData : (resData.players || []);

            // Deduplicate by player_id, keeping the latest info (or merging)
            const uniquePlayersMap = new Map();
            for (const p of allPlayers) {
                if (p.player_id) {
                    if (!uniquePlayersMap.has(p.player_id)) {
                        uniquePlayersMap.set(p.player_id, { ...p, playedSeasons: [p.season_id] });
                    } else {
                        const existing = uniquePlayersMap.get(p.player_id);
                        if (p.season_id && !existing.playedSeasons.includes(p.season_id)) {
                            existing.playedSeasons.push(p.season_id);
                        }
                    }
                }
            }
            return Array.from(uniquePlayersMap.values());
        },
        enabled: !!teamId && seasonTeams.length > 0,
        staleTime: 60_000,
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
export function usePlayersPerformance(players, seasonId) {
    return useQuery({
        queryKey: myTeamKeys.playerPerfBatch(players.map(p => p.player_id).join(','), seasonId),
        queryFn: async () => {
            if (!players || players.length === 0) return [];

            if (seasonId === 'all') {
                // Fetch individually using getPlayerOverview for all time
                const promises = players.map(async (p) => {
                    if (!p.player_id) return null;
                    try {
                        const res = await statisticsApi.getPlayerOverview(p.player_id);
                        const data = unwrap(res) || {};
                        return {
                            player_id: p.player_id,
                            player_name: p.name,
                            player_number: p.number || p.jersey_number || 0,
                            position: p.position,
                            avatar: p.avatar,
                            total_matches_played: data.total_matches_played || 0,
                            total_starter_count: 0, // not available in overview
                            total_substitute_count: 0,
                            total_captain_count: 0,
                            total_goals: data.total_goals || 0,
                            total_assists: data.total_assists || 0,
                            total_yellow_cards: data.total_yellow_cards || 0,
                            total_red_cards: data.total_red_cards || 0,
                        };
                    } catch (err) {
                        console.warn(`No stats for player ${p.player_id}`, err);
                        return null;
                    }
                });
                const results = await Promise.all(promises);
                return results.filter(Boolean);
            } else {
                // Fetch batch for the season
                try {
                    const res = await statisticsApi.getPlayersPerformanceStatsBatch(seasonId);
                    const batchData = unwrap(res) || { players: [] };
                    const batchPlayers = batchData.players || [];

                    const statsMap = new Map();
                    for (const bp of batchPlayers) {
                        statsMap.set(bp.player_id, bp);
                    }

                    return players.filter(p => !!p.player_id).map((p) => {
                        const data = statsMap.get(p.player_id) || {};
                        return {
                            player_id: p.player_id,
                            player_name: p.name,
                            player_number: p.number || p.jersey_number || 0,
                            position: p.position,
                            avatar: p.avatar,
                            total_matches_played: data.total_matches_played || 0,
                            total_starter_count: data.total_starter_count || 0,
                            total_substitute_count: data.total_substitute_count || 0,
                            total_captain_count: data.total_captain_count || 0,
                            total_goals: data.total_goals || 0,
                            total_assists: data.total_assists || 0,
                            total_yellow_cards: data.total_yellow_cards || 0,
                            total_red_cards: data.total_red_cards || 0,
                        };
                    });
                } catch (err) {
                    console.error("Error fetching batch stats", err);
                    return players.filter(p => !!p.player_id).map((p) => ({
                        player_id: p.player_id,
                        player_name: p.name,
                        player_number: p.number || p.jersey_number || 0,
                        position: p.position,
                        avatar: p.avatar,
                        total_matches_played: 0,
                        total_starter_count: 0,
                        total_substitute_count: 0,
                        total_captain_count: 0,
                        total_goals: 0,
                        total_assists: 0,
                        total_yellow_cards: 0,
                        total_red_cards: 0,
                    }));
                }
            }
        },
        enabled: players && players.length > 0,
    });
}

export function useRegisterSeasonMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (seasonId) => seasonTeamApi.register({ season_id: seasonId, team_id: teamId }),
        // FIX: chặn double-fire ở tầng mutation — nếu đang có mutation
        // pending cho cùng teamId, không cho gọi lại. React Query tự expose
        // `isPending`, MyTeam.jsx cần đọc registerSeason.isPending thay vì
        // chỉ dựa vào registeringSeasonId local state (dễ miss 1 tick khi
        // user double-click nhanh hơn 1 render cycle).
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.eligibility(teamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.detail(teamId) });
        },
    });
}

export function useUpdatePlayerPositionMutation(seasonTeamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ playerId, position }) =>
            playerApi.updateTeamPlayer(seasonTeamId, Number(playerId), { position }),
        onMutate: async ({ playerId, position }) => {
            await qc.cancelQueries({ queryKey: myTeamKeys.players(seasonTeamId) });
            const prev = qc.getQueryData(myTeamKeys.players(seasonTeamId));
            qc.setQueryData(myTeamKeys.players(seasonTeamId), (old) =>
                old?.map((p) => (p.id === Number(playerId) ? { ...p, position } : p))
            );
            return { prev };
        },
        onError: (_e, _v, ctx) => {
            if (ctx?.prev) qc.setQueryData(myTeamKeys.players(seasonTeamId), ctx.prev);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) }),
    });
}

export function useAddPlayerMutation(seasonTeamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (values) =>
            playerApi.createForTeam(seasonTeamId, {
                name: values.name.trim(),
                user_email: values.email.trim(),
                student_code: values.student_code?.trim() || undefined,
                date_of_birth: values.date_of_birth || undefined,
                position: values.position,
                jersey_number: parseInt(values.number, 10),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.detail(seasonTeamId) });
        },
    });
}

export function useEditPlayerMutation(seasonTeamId) {
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
            return playerApi.updateTeamPlayer(seasonTeamId, editingPlayer.id, {
                jersey_number: parseInt(values.number, 10),
                position: values.position,
                role: values.role,
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) }),
    });
}

export function useTransferPlayerMutation(seasonTeamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (playersToTransfer) => {
            const promises = playersToTransfer.map(p =>
                playerApi.addToTeam(seasonTeamId, {
                    player_id: p.player_id,
                    jersey_number: parseInt(p.number, 10),
                    position: p.position,
                    role: p.role || 'player',
                })
            );
            return Promise.all(promises);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.detail(seasonTeamId) });
        },
    });
}

export function useDeletePlayerMutation(seasonTeamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (playerId) => playerApi.bulkRemoveFromTeam(seasonTeamId, { ids: [playerId] }),
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) }),
    });
}

export function useImportExcelMutation(seasonTeamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return playerApi.importTeamPlayers(seasonTeamId, formData);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) }),
    });
}

// NEW — Copy roster từ 1 season_team NGUỒN (mùa cũ, đã có cầu thủ đã duyệt)
// sang season_team ĐÍCH (mùa hiện đang xem, roster rỗng) — tránh phải
// add/import lại từ đầu mỗi khi đăng ký mùa mới. `seasonTeamId` truyền vào
// đây LUÔN LÀ season_team ĐÍCH; `fromSeasonTeamId` truyền lúc gọi mutate
// là season_team NGUỒN. Invalidate players + historyPlayers của ĐÍCH sau
// khi copy xong để roster/tab thống kê phản ánh ngay cầu thủ mới copy vào.
export function useCopyRosterMutation(seasonTeamId, teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (fromSeasonTeamId) =>
            playerApi.copyRosterFromSeason(seasonTeamId, fromSeasonTeamId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: myTeamKeys.players(seasonTeamId) });
            qc.invalidateQueries({ queryKey: myTeamKeys.historyPlayers(teamId) });
        },
    });
}

export function useUpdateTeamMutation(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ values, activeSeasonTeamId }) => {
            const payload = {
                name: values.name,
                coach_name: values.coach_name || null,
                description: values.description || null,
            };
            await teamApi.update(teamId, payload);
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