import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Trophy, Info, Settings, Trash2, Edit,
  ShieldOff, ArrowRight, X, Loader2, AlertTriangle,
  CheckCircle2, Search, ArrowUpDown, CreditCard, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import { teamApi, playerApi, userApi, seasonApi, matchApi, seasonTeamApi, jerseyApi } from '../api';

import PlayerRowSkeleton from '../components/skeletons/PlayerRowSkeleton';
import Pagination from '../components/ui/Pagination';
import { useShallow } from 'zustand/react/shallow';
import LineupBuilderModal from '../components/modals/LineupBuilderModal';
import EditTeamModal from '../components/modals/EditTeamModal';
import PlayerFormModal from '../components/modals/PlayerFormModal'; // Doc 2 — react-hook-form based
import { AVATAR_COLORS, getInitials, POSITION_LABELS } from '../utils/constants';

const normalizePosition = (posStr) => {
  if (!posStr) return 'OTHER';
  const p = posStr.toUpperCase().trim();
  if (p === 'GOALKEEPER' || p.includes('GK')) return 'GK';
  if (p === 'DEFENDER' || p.includes('DEF')) return 'DEF';
  if (p === 'MIDFIELDER' || p.includes('MID')) return 'MID';
  if (p === 'FORWARD' || p.includes('FW')) return 'FW';
  return p;
};

const extractFilename = (contentDisposition, fallback) => {
  if (!contentDisposition) return fallback;
  const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)"?/i);
  return match ? decodeURIComponent(match[1]) : fallback;
};

// ─── Empty State ──────────────────────────────────────────
function NoTeamState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8 animate-fade-in">
      <div className="w-32 h-32 rounded-4xl bg-navy-light/30 border-2 border-dashed border-navy-light flex items-center justify-center relative group shadow-[0_0_50px_rgba(30,58,138,0.2)]">
        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-4xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
        <ShieldOff className="w-14 h-14 text-gray-400 group-hover:scale-110 group-hover:text-blue-400 transition-all duration-500 relative z-10" />
      </div>
      <div className="text-center space-y-3">
        <h3 className="text-3xl font-black text-white tracking-tight">Bạn chưa có đội bóng</h3>
        <p className="text-gray-400 text-base max-w-sm mx-auto leading-relaxed">
          Hãy đăng ký đội bóng để tham gia giải đấu và quản lý đội hình của bạn ngay hôm nay.
        </p>
      </div>
      <Link
        to="/dang-ky-doi-bong"
        className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-neon to-emerald-400 text-navy-dark font-black rounded-2xl shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_50px_rgba(57,255,20,0.5)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-sm"
      >
        <UserPlus className="w-5 h-5" /> Đăng Ký Đội Bóng
        <ArrowRight className="w-5 h-5" />
      </Link>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────
