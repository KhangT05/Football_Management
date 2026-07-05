import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    teamApi, playerApi, seasonApi, matchApi, seasonTeamApi, jerseyApi,
    userApi, // NOTE: giả định module `userApi` có `findByEmail`. Nếu tên endpoint
    //       thật của bạn khác (vd. authApi.lookupByEmail, adminUserApi.search...),
    //       đổi lại đúng 1 chỗ này trong useAddPlayer bên dưới.
} from '../../../api';
import { parseList, normalizePlayer } from '../utils';

const myTeamKey = (userId) => ['myTeam', userId];

// ── Main read query: team + roster + season + matches ──────────────────────
async function fetchMyTeamData(userId) {
    const teamsRes = await teamApi.getTeams({ per_page: 10 });
    const allTeams = parseList(teamsRes);
    const myTeam = allTeams.find((t) => t.user_id === userId) ?? allTeams[0] ?? null;

    if (!myTeam) return { team: null, players: [], matches: [] };

    let team = {
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
        season: '2026',
        description: myTeam.description,
        logo: myTeam.logo,
    };

    const playersRes = await teamApi.getPlayers(myTeam.id, { per_page: 50 });
    const players = parseList(playersRes).map(normalizePlayer);

    let matches = [];
    try {
        const seasonsRes = await seasonApi.getAll();
        const allSeasons = parseList(seasonsRes);
        const activeSeason =
            allSeasons.find((s) => ['registration_open', 'ongoing', 'upcoming'].includes(s.status)) || allSeasons[0];

        if (activeSeason) {
            const stRes = await seasonTeamApi.getAll({ team_id: myTeam.id, season_id: activeSeason.id });
            const stData = stRes?.data?.data || stRes?.data || [];
            const currentSt = stData[0];

            let homeJersey = null;
            if (currentSt) {
                try {
                    const jRes = await jerseyApi.getBySeasonTeam(currentSt.id);
                    const jerseys = parseList(jRes);
                    homeJersey = jerseys.find((j) => j.type === 'home');
                } catch (err) {
                    console.warn('Không thể lấy thông tin áo đấu:', err);
                }
            }

            team = {
                ...team,
                season: activeSeason.name,
                activeSeasonId: activeSeason.id,
                activeSeasonTeamId: currentSt ? currentSt.id : null,
                registrationStatus: currentSt ? currentSt.status : null,
                primaryColor: homeJersey?.secondary_color || team.primaryColor,
                colorHex: homeJersey?.primary_color || team.colorHex,
            };

            if (currentSt && ['approved', 'active'].includes(currentSt.status)) {
                const scheduleRes = await matchApi.getTeamSchedule(activeSeason.id, myTeam.id);
                matches = parseList(scheduleRes);
            }
        }
    } catch (seasonErr) {
        console.warn('Cannot fetch season or schedule for team:', seasonErr);
    }

    return { team, players, matches };
}

export function useMyTeam(userId) {
    return useQuery({
        queryKey: myTeamKey(userId),
        queryFn: () => fetchMyTeamData(userId),
        enabled: !!userId,
    });
}

// ── Mutations ────────────────────────────────────────────────────────────
function useInvalidateMyTeam(userId) {
    const qc = useQueryClient();
    return () => qc.invalidateQueries({ queryKey: myTeamKey(userId) });
}

export function useAddPlayer(teamId, userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: async ({ user_email, date_of_birth, position, number }) => {
            // 1) Player luôn phải gắn với 1 User có thật -> resolve theo email trước
            const userRes = await userApi.findByEmail(user_email.trim().toLowerCase());
            const foundUser = userRes?.data?.data ?? userRes?.data ?? userRes;
            if (!foundUser?.id) {
                throw new Error(`Không tìm thấy tài khoản với email "${user_email}"`);
            }

            // 2) Tạo hồ sơ Player đúng theo CreatePlayerDto (không gửi "name")
            const createRes = await playerApi.create({
                user_id: foundUser.id,
                date_of_birth,
                position,
            });
            const newPlayer = createRes?.data?.data ?? createRes?.data ?? createRes;

            // 3) Thêm vào đội
            return playerApi.addToTeam(teamId, {
                player_id: newPlayer.id,
                jersey_number: Number(number),
                position,
                role: 'player',
            });
        },
        onSuccess: invalidate,
    });
}

export function useEditPlayer(teamId, userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: async ({ teamPlayerId, number, position }) => {
            // Player.name không tồn tại (tên thuộc về User) nên không gọi playerApi.update ở đây.
            // Chỉ jersey_number/position là dữ liệu thuộc về TeamPlayer trong đội này.
            return playerApi.updateTeamPlayer(teamId, teamPlayerId, {
                jersey_number: parseInt(number, 10),
                position,
            });
        },
        onSuccess: invalidate,
    });
}

export function useDeletePlayer(teamId, userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: (teamPlayerId) => playerApi.bulkRemoveFromTeam(teamId, { ids: [teamPlayerId] }),
        onSuccess: invalidate,
    });
}

export function useImportExcel(teamId, userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: (file) => {
            const formData = new FormData();
            formData.append('file', file);
            return playerApi.importTeamPlayers(teamId, formData);
        },
        onSuccess: invalidate,
    });
}

export function useDownloadImportTemplate() {
    return useMutation({
        mutationFn: () => playerApi.downloadImportTemplate(),
    });
}

export function useEditTeam(userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: async ({ teamId, form, activeSeasonTeamId }) => {
            await teamApi.update(teamId, form);
            if (activeSeasonTeamId && form.color_hex) {
                try {
                    await jerseyApi.upsert(activeSeasonTeamId, { type: 'home', primary_color: form.color_hex });
                } catch (e) {
                    console.warn('Could not update jersey color:', e);
                }
            }
        },
        onSuccess: invalidate,
    });
}

export function useDeleteTeam(userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: (teamId) => teamApi.delete(teamId),
        onSuccess: invalidate,
    });
}

export function useRegisterSeason(userId) {
    const invalidate = useInvalidateMyTeam(userId);
    return useMutation({
        mutationFn: (seasonId) => seasonTeamApi.register({ season_id: seasonId }),
        onSuccess: invalidate,
    });
}