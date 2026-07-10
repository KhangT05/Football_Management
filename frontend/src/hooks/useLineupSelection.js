import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchLineupApi } from '../api';
import useToastStore from '../store/toastStore';
import { mapPosition } from '../utils/position';

/**
 * Quản lý state chọn đội hình (starter/substitute/captain) cho 1 (matchId, teamId).
 * Dùng chung cho ManageMatchLineup (full page) và LineupBuilderModal.
 *
 * roster: mảng đã normalize { player_id, name, jersey_number, position (raw), avatar? }
 * squadLimit: { min_players_per_team, max_players_per_team }
 * onSaved: callback sau khi save API thành công (điều hướng / đóng modal — do caller quyết định)
 */
export default function useLineupSelection({ matchId, teamId, roster, squadLimit, onSaved }) {
    const toast = useToastStore();
    // key: player_id, value: { lineup_type: 'starter' | 'substitute', is_captain: boolean }
    const [selections, setSelections] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const maxStarters = squadLimit?.max_players_per_team ?? 11;
    const minStarters = squadLimit?.min_players_per_team ?? 1;

    useEffect(() => {
        if (!matchId || !teamId) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const res = await matchLineupApi.getLineup(matchId, teamId);
                const data = typeof res?.status === 'boolean' ? res.data : res;
                const lineupData = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
                const initial = {};
                lineupData.forEach(p => {
                    initial[p.player_id] = {
                        lineup_type: p.lineup_type || (p.is_starting ? 'starter' : 'substitute'),
                        is_captain: p.is_captain || false,
                    };
                });
                if (!cancelled) setSelections(initial);
            } catch (err) {
                console.error(err);
                if (!cancelled) setSelections({});
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [matchId, teamId]);

    const findPlayer = useCallback(
        (playerId) => roster.find(p => String(p.player_id) === String(playerId)),
        [roster]
    );

    const startersCount = useMemo(
        () => Object.values(selections).filter(s => s.lineup_type === 'starter').length,
        [selections]
    );
    const subsCount = useMemo(
        () => Object.values(selections).filter(s => s.lineup_type === 'substitute').length,
        [selections]
    );
    const hasCaptain = useMemo(
        () => Object.values(selections).some(s => s.is_captain),
        [selections]
    );

    // Dùng cho nút Chính/Dự bị trong bảng danh sách, và cũng dùng làm "remove"
    // khi gọi lại với type='starter' trên 1 cầu thủ đang là starter (toggle off).
    const toggleLineupType = useCallback((playerId, type) => {
        setSelections(prev => {
            const current = prev[playerId];
            const next = { ...prev };
            if (current?.lineup_type === type) {
                delete next[playerId];
                return next;
            }
            if (type === 'starter' && startersCount >= maxStarters) {
                toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính`);
                return prev;
            }
            next[playerId] = { lineup_type: type, is_captain: current?.is_captain || false };
            return next;
        });
    }, [startersCount, maxStarters, toast]);

    // Gọi khi thả cầu thủ vào 1 hàng vị trí trên PitchFormation.
    // Chỉ chấp nhận nếu vị trí thật của cầu thủ khớp hàng đích.
    const handleDropOnPitch = useCallback((playerId, rowPosition) => {
        const player = findPlayer(playerId);
        if (!player) return;

        const playerPos = mapPosition(player.position);
        if (playerPos !== rowPosition) {
            toast.error(`${player.name} không chơi vị trí này, không thể xếp vào đây`);
            return;
        }

        setSelections(prev => {
            const current = prev[playerId];
            if (current?.lineup_type === 'starter') return prev; // đã trên sân rồi
            if (startersCount >= maxStarters) {
                toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính`);
                return prev;
            }
            return { ...prev, [playerId]: { lineup_type: 'starter', is_captain: current?.is_captain || false } };
        });
    }, [findPlayer, startersCount, maxStarters, toast]);

    const setCaptain = useCallback((playerId) => {
        setSelections(prev => {
            if (!prev[playerId]) return prev; // phải được chọn trước
            const next = {};
            Object.entries(prev).forEach(([id, sel]) => { next[id] = { ...sel, is_captain: false }; });
            next[playerId] = { ...next[playerId], is_captain: true };
            return next;
        });
    }, []);

    const starters = useMemo(() => roster
        .filter(p => selections[p.player_id]?.lineup_type === 'starter')
        .map(p => ({
            player_id: p.player_id,
            name: p.name,
            jersey_number: p.jersey_number,
            position: mapPosition(p.position),
            is_captain: selections[p.player_id]?.is_captain || false,
        })), [roster, selections]);

    const substitutes = useMemo(
        () => roster.filter(p => selections[p.player_id]?.lineup_type === 'substitute'),
        [roster, selections]
    );

    const save = useCallback(async () => {
        if (startersCount < minStarters) {
            toast.error(`Cần tối thiểu ${minStarters} cầu thủ đá chính`);
            return false;
        }
        if (!hasCaptain) {
            toast.error('Vui lòng chọn một đội trưởng');
            return false;
        }

        const payload = {
            team_id: teamId,
            players: Object.entries(selections).map(([playerId, sel]) => {
                const player = findPlayer(playerId);
                const jNum = parseInt(player?.jersey_number || 1, 10);
                return {
                    player_id: Number(playerId),
                    jersey_number: isNaN(jNum) || jNum < 1 ? 1 : Math.min(jNum, 99),
                    position: mapPosition(player?.position),
                    lineup_type: sel.lineup_type,
                    is_captain: sel.is_captain,
                };
            }),
        };

        setIsSaving(true);
        try {
            await matchLineupApi.updateLineup(matchId, payload);
            toast.success('Lưu đội hình thành công!');
            onSaved?.();
            return true;
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Lỗi khi lưu đội hình');
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [startersCount, minStarters, hasCaptain, selections, teamId, matchId, findPlayer, toast, onSaved]);

    return {
        selections, isLoading, isSaving,
        startersCount, subsCount, hasCaptain,
        maxStarters, minStarters,
        starters, substitutes,
        toggleLineupType, handleDropOnPitch, setCaptain, save,
        findPlayer,
    };
}