import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Users, Shuffle, AlertTriangle, Loader2, Trash2, LayoutGrid, Hash, ListChecks, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { seasonTeamApi, groupApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';

function unwrapResponse(res) {
  return typeof res?.status === 'boolean' ? res.data : res;
}

function extractTotalCount(payload) {
  const meta = payload?.meta ?? payload?.pagination ?? null;
  const candidates = [
    meta?.total, meta?.total_items, meta?.totalItems,
    meta?.total_count, meta?.totalCount, meta?.count, meta?.itemCount,
    payload?.total,
  ];
  const found = candidates.find((v) => typeof v === 'number');
  if (typeof found === 'number') return found;
  return null;
}

export default function GroupDrawUI({ seasonId }) {
  const toast = useToastStore();

  const { teams, fetchAll: fetchTeams } = useTeamStore(useShallow(state => ({
    teams: state.teams,
    fetchAll: state.fetchAll
  })));

  useEffect(() => {
    fetchTeams({ per_page: 500, force: true });
  }, [fetchTeams]);

  const teamMap = useMemo(() => {
    const map = new Map();
    for (const t of teams) map.set(t.id, t);
    return map;
  }, [teams]);
  const getTeamName = (teamId) => teamMap.get(Number(teamId))?.name ?? `Đội #${teamId}`;

  const [loading, setLoading] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCreatingGroups, setIsCreatingGroups] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [draggedTeam, setDraggedTeam] = useState(null);
  const [dragOverGroup, setDragOverGroup] = useState(null);
  const [dragOverTeamId, setDragOverTeamId] = useState(null);

  // numPots: chỉ dùng riêng cho bốc thăm hạt giống.
  // teams_per_group KHÔNG còn là input của user nữa — tự tính từ
  // totalTeams / groups.length (xem computedTeamsPerGroup bên dưới),
  // BE vẫn nhận field này như upper-bound để validate.
  const [numPots, setNumPots] = useState(4);
  const [groupCount, setGroupCount] = useState(4);

  const [phaseInfo, setPhaseInfo] = useState(null);
  const [groups, setGroups] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  const [totalTeams, setTotalTeams] = useState(null);
  const [groupsLoadError, setGroupsLoadError] = useState(false);
  const [teamsCountError, setTeamsCountError] = useState(false);

  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  const loadData = useCallback(async () => {
    if (!seasonId) return;
    const reqId = ++requestIdRef.current;
    setLoading(true);
    try {
      const [groupsRes, teamsRes] = await Promise.allSettled([
        groupApi.listBySeason(seasonId),
        seasonTeamApi.getAll({ season_id: seasonId, status: 'approved', per_page: 1 }),
      ]);

      if (reqId !== requestIdRef.current || !isMountedRef.current) return;

      if (groupsRes.status === 'fulfilled') {
        const payload = unwrapResponse(groupsRes.value);
        setGroupsLoadError(false);
        setPhaseInfo(payload?.phase ?? null);
        const fetchedGroups = Array.isArray(payload?.groups) ? payload.groups : [];
        setGroups(fetchedGroups);
        setOriginalGroups(JSON.parse(JSON.stringify(fetchedGroups)));
      } else {
        console.error('[GroupDrawUI] loadGroups failed:', groupsRes.reason);
        toast.error(groupsRes.reason?.response?.data?.message || 'Không thể tải danh sách bảng đấu');
        setGroups([]);
        setPhaseInfo(null);
        setGroupsLoadError(true);
      }

      if (teamsRes.status === 'fulfilled') {
        const payload = unwrapResponse(teamsRes.value);
        const total = extractTotalCount(payload);
        if (total === null) {
          console.warn('[GroupDrawUI] Không xác định được tổng số team approved. Raw payload:', payload);
          setTeamsCountError(true);
          setTotalTeams(null);
        } else {
          setTeamsCountError(false);
          setTotalTeams(total);
        }
      } else {
        console.error('[GroupDrawUI] loadTotalTeams failed:', teamsRes.reason);
        toast.error(teamsRes.reason?.response?.data?.message || 'Không thể tải số lượng đội đã duyệt');
        setTeamsCountError(true);
        setTotalTeams(null);
      }
    } finally {
      if (reqId === requestIdRef.current && isMountedRef.current) setLoading(false);
    }
  }, [seasonId, toast]);

  useEffect(() => {
    setGroups([]);
    setGroupsLoadError(false);
    setTeamsCountError(false);
    setTotalTeams(null);
    setOriginalGroups([]);
    setPhaseInfo(null);
    if (seasonId) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [seasonId, loadData]);

  const isConfirmed = phaseInfo?.status === 'in_progress';
  const isLocked = phaseInfo?.status === 'locked';
  const hasBeenDrawn = groups.some(g => (g.season_teams?.length || 0) > 0);
  const showDrawConfig = groups.length > 0 && !isConfirmed && !isLocked;

  // Capacity thật ra chỉ là upper-bound gửi cho BE để validate — không cần
  // user nhập tay, tự tính từ số đội / số bảng hiện có (làm tròn lên,
  // tối thiểu 2). Nếu chưa đủ dữ liệu (đang load totalTeams / chưa có group)
  // thì null, disable nút draw.
  const computedTeamsPerGroup = useMemo(() => {
    if (typeof totalTeams !== 'number' || groups.length === 0) return null;
    return Math.max(2, Math.ceil(totalTeams / groups.length));
  }, [totalTeams, groups.length]);

  const anyBusy = isDrawing || isCreatingGroups || isConfirming || deletingGroupId !== null || loading;

  const handleCreateGroups = async () => {
    if (!seasonId) return toast.error('Chưa chọn season');
    if (groups.length > 0) return toast.error('Season đã có bảng — xoá hết trước khi tạo lại');
    const count = Number(groupCount);
    if (!Number.isInteger(count) || count < 1 || count > 26)
      return toast.error('Số bảng phải là số nguyên từ 1 đến 26');
    setIsCreatingGroups(true);
    try {
      await groupApi.createGroupsBulk(seasonId, count);
      toast.success(`Đã tạo ${count} bảng`);
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] createGroupsBulk failed:', error);
      toast.error(
        error?.response?.data?.message || `Lỗi tạo bảng (HTTP ${error?.response?.status ?? '?'})`
      );
    } finally {
      setIsCreatingGroups(false);
    }
  };

  const handleDrawRandom = async () => {
    if (!seasonId) return toast.error('Chưa chọn season');
    if (groups.length === 0) return toast.error('Chưa có bảng — tạo bảng trước khi bốc thăm');
    if (!computedTeamsPerGroup) return toast.error('Chưa xác định được số đội đã duyệt');
    setIsDrawing(true);
    try {
      await groupApi.drawGroups(seasonId, { teams_per_group: computedTeamsPerGroup });
      toast.success('Bốc thăm ngẫu nhiên thành công!');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] drawGroups failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi bốc thăm ngẫu nhiên');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleDrawSeeded = async () => {
    if (!seasonId) return toast.error('Chưa chọn season');
    if (groups.length === 0) return toast.error('Chưa có bảng — tạo bảng trước khi bốc thăm');
    if (!computedTeamsPerGroup) return toast.error('Chưa xác định được số đội đã duyệt');

    const pots = Number(numPots);
    if (!Number.isInteger(pots) || pots < 1)
      return toast.error('Số pot phải là số nguyên >= 1');

    if (typeof totalTeams === 'number') {
      const maxPotSize = Math.ceil(totalTeams / pots);
      if (maxPotSize > groups.length) {
        return toast.error(
          `Pot lớn nhất ước tính ~${maxPotSize} team > ${groups.length} bảng — giảm số pot hoặc tăng số bảng`
        );
      }
    }

    setIsDrawing(true);
    try {
      await groupApi.drawSeeded(seasonId, { teams_per_group: computedTeamsPerGroup, num_pots: pots });
      toast.success('Bốc thăm hạt giống thành công!');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] drawGroupsSeeded failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi bốc thăm hạt giống');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleClearDraw = async () => {
    if (!seasonId) return toast.error('Chưa chọn season');
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ kết quả bốc thăm của vòng này?')) return;
    setIsDrawing(true);
    try {
      await groupApi.clearDraw(seasonId);
      toast.success('Đã xóa kết quả bốc thăm!');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] clearDraw failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi xóa bốc thăm');
    } finally {
      setIsDrawing(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (anyBusy) return;

    const teamCount = group.season_teams?.length || 0;
    const confirmMsg = teamCount > 0
      ? `Bảng "${group.name}" đang có ${teamCount} đội — xoá sẽ gỡ các đội này khỏi bảng ` +
      `(không xoá team, không ảnh hưởng match đã tồn tại). Không thể hoàn tác. Tiếp tục?`
      : `Xoá bảng "${group.name}"?`;
    if (!confirm(confirmMsg)) return;

    setDeletingGroupId(group.id);
    try {
      await groupApi.deactivateGroup(group.id);
      toast.success(`Đã xoá bảng "${group.name}"`);
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] deactivateGroup failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi xoá bảng (có thể do bảng đã có match)');
    } finally {
      setDeletingGroupId(null);
    }
  };

  const canConfirm = groups.length > 0 && !isConfirmed && !isLocked &&
    groups.every(g => (g.season_teams?.length || 0) >= 2);

  const handleConfirmGroups = async () => {
    if (!seasonId || !canConfirm) return;
    if (!confirm('Xác nhận bảng đấu? Sau khi xác nhận sẽ không tạo/xoá/bốc thăm lại được — chỉ còn đổi chỗ (swap) từng đội.')) return;
    setIsConfirming(true);
    try {
      await groupApi.confirmGroups(seasonId);
      toast.success('Đã xác nhận bảng đấu');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] confirmGroups failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi xác nhận bảng đấu');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleUnconfirmGroups = async () => {
    if (!seasonId || !isConfirmed) return;
    if (!confirm('Hủy xác nhận để mở lại chỉnh sửa cấu trúc bảng?')) return;
    setIsConfirming(true);
    try {
      await groupApi.unconfirmGroups(seasonId);
      toast.success('Đã hủy xác nhận');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] unconfirmGroups failed:', error);
      toast.error(error?.response?.data?.message || 'Lỗi hủy xác nhận (có thể đã có lịch thi đấu)');
    } finally {
      setIsConfirming(false);
    }
  };

  // ── Drag & Drop Handlers ──
  const handleDragStart = (e, stId, sourceGroupId) => {
    e.dataTransfer.setData('stId', stId);
    e.dataTransfer.setData('sourceGroupId', sourceGroupId);
    setDraggedTeam(stId);
  };

  const handleDragOver = (e, groupId) => {
    e.preventDefault();
    if (dragOverGroup !== groupId) {
      setDragOverGroup(groupId);
    }
  };

  const handleDragLeave = (e, groupId) => {
    e.preventDefault();
    if (dragOverGroup === groupId) {
      setDragOverGroup(null);
    }
  };

  const handleDrop = (e, targetGroupId) => {
    e.preventDefault();
    setDragOverGroup(null);
    setDraggedTeam(null);

    const stId = Number(e.dataTransfer.getData('stId'));
    const sourceGroupId = Number(e.dataTransfer.getData('sourceGroupId'));

    if (!stId || sourceGroupId === targetGroupId) return;

    const sourceGroup = groups.find(g => g.id === sourceGroupId);
    const targetGroup = groups.find(g => g.id === targetGroupId);
    if (!sourceGroup || !targetGroup) return;

    if (sourceGroup.season_teams.length === targetGroup.season_teams.length) {
      toast.error(
        'Hai bảng đang bằng số đội — thả trúng vào 1 đội trong bảng đích để hoán đổi vị trí (swap) thay vì di chuyển.'
      );
      return;
    }

    setGroups(prevGroups => {
      const newGroups = JSON.parse(JSON.stringify(prevGroups));
      const sg = newGroups.find(g => g.id === sourceGroupId);
      const tg = newGroups.find(g => g.id === targetGroupId);

      if (!sg || !tg) return prevGroups;

      const teamIndex = sg.season_teams.findIndex(st => st.id === stId);
      if (teamIndex === -1) return prevGroups;

      const [teamToMove] = sg.season_teams.splice(teamIndex, 1);
      tg.season_teams.push(teamToMove);

      return newGroups;
    });
  };

  const handleTeamDragOver = (e, stId) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverTeamId !== stId) setDragOverTeamId(stId);
  };

  const handleTeamDragLeave = (e) => {
    e.stopPropagation();
    setDragOverTeamId(null);
  };

  const handleTeamDrop = (e, targetGroupId, targetStId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverGroup(null);
    setDragOverTeamId(null);
    setDraggedTeam(null);

    const stId = Number(e.dataTransfer.getData('stId'));
    const sourceGroupId = Number(e.dataTransfer.getData('sourceGroupId'));

    if (!stId || stId === targetStId) return;
    if (sourceGroupId === targetGroupId) return;

    setGroups(prevGroups => {
      const newGroups = JSON.parse(JSON.stringify(prevGroups));
      const sourceGroup = newGroups.find(g => g.id === sourceGroupId);
      const targetGroup = newGroups.find(g => g.id === targetGroupId);
      if (!sourceGroup || !targetGroup) return prevGroups;

      const sourceIdx = sourceGroup.season_teams.findIndex(st => st.id === stId);
      const targetIdx = targetGroup.season_teams.findIndex(st => st.id === targetStId);
      if (sourceIdx === -1 || targetIdx === -1) return prevGroups;

      const tmp = sourceGroup.season_teams[sourceIdx];
      sourceGroup.season_teams[sourceIdx] = targetGroup.season_teams[targetIdx];
      targetGroup.season_teams[targetIdx] = tmp;

      return newGroups;
    });
  };

  const handleSaveChanges = async () => {
    if (isDrawing || isCreatingGroups) return;

    const originalGroupOf = new Map();
    originalGroups.forEach(g => g.season_teams.forEach(st => originalGroupOf.set(st.id, g.id)));

    const moves = [];
    groups.forEach(currentGroup => {
      currentGroup.season_teams.forEach(st => {
        const originalGroupId = originalGroupOf.get(st.id);
        if (originalGroupId !== undefined && originalGroupId !== currentGroup.id) {
          moves.push({ teamId: st.id, fromGroupId: originalGroupId, toGroupId: currentGroup.id });
        }
      });
    });

    if (moves.length === 0) return;

    const used = new Set();
    const swapPairs = [];
    for (let i = 0; i < moves.length; i++) {
      const a = moves[i];
      if (used.has(a.teamId)) continue;
      const j = moves.findIndex((b, k) =>
        k !== i && !used.has(b.teamId) &&
        b.fromGroupId === a.toGroupId && b.toGroupId === a.fromGroupId
      );
      if (j !== -1) {
        swapPairs.push([a.teamId, moves[j].teamId]);
        used.add(a.teamId);
        used.add(moves[j].teamId);
      }
    }
    const singleMoves = moves.filter(m => !used.has(m.teamId));

    setIsDrawing(true);
    try {
      for (const [teamAId, teamBId] of swapPairs) {
        await groupApi.swapTeams({ season_team_id_a: teamAId, season_team_id_b: teamBId });
      }
      if (singleMoves.length > 0) {
        await Promise.all(
          singleMoves.map(m => groupApi.assignTeam({ season_team_id: m.teamId, group_id: m.toGroupId }))
        );
      }
      toast.success('Đã lưu thành công các thay đổi bảng đấu!');
      loadData();
    } catch (error) {
      console.error('[GroupDrawUI] save changes failed:', error);
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi lưu thay đổi bảng đấu.');
    } finally {
      setIsDrawing(false);
    }
  };

  const hasChanges = useMemo(() => {
    return JSON.stringify(groups) !== JSON.stringify(originalGroups);
  }, [groups, originalGroups]);

  const hasTeamCount = typeof totalTeams === 'number';
  const minRequired = groups.length * 2;
  const belowMin = hasTeamCount && groups.length > 0 && totalTeams < minRequired;
  const outOfRange = showDrawConfig && belowMin;

  let headerSubtitle;
  if (loading) {
    headerSubtitle = 'Đang tải vòng đấu...';
  } else if (groupsLoadError) {
    headerSubtitle = 'Không tải được thông tin vòng đấu — thử tải lại trang';
  } else if (isConfirmed) {
    headerSubtitle = `Vòng đấu: ${phaseInfo.name} · đã xác nhận`;
  } else if (phaseInfo) {
    headerSubtitle = `Vòng đấu: ${phaseInfo.name}`;
  } else {
    headerSubtitle = 'Chưa có vòng đấu — tạo bảng để bắt đầu';
  }

  return (
    <div className="space-y-6">
      <div className="bg-navy border border-navy-light rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-navy-light">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center shrink-0">
            <Shuffle className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white leading-none">Bốc thăm chia bảng</h3>
            <p className="text-xs text-gray-500 mt-1">{headerSubtitle}</p>
          </div>
          {isConfirmed && (
            <span className="ml-auto flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Đã xác nhận
            </span>
          )}
        </div>

        <div className="p-5 space-y-5">
          {/* Chỉ còn input số pot — dùng riêng cho bốc thăm hạt giống.
              Số đội/bảng không còn là input, tự tính ngầm. */}
          {showDrawConfig && (
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Số pot (chỉ dùng cho bốc thăm hạt giống)</label>
              <input
                type="number"
                min={1}
                value={numPots}
                onChange={e => setNumPots(e.target.value)}
                className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                Độc lập với số bảng — pot lớn nhất phải ≤ số bảng, ngược lại server sẽ từ chối.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${outOfRange ? 'bg-amber-500/10 border-amber-500/30' : 'bg-navy-dark border-navy-light'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${outOfRange ? 'bg-amber-500/20' : 'bg-emerald-500/15'}`}>
                <Users className={`w-4 h-4 ${outOfRange ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium leading-none">Đội đã duyệt</p>
                <p className={`text-lg font-black leading-tight mt-0.5 ${outOfRange ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {hasTeamCount ? totalTeams : teamsCountError ? '—' : <Loader2 className="w-4 h-4 animate-spin inline" />}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border bg-navy-dark border-navy-light">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium leading-none">Số bảng hiện có</p>
                <p className="text-lg font-black text-white leading-tight mt-0.5">{groups.length}</p>
              </div>
            </div>
          </div>

          {teamsCountError && (
            <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Không xác định được số đội đã duyệt từ server. Xem console (F12) để biết chi tiết.</span>
            </div>
          )}

          {outOfRange && (
            <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Cần ít nhất <strong>{minRequired}</strong> đội cho <strong>{groups.length}</strong> bảng
                (2 đội/bảng tối thiểu), hiện chỉ có <strong>{totalTeams}</strong>. Bốc thăm sẽ bị từ chối.
              </span>
            </div>
          )}

          {groups.length === 0 && seasonId && !loading && (
            <div className="flex flex-wrap items-end gap-3 bg-navy-dark/60 border border-dashed border-navy-light rounded-xl p-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1.5">Số bảng cần tạo</label>
                <input
                  type="number"
                  min={1}
                  max={26}
                  value={groupCount}
                  onChange={e => setGroupCount(e.target.value)}
                  className="w-28 bg-navy-dark border border-navy-light rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-colors"
                />
              </div>
              <button
                onClick={handleCreateGroups}
                disabled={isCreatingGroups || loading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingGroups ? <Loader2 className="w-4 h-4 animate-spin" /> : <LayoutGrid className="w-4 h-4" />}
                Tạo bảng (Bảng A, B, C...)
              </button>
            </div>
          )}

          {/* Action bar: draw/clear chỉ hiện khi CÒN sửa được cấu trúc.
              Confirm/Unconfirm luôn hiện (miễn có group) để đổi trạng thái. */}
          {groups.length > 0 && !isLocked && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {!isConfirmed && (
                <>
                  <button
                    onClick={handleDrawRandom}
                    disabled={anyBusy || groups.length === 0 || !computedTeamsPerGroup}
                    className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
                    Bốc thăm ngẫu nhiên
                  </button>

                  <button
                    onClick={handleDrawSeeded}
                    disabled={anyBusy || groups.length === 0 || !computedTeamsPerGroup}
                    className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
                    Bốc thăm có hạt giống
                  </button>
                </>
              )}

              <div className="flex-1" />

              {!isConfirmed ? (
                <>
                  <button
                    onClick={handleClearDraw}
                    disabled={anyBusy || groups.length === 0}
                    className="flex items-center gap-2 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa bốc thăm
                  </button>
                  <button
                    onClick={handleConfirmGroups}
                    disabled={anyBusy || !canConfirm}
                    title={!canConfirm ? 'Mỗi bảng cần tối thiểu 2 đội trước khi xác nhận' : undefined}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    Xác nhận bảng đấu
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUnconfirmGroups}
                  disabled={anyBusy}
                  className="flex items-center gap-2 bg-transparent border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                  Hủy xác nhận
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-14">
          <Loader2 className="w-7 h-7 text-purple-500 animate-spin" />
        </div>
      ) : groups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {groups.map((group) => (
            <div key={group.id} className="bg-navy border border-navy-light rounded-2xl overflow-hidden shadow-lg">
              <div className="bg-linear-to-r from-blue-600 to-indigo-600 py-3.5 px-5 text-white flex justify-between items-center">
                <h4 className="font-black text-base tracking-wide uppercase">{group.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <Users className="w-3 h-3" /> {group.season_teams?.length || 0} đội
                  </span>
                  {!isConfirmed && !isLocked && (
                    <button
                      onClick={() => handleDeleteGroup(group)}
                      disabled={anyBusy}
                      title="Xoá bảng này (tạo nhầm)"
                      className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {deletingGroupId === group.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
              <div
                className={`p-2 transition-colors min-h-[80px] ${dragOverGroup === group.id && dragOverTeamId === null ? 'bg-blue-500/20 ring-2 ring-blue-500 rounded-b-2xl' : ''}`}
                onDragOver={(e) => handleDragOver(e, group.id)}
                onDragLeave={(e) => handleDragLeave(e, group.id)}
                onDrop={(e) => handleDrop(e, group.id)}
              >
                {group.season_teams.length === 0 ? (
                  <div className="text-center py-8">
                    <Hash className="w-6 h-6 text-gray-700 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Chưa có đội — chưa bốc thăm</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-sm">
                    <tbody>
                      {group.season_teams.map((st, idx) => (
                        <tr
                          key={st.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, st.id, group.id)}
                          onDragEnd={() => { setDraggedTeam(null); setDragOverTeamId(null); }}
                          onDragOver={(e) => handleTeamDragOver(e, st.id)}
                          onDragLeave={handleTeamDragLeave}
                          onDrop={(e) => handleTeamDrop(e, group.id, st.id)}
                          className={`border-b border-navy-light/30 last:border-0 hover:bg-navy-light/10 transition-colors cursor-grab active:cursor-grabbing
                            ${draggedTeam === st.id ? 'opacity-50' : ''}
                            ${dragOverTeamId === st.id ? 'bg-blue-500/25 ring-1 ring-inset ring-blue-400' : ''}`}
                        >
                          <td className="py-2.5 pl-3 pr-2 text-gray-500 font-mono text-xs w-8">{idx + 1}</td>
                          <td className="py-2.5 pr-3 font-bold text-white">
                            {getTeamName(st.team_id)}
                            <span className="text-xs text-gray-500 font-normal ml-2">#{st.team_id}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-14 bg-navy border border-dashed border-navy-light rounded-2xl">
          <Users className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h4 className="text-gray-400 font-bold text-sm">Chưa có bảng đấu</h4>
          <p className="text-gray-500 text-xs mt-1">Tạo bảng trước khi bốc thăm.</p>
        </div>
      )}

      {hasChanges && (
        <div className="fixed bottom-4 right-4 z-20 flex items-center gap-3 bg-navy-dark/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-blue-500/30 shadow-xl shadow-black/40">
          <span className="text-xs font-bold text-amber-400 whitespace-nowrap">Chưa lưu thay đổi</span>
          <button
            onClick={() => {
              setGroups(JSON.parse(JSON.stringify(originalGroups)));
              toast.success('Đã hủy các thay đổi');
            }}
            disabled={isDrawing || isCreatingGroups || loading}
            className="px-3 py-1.5 rounded-lg font-bold text-xs text-gray-400 hover:text-white bg-transparent border border-navy-light hover:bg-navy-light transition-all disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSaveChanges}
            disabled={isDrawing || isCreatingGroups || loading}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDrawing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ListChecks className="w-3.5 h-3.5" />}
            Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  );
}