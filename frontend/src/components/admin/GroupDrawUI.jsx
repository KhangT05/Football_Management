import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Users, Shuffle, AlertTriangle, Loader2, Trash2, LayoutGrid, Hash, ListChecks } from 'lucide-react';
import { seasonTeamApi, groupApi } from '../../api';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import { useShallow } from 'zustand/react/shallow';

const DEBUG_RESPONSE_SHAPE = false;

function unwrapResponse(res, label) {
  if (DEBUG_RESPONSE_SHAPE) {
    console.log(`[GroupDrawUI][DEBUG raw response] ${label}:`, res);
  }
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

  // Không có meta.total tin cậy được -> KHÔNG suy ra từ data.length khi ta
  // chủ động giới hạn per_page, vì data.length lúc đó chỉ phản ánh per_page,
  // không phải tổng thật. Trả về null để UI báo lỗi thay vì hiển thị số sai.
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
  const [deletingGroupId, setDeletingGroupId] = useState(null);
  const [draggedTeam, setDraggedTeam] = useState(null);
  const [dragOverGroup, setDragOverGroup] = useState(null);
  // NEW: highlight đúng 1 dòng team đang là drop-target, để phân biệt trực
  // quan với "thả vào vùng trống của cả bảng" (dragOverGroup). Khi cả 2
  // cùng active, dragOverTeamId ưu tiên hiển thị (xem className bên dưới).
  const [dragOverTeamId, setDragOverTeamId] = useState(null);

  const [teamsPerGroup, setTeamsPerGroup] = useState(4);
  const [numPots, setNumPots] = useState(4);
  const [groupCount, setGroupCount] = useState(4);

  const [persistedTeamsPerGroup, setPersistedTeamsPerGroup] = useState(null);
  const [phaseInfo, setPhaseInfo] = useState(null);

  const [groups, setGroups] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  const [totalTeams, setTotalTeams] = useState(null);
  const [groupsLoadError, setGroupsLoadError] = useState(false);
  const [teamsCountError, setTeamsCountError] = useState(false);

  const requestIdRef = useRef(0);
  const isMountedRef = useRef(true);

  // FIX (root cause "stuck loading" dưới StrictMode dev): effect cleanup-only
  // trước đây set isMountedRef.current = false ở cleanup nhưng KHÔNG set lại
  // true khi mount lại. StrictMode double-invoke (mount -> cleanup -> mount)
  // khiến flag kẹt false vĩnh viễn sau lần mount thứ 2, trong khi request
  // thật (reqId khớp) vẫn đang in-flight. Khi response về, guard
  // `!isMountedRef.current` fail-safe sai -> bỏ qua setState -> loading kẹt
  // true, groups/phase kẹt giá trị reset, dù network đã 200 hợp lệ.
  // Set lại true ở mount body để lần mount thứ 2 tự sửa flag trước khi
  // response resolve.
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
        const payload = unwrapResponse(groupsRes.value, 'groupApi.listBySeason');
        setGroupsLoadError(false);
        setPhaseInfo(payload?.phase ?? null);
        const fetchedGroups = Array.isArray(payload?.groups) ? payload.groups : [];
        setGroups(fetchedGroups);
        setOriginalGroups(JSON.parse(JSON.stringify(fetchedGroups)));
        setPersistedTeamsPerGroup(
          typeof payload?.phase?.teams_per_group === 'number' ? payload.phase.teams_per_group : null
        );
      } else {
        console.error('[GroupDrawUI] loadGroups failed:', groupsRes.reason);
        toast.error(groupsRes.reason?.response?.data?.message || 'Không thể tải danh sách bảng đấu');
        setGroups([]);
        setPersistedTeamsPerGroup(null);
        setPhaseInfo(null);
        setGroupsLoadError(true);
      }

      if (teamsRes.status === 'fulfilled') {
        const payload = unwrapResponse(teamsRes.value, 'seasonTeamApi.getAll');
        const total = extractTotalCount(payload);
        if (total === null) {
          console.warn(
            '[GroupDrawUI] Không xác định được tổng số team approved từ response. Raw payload:',
            payload
          );
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
    setPersistedTeamsPerGroup(null);
    setOriginalGroups([]);
    setPhaseInfo(null);
    if (seasonId) {
      loadData();
    } else {
      // FIX (edge case): seasonId falsy -> loadData() không chạy -> không có
      // finally nào tắt loading nếu nhánh trước đó đã set true. Guard tường
      // minh thay vì phụ thuộc side-effect của loadData.
      setLoading(false);
    }
  }, [seasonId, loadData]);

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
    setIsDrawing(true);
    try {
      await groupApi.drawGroups(seasonId, { teams_per_group: Number(teamsPerGroup) });
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
      await groupApi.drawSeeded(seasonId, { teams_per_group: Number(teamsPerGroup), num_pots: pots });
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

  // NEW: xoá 1 group riêng lẻ (khác handleClearDraw — cái đó xoá toàn bộ
  // kết quả draw của phase, không xoá group). Dùng khi tạo nhầm số lượng/tên
  // bảng và muốn gỡ từng cái thay vì clear draw + xoá hết rồi bulk-create lại.
  // Backend (deactivateGroup) chặn nếu group đã có match, nhưng KHÔNG chặn
  // nếu group đang có team — nó set group_id=null cho các season_teams rồi
  // mới deactivate. Vì vậy confirm phải nêu rõ số đội bị ảnh hưởng.
  const handleDeleteGroup = async (group) => {
    if (isDrawing || isCreatingGroups || deletingGroupId !== null) return;

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

  // ── Drag & Drop Handlers ──
  //
  // Có 2 loại thao tác kéo-thả khác nhau, PHẢI phân biệt rõ:
  //
  // 1) Thả vào 1 ĐỘI cụ thể ở bảng khác (handleTeamDrop) -> SWAP 1-1.
  //    Sĩ số 2 bảng không đổi -> luôn được phép, kể cả khi 2 bảng đang
  //    bằng quân số.
  //
  // 2) Thả vào VÙNG TRỐNG của cả bảng, không nhắm vào đội nào (handleDrop)
  //    -> MOVE (chuyển hẳn 1 đội sang bảng khác). Việc này làm bảng nguồn
  //    -1, bảng đích +1 -> CHỈ hợp lệ khi 2 bảng đang lệch quân số (dùng để
  //    cân lại). Nếu 2 bảng đang bằng nhau, move sẽ tạo ra đúng bug trong
  //    ảnh (3/2 và 1/2) nên phải chặn và bắt buộc người dùng thả trúng vào
  //    1 đội để trigger swap thay vì move.
  //
  // Lưu ý về "thả vào giữa 2 dòng": vì các <tr> xếp sát nhau không có
  // khoảng cách thật trong DOM, con trỏ giữa 2 dòng luôn nằm trên rìa của
  // 1 trong 2 <tr> đó -> event luôn rơi vào (1), không lọt xuống (2).
  // Khoảng trống thật của (2) chỉ tồn tại dưới dòng cuối/bảng rỗng.
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

  // Thả vào vùng trống của cả bảng -> MOVE. Chặn nếu 2 bảng đang bằng
  // quân số, vì move trong trường hợp đó luôn làm lệch sĩ số 1 bên.
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

  // Thả trúng vào 1 đội cụ thể -> SWAP 1-1. Luôn cho phép vì không đổi
  // sĩ số 2 bên. stopPropagation để container's onDrop (handleDrop) không
  // chạy tiếp và hiểu nhầm thành move.
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
    if (sourceGroupId === targetGroupId) return; // thả vào chính bảng của nó — bỏ qua

    setGroups(prevGroups => {
      const newGroups = JSON.parse(JSON.stringify(prevGroups));
      const sourceGroup = newGroups.find(g => g.id === sourceGroupId);
      const targetGroup = newGroups.find(g => g.id === targetGroupId);
      if (!sourceGroup || !targetGroup) return prevGroups;

      const sourceIdx = sourceGroup.season_teams.findIndex(st => st.id === stId);
      const targetIdx = targetGroup.season_teams.findIndex(st => st.id === targetStId);
      if (sourceIdx === -1 || targetIdx === -1) return prevGroups;

      // Đổi chỗ 2 đội cho nhau tại đúng vị trí — sĩ số 2 bảng giữ nguyên
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

    // Tất cả đội đã đổi bảng so với bản gốc
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

    // FIX: ghép các cặp "A đi G1->G2 và B đi G2->G1" thành 1 lệnh swap thật
    // (seasonTeamApi.swapTeams) thay vì 2 lệnh assignGroup độc lập chạy
    // song song. Lý do: assignGroup kiểm tra capacity dựa trên số đội đã
    // COMMIT trong group đích tại thời điểm request đó chạy; 2 request
    // song song cho 1 swap có thể đọc capacity trước khi lệnh kia commit,
    // dẫn tới bị BE từ chối "group đã full" dù về bản chất sĩ số không đổi.
    // swapTeams xử lý atomic trong 1 transaction, không đụng đến capacity
    // nên luôn an toàn cho đúng loại thao tác đổi chỗ này.
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

    setIsDrawing(true); // Reuse isDrawing state to show loading
    try {
      // groupApi.swapTeams / groupApi.assignTeam (PUT /groups/swap, /groups/assign)
      // — field name khớp đúng SwapTeamsBody { season_team_id_a, season_team_id_b }
      // và AssignTeamToGroupBody { season_team_id, group_id } phía BE.
      for (const [teamAId, teamBId] of swapPairs) {
        await groupApi.swapTeams({ season_team_id_a: teamAId, season_team_id_b: teamBId });
      }
      // Move đơn lẻ còn lại (trường hợp cân lại quân số giữa 2 bảng lệch)
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
  const maxAllowed = groups.length * Number(teamsPerGroup || 0);
  const belowMin = hasTeamCount && groups.length > 0 && totalTeams < minRequired;
  const aboveMax = hasTeamCount && groups.length > 0 && totalTeams > maxAllowed;
  const outOfRange = belowMin || aboveMax;

  const displayedCapacity = persistedTeamsPerGroup ?? Number(teamsPerGroup || 0);

  let headerSubtitle;
  if (loading) {
    headerSubtitle = 'Đang tải vòng đấu...';
  } else if (groupsLoadError) {
    headerSubtitle = 'Không tải được thông tin vòng đấu — thử tải lại trang';
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
        </div>

        <div className="p-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">Số đội mỗi bảng (capacity)</label>
              <input
                type="number"
                min={2}
                value={teamsPerGroup}
                onChange={e => setTeamsPerGroup(e.target.value)}
                className="w-full bg-navy-dark border border-navy-light rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-colors"
              />
              <p className="text-[11px] text-gray-500 mt-1.5">
                Upper bound để validate — số thật lưu sau draw có thể thấp hơn nếu team lệch số.
              </p>
            </div>
            <div>
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
          </div>

          <div className="grid grid-cols-3 gap-3">
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
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border bg-navy-dark border-navy-light">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0">
                <Hash className="w-4 h-4 text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 font-medium leading-none">Capacity thật (đã lưu)</p>
                <p className="text-lg font-black text-white leading-tight mt-0.5">
                  {persistedTeamsPerGroup ?? '—'}
                </p>
              </div>
            </div>
          </div>

          {teamsCountError && (
            <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Không xác định được số đội đã duyệt từ server (response shape không như mong đợi). Mở console
                (F12) để xem log <code>Raw payload</code>, hoặc bật <code>DEBUG_RESPONSE_SHAPE = true</code> ở
                đầu file này để log toàn bộ response.
              </span>
            </div>
          )}

          {outOfRange && (
            <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              {belowMin ? (
                <span>
                  Cần ít nhất <strong>{minRequired}</strong> đội cho <strong>{groups.length}</strong> bảng
                  (2 đội/bảng tối thiểu), hiện chỉ có <strong>{totalTeams}</strong>. Bốc thăm sẽ bị từ chối.
                </span>
              ) : (
                <span>
                  <strong>{totalTeams}</strong> đội vượt capacity <strong>{groups.length}</strong> bảng ×{' '}
                  <strong>{teamsPerGroup}</strong> = <strong>{maxAllowed}</strong>. Tăng số đội/bảng hoặc tạo thêm bảng.
                </span>
              )}
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

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleDrawRandom}
              disabled={isDrawing || loading || groups.length === 0}
              className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shuffle className="w-4 h-4" />}
              Bốc thăm ngẫu nhiên
            </button>

            <button
              onClick={handleDrawSeeded}
              disabled={isDrawing || loading || groups.length === 0}
              className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isDrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ListChecks className="w-4 h-4" />}
              Bốc thăm có hạt giống
            </button>

            <div className="flex-1" />

            <button
              onClick={handleClearDraw}
              disabled={isDrawing || loading || groups.length === 0}
              className="flex items-center gap-2 bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" /> Xóa bốc thăm
            </button>
          </div>
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
                    <Users className="w-3 h-3" /> {group.season_teams?.length || 0}
                    {displayedCapacity ? ` / ${displayedCapacity}` : ''} đội
                  </span>
                  <button
                    onClick={() => handleDeleteGroup(group)}
                    disabled={deletingGroupId !== null || isDrawing || isCreatingGroups || loading}
                    title="Xoá bảng này (tạo nhầm)"
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-red-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {deletingGroupId === group.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
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
        // FIX: trước đây là 1 thanh full-width (flex justify-end trên div
        // rộng hết container) nên trông như che gần hết khu vực bên dưới dù
        // nội dung thật chỉ gói gọn bên phải. Giờ chuyển thành 1 card nhỏ
        // gọn, fixed ở góc phải-dưới màn hình (giống toast/snackbar), không
        // chiếm ngang layout, thu nhỏ padding/chữ.
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