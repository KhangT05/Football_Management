import { useState, useEffect, useMemo, useCallback } from 'react';
import { matchLineupApi } from '../api';
import useToastStore from '../store/toastStore';
import { mapPosition, PITCH_GOALKEEPER_COUNT, getSquadRange } from '../utils/position';
import { parseApiError } from '../utils/errorHelper';
import { useShallow } from 'zustand/react/shallow';

export default function useLineupSelection({ matchId, teamId, match, onSaved }) {
    const toast = useToastStore(useShallow(state => ({
        success: state.success, error: state.error, warning: state.warning,
        info: state.info, apiError: state.apiError
    })));

    const [roster, setRoster] = useState([]);
    const [selections, setSelections] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    // live formation — nguồn sự thật duy nhất cho totalStarters/pitchType,
    // KHÔNG suy từ match.phase.season.pitch_type (stale cache risk).
    const [formation, setFormation] = useState(null); // { pitchType, totalStarters } | null khi chưa load xong

    const squadRange = getSquadRange(match); // tournamentRule max_squad_size — rủi ro stale chấp nhận được (ít đổi giữa mùa)

    // null khi formation chưa fetch xong -> caller phải chặn tương tác,
    // không fallback ngầm về san_5 (5) như bug cũ.
    const starterReq = formation?.totalStarters ?? null;
    const maxStarters = starterReq;
    const minStarters = starterReq;
    const maxSquadSize = squadRange?.max_players_per_team ?? Infinity;
    const formationLoaded = starterReq !== null;

    useEffect(() => {
        if (!matchId || !teamId) {
            setIsLoading(false);
            return;
        }
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            try {
                const [lineupRes, eligibleRes, formationRes] = await Promise.all([
                    matchLineupApi.getLineup(matchId, teamId),
                    matchLineupApi.getEligiblePlayers(matchId, teamId),
                    matchLineupApi.getFormation(matchId, teamId), // GET /matches/:id/lineups/formation — LIVE, không cache
                ]);

                const eligibleData = typeof eligibleRes?.status === 'boolean' ? eligibleRes.data : eligibleRes;
                const pool = Array.isArray(eligibleData?.data) ? eligibleData.data : Array.isArray(eligibleData) ? eligibleData : [];
                const mappedRoster = pool.map(tp => ({
                    player_id: tp.player_id ?? tp.player?.id ?? tp.id,
                    name: tp.player?.name ?? tp.name,
                    jersey_number: tp.jersey_number ?? tp.number,
                    position: tp.position,
                    avatar: tp.player?.avatar,
                }));
                if (!cancelled) setRoster(mappedRoster);

                const formationData = typeof formationRes?.status === 'boolean' ? formationRes.data : formationRes;
                if (!cancelled) {
                    setFormation({
                        pitchType: formationData?.pitchType ?? formationData?.pitch_type,
                        totalStarters: formationData?.totalStarters ?? formationData?.total_starters,
                    });
                }

                const data = typeof lineupRes?.status === 'boolean' ? lineupRes.data : lineupRes;
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
                if (!cancelled) {
                    setSelections({});
                    setRoster([]);
                    setFormation(null);
                }
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
        if (row === 'goalkeeper') return (startersByRow.goalkeeper || 0) >= PITCH_GOALKEEPER_COUNT;
        return false;
    }, [startersByRow]);

    const toggleLineupType = useCallback((playerId, type) => {
        if (!formationLoaded) {
            toast.warning('Đang tải thông tin sân thi đấu, vui lòng chờ...');
            return;
        }
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
    }, [formationLoaded, startersCount, subsCount, maxStarters, maxSquadSize, findPlayer, rowIsFull, toast]);

    const handleDropOnPitch = useCallback((playerId, rowPosition) => {
        if (!formationLoaded) {
            toast.warning('Đang tải thông tin sân thi đấu, vui lòng chờ...');
            return;
        }
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
                toast.error(`Chỉ được chọn tối đa ${maxStarters} cầu thủ đá chính (đúng luật sân)`);
                return prev;
            }
            if (rowIsFull(rowPosition)) {
                toast.error(`Đội hình chính chỉ được đúng ${PITCH_GOALKEEPER_COUNT} thủ môn`);
                return prev;
            }
            return { ...prev, [playerId]: { lineup_type: 'starter', is_captain: current?.is_captain || false } };
        });
    }, [formationLoaded, findPlayer, startersCount, maxStarters, rowIsFull, toast]);

    const setCaptain = useCallback((playerId) => {
        setSelections(prev => {
            if (!prev[playerId]) return prev;
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

    const canSave = useMemo(() => {
        if (!formationLoaded) return false;
        const gkCount = startersByRow.goalkeeper || 0;
        const totalPlayers = startersCount + subsCount;
        return (
            startersCount === starterReq &&
            gkCount === PITCH_GOALKEEPER_COUNT &&
            hasCaptain &&
            (!squadRange?.min_players_per_team || totalPlayers >= squadRange.min_players_per_team) &&
            (!squadRange?.max_players_per_team || totalPlayers <= squadRange.max_players_per_team)
        );
    }, [formationLoaded, startersCount, starterReq, startersByRow, hasCaptain, subsCount, squadRange]);

    const save = useCallback(async () => {
        if (!formationLoaded) {
            toast.error('Chưa xác định được sân thi đấu (đang tải), thử lại sau');
            return false;
        }
        const gkCount = startersByRow.goalkeeper || 0;
        const totalPlayers = startersCount + subsCount;

        if (startersCount !== starterReq) {
            toast.error(`Cần đúng ${starterReq} cầu thủ đá chính theo luật sân`);
            return false;
        }
        if (gkCount !== PITCH_GOALKEEPER_COUNT) {
            toast.error(`Đội hình chính cần đúng ${PITCH_GOALKEEPER_COUNT} thủ môn (hiện tại: ${gkCount})`);
            return false;
        }
        if (!hasCaptain) {
            toast.error('Vui lòng chọn một đội trưởng');
            return false;
        }
        if (squadRange?.min_players_per_team && totalPlayers < squadRange.min_players_per_team) {
            toast.error(`Cần tối thiểu ${squadRange.min_players_per_team} cầu thủ đăng ký`);
            return false;
        }
        if (squadRange?.max_players_per_team && totalPlayers > squadRange.max_players_per_team) {
            toast.error(`Tổng quân số đăng ký vượt quá ${squadRange.max_players_per_team} cầu thủ`);
            return false;
        }

        const payload = {
            team_id: Number(teamId),
            players: Object.entries(selections).map(([playerId, sel]) => {
                const player = findPlayer(playerId);
                return {
                    player_id: Number(playerId),
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
            toast.error(parseApiError(err, 'Lỗi khi lưu đội hình'));
            return false;
        } finally {
            setIsSaving(false);
        }
    }, [formationLoaded, startersCount, starterReq, startersByRow, hasCaptain, subsCount, squadRange, selections, teamId, matchId, findPlayer, toast, onSaved]);

    return {
        selections, isLoading, isSaving,
        startersCount, subsCount, hasCaptain,
        maxStarters, minStarters, maxSquadSize,
        formationLoaded, pitchType: formation?.pitchType ?? null,
        startersByRow,
        starters, substitutes, roster, canSave,
        toggleLineupType, handleDropOnPitch, setCaptain, save,
        findPlayer,
    };
}