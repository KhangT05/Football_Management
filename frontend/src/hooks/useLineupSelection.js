import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchLineupApi } from '../api';
import useToastStore from '../store/toastStore';
import { mapPosition } from '../utils/position';

export default function useLineupSelection({ matchId, teamId, roster, squadLimit, onSaved }) {
    const toast = useToastStore();
    const [selections, setSelections] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const maxStarters = squadLimit?.max_players_per_team ?? 11;
    const minStarters = squadLimit?.min_players_per_team ?? 1;
    // NEW — tổng quân số tối đa (đá chính + dự bị); Infinity nếu season chưa
    // gán rule, để không chặn nhầm khi thiếu dữ liệu.
    const maxSquadSize = squadLimit?.max_squad_size ?? Infinity;
    // NEW — số lượng ĐÚNG từng vị trí theo sân (vd sân 7: {goalkeeper:1,defender:3,...})
    const formation = squadLimit?.formation ?? null;

    // ... useEffect load giữ nguyên ...

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

    // NEW — đếm số cầu thủ đang đá chính theo từng hàng vị trí (đã mapPosition),
    // dùng để chặn drop/toggle khi hàng đó đã đủ quân theo sơ đồ sân.
    const startersByRow = useMemo(() => {
        const counts = {};
        roster.forEach(p => {
            if (selections[p.player_id]?.lineup_type === 'starter') {
                const row = mapPosition(p.position);
                counts[row] = (counts[row] || 0) + 1;
            }
        });
        return counts;
    }, [roster, selections]);

    const rowIsFull = useCallback((row) => {
        if (!formation) return false;
        const limit = formation[row];
        return limit != null && (startersByRow[row] || 0) >= limit;
    }, [formation, startersByRow]);

    const toggleLineupType = useCallback((playerId, type) => {
        setSelections(prev => {
            const current = prev[playerId];
            const next = { ...prev };
            if (current?.lineup_type === type) {
                delete next[playerId];
                return next;
            }
            if (type === 'starter') {
                if (startersCount >= maxStarters) {
                    toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính`);
                    return prev;
                }
                const player = findPlayer(playerId);
                const row = mapPosition(player?.position);
                if (rowIsFull(row)) {
                    toast.error(`Sơ đồ sân đã đủ quân ở vị trí này`);
                    return prev;
                }
            }
            if (type === 'substitute' && startersCount + subsCount >= maxSquadSize) {
                toast.error(`Chỉ được đăng ký tối đa ${maxSquadSize} cầu thủ cho trận này`);
                return prev;
            }
            next[playerId] = { lineup_type: type, is_captain: current?.is_captain || false };
            return next;
        });
    }, [startersCount, subsCount, maxStarters, maxSquadSize, findPlayer, rowIsFull, toast]);

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
            if (current?.lineup_type === 'starter') return prev;
            if (startersCount >= maxStarters) {
                toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính`);
                return prev;
            }
            if (rowIsFull(rowPosition)) {
                toast.error(`Sơ đồ sân đã đủ quân ở vị trí "${rowPosition}"`);
                return prev;
            }
            return { ...prev, [playerId]: { lineup_type: 'starter', is_captain: current?.is_captain || false } };
        });
    }, [findPlayer, startersCount, maxStarters, rowIsFull, toast]);

    // setCaptain, starters, substitutes, save giữ nguyên logic — chỉ đổi
    // dependency array của save() nếu bạn thêm maxSquadSize vào thông báo lỗi.

    return {
        selections, isLoading, isSaving,
        startersCount, subsCount, hasCaptain,
        maxStarters, minStarters, maxSquadSize, formation, startersByRow,
        starters, substitutes,
        toggleLineupType, handleDropOnPitch, setCaptain, save,
        findPlayer,
    };
}