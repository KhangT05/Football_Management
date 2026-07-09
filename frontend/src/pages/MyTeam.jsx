import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users, UserPlus, Trophy, Info, Settings, Trash2, Edit,
  AlertTriangle, CheckCircle2, Loader2, X,
  Search, ArrowUpDown, CreditCard, Shield, Calendar,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { teamApi, playerApi, seasonApi, matchApi, seasonTeamApi, jerseyApi, userApi } from '../api';
import PlayerRowSkeleton from '../components/skeletons/PlayerRowSkeleton';
import Pagination from '../components/ui/Pagination';
import { useShallow } from 'zustand/react/shallow';
import LineupBuilderModal from '../components/modals/LineupBuilderModal';
import EditTeamModal from '../components/modals/EditTeamModal';
import NoTeamState from '../components/myteam/NoTeamState';
import PlayerDeleteModal from '../components/myteam/PlayerDeleteModal';
import PlayerFormModal from '../components/admin/PlayerFormModal';
import PosBadge from '../components/myteam/PosBadge';
import TeamPaymentModal from '../components/myteam/TeamPaymentModal';
import TransactionsTab from '../components/myteam/TransactionsTab';
import { AVATAR_COLORS, getInitials, POSITION_LABELS } from '../utils/constants';
import { parseApiError } from '../utils/errorHelper';

// ─── Constants ─────────────────────────────────────────────
const MATCH_STATUS_LABEL = {
  scheduled: 'Chưa đấu',
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  live: 'Đang diễn ra',
  completed: 'Đã kết thúc',
  finished: 'Đã kết thúc',
  cancelled: 'Bị hủy',
  postponed: 'Hoãn',
};

const MATCH_STATUS_CLASS = {
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  ongoing: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
  live: 'bg-red-500/10 text-red-400 border-red-500/30 animate-pulse',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  finished: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  cancelled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  postponed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};

const normalizePosition = (posStr) => {
  if (!posStr) return 'OTHER';
  const p = posStr.toUpperCase().trim();
  if (p === 'GOALKEEPER' || p.includes('GK') || p.includes('THỦ MÔN')) return 'GK';
  if (p === 'DEFENDER' || p.includes('DEF') || p === 'DF' || p.includes('HẬU VỆ')) return 'DEF';
  if (p === 'MIDFIELDER' || p.includes('MID') || p === 'MF' || p.includes('TIỀN VỆ')) return 'MID';
  if (p === 'FORWARD' || p.includes('FW') || p === 'FWD' || p.includes('TIỀN ĐẠO')) return 'FW';
  return p;
};

/** Guard: trả về 'Chưa xếp lịch' nếu dateStr null/Invalid */
const formatMatchTime = (dateStr) => {
  if (!dateStr) return 'Chưa xếp lịch';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Chưa xếp lịch' : d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
};

const extractFilename = (contentDisposition, fallback) => {
  if (!contentDisposition) return fallback;
  const m = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)"?/i);
  return m ? decodeURIComponent(m[1]) : fallback;
};

// ─── Parse helpers ─────────────────────────────────────────


const parseList = (res) => {
  const payload = (typeof res?.status === 'boolean') ? res.data : res;
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
};

/** Map TeamPlayer record → normalised player object.
 *  API trả về: teamPlayer.player.user.name (tên nằm ở bảng User).
 *  goals: PlayerDto/TeamPlayerDto hiện chưa có endpoint cập nhật/persist —
 *  hiển thị nếu BE trả sẵn field, không có form nào ghi được giá trị này.
 */
const normalizePlayer = (tp) => ({
  id: tp.id,
  player_id: tp.player_id ?? tp.player?.id,
  user_id: tp.player?.user_id ?? tp.player?.user?.id,
  name: tp.player?.user?.name ?? tp.player?.name ?? tp.name ?? `Cầu thủ #${tp.id}`,
  email: tp.player?.user?.email ?? null,
  number: tp.jersey_number ?? tp.number ?? 0,
  position: tp.position ?? 'MID',
  goals: tp.goals_scored ?? tp.goals ?? 0,
  status: tp.status ?? 'active',
  role: tp.role ?? 'player',
  avatar: tp.player?.user?.avatar ?? tp.player?.avatar ?? null,
});

