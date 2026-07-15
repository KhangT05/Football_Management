import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchLineupApi } from '../api';
import useToastStore from '../store/toastStore';
import { mapPosition, PITCH_GOALKEEPER_COUNT } from '../utils/position';

/**
 * Quản lý state chọn đội hình (starter/substitute/captain) cho 1 (matchId, teamId).
 * Dùng chung cho ManageMatchLineup (full page) và LineupBuilderModal.
 *
 * roster: mảng đã normalize { player_id, name, jersey_number, position (raw), avatar? }
 * squadLimit: { min_players_per_team, max_players_per_team, max_squad_size, pitchType }
 *   — min/max_players_per_team ở đây LUÔN bằng nhau = tổng số người/sân theo
 *   luật (5/7/11), không phải khoảng linh hoạt. max_squad_size là tổng đăng
 *   ký tối đa (chính + dự bị) theo tournament_rule, tách biệt hoàn toàn.
 * onSaved: callback sau khi save API thành công (điều hướng / đóng modal — do caller quyết định)
 */
export default function useLineupSelection({ matchId, teamId, roster, squadLimit, onSaved }) {
    const toast = useToastStore();
    // key: player_id, value: { lineup_type: 'starter' | 'substitute', is_captain: boolean }
    const [selections, setSelections] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Tổng số đá chính bắt buộc theo luật sân (vd sân 7 => 7). Không phải
    // khoảng — min và max ở đây luôn bằng nhau, xem getSquadLimit().
    const maxStarters = squadLimit?.max_players_per_team ?? 11;
    const minStarters = squadLimit?.min_players_per_team ?? 1;
    // Tổng quân số tối đa (đá chính + dự bị) theo tournament_rule của giải —
    // Infinity nếu chưa có rule, để không chặn nhầm khi thiếu dữ liệu.
    const maxSquadSize = squadLimit?.max_squad_size ?? Infinity;

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

    // Đếm số cầu thủ đang đá chính theo từng hàng vị trí (đã mapPosition) —
    // chỉ dùng để khoá hàng "goalkeeper" ở đúng 1 người (luật bóng đá bắt
    // buộc). Các hàng DEF/MID/FW KHÔNG bị giới hạn riêng — đội tự chọn sơ đồ
    // chiến thuật, chỉ bị chặn chung khi startersCount đã chạm maxStarters.
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

    // Chỉ hàng thủ môn có giới hạn cứng (PITCH_GOALKEEPER_COUNT = 1). Các
    // hàng khác trả về false — không có trần riêng, chỉ bị chặn bởi
    // startersCount >= maxStarters (tổng số người/sân).
    const rowIsFull = useCallback((row) => {
        if (row === 'goalkeeper') return (startersByRow.goalkeeper || 0) >= PITCH_GOALKEEPER_COUNT;
        return false;
    }, [startersByRow]);

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
            if (type === 'starter') {
                if (startersCount >= maxStarters) {
                    toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính (đúng luật sân)`);
                    return prev;
                }
                const player = findPlayer(playerId);
                const row = mapPosition(player?.position);
                if (rowIsFull(row)) {
                    toast.error(`Đội hình chính chỉ được đúng ${PITCH_GOALKEEPER_COUNT} thủ môn`);
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
                toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính (đúng luật sân)`);
                return prev;
            }
            if (rowIsFull(rowPosition)) {
                toast.error(`Đội hình chính chỉ được đúng ${PITCH_GOALKEEPER_COUNT} thủ môn`);
                return prev;
            }
            return { ...prev, [playerId]: { lineup_type: 'starter', is_captain: current?.is_captain || false } };
        });
    }, [findPlayer, startersCount, maxStarters, rowIsFull, toast]);

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
        if (startersCount !== maxStarters) {
            toast.error(`Cần đúng ${maxStarters} cầu thủ đá chính theo luật sân`);
            return false;
        }
        const gkCount = startersByRow.goalkeeper || 0;
        if (gkCount !== PITCH_GOALKEEPER_COUNT) {
            toast.error(`Đội hình chính cần đúng ${PITCH_GOALKEEPER_COUNT} thủ môn (hiện tại: ${gkCount})`);
            return false;
        }
        if (!hasCaptain) {
            toast.error('Vui lòng chọn một đội trưởng');
            return false;
        }
        if (startersCount + subsCount > maxSquadSize) {
            toast.error(`Tổng quân số đăng ký (chính + dự bị) vượt quá ${maxSquadSize} cầu thủ`);
            return false;
        }

        const payload = {
            team_id: Number(teamId),
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
    }, [startersCount, maxStarters, startersByRow, hasCaptain, subsCount, maxSquadSize, selections, teamId, matchId, findPlayer, toast, onSaved]);

    return {
        selections, isLoading, isSaving,
        startersCount, subsCount, hasCaptain,
        maxStarters, minStarters, maxSquadSize,
        startersByRow,
        starters, substitutes,
        toggleLineupType, handleDropOnPitch, setCaptain, save,
        findPlayer,
    };
}