function ConfirmDeleteModal({ playerName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-navy-dark/90 backdrop-blur-xl border border-red-500/30 rounded-4xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 animate-scale-in">
        <div className="absolute inset-0 bg-linear-to-b from-red-500/5 to-transparent rounded-4xl pointer-events-none"></div>
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h4 className="text-2xl font-black text-white tracking-tight">Xóa cầu thủ?</h4>
          <p className="text-gray-400 leading-relaxed text-sm">
            Xóa <strong className="text-red-400 font-bold">{playerName}</strong> khỏi đội? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-4">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold bg-navy-light/50 text-gray-300 border border-navy-light hover:bg-navy-light hover:text-white transition-all duration-300">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3.5 rounded-xl font-bold bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Position Badge ───────────────────────────────────────
function PosBadge({ pos }) {
  const normPos = normalizePosition(pos);
  const styles = {
    GK: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_10px_rgba(250,204,21,0.1)]',
    DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30 shadow-[0_0_10px_rgba(96,165,250,0.1)]',
    MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30 shadow-[0_0_10px_rgba(52,211,153,0.1)]',
    FW: 'bg-red-400/10 text-red-400 border-red-400/30 shadow-[0_0_10px_rgba(248,113,113,0.1)]',
  };
  return (
    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${styles[normPos] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
      {POSITION_LABELS[normPos] || normPos}
    </span>
  );
}

// ─── Payment Modal ───────────────────────────────
function PaymentModal({ teamName, onClose }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-lg animate-scale-in flex flex-col overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light bg-navy/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Thanh toán Lệ phí</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 space-y-8 overflow-y-auto relative z-10 custom-scrollbar max-h-[70vh]">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0 mt-0.5">
              <Info className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-sm">
              <p className="text-emerald-400 font-black mb-1.5 text-base tracking-tight">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-emerald-500/80 font-medium leading-relaxed">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black">Chuyển khoản</p>
                <p className="text-[11px] text-gray-400 font-medium">Quét mã qua ứng dụng ngân hàng</p>
              </div>
              <div className="mt-2 text-xs font-mono font-bold bg-navy-dark px-4 py-3 rounded-xl border border-navy-light text-neon w-full flex items-center justify-center gap-2">
                <span className="text-gray-500">ND:</span> {teamName} LE PHI
              </div>
            </div>
            <div className="border border-navy-light bg-navy/50 rounded-4xl p-6 text-center flex flex-col items-center justify-center gap-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 group">
              <div className="w-16 h-16 bg-navy rounded-2xl border border-navy-light flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-500/50">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black">Trực tiếp</p>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Gặp BTC tại Văn phòng Khoa CNTT (E3.1)</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 font-medium px-4">
            * Sau khi thanh toán, vui lòng liên hệ Admin qua Fanpage để được xác nhận trạng thái.
          </p>
        </div>
        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end relative z-10">
          <button onClick={onClose} className="px-8 py-3.5 font-bold bg-navy-light text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 shadow-lg">
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function MyTeam() {
  const { user } = useAuthStore(useShallow(state => ({ user: state.user })));
  const toast = useToastStore();

  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const [activeTab, setActiveTab] = useState('roster');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('number');
  const [showPayment, setShowPayment] = useState(false);

  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const [lineupModalMatch, setLineupModalMatch] = useState(null);
  const [playerModal, setPlayerModal] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const parseSingle = (res) => {
    const payload = (typeof res?.status === 'boolean') ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data[0] : (payload?.data ?? payload);
  };

  const parseList = (res) => {
    const payload = (typeof res?.status === 'boolean') ? res.data : res;
    return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  };

  // tp.player.user.name — join path thật theo PlayerDto.user shape.
  // goals: KHÔNG có field backing trong PlayerDto/TeamPlayerDto — fallback 0,
  // giữ lại UI hiển thị nhưng KHÔNG persist được (chưa có endpoint) — đã flag turn trước.
  const normalizePlayer = (tp) => ({
    id: tp.id,
    player_id: tp.player_id ?? tp.player?.id,
    name: tp.player?.user?.name ?? `Cầu thủ #${tp.id}`,
    email: tp.player?.user?.email ?? null,
    number: tp.jersey_number ?? 0,
    position: tp.position ?? 'midfielder',
    goals: 0,
    status: tp.status ?? 'active',
    approval_status: tp.approval_status ?? 'approved',
    role: tp.role ?? 'player',
    avatar: tp.player?.avatar ?? null,
  });

  const loadTeamData = useCallback(async () => {
    if (!user?.id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const teamsRes = await teamApi.getTeams({ per_page: 10 });
      const allTeams = parseList(teamsRes);
      const myTeam = allTeams.find(t => t.user_id === user.id) ?? allTeams[0] ?? null;

      if (!myTeam) {
        setTeam(null);
        setPlayers([]);
        setIsLoading(false);
        return;
      }

      setTeam({
        id: myTeam.id,
        name: myTeam.name,
        emoji: '🛡️',
        status: myTeam.is_active ? 'approved' : 'pending',
        registrationStatus: null,
        activeSeasonId: null,
        captain: myTeam.coach_name ?? '—',
        phone: myTeam.phone ?? '—',
        primaryColor: myTeam.primary_color ?? '—',
        colorHex: myTeam.color_hex ?? '#334155',
        registeredAt: myTeam.created_at
          ? new Date(myTeam.created_at).toLocaleDateString('vi-VN')
          : '—',
        season: '2026',
        description: myTeam.description,
        logo: myTeam.logo,
      });

      const playersRes = await teamApi.getPlayers(myTeam.id, { per_page: 50 });
      const rawPlayers = parseList(playersRes);
      setPlayers(rawPlayers.map(normalizePlayer));

      try {
        const seasonsRes = await seasonApi.getAll();
        const allSeasons = parseList(seasonsRes);
        const activeSeason = allSeasons.find(s => ['registration_open', 'ongoing', 'upcoming'].includes(s.status)) || allSeasons[0];

        if (activeSeason) {
          const stRes = await seasonTeamApi.getAll({ team_id: myTeam.id, season_id: activeSeason.id });
          const stData = stRes?.data?.data || stRes?.data || [];
          const currentSt = stData[0];

          let homeJersey = null;
          if (currentSt) {
            try {
              const jRes = await jerseyApi.getBySeasonTeam(currentSt.id);
              const jerseys = Array.isArray(jRes?.data?.data) ? jRes.data.data : Array.isArray(jRes?.data) ? jRes.data : Array.isArray(jRes) ? jRes : [];
              homeJersey = jerseys.find(j => j.type === 'home');
            } catch (err) {
              console.warn('Không thể lấy thông tin áo đấu:', err);
            }
          }

          setTeam(prev => ({
            ...prev,
            season: activeSeason.name,
            activeSeasonId: activeSeason.id,
            activeSeasonTeamId: currentSt ? currentSt.id : null,
            registrationStatus: currentSt ? currentSt.status : null,
            primaryColor: homeJersey?.secondary_color || prev.primaryColor,
            colorHex: homeJersey?.primary_color || prev.colorHex,
          }));

          if (currentSt && ['approved', 'active'].includes(currentSt.status)) {
            const scheduleRes = await matchApi.getTeamSchedule(activeSeason.id, myTeam.id);
            setMatches(parseList(scheduleRes));
          }
        }
      } catch (seasonErr) {
        console.warn('Cannot fetch season or schedule for team:', seasonErr);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể tải dữ liệu đội bóng.');
      setTeam(null);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { loadTeamData(); }, [loadTeamData]);

  const displayed = players
    .filter(p =>
      (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.number).includes(search)
    )
    .sort((a, b) => {
      if (sortField === 'number') return (a.number ?? 0) - (b.number ?? 0);
      if (sortField === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const [prevFilterState, setPrevFilterState] = useState({ search, sortField });
  if (prevFilterState.search !== search || prevFilterState.sortField !== sortField) {
    setPrevFilterState({ search, sortField });
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(displayed.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlayers = displayed.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleEditTeamSave = async (form) => {
    setIsSaving(true);
    try {
      await teamApi.update(team.id, form);
      if (team.activeSeasonTeamId && form.color_hex) {
        try {
          await jerseyApi.upsert(team.activeSeasonTeamId, { type: 'home', primary_color: form.color_hex });
        } catch (e) {
          console.warn('Could not update jersey color:', e);
        }
      }
      toast.success('Đã cập nhật thông tin đội bóng thành công!');
      setEditTeamModalOpen(false);
      await loadTeamData();
    } catch (apiErr) {
      setModalError(apiErr?.response?.data?.message || 'Lỗi khi cập nhật thông tin đội.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    setIsSaving(true);
    try {
      await teamApi.delete(teamId);
      toast.success('Đã giải tán đội bóng thành công!');
      setEditTeamModalOpen(false);
      await loadTeamData();
    } catch (apiErr) {
      setModalError(apiErr?.response?.data?.message || 'Lỗi khi xóa đội bóng.');
    } finally {
      setIsSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingPlayer(null);
    setModalError('');
    setPlayerModal('add');
  };

  // values: { user_email, date_of_birth, position, number } — shape từ PlayerFormModal (doc 2)
  const handleAddSave = async (values) => {
    setIsSaving(true);
    setModalError('');
    try {
      const lookupRes = await userApi.lookupByEmail(values.user_email.trim());
      const foundUser = parseSingle(lookupRes);
      if (!foundUser) { setModalError('Không tìm thấy tài khoản với email này.'); return; }

      const createRes = await playerApi.create({
        user_id: foundUser.id,
        date_of_birth: values.date_of_birth,
        position: values.position,
      });
      const newPlayer = parseSingle(createRes);

      await playerApi.addToTeam(team.id, {
        player_id: newPlayer.id,
        jersey_number: parseInt(values.number, 10),
        position: values.position,
        role: 'player',
      });

      toast.success(`Đã thêm "${foundUser.name}" (áo số ${values.number}) vào đội!`);
      setPlayerModal(null);
      await loadTeamData();
    } catch (apiErr) {
      // 404 từ lookup, 409 nếu Player user_id đã tồn tại (chưa dedupe ở BE — xem note trước),
      // hoặc 422 nếu jersey_number trùng (BE chưa confirm có check trùng số áo không)
      setModalError(apiErr?.response?.data?.message || 'Lỗi khi thêm cầu thủ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      setIsSaving(true);
      await playerApi.importTeamPlayers(team.id, formData);
      toast.success('Nhập dữ liệu từ file Excel thành công!');
      await loadTeamData();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Có lỗi xảy ra khi nhập dữ liệu từ file Excel.');
    } finally {
      setIsSaving(false);
      e.target.value = null;
    }
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
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Không thể tải file mẫu Excel.');
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const openEditModal = (player) => {
    setEditingPlayer(player);
    setModalError('');
    setPlayerModal('edit');
  };

  // values: { number, position } — mode edit của PlayerFormModal không có name/email
  const handleEditSave = async (values) => {
    setIsSaving(true);
    setModalError('');
    try {
      await playerApi.updateTeamPlayer(team.id, editingPlayer.id, {
        jersey_number: parseInt(values.number, 10),
        position: values.position,
      });
      toast.success('Đã cập nhật thông tin cầu thủ.');
      setPlayerModal(null);
      await loadTeamData();
    } catch (apiErr) {
      setModalError(apiErr?.response?.data?.message || 'Lỗi khi cập nhật cầu thủ.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await playerApi.bulkRemoveFromTeam(team.id, { ids: [deletingPlayer.id] });
      toast.success(`Đã xóa cầu thủ "${deletingPlayer.name}" khỏi đội.`);
      setDeletingPlayer(null);
      await loadTeamData();
    } catch (apiErr) {
      toast.error(apiErr?.response?.data?.message || 'Lỗi khi xóa cầu thủ.');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSort = (field) => setSortField(field);

  if (!isLoading && !team) {
    return (
      <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <NoTeamState />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl animate-fade-in relative z-10">

        {!isLoading && team.status === 'pending' && (
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

        {!isLoading && team.status === 'approved' && team.registrationStatus === 'pending' && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-slide-up shadow-[0_0_30px_rgba(245,158,11,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-amber-500/20 rounded-xl shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-amber-400 font-black text-lg mb-1 tracking-tight">Chờ duyệt tham gia giải</p>
                <p className="text-amber-500/80 font-medium">Yêu cầu tham gia giải {team.season} đang chờ Admin xác nhận.</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && team.status === 'approved' && !team.registrationStatus && team.activeSeasonId && (
          <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-slide-up shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-blue-500/20 rounded-xl shrink-0">
                <Info className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-400 font-black text-lg mb-1 tracking-tight">Giải đấu đang mở đăng ký</p>
                <p className="text-blue-500/80 font-medium">Đội bóng của bạn chưa đăng ký tham gia giải {team.season}.</p>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await seasonTeamApi.register({ season_id: team.activeSeasonId });
                  toast.success('Đã gửi yêu cầu tham gia giải!');
                  loadTeamData();
                } catch (err) {
                  toast.error(err?.response?.data?.message || 'Không thể đăng ký tham gia giải.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="px-6 py-3.5 shrink-0 bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" /> Đăng ký ngay
            </button>
          </div>
        )}

        {!isLoading && team.status === 'approved' && ['approved', 'active'].includes(team.registrationStatus) && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-slide-up shadow-[0_0_30px_rgba(16,185,129,0.1)]">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-emerald-400 font-black text-lg mb-1 tracking-tight">Đăng ký thành công!</p>
                <p className="text-emerald-500/80 font-medium">Đội bóng đã được duyệt tham gia {team.season}. Hãy thanh toán lệ phí để bốc thăm chia bảng.</p>
              </div>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="px-6 py-3.5 shrink-0 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm hover:-translate-y-0.5"
            >
              <CreditCard className="w-5 h-5" /> Thanh toán
            </button>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up relative">
          <div className="flex items-center gap-6">
            {isLoading ? (
              <>
                <div className="skeleton w-24 h-24 rounded-3xl" />
                <div className="space-y-3">
                  <div className="skeleton h-10 w-48 rounded-xl" />
                  <div className="skeleton h-5 w-64 rounded-lg" />
                </div>
              </>
            ) : (
              <>
                <div className="w-24 h-24 bg-navy-dark/80 backdrop-blur-md border-[3px] border-neon/50 rounded-3xl flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(57,255,20,0.2)] animate-fade-in relative group overflow-hidden">
                  <div className="absolute inset-0 bg-neon/10 group-hover:bg-neon/20 transition-colors duration-300"></div>
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{team.emoji}</span>
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-3 mb-2">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon uppercase tracking-tight">{team.name}</h1>
                    {team.status === 'approved' && (
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                        Chờ Thanh Toán
                      </span>
                    )}
                    {team.status === 'pending' && (
                      <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                        Chờ Duyệt
                      </span>
                    )}
                  </div>
                  <p className="text-blue-400/80 font-bold tracking-wide">Khoa Công nghệ thông tin <span className="text-gray-600 mx-2">•</span> Mùa giải {team.season}</p>
                </div>
              </>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <button
                onClick={() => setEditTeamModalOpen(true)}
                className="bg-navy/60 backdrop-blur-xl text-white font-bold px-5 py-3.5 rounded-2xl hover:bg-navy transition-colors flex items-center gap-2 border border-navy-light text-sm shadow-lg hover:-translate-y-0.5"
              >
                <Settings className="w-5 h-5" /> Cài đặt đội
              </button>
              <button
                onClick={openAddModal}
                disabled={players.length >= 20}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white font-black px-5 py-3.5 rounded-2xl hover:from-blue-400 hover:to-indigo-500 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5" /> Thêm cầu thủ
              </button>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="flex items-center gap-4 border-b border-navy-light mb-8 animate-fade-in">
            <button
              onClick={() => setActiveTab('roster')}
              className={`pb-4 px-2 font-black uppercase tracking-wider text-sm border-b-2 transition-all ${activeTab === 'roster' ? 'border-neon text-neon' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Đội hình ({players.length})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`pb-4 px-2 font-black uppercase tracking-wider text-sm border-b-2 transition-all ${activeTab === 'matches' ? 'border-neon text-neon' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
            >
              Lịch thi đấu & Ra sân
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>

            {activeTab === 'matches' && (
              <div className="space-y-4">
                {matches.length === 0 ? (
                  <div className="text-center py-16 bg-navy/30 border border-dashed border-navy-light rounded-3xl">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Chưa có lịch thi đấu nào trong mùa giải này.</p>
                  </div>
                ) : (
                  matches.map((match) => (
                    <div key={match.id} className="bg-navy/50 border border-navy-light rounded-3xl p-5 hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${match.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : match.status === 'ongoing' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-gray-500/10 text-gray-400 border border-gray-500/30'}`}>
                            {match.status}
                          </span>
                          <span className="text-sm font-medium text-gray-400">
                            {new Date(match.start_time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                        <p className="text-lg font-black text-white">
                          {match.home_team?.name || 'Đội nhà'} <span className="text-gray-500 font-medium mx-2">vs</span> {match.away_team?.name || 'Đội khách'}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Sân: {match.venue?.name || 'Chưa xếp sân'}</p>
                      </div>
                      <div className="shrink-0">
                        {match.status === 'scheduled' || match.status === 'ongoing' ? (
                          <button
                            onClick={() => setLineupModalMatch(match)}
                            className="w-full md:w-auto px-6 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                          >
                            Xếp Đội Hình
                          </button>
                        ) : (
                          <button disabled className="w-full md:w-auto px-6 py-3 bg-gray-500/10 text-gray-500 border border-gray-500/30 rounded-xl font-black uppercase tracking-widest text-xs">
                            Đã kết thúc
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'roster' && (
              <>
                {!isLoading && (
                  <div className="flex gap-4 items-center animate-fade-in bg-navy/40 backdrop-blur-md p-2 rounded-2xl border border-navy-light">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số áo..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all"
                      />
                    </div>
                    <div className="relative">
                      <select
                        value={sortField}
                        onChange={e => toggleSort(e.target.value)}
                        className="pl-4 pr-10 py-3 bg-navy-dark border border-navy-light rounded-xl text-white text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shrink-0 appearance-none cursor-pointer transition-all"
                      >
                        <option value="number">Sắp xếp: Số áo</option>
                        <option value="name">Sắp xếp: Tên</option>
                      </select>
                      <ArrowUpDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                )}

                <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 overflow-hidden">
                  <div className="px-8 py-6 border-b border-navy-light/50 flex items-center justify-between bg-navy-dark/40">
                    <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                      <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      Danh Sách Cầu Thủ
                    </h2>
                    {!isLoading && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-blue-400 bg-navy-dark px-4 py-1.5 rounded-xl border border-navy-light shadow-inner">
                          {players.length} / 20
                        </span>
                        {players.length >= 20 && (
                          <span className="text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                            Đủ quân số
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead>
                        <tr className="bg-navy-dark/60 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-navy-light/50">
                          <th className="py-4 px-6 w-20 text-center">
                            <button onClick={() => toggleSort('number')} className="flex items-center justify-center gap-1.5 w-full hover:text-white transition-colors group">
                              Số <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          </th>
                          <th className="py-4 px-6">
                            <button onClick={() => toggleSort('name')} className="flex items-center gap-1.5 hover:text-white transition-colors group">
                              Cầu thủ <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                          </th>
                          <th className="py-4 px-6 text-center">Vị trí</th>
                          <th className="py-4 px-6 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-light/50">
                        {isLoading ? (
                          <>
                            <PlayerRowSkeleton />
                            <PlayerRowSkeleton />
                            <PlayerRowSkeleton />
                            <PlayerRowSkeleton />
                            <PlayerRowSkeleton />
                          </>
                        ) : paginatedPlayers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-20 text-center text-gray-500">
                              <Search className="w-12 h-12 mx-auto mb-4 text-navy-light opacity-50" />
                              <p className="font-bold text-gray-400 text-lg">Không tìm thấy cầu thủ</p>
                              <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm</p>
                            </td>
                          </tr>
                        ) : (
                          paginatedPlayers.map((player, idx) => (
                            <tr
                              key={player.id}
                              className="hover:bg-navy-light/20 transition-all duration-300 group animate-fade-in"
                              style={{ animationDelay: `${idx * 40}ms` }}
                            >
                              <td className="py-5 px-6 text-center">
                                <span className="font-black text-2xl text-transparent bg-clip-text bg-linear-to-b from-white to-gray-500">{player.number}</span>
                              </td>
                              <td className="py-5 px-6">
                                <div className="flex items-center gap-4">
                                  <div className="relative">
                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    {player.avatar ? (
                                      <img
                                        src={player.avatar}
                                        alt={player.name}
                                        className="w-12 h-12 rounded-full bg-navy-dark border-2 border-navy-light shrink-0 relative z-10 object-cover"
                                      />
                                    ) : (
                                      <div className={`w-12 h-12 rounded-full bg-linear-to-br ${AVATAR_COLORS[(player.id || idx) % AVATAR_COLORS.length]} border-2 border-navy-light flex items-center justify-center font-black text-white text-sm relative z-10`}>
                                        {getInitials(player.name)}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{player.name}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-0.5">MSSV: <span className="text-gray-400">{String(player.id).padStart(8, '0')}</span></p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 px-6 text-center">
                                <PosBadge pos={player.position} />
                              </td>
                              <td className="py-5 px-6">
                                <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 sm:group-hover:translate-x-0">
                                  <button
                                    onClick={() => openEditModal(player)}
                                    className="w-10 h-10 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-sm"
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingPlayer(player)}
                                    className="w-10 h-10 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 shadow-sm"
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
                    <div className="px-8 py-4 bg-navy-dark/40 border-t border-navy-light/50 text-xs font-bold text-gray-500 flex items-center justify-between uppercase tracking-wider">
                      <span>Hiển thị <span className="text-white">{displayed.length}</span> / {players.length} cầu thủ</span>
                      {search && (
                        <button onClick={() => setSearch('')} className="text-blue-400 hover:text-blue-300 transition-colors">
                          Xóa bộ lọc
                        </button>
                      )}
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

          <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '150ms' }}>
            <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
              <h3 className="text-lg font-black text-white flex items-center gap-3 mb-6 border-b border-navy-light/50 pb-5 relative z-10">
                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <Info className="w-5 h-5 text-indigo-400" />
                </div>
                Thông tin chung
              </h3>
              {isLoading ? (
                <div className="space-y-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="skeleton h-4 w-24 rounded" />
                      <div className="skeleton h-5 w-32 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Đội trưởng', value: team.captain },
                    { label: 'SĐT liên hệ', value: team.phone },
                    {
                      label: 'Màu áo',
                      value: (
                        <div className="flex items-center gap-2.5 bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light">
                          <div className="w-4 h-4 rounded-full border-2 border-white/20 shadow-sm" style={{ backgroundColor: team.colorHex }} />
                          <span className="font-bold text-white">{team.primaryColor}</span>
                        </div>
                      )
                    },
                    { label: 'Ngày đăng ký', value: team.registeredAt },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-navy-light/30 last:border-0 last:pb-0 group/item">
                      <span className="text-gray-400 text-sm font-medium group-hover/item:text-gray-300 transition-colors">{item.label}</span>
                      {typeof item.value === 'string' ? (
                        <span className="text-white font-bold text-sm bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light">{item.value}</span>
                      ) : (
                        item.value
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                <Trophy className="w-32 h-32 text-neon" />
              </div>
              <h3 className="text-lg font-black text-white flex items-center gap-3 mb-6 relative z-10 border-b border-navy-light/50 pb-5">
                <div className="p-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                </div>
                Thống kê giải đấu
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                  {(() => {
                    const totalByPosition = players.reduce((acc, p) => {
                      const pos = normalizePosition(p.position);
                      acc[pos] = (acc[pos] || 0) + 1;
                      return acc;
                    }, {});
                    return [
                      { label: 'Cầu thủ', value: players.length, color: 'text-white', bg: 'bg-navy-dark border-navy-light' },
                      { label: 'Đã duyệt', value: players.filter(p => p.approval_status === 'approved').length, color: 'text-emerald-400', bg: 'bg-emerald-500/5 border-emerald-500/20' },
                      { label: 'Chờ duyệt', value: players.filter(p => p.approval_status === 'pending').length, color: 'text-amber-400', bg: 'bg-amber-400/5 border-amber-400/20' },
                      { label: 'Thủ môn', value: totalByPosition['GK'] || 0, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30' },
                      { label: 'Hậu vệ', value: totalByPosition['DEF'] || 0, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
                      { label: 'Tiền vệ', value: totalByPosition['MID'] || 0, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30' },
                      { label: 'Tiền đạo', value: totalByPosition['FW'] || 0, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
                    ].map((stat, idx) => (
                      <div
                        key={stat.label}
                        className={`${stat.bg || 'bg-navy-dark'} p-5 rounded-2xl border text-center animate-slide-up hover:-translate-y-1 transition-transform duration-300`}
                        style={{ animationDelay: `${200 + idx * 50}ms` }}
                      >
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
                        <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
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
          player={editingPlayer}
          usedNumbers={players}
          onSubmitAdd={handleAddSave}
          onSubmitEdit={handleEditSave}
          onClose={() => { setPlayerModal(null); setModalError(''); }}
          isSaving={isSaving}
          serverError={modalError}
          onImportExcel={handleImportExcel}
          onDownloadTemplate={handleDownloadTemplate}
          isDownloadingTemplate={isDownloadingTemplate}
        />
      )}

      {deletingPlayer && (
        <ConfirmDeleteModal
          playerName={deletingPlayer.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPlayer(null)}
          isDeleting={isDeleting}
        />
      )}

      {showPayment && (
        <PaymentModal
          teamName={team?.name}
          onClose={() => setShowPayment(false)}
        />
      )}

      {editTeamModalOpen && (
        <EditTeamModal
          team={team}
          onSave={handleEditTeamSave}
          onClose={() => setEditTeamModalOpen(false)}
          isSaving={isSaving}
          error={modalError}
          onDelete={handleDeleteTeam}
        />
      )}

      {lineupModalMatch && (
        <LineupBuilderModal
          match={lineupModalMatch}
          teamId={team.id}
          roster={players}
          onClose={() => setLineupModalMatch(null)}
        />
      )}
    </div>
  );
}