// ─── Main Component ────────────────────────────────────────
export default function MyTeam() {
  const { user } = useAuthStore(useShallow(s => ({ user: s.user })));
  const toast = useToastStore();
  const location = useLocation();
  const navigate = useNavigate();

  // ── Multi-team state ─────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [teams, setTeams] = useState([]);   // basic list (all teams user owns)
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [teamDetail, setTeamDetail] = useState(null); // enriched active-team data
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [allSeasons, setAllSeasons] = useState([]);
  const [activeMatchSeasonId, setActiveMatchSeasonId] = useState(null);
  const [isLoadingMatches, setIsLoadingMatches] = useState(false);
  const [playerForm, setPlayerForm] = useState({});

  // Derived — always use this instead of teamDetail directly
  const activeTeam = useMemo(
    () => teamDetail ?? teams.find(t => t.id === activeTeamId) ?? null,
    [teamDetail, teams, activeTeamId],
  );

  // ── UI State ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('roster');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('number');
  const [showPayment, setShowPayment] = useState(false);

  // Modal state
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const [lineupModalMatch, setLineupModalMatch] = useState(null);
  const [playerModal, setPlayerModal] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  // Delete confirm
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const handleItemsPerPageChange = (n) => { setItemsPerPage(n); setCurrentPage(1); };

  const [prevFilter, setPrevFilter] = useState({ search, sortField });
  if (prevFilter.search !== search || prevFilter.sortField !== sortField) {
    setPrevFilter({ search, sortField });
    setCurrentPage(1);
  }

  // ── Load matches for active-team + selected season ────────
  const loadMatches = useCallback(async (teamId, seasonId) => {
    if (!teamId || !seasonId) return;
    setIsLoadingMatches(true);
    try {
      const res = await matchApi.getTeamSchedule(seasonId, teamId);
      setMatches(parseList(res));
    } catch (err) {
      console.warn('Cannot fetch matches:', err);
      setMatches([]);
    } finally {
      setIsLoadingMatches(false);
    }
  }, []);

  // ── Load detailed info for one team ──────────────────────
  const loadTeamDetail = useCallback(async (teamId) => {
    if (!teamId) return;
    setIsLoading(true);
    try {
      // Re-fetch raw team list to get up-to-date data
      const teamsRes = await teamApi.getTeams({ per_page: 50 });
      const allRaw = parseList(teamsRes);
      const myTeam = allRaw.find(t => t.id === teamId);
      if (!myTeam) return;

      // Players — correct endpoint per PlayerDto/TeamPlayerDto join
      const playersRes = await playerApi.listTeamPlayers(teamId, { per_page: 100 });
      setPlayers(parseList(playersRes).map(normalizePlayer));

      // Build enriched detail object
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
        registeredAt: myTeam.created_at
          ? new Date(myTeam.created_at).toLocaleDateString('vi-VN')
          : '—',
        season: '—',
        description: myTeam.description,
        logo: myTeam.logo,
      };

      // Load season info
      try {
        const seasonsRes = await seasonApi.getAll();
        const seasonList = parseList(seasonsRes);
        setAllSeasons(seasonList);
        const active = seasonList.find(s =>
          ['registration_open', 'ongoing', 'upcoming'].includes(s.status)
        ) || seasonList[0];

        if (active) {
          if (!activeMatchSeasonId) setActiveMatchSeasonId(active.id);

          const stRes = await seasonTeamApi.getAll({ team_id: teamId, season_id: active.id });
          const stData = stRes?.data?.data || stRes?.data || [];
          const st = Array.isArray(stData) ? stData[0] : stData;

          let homeJersey = null;
          if (st) {
            try {
              const jRes = await jerseyApi.getBySeasonTeam(st.id);
              const jerseys = Array.isArray(jRes?.data?.data) ? jRes.data.data
                : Array.isArray(jRes?.data) ? jRes.data
                  : Array.isArray(jRes) ? jRes : [];
              homeJersey = jerseys.find(j => j.type === 'home');
            } catch (e) { console.warn('Cannot load jersey:', e); }
          }

          enriched = {
            ...enriched,
            season: active.name,
            activeSeasonId: active.id,
            activeSeasonTeamId: st?.id ?? null,
            registrationStatus: st?.status ?? null,
            primaryColor: homeJersey?.secondary_color || enriched.primaryColor,
            colorHex: homeJersey?.primary_color || enriched.colorHex,
          };
        }
      } catch (e) { console.warn('Cannot load season info:', e); }

      setTeamDetail(enriched);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tải dữ liệu đội bóng.');
    } finally {
      setIsLoading(false);
    }
  }, [activeMatchSeasonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load all teams user owns (called once on mount) ───────
  const loadAllTeams = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const res = await teamApi.getTeams({ per_page: 50 });
      const rawList = parseList(res);
      // API returns only user's teams; filter by user_id as safety
      const myTeams = rawList.filter(t => t.user_id === user.id);

      if (myTeams.length === 0) { setTeams([]); setIsLoading(false); return; }

      const basicTeams = myTeams.map(t => ({
        id: t.id,
        name: t.name,
        emoji: '🛡️',
        status: t.is_active ? 'approved' : 'pending',
      }));
      setTeams(basicTeams);

      // Nếu có yêu cầu mở sẵn 1 team cụ thể (từ RegisterTeam → autoOpenAddPlayer),
      // ưu tiên activate đúng team đó thay vì luôn lấy team đầu tiên.
      const requestedTeamId = location.state?.autoOpenAddPlayer ? location.state?.teamId : null;
      const requestedExists = requestedTeamId && basicTeams.some(t => t.id === requestedTeamId);
      setActiveTeamId(requestedExists ? requestedTeamId : basicTeams[0].id); // triggers loadTeamDetail effect below
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tải danh sách đội bóng.');
      setIsLoading(false);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => { loadAllTeams(); }, [loadAllTeams]);

  // When active team changes → reload detail
  useEffect(() => {
    if (!activeTeamId) return;
    setTeamDetail(null);
    setPlayers([]);
    setMatches([]);
    loadTeamDetail(activeTeamId);
  }, [activeTeamId]); // eslint-disable-line react-hooks/exhaustive-deps

  // When match season switcher changes → reload matches
  useEffect(() => {
    if (activeTeamId && activeMatchSeasonId && activeTab === 'matches') {
      loadMatches(activeTeamId, activeMatchSeasonId);
    }
  }, [activeTeamId, activeMatchSeasonId, activeTab, loadMatches]);

  // ── Handle team switch ────────────────────────────────────
  const handleSwitchTeam = (teamId) => {
    if (teamId === activeTeamId) return;
    setSearch('');
    setSortField('number');
    setActiveTab('roster');
    setActiveTeamId(teamId);
  };

  // ── Full reload after mutations ───────────────────────────
  const reloadCurrent = useCallback(async () => {
    if (!activeTeamId) return;
    await loadTeamDetail(activeTeamId);
    if (activeMatchSeasonId && activeTab === 'matches') {
      await loadMatches(activeTeamId, activeMatchSeasonId);
    }
  }, [activeTeamId, activeMatchSeasonId, activeTab, loadTeamDetail, loadMatches]);

  // ── Filtered + sorted players ─────────────────────────────
  const displayed = players
    .filter(p =>
      (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.number).includes(search)
    )
    .sort((a, b) => {
      if (sortField === 'number') return (a.number ?? 0) - (b.number ?? 0);
      if (sortField === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      if (sortField === 'goals') return (b.goals ?? 0) - (a.goals ?? 0);
      return 0;
    });

  const totalPages = Math.ceil(displayed.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlayers = displayed.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleEditTeamSave = async (form) => {
    setIsSaving(true);
    try {
      await teamApi.update(activeTeam.id, form);
      if (activeTeam.activeSeasonTeamId && form.color_hex) {
        try {
          await jerseyApi.upsert(activeTeam.activeSeasonTeamId, { type: 'home', primary_color: form.color_hex });
        } catch (e) {
          console.warn('Could not update jersey color:', e);
        }
      }
      toast.success('Đã cập nhật thông tin đội bóng thành công!');
      setEditTeamModalOpen(false);
      await reloadCurrent();
    } catch (apiErr) {
      setModalError(parseApiError(apiErr, 'Lỗi khi cập nhật thông tin đội.'));
    } finally { setIsSaving(false); }
  };

  const handleDeleteTeam = async (teamId) => {
    setIsSaving(true);
    try {
      await teamApi.delete(teamId);
      toast.success('Đã giải tán đội bóng!');
      setEditTeamModalOpen(false);
      const remaining = teams.filter(t => t.id !== teamId);
      setTeams(remaining);
      setTeamDetail(null);
      setActiveTeamId(remaining[0]?.id ?? null);
    } catch (apiErr) {
      setModalError(parseApiError(apiErr, 'Lỗi khi xóa đội bóng.'));
    } finally { setIsSaving(false); }
  };

  const openAddModal = () => {
    setEditingPlayer(null);
    setModalError('');
    setPlayerForm({ name: '', email: '', date_of_birth: '', number: '', position: 'midfielder', role: 'player' });
    setPlayerModal('add');
  };

  // ── FIX: xử lý điều hướng từ RegisterTeam.jsx ──────────────
  // Khi user chọn "Thêm cầu thủ vào team có sẵn" ở màn hình choice của
  // RegisterTeam, nó navigate('/doi-cua-toi', { state: { autoOpenAddPlayer, teamId } }).
  // Effect này đọc lại state đó và tự động: switch đúng team + mở modal add player.
  //
  // Điều kiện `teams.length === 0` bắt buộc phải có: loadAllTeams() là async,
  // nếu thiếu check này thì lần effect chạy đầu tiên (khi teams còn rỗng)
  // sẽ fail-silent (targetExists = false) và tính năng coi như không chạy.
  useEffect(() => {
    const st = location.state;
    if (!st?.autoOpenAddPlayer || !st?.teamId) return;
    if (teams.length === 0) return; // chưa load xong danh sách team, đợi render sau

    const targetExists = teams.some(t => t.id === st.teamId);
    if (targetExists) {
      if (activeTeamId !== st.teamId) {
        setSearch('');
        setSortField('number');
        setActiveTab('roster');
        setActiveTeamId(st.teamId);
      }
      openAddModal();
    } else {
      // teamId trong state không thuộc danh sách team của user hiện tại
      // (VD: đã bị xóa, hoặc dữ liệu cũ) — fail quiet, không mở nhầm team.
      console.warn('autoOpenAddPlayer: teamId không tồn tại trong danh sách team của user', st.teamId);
    }

    // Clear ngay location.state để F5 / back không bị trigger mở modal lại.
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, location.state]);

  const handleAddSave = async () => {
    const values = playerForm;
    setIsSaving(true);
    setModalError('');
    try {
      await playerApi.createForTeam(activeTeam.id, {
        name: values.name.trim(),
        user_email: values.email.trim(), // field trong form tên là "email", map sang key API "user_email"
        date_of_birth: values.date_of_birth,
        position: values.position,
        jersey_number: parseInt(values.number, 10),
      });
      toast.success(`Đã thêm "${values.name}" (áo số ${values.number}) vào đội...`);
      setPlayerModal(null);
      await loadTeamDetail(activeTeamId);
    } catch (apiErr) {
      setModalError(apiErr?.response?.data?.message || 'Lỗi khi thêm cầu thủ.');
    } finally { setIsSaving(false); }
  };
  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      setIsSaving(true);
      await playerApi.importTeamPlayers(activeTeam.id, formData);
      toast.success('Nhập dữ liệu từ file Excel thành công!');
      await loadTeamDetail(activeTeamId);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi khi nhập dữ liệu Excel.');
    } finally { setIsSaving(false); e.target.value = null; }
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const res = await playerApi.downloadImportTemplate();
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      if (!blob.size) throw new Error('Empty response — kiểm tra axiosClient interceptor có unwrap blob response không');
      const filename = extractFilename(res?.headers?.['content-disposition'], 'import-template.xlsx');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Không thể tải file mẫu Excel.');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleExportMatchReport = async (matchId) => {
    try {
      const res = await matchApi.getMatchReport(matchId);
      const blob = res.data instanceof Blob ? res.data : new Blob([res.data]);
      if (!blob.size) throw new Error('Empty response');
      const filename = extractFilename(res?.headers?.['content-disposition'], `BienBanTranDau_${matchId}.pdf`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename;
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Không thể tải biên bản trận đấu.');
    }
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setModalError('');
    setPlayerForm({
      name: player.player?.user?.name ?? player.player?.name ?? player.name ?? '',
      number: player.number,
      position: player.position,
      role: player.role,
    });
    setPlayerModal('edit');
  };
  // values: { number, position, role } — mode edit của PlayerFormModal
  // KHÔNG có name/email (đổi ở phần quản lý tài khoản), nhưng CÓ role
  // (đội trưởng/phó/thành viên) từ bản cập nhật PlayerFormModal.
  //
  // FIX: forward thêm `role` lên updateTeamPlayer — trước đây modal không
  // có UI chọn role nên field này bị bỏ qua hoàn toàn (mọi player mãi mãi
  // là "player" dù backend/updateTeamPlayerSchema đã support). Giờ modal
  // trả kèm values.role, cần gửi lên để không bị mất giá trị người dùng chọn.
  const handleEditSave = async () => {
    const values = playerForm;
    setIsSaving(true);
    setModalError('');
    try {
      // Cập nhật tên cầu thủ thông qua userApi
      if (values.name && editingPlayer.user_id) {
        try {
          await userApi.updateProfile(editingPlayer.user_id, { name: values.name.trim() });
        } catch (e) {
          console.error('Failed to update User name', e);
        }
      }

      await playerApi.updateTeamPlayer(activeTeam.id, editingPlayer.id, {
        jersey_number: parseInt(values.number, 10),
        position: values.position,
        role: values.role,
      });
      toast.success(`Đã cập nhật cầu thủ "${editingPlayer.name}".`);
      setPlayerModal(null);
      await loadTeamDetail(activeTeamId);
    } catch (apiErr) {
      setModalError(parseApiError(apiErr, 'Lỗi khi cập nhật cầu thủ.'));
    } finally { setIsSaving(false); }
  };


  // FIX (onSave is not a function): PlayerFormModal chỉ expose 1 callback
  // duy nhất — dispatch theo mode ngay tại đây, không truyền onSubmitAdd/
  // onSubmitEdit riêng lẻ nữa. Nếu PlayerFormModal source thực tế gọi tên
  // prop khác (vd. onSubmit), đổi tên prop bên dưới cho khớp — grep
  // `onSave(` trong PlayerFormModal.jsx để confirm.
  const handlePlayerModalSave = () =>
    playerModal === 'add' ? handleAddSave() : handleEditSave();

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await playerApi.bulkRemoveFromTeam(activeTeam.id, { ids: [deletingPlayer.id] });
      toast.success(`Đã xóa "${deletingPlayer.name}" khỏi đội.`);
      setDeletingPlayer(null);
      await loadTeamDetail(activeTeamId);
    } catch (apiErr) {
      toast.error(apiErr?.response?.data?.message || 'Lỗi khi xóa cầu thủ.');
    } finally { setIsDeleting(false); }
  };

  if (!isLoading && teams.length === 0) {
    return (
      <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <NoTeamState />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl animate-fade-in relative z-10">

        {/* ─── Team Switcher (multi-team) ───────────────── */}
        {!isLoading && teams.length > 1 && (
          <div className="mb-8 animate-slide-up">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5" /> Chọn đội bóng để quản lý
            </p>
            <div className="flex flex-wrap gap-2.5">
              {teams.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSwitchTeam(t.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-sm border transition-all duration-300 ${t.id === activeTeamId
                    ? 'bg-neon/10 border-neon/40 text-neon shadow-[0_0_15px_rgba(57,255,20,0.2)]'
                    : 'bg-navy/50 border-navy-light text-gray-300 hover:border-blue-500/50 hover:text-white hover:-translate-y-0.5'
                    }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="truncate max-w-[140px]">{t.name}</span>
                  {t.id === activeTeamId && (
                    <span className="w-2 h-2 rounded-full bg-neon shadow-[0_0_6px_rgba(57,255,20,0.6)] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── Status Banners ──────────────────────────── */}
        {!isLoading && activeTeam?.status === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl mb-8 flex items-start gap-4 animate-slide-up shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <div className="p-2 bg-yellow-500/20 rounded-xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-yellow-400 font-black text-lg mb-1 tracking-tight">Đội bóng đang chờ duyệt</p>
              <p className="text-yellow-500/80 font-medium">Hồ sơ đăng ký của bạn đã được gửi. Vui lòng chờ Admin xác nhận.</p>
            </div>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'approved' && activeTeam?.registrationStatus === 'pending' && (
          <div className="bg-navy border border-navy-light p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-xl shrink-0"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
              <div>
                <p className="text-red-500 font-black text-lg mb-1 tracking-tight">Chờ duyệt tham gia giải</p>
                <p className="text-red-400 font-medium">Yêu cầu tham gia giải <strong>{activeTeam.season}</strong> đang chờ Admin xác nhận.</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'approved' && !activeTeam?.registrationStatus && activeTeam?.activeSeasonId && (
          <div className="bg-navy border border-navy-light p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-xl shrink-0"><Info className="w-6 h-6 text-red-500" /></div>
              <div>
                <p className="text-red-500 font-black text-lg mb-1 tracking-tight">Giải đấu đang mở đăng ký</p>
                <p className="text-red-400 font-medium">Đội chưa đăng ký tham gia giải <strong>{activeTeam.season}</strong>.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await seasonTeamApi.register({ season_id: activeTeam.activeSeasonId });
                  toast.success('Đã gửi yêu cầu tham gia giải!');
                  await loadTeamDetail(activeTeamId);
                } catch (err) {
                  toast.error(err?.response?.data?.message || 'Không thể đăng ký tham gia giải.');
                } finally { setIsLoading(false); }
              }}
              className="px-6 py-3.5 shrink-0 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm hover:-translate-y-0.5 whitespace-nowrap"
            >
              <UserPlus className="w-5 h-5" /> Đăng ký ngay
            </button>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'approved' && ['approved', 'active'].includes(activeTeam?.registrationStatus) && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <p className="text-emerald-400 font-black text-lg mb-1 tracking-tight">Đăng ký thành công!</p>
                <p className="text-emerald-500/80 font-medium">Đội đã được duyệt tham gia <strong>{activeTeam.season}</strong>. Thanh toán lệ phí để bốc thăm chia bảng.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="px-6 py-3.5 shrink-0 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm hover:-translate-y-0.5 whitespace-nowrap"
            >
              <CreditCard className="w-5 h-5" /> Thanh toán
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up relative">
          <div className="flex items-center gap-6">
            {isLoading ? (
              <>
                <div className="skeleton w-20 h-20 rounded-3xl shrink-0" />
                <div className="space-y-2.5">
                  <div className="skeleton h-9 w-48 rounded-xl" />
                  <div className="skeleton h-4 w-56 rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 shrink-0 bg-navy-dark/80 backdrop-blur-md border-[3px] border-neon/50 rounded-3xl flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(57,255,20,0.2)] relative group overflow-hidden">
                  <div className="absolute inset-0 bg-neon/10 group-hover:bg-neon/20 transition-colors duration-300" />
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{activeTeam?.emoji}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon uppercase tracking-tight truncate">
                      {activeTeam?.name}
                    </h1>
                    {activeTeam?.status === 'approved' && (
                      <span className="shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Hoạt động
                      </span>
                    )}
                    {activeTeam?.status === 'pending' && (
                      <span className="shrink-0 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        Chờ Duyệt
                      </span>
                    )}
                  </div>
                  <p className="text-blue-400/80 font-bold tracking-wide text-sm">Mùa giải: {activeTeam?.season || '—'}</p>
                </div>
              </>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditTeamModalOpen(true)}
                className="bg-navy/60 backdrop-blur-xl text-white font-bold px-4 py-3 rounded-2xl hover:bg-navy transition-colors flex items-center gap-2 border border-navy-light shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap"
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Cài đặt</span>
              </button>
              <button
                onClick={openAddModal}
                disabled={players.length >= 20}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white font-black px-4 py-3 rounded-2xl hover:from-blue-400 hover:to-indigo-500 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Thêm cầu thủ</span>
                <span className="sm:hidden">Thêm CT</span>
              </button>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2 border-b border-navy-light mb-8 animate-fade-in overflow-x-auto custom-scrollbar">
            {[
              { id: 'roster', label: `Đội hình (${players.length})` },
              { id: 'matches', label: 'Lịch thi đấu' },
              { id: 'transactions', label: 'Lịch sử giao dịch' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'matches' && activeTeamId && activeMatchSeasonId) {
                    loadMatches(activeTeamId, activeMatchSeasonId);
                  }
                }}
                className={`pb-4 px-3 font-black uppercase tracking-wider text-sm border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'border-neon text-neon' : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>

            {/* ─── Matches Tab ──────────────────────────── */}
            {activeTab === 'matches' && (
              <div className="space-y-4">

                {allSeasons.length > 1 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3.5 h-3.5" /> Mùa:
                    </span>
                    {allSeasons.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setActiveMatchSeasonId(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${s.id === activeMatchSeasonId
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-navy/50 border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                          }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}

                {isLoadingMatches ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-neon animate-spin" />
                  </div>
                ) : matches.length === 0 ? (
                  <div className="text-center py-16 bg-navy/30 border border-dashed border-navy-light rounded-3xl">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Chưa có lịch thi đấu trong mùa giải này.</p>
                  </div>
                ) : (
                  matches.map((match) => {
                    const statusLabel = MATCH_STATUS_LABEL[match.status] ?? match.status;
                    const statusClass = MATCH_STATUS_CLASS[match.status] ?? 'bg-gray-500/10 text-gray-400 border-gray-500/30';
                    const isActive = ['scheduled', 'upcoming', 'ongoing', 'live'].includes(match.status);
                    return (
                      <div key={match.id} className="bg-navy/50 border border-navy-light rounded-3xl p-5 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border whitespace-nowrap ${statusClass}`}>
                              {statusLabel}
                            </span>
                            <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                              {formatMatchTime(match.start_time)}
                            </span>
                          </div>
                          <p className="text-lg font-black text-white truncate flex items-center gap-2">
                            <span>{match.home_team?.name || 'Đội nhà'}</span>
                            {['completed', 'finished'].includes(match.status) ? (
                                <span className="bg-navy-dark border border-navy-light px-3 py-1 rounded-lg text-neon text-xl tracking-widest tabular-nums mx-2">
                                  {match.home_score ?? 0} - {match.away_score ?? 0}
                                </span>
                            ) : (
                                <span className="text-gray-500 font-medium mx-2">vs</span>
                            )}
                            <span>{match.away_team?.name || 'Đội khách'}</span>
                          </p>
                          <p className="text-sm text-gray-400 mt-1 truncate">Sân: {match.venue?.name || 'Chưa xếp sân'}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
                          <button
                            onClick={() => handleExportMatchReport(match.id)}
                            className="w-full sm:w-auto px-4 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap"
                          >
                            Xuất Biên Bản
                          </button>
                          {isActive ? (
                            <button
                              onClick={() => setLineupModalMatch(match)}
                              className="w-full sm:w-auto px-5 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap"
                            >
                              Xếp Đội Hình
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/tran-dau/${match.id}`)}
                              className="w-full sm:w-auto px-5 py-3 bg-navy-light/50 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 border border-navy-light hover:border-blue-500/50 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap"
                            >
                              Xem Kết Quả
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── Transactions Tab ───────────────────────── */}
            {activeTab === 'transactions' && (
              <TransactionsTab teamId={activeTeamId} />
            )}

            {/* ─── Roster Tab ───────────────────────────── */}
            {activeTab === 'roster' && (
              <>
                {!isLoading && (
                  <div className="flex gap-2 items-center animate-fade-in bg-navy/40 backdrop-blur-md p-2 rounded-2xl border border-navy-light">
                    <div className="relative flex-1 min-w-0">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Tìm tên hoặc số áo..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="relative shrink-0">
                      <select
                        value={sortField}
                        onChange={e => setSortField(e.target.value)}
                        className="pl-3 pr-8 py-3 bg-navy-dark border border-navy-light rounded-xl text-white text-sm font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-all"
                      >
                        <option value="number">Sắp xếp: Số áo</option>
                        <option value="name">Sắp xếp: Tên</option>
                        <option value="goals">Sắp xếp: Bàn thắng</option>
                      </select>
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-6 py-5 border-b border-navy-light/50 flex items-center justify-between bg-navy-dark/40">
                    <h2 className="text-lg font-black text-white flex items-center gap-2.5 tracking-tight">
                      <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      Danh Sách Cầu Thủ
                    </h2>
                    {!isLoading && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-blue-400 bg-navy-dark px-3 py-1.5 rounded-xl border border-navy-light shadow-inner">
                          {players.length}/20
                        </span>
                        {players.length >= 20 && (
                          <span className="text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-2.5 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap hidden sm:block">
                            Đủ quân
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead>
                        <tr className="bg-navy-dark/60 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-navy-light/50">
                          <th className="py-4 px-4 w-14 text-center">
                            <button onClick={() => setSortField('number')} className="flex items-center justify-center gap-1 w-full hover:text-white transition-colors group">
                              Số <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          </th>
                          <th className="py-4 px-4">
                            <button onClick={() => setSortField('name')} className="flex items-center gap-1 hover:text-white transition-colors group">
                              Cầu thủ <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          </th>
                          <th className="py-4 px-4 text-center">Vị trí</th>
                          <th className="py-4 px-4 text-center">
                            <button onClick={() => setSortField('goals')} className="flex items-center justify-center gap-1 w-full hover:text-white transition-colors group">
                              Bàn <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          </th>
                          <th className="py-4 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-light/50">
                        {isLoading ? (
                          <><PlayerRowSkeleton /><PlayerRowSkeleton /><PlayerRowSkeleton /><PlayerRowSkeleton /><PlayerRowSkeleton /></>
                        ) : paginatedPlayers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-20 text-center text-gray-500">
                              <Search className="w-12 h-12 mx-auto mb-4 text-navy-light opacity-50" />
                              <p className="font-bold text-gray-400 text-lg">
                                {players.length === 0 ? 'Chưa có cầu thủ nào trong đội' : 'Không tìm thấy cầu thủ'}
                              </p>
                              <p className="text-sm mt-1">
                                {players.length === 0 ? 'Nhấn "Thêm CT" để thêm cầu thủ đầu tiên!' : 'Thử thay đổi từ khóa tìm kiếm'}
                              </p>
                            </td>
                          </tr>
                        ) : (
                          paginatedPlayers.map((player, idx) => (
                            <tr
                              key={player.id}
                              className="hover:bg-navy-light/20 transition-all duration-300 group animate-fade-in"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <td className="py-5 px-4 text-center">
                                <span className="font-black text-2xl text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">{player.number}</span>
                              </td>
                              <td className="py-5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity" />
                                    {player.avatar ? (
                                      <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-full bg-navy-dark border-2 border-navy-light relative z-10 object-cover" />
                                    ) : (
                                      <div className={`w-10 h-10 rounded-full bg-linear-to-br ${AVATAR_COLORS[(player.id || idx) % AVATAR_COLORS.length]} border-2 border-navy-light flex items-center justify-center font-black text-white text-xs relative z-10`}>
                                        {getInitials(player.name)}
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors truncate">{player.name}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                                      {player.role === 'captain' && '⭐ Đội trưởng'}
                                      {player.role === 'vice_captain' && '🔹 Phó đội trưởng'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-4 text-center"><PosBadge pos={player.position} /></td>
                              <td className="py-5 px-4 text-center">
                                <span className="font-black text-neon text-xl drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">
                                  {player.goals > 0 ? player.goals : <span className="text-navy-light font-normal text-base">—</span>}
                                </span>
                              </td>
                              <td className="py-5 px-4">
                                <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 sm:group-hover:translate-x-0">
                                  <button
                                    onClick={() => openEditModal(player)}
                                    className="w-9 h-9 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingPlayer(player)}
                                    className="w-9 h-9 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {!isLoading && displayed.length > 0 && (
                    <div className="px-6 py-4 bg-navy-dark/40 border-t border-navy-light/50 text-xs font-bold text-gray-500 flex items-center justify-between uppercase tracking-wider">
                      <span>Hiển thị <span className="text-white">{displayed.length}</span>/{players.length} cầu thủ</span>
                      {search && <button onClick={() => setSearch('')} className="text-blue-400 hover:text-blue-300 transition-colors">Xóa bộ lọc</button>}
                    </div>
                  )}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <Pagination
                      currentPage={safePage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      itemsPerPage={itemsPerPage}
                      onItemsPerPageChange={handleItemsPerPageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* ─── Sidebar ──────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-5 animate-slide-up" style={{ animationDelay: '150ms' }}>

            {/* Team Info Card */}
            <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-500" />
              <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-5 border-b border-navy-light/50 pb-4 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <Info className="w-4 h-4 text-indigo-400" />
                </div>
                Thông tin chung
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="skeleton h-4 w-24 rounded" />
                      <div className="skeleton h-5 w-28 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 relative z-10">
                  {[
                    { label: 'Đội trưởng', value: activeTeam?.captain },
                    { label: 'SĐT liên hệ', value: activeTeam?.phone },
                    {
                      label: 'Màu áo',
                      value: (
                        <div className="flex items-center gap-2 bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light">
                          <div className="w-4 h-4 rounded-full border-2 border-white/20 shadow-sm shrink-0" style={{ backgroundColor: activeTeam?.colorHex }} />
                          <span className="font-bold text-white text-sm truncate max-w-[90px]">{activeTeam?.primaryColor}</span>
                        </div>
                      ),
                    },
                    { label: 'Ngày đăng ký', value: activeTeam?.registeredAt },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-navy-light/30 last:border-0 last:pb-0 gap-3">
                      <span className="text-gray-400 text-sm font-medium shrink-0">{item.label}</span>
                      {typeof item.value === 'string' ? (
                        <span className="text-white font-bold text-sm bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light truncate max-w-[140px]">{item.value}</span>
                      ) : item.value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Trophy className="w-28 h-28 text-neon" />
              </div>
              <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-5 relative z-10 border-b border-navy-light/50 pb-4">
                <div className="p-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                </div>
                Thống kê đội
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {(() => {
                    const byPos = players.reduce((acc, p) => {
                      const pos = normalizePosition(p.position);
                      acc[pos] = (acc[pos] || 0) + 1;
                      return acc;
                    }, {});
                    const totalGoals = players.reduce((s, p) => s + (p.goals || 0), 0);
                    return [
                      { label: 'Cầu thủ', value: players.length, color: 'text-white', bg: 'bg-navy-dark border-navy-light' },
                      { label: 'Bàn thắng', value: totalGoals, color: 'text-neon', bg: 'bg-neon/5 border-neon/20' },
                      { label: 'Thủ môn', value: byPos['GK'] || 0, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
                      { label: 'Hậu vệ', value: byPos['DEF'] || 0, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
                      { label: 'Tiền vệ', value: byPos['MID'] || 0, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
                      { label: 'Tiền đạo', value: byPos['FW'] || 0, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
                    ].map((stat, idx) => (
                      <div
                        key={stat.label}
                        className={`${stat.bg} p-4 rounded-2xl border text-center animate-slide-up hover:-translate-y-1 transition-transform duration-300`}
                        style={{ animationDelay: `${200 + idx * 50}ms` }}
                      >
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{stat.label}</p>
                        <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {playerModal && (
        <PlayerFormModal
          mode={playerModal}
          form={playerForm}
          setForm={setPlayerForm}
          formError={modalError}
          isSaving={isSaving}
          onSave={handlePlayerModalSave}
          onClose={() => { setPlayerModal(null); setModalError(''); }}
          onImportExcel={handleImportExcel}
          onDownloadTemplate={handleDownloadTemplate}
          isDownloadingTemplate={isDownloadingTemplate}
        />
      )}

      {deletingPlayer && (
        <PlayerDeleteModal
          playerName={deletingPlayer.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPlayer(null)}
          isDeleting={isDeleting}
        />
      )}

      {showPayment && (
        <TeamPaymentModal
          teamName={activeTeam?.name}
          seasonTeamId={activeTeam?.activeSeasonTeamId}
          onClose={() => setShowPayment(false)}
        />
      )}

      {editTeamModalOpen && (
        <EditTeamModal
          team={activeTeam}
          onSave={handleEditTeamSave}
          onClose={() => { setEditTeamModalOpen(false); setModalError(''); }}
          isSaving={isSaving}
          error={modalError}
          onDelete={handleDeleteTeam}
        />
      )}

      {lineupModalMatch && activeTeam && (
        <LineupBuilderModal
          match={lineupModalMatch}
          teamId={activeTeam.id}
          roster={players}
          onClose={() => setLineupModalMatch(null)}
        />
      )}
    </div>
  );
}