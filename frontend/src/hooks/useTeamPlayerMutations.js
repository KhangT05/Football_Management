// queries/useTeamPlayerMutations.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/userApi';
import { playerApi } from '../api/playerApi';
import { teamKeys } from './keys';

const unwrap = (res) => (typeof res?.status === 'boolean' ? res.data : res);

async function findOrCreateUser({ email, name }) {
    if (email) {
        try {
            const searchRes = await userApi.getAll({ q: email });
            const users = unwrap(searchRes)?.data ?? [];
            const exact = users.find(u => u.email === email);
            if (exact) return exact.id;
        } catch { /* fallthrough to create */ }
    }
    const created = await userApi.create({
        name,
        email: email || `player_${Date.now()}@temp.local`,
        password: 'Password123!',
        phone: '0000000000',
    });
    return unwrap(created).id;
}

export function useAddPlayerToTeam(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            const userId = await findOrCreateUser({ email: data.user_email || data.email, name: data.name });

            const playerRes = await playerApi.create({
                user_id: userId,
                date_of_birth: data.date_of_birth || '2000-01-01',
                position: data.position || 'FW',
                ...(data.height && { height: parseFloat(data.height) }),
                ...(data.weight && { weight: parseFloat(data.weight) }),
                ...(data.nationality && { nationality: data.nationality }),
            });
            const playerId = unwrap(playerRes).id;

            return playerApi.addToTeam(teamId, {
                player_id: playerId,
                jersey_number: parseInt(data.jersey_number, 10),
                position: data.position,
                role: data.role ?? 'player',
            });
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.players(teamId, {}) }),
    });
}

export function useUpdateTeamPlayer(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ teamPlayerId, playerId, userId, data }) => {
            if (userId && data.name !== undefined) {
                await userApi.updateProfile(userId, { name: data.name }).catch((e) => console.error('update user name failed', e));
            }
            const playerPatch = {};
            ['date_of_birth', 'height', 'weight', 'nationality'].forEach((k) => {
                if (data[k] !== undefined) {
                    playerPatch[k] = ['height', 'weight'].includes(k) ? (parseFloat(data[k]) || null) : data[k];
                }
            });
            if (Object.keys(playerPatch).length) await playerApi.update(playerId, playerPatch);

            const tpPatch = {};
            if (data.jersey_number !== undefined) tpPatch.jersey_number = parseInt(data.jersey_number, 10);
            if (data.position !== undefined) tpPatch.position = data.position;
            if (data.role !== undefined) tpPatch.role = data.role;
            if (Object.keys(tpPatch).length) return playerApi.updateTeamPlayer(teamId, teamPlayerId, tpPatch);
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.players(teamId, {}) }),
    });
}

export function useApprovePlayer(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamPlayerId) => playerApi.approve(teamId, teamPlayerId),
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.players(teamId, {}) }),
    });
}

export function useRejectPlayer(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (teamPlayerId) => playerApi.reject(teamId, teamPlayerId),
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.players(teamId, {}) }),
    });
}

export function useRemovePlayers(teamId) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (ids) => playerApi.bulkRemoveFromTeam(teamId, { ids }),
        onSuccess: () => qc.invalidateQueries({ queryKey: teamKeys.players(teamId, {}) }),
    });
}