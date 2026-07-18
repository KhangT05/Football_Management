import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Users, UserPlus, Trophy, Info, Settings, Trash2, Edit,
  AlertTriangle, CheckCircle2, Loader2, X,
  Search, ArrowUpDown, CreditCard, Calendar,
  DollarSign, Flame, Award, Ban, Activity,
  ChevronDown, Plus, Star,
} from 'lucide-react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';
import useTeamUiStore from '../store/teamUiStore';
import { useShallow } from 'zustand/react/shallow';
import { matchApi } from '../api';
import PlayerRowSkeleton from '../components/skeletons/PlayerRowSkeleton';
import Pagination from '../components/ui/Pagination';
import LineupBuilderModal from '../components/modals/LineupBuilderModal';
import EditTeamModal from '../components/myteam/EditTeamModal';
import NoTeamState from '../components/myteam/NoTeamState';
import PlayerDeleteModal from '../components/myteam/PlayerDeleteModal';
import PlayerFormModal from '../components/admin/PlayerFormModal';
import PosBadge from '../components/myteam/PosBadge';
import TeamPaymentModal from '../components/myteam/TeamPaymentModal';
import TransactionsTab from '../components/myteam/TransactionsTab';
import { AVATAR_COLORS, getInitials } from '../utils/constants';
import { parseApiError } from '../utils/errorHelper';
import { extractFilename, downloadBlob } from '../utils/teamHelpers';
import { MATCH_STATUS_CLASS, MATCH_STATUS_LABEL } from '../data/data';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  useMyTeams, useTeamDetail, useTeamPlayers, useTeamMatches, useSeasonEligibility,
  useTeamStats, usePlayersPerformance,
  useRegisterSeasonMutation, useUpdatePlayerPositionMutation,
  useAddPlayerMutation, useEditPlayerMutation, useDeletePlayerMutation,
  useImportExcelMutation, useUpdateTeamMutation, useDeleteTeamMutation,
} from '../queries/useMyTeamQueries';
import SeasonRegistrationModal from '../components/myteam/SeasonRegistrationModal';
// ─── Constants & format helpers ─────────────────────────────

const normalizePosition = (posStr) => {
  if (!posStr) return 'OTHER';
  const p = posStr.toUpperCase().trim();
  if (p === 'GOALKEEPER' || p.includes('GK') || p.includes('THỦ MÔN')) return 'GK';
  if (p === 'DEFENDER' || p.includes('DEF') || p === 'DF' || p.includes('HẬU VỆ')) return 'DEF';
  if (p === 'MIDFIELDER' || p.includes('MID') || p === 'MF' || p.includes('TIỀN VỆ')) return 'MID';
  if (p === 'FORWARD' || p.includes('FW') || p === 'FWD' || p.includes('TIỀN ĐẠO')) return 'FW';
  return p;
};

const formatMatchTime = (dateStr) => {
  if (!dateStr) return 'Chưa xếp lịch';
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 'Chưa xếp lịch' : d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
};

const formatCurrencyVN = (val) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

const GRANULARITY_OPTIONS = [
  { value: 'day', label: 'Ngày' },
  { value: 'month', label: 'Tháng' },
  { value: 'year', label: 'Năm' },
];

// ── Sơ đồ đội hình ───────────────────────────────────────────
function RosterPitchDot({ player, kit, onClick }) {
  const isCap = player.role === 'captain';
  const isVice = player.role === 'vice_captain';
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${player.name} — bấm để xem/sửa`}
      className="flex flex-col items-center gap-1.5 w-[64px] sm:w-[88px] shrink-0 group cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('app/player-id', String(player.id))}
    >
      <div className="relative">
        {player.avatar ? (
          <img src={player.avatar} alt={player.name}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 shadow-md shadow-black/40 transition-transform group-hover:scale-110"
            style={{ borderColor: kit.border }} />
        ) : (
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center font-black text-[10px] sm:text-sm shadow-md shadow-black/40 transition-transform group-hover:scale-110"
            style={{ backgroundColor: kit.bg, color: kit.text, borderColor: kit.border }}>
            {player.number || '?'}
          </div>
        )}
        {isCap && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center bg-amber-500 text-white text-[8px] sm:text-[10px] font-black rounded-full border-2 border-black/20">C</span>}
        {isVice && !isCap && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center bg-blue-500 text-white text-[8px] sm:text-[10px] font-black rounded-full border-2 border-black/20">P</span>}
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold text-white! text-center leading-tight px-1 sm:px-1.5 py-1 rounded-md bg-black/30 backdrop-blur-md border border-white/10 shadow-sm w-full wrap-break-word"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
        {player.name}
      </span>
    </button>
  );
}

function RosterPitch({ players, kit, onSelectPlayer, onDropPlayer }) {
  const [pitchSize, setPitchSize] = useState('7');
  const [dragOverRow, setDragOverRow] = useState(null);

  const handleDragOver = (rowKey) => (e) => {
    if (e.dataTransfer.types.includes('app/player-id')) { e.preventDefault(); setDragOverRow(rowKey); }
  };
  const handleDragLeave = (rowKey) => (e) => { e.preventDefault(); if (dragOverRow === rowKey) setDragOverRow(null); };
  const handleDrop = (rowKey) => (e) => {
    e.preventDefault(); setDragOverRow(null);
    const playerId = e.dataTransfer.getData('app/player-id');
    if (playerId && onDropPlayer) {
      let mappedPos = rowKey;
      if (rowKey === 'FW') mappedPos = 'forward';
      else if (rowKey === 'MID') mappedPos = 'midfielder';
      else if (rowKey === 'DEF') mappedPos = 'defender';
      else if (rowKey === 'GK') mappedPos = 'goalkeeper';
      onDropPlayer(Number(playerId), mappedPos);
    }
  };

  const gks = players.filter(p => normalizePosition(p.position) === 'GK');
  const defs = players.filter(p => normalizePosition(p.position) === 'DEF');
  const mids = players.filter(p => normalizePosition(p.position) === 'MID');
  const fws = players.filter(p => normalizePosition(p.position) === 'FW');

  let layout = [];
  if (pitchSize === '11') layout = [{ pos: 'FW', count: 3 }, { pos: 'MID', count: 3 }, { pos: 'DEF', count: 4 }, { pos: 'GK', count: 1 }];
  else if (pitchSize === '7') layout = [{ pos: 'FW', count: 1 }, { pos: 'MID', count: 2 }, { pos: 'DEF', count: 3 }, { pos: 'GK', count: 1 }];
  else layout = [{ pos: 'FW', count: 1 }, { pos: 'MID', count: 1 }, { pos: 'DEF', count: 2 }, { pos: 'GK', count: 1 }];

  const usedIds = new Set();
  const getPlayersForSlot = (posType, count) => {
    let pool = [];
    if (posType === 'FW') pool = [...fws, ...mids, ...defs, ...gks];
    else if (posType === 'MID') pool = [...mids, ...fws, ...defs, ...gks];
    else if (posType === 'DEF') pool = [...defs, ...mids, ...fws, ...gks];
    else if (posType === 'GK') pool = [...gks, ...defs, ...mids, ...fws];
    const selected = [];
    for (const p of pool) { if (!usedIds.has(p.id) && selected.length < count) { selected.push(p); usedIds.add(p.id); } }
    while (selected.length < count) selected.push(null);
    return selected;
  };
  const rowsData = layout.map(row => ({ ...row, players: getPlayersForSlot(row.pos, row.count) }));

  return (
    <div className="space-y-3 relative">
      <div className="absolute top-2 right-2 z-20 flex bg-black/40 backdrop-blur-md p-1 rounded-lg border border-white/10">
        {['5', '7', '11'].map(size => (
          <button key={size} onClick={() => setPitchSize(size)}
            className={`px-2 sm:px-3 py-1.5 rounded-md text-xs font-black uppercase tracking-wider transition-all ${pitchSize === size ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-300 hover:text-white'}`}>
            Sân {size}
          </button>
        ))}
      </div>

      <div className="relative rounded-2xl border border-navy-light overflow-hidden shadow-lg shadow-black/20" style={{ minHeight: 560 }}>
        <div className="absolute inset-0 bg-[#1e5e1e]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#1a521a_50%,transparent_50%)] bg-size-[100%_20%] opacity-50" />
        <div className="absolute inset-4 border-2 border-white/40 pointer-events-none" />
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/40 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-48 h-24 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-4 left-1/2 w-24 h-10 border-2 border-b-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-48 h-24 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-4 left-1/2 w-24 h-10 border-2 border-t-0 border-white/40 -translate-x-1/2 pointer-events-none" />

        <div className="absolute inset-0 flex flex-col justify-evenly py-6 pointer-events-auto z-10">
          {rowsData.map((row, i) => (
            <div key={i} onDragOver={handleDragOver(row.pos)} onDragLeave={handleDragLeave(row.pos)} onDrop={handleDrop(row.pos)}
              className={`flex justify-center flex-wrap gap-2 sm:gap-6 px-2 min-h-22 rounded-xl transition-colors ${dragOverRow === row.pos ? 'bg-emerald-500/20 ring-2 ring-emerald-500/60' : ''}`}>
              {row.players.map((p, j) => p ? (
                <RosterPitchDot key={p.id} player={p} kit={kit} onClick={() => onSelectPlayer?.(p)} />
              ) : (
                <div key={`empty-${j}`} className="flex flex-col items-center gap-1.5 w-[64px] sm:w-[88px] shrink-0 opacity-40">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 border-white/30 bg-black/20 flex items-center justify-center text-white text-xs">+</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-navy/60 border border-navy-light rounded-2xl p-4 text-center">
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}

const stripDiacritics = (str) =>
  (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

function TeamSwitcher({ teams, activeTeamId, onSwitch, onCreateNew }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const activeTeam = teams.find(t => t.id === activeTeamId);

  const filtered = useMemo(() => {
    const q = stripDiacritics(query);
    return teams.filter(t => stripDiacritics(t.name).includes(q));
  }, [teams, query]);
  const groups = useMemo(() => ({
    approved: filtered.filter(t => t.status === 'approved'),
    pending: filtered.filter(t => t.status === 'pending'),
  }), [filtered]);

  const closeAndReset = () => { setOpen(false); setQuery(''); };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 bg-navy/60 backdrop-blur-xl border border-navy-light rounded-2xl px-4 py-2.5 hover:border-blue-500/50 transition-colors">
        {activeTeam?.logo ? (
          <img src={activeTeam.logo} alt={activeTeam.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shrink-0" style={{ backgroundColor: activeTeam?.colorHex }}>
            {getInitials(activeTeam?.name || '')[0]}
          </div>
        )}
        <span className="font-bold text-sm text-white truncate max-w-[160px]">{activeTeam?.name}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {open && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center p-4 pt-20 sm:pt-24"
          onClick={closeAndReset}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-md max-h-[75vh] flex flex-col overflow-hidden animate-scale-in"
          >
            <div className="p-4 border-b border-slate-700 shrink-0 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm đội bóng..."
                  type="search"
                  name="team-search-nofill"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  role="combobox"
                  aria-autocomplete="list"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 rounded-xl text-sm !text-white font-bold placeholder:text-slate-500 placeholder:font-normal outline-none border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <button type="button" onClick={closeAndReset} className="p-2 text-slate-400 hover:text-white transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
              {[['Đang hoạt động', groups.approved], ['Chờ duyệt', groups.pending]].map(([label, list]) => (
                list.length > 0 && (
                  <div key={label} className="flex flex-col">
                    <p className="px-4 pt-3 pb-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
                    {list.map(t => (
                      <button key={t.id} type="button" onClick={() => { onSwitch(t.id); closeAndReset(); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-slate-800 transition-colors ${t.id === activeTeamId ? 'text-neon' : 'text-slate-300'}`}>
                        {t.logo ? (
                          <img src={t.logo} alt={t.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shrink-0" style={{ backgroundColor: t.colorHex }}>
                            {getInitials(t.name)[0]}
                          </div>
                        )}
                        <span className="truncate">{t.name}</span>
                        {t.id === activeTeamId && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon shrink-0" />}
                      </button>
                    ))}
                  </div>
                )
              ))}
              {filtered.length === 0 && <p className="p-4 text-sm text-slate-500 text-center">Không tìm thấy đội bóng nào</p>}
            </div>

            {onCreateNew && (
              <button type="button" onClick={() => { closeAndReset(); onCreateNew(); }}
                className="w-full p-3 text-sm font-bold text-blue-400 hover:bg-slate-800 border-t border-slate-700 flex items-center gap-2 justify-center shrink-0">
                <Plus className="w-4 h-4" /> Tạo đội mới
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
export default function MyTeam() {
  const { user } = useAuthStore(useShallow(s => ({ user: s.user })));
  const toast = useToastStore();
  const location = useLocation();
  const navigate = useNavigate();

  const { activeTeamId, setActiveTeamId, activeTab, setActiveTab } = useTeamUiStore(useShallow(s => ({
    activeTeamId: s.activeTeamId, setActiveTeamId: s.setActiveTeamId,
    activeTab: s.activeTab, setActiveTab: s.setActiveTab,
  })));

  // ── Queries ────────────────────────────────────────────────
  const { data: teams = [], isLoading: loadingTeams } = useMyTeams(user?.id);
  const { data: detailData, isLoading: loadingDetail } = useTeamDetail(activeTeamId);
  const { data: players = [], isLoading: loadingPlayers } = useTeamPlayers(activeTeamId);
  const { data: eligibility = [] } = useSeasonEligibility(activeTeamId);

  const activeTeam = detailData?.team ?? null;
  const allSeasons = detailData?.allSeasons ?? [];
  const isLoading = loadingTeams || loadingDetail || loadingPlayers;

  const teamKit = useMemo(() => ({
    bg: activeTeam?.colorHex || '#1d4ed8', text: '#ffffff', border: 'rgba(255,255,255,0.5)',
  }), [activeTeam?.colorHex]);

  // ── UI state cục bộ ───────────────────────────────────────
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('number');
  const [showPayment, setShowPayment] = useState(false);
  const [activeMatchSeasonId, setActiveMatchSeasonId] = useState(null);
  const [showSeasonRegModal, setShowSeasonRegModal] = useState(false);
  const [registeringSeasonId, setRegisteringSeasonId] = useState(null);
  const [editTeamModalOpen, setEditTeamModalOpen] = useState(false);
  const [lineupModalMatch, setLineupModalMatch] = useState(null);
  const [playerModal, setPlayerModal] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [teamGranularity, setTeamGranularity] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => { if (allSeasons.length > 0 && !activeMatchSeasonId) setActiveMatchSeasonId(allSeasons[0].id); }, [allSeasons]); // eslint-disable-line

  const { data: matches = [], isLoading: isLoadingMatches } = useTeamMatches(
    activeTeamId, activeMatchSeasonId, { enabled: activeTab === 'matches' }
  );
  const { data: statsData, isLoading: isStatsLoading } = useTeamStats(
    activeTeamId, teamGranularity, { enabled: activeTab === 'stats' }
  );
  const { data: playersPerf, isLoading: isPerfLoading } = usePlayersPerformance(
    activeTab === 'stats' ? players : []
  );

  // ── Mutations ──────────────────────────────────────────────
  const registerSeason = useRegisterSeasonMutation(activeTeamId);
  const dropOnPitch = useUpdatePlayerPositionMutation(activeTeamId);
  const addPlayer = useAddPlayerMutation(activeTeamId);
  const editPlayer = useEditPlayerMutation(activeTeamId);
  const deletePlayer = useDeletePlayerMutation(activeTeamId);
  const importExcel = useImportExcelMutation(activeTeamId);
  const updateTeam = useUpdateTeamMutation(activeTeamId);
  const deleteTeam = useDeleteTeamMutation(user?.id);

  // ── Set team mặc định khi teams load xong ────────────────
  useEffect(() => {
    if (!activeTeamId && teams.length > 0) setActiveTeamId(teams[0].id);
  }, [teams, activeTeamId, setActiveTeamId]);

  const eligibleSeasonCount = useMemo(() => eligibility.filter(s => s.eligible).length, [eligibility]);

  const handleDropOnPitch = (playerId, position) => {
    dropOnPitch.mutate({ playerId, position }, {
      onError: () => toast.error('Lỗi khi lưu vị trí cầu thủ'),
    });
  };

  const handleSwitchTeam = (teamId) => {
    if (teamId === activeTeamId) return;
    setSearch(''); setSortField('number'); setActiveTab('roster');
    setActiveTeamId(teamId);
  };

  const handleRegisterSeason = (seasonId) => {
    setRegisteringSeasonId(seasonId);
    registerSeason.mutate(seasonId, {
      onSuccess: () => toast.success('Đã gửi yêu cầu đăng ký giải!'),
      onError: (err) => toast.error(parseApiError(err, 'Không thể đăng ký giải.')),
      onSettled: () => setRegisteringSeasonId(null),
    });
  };

  // ── autoOpenAddPlayer từ RegisterTeam ────────────────────
  useEffect(() => {
    const st = location.state;
    if (!st?.autoOpenAddPlayer || !st?.teamId) return;
    if (teams.length === 0) return;

    const targetExists = teams.some(t => t.id === st.teamId);
    if (targetExists) {
      if (activeTeamId !== st.teamId) {
        setSearch(''); setSortField('number'); setActiveTab('roster');
        setActiveTeamId(st.teamId);
      }
      setEditingPlayer(null); setModalError(''); setPlayerModal('add');
    } else {
      console.warn('autoOpenAddPlayer: teamId không tồn tại trong danh sách team của user', st.teamId);
    }
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, location.state]);

  // ── Filtered + sorted players ─────────────────────────────
  const displayed = players
    .filter(p => (p.name ?? '').toLowerCase().includes(search.toLowerCase()) || String(p.number).includes(search))
    .sort((a, b) => {
      if (sortField === 'number') return (a.number ?? 0) - (b.number ?? 0);
      if (sortField === 'name') return (a.name ?? '').localeCompare(b.name ?? '');
      return 0;
    });
  const totalPages = Math.ceil(displayed.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPlayers = displayed.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const handleItemsPerPageChange = (n) => { setItemsPerPage(n); setCurrentPage(1); };

  // ── Handlers: team ─────────────────────────────────────────
  const handleEditTeamSave = (values) => {
    updateTeam.mutate({ values, activeSeasonTeamId: activeTeam?.activeSeasonTeamId }, {
      onSuccess: () => { toast.success('Đã cập nhật thông tin đội bóng!'); setEditTeamModalOpen(false); },
      onError: (err) => setModalError(parseApiError(err, 'Lỗi khi cập nhật thông tin đội.')),
    });
  };

  const handleDeleteTeam = (teamId) => {
    deleteTeam.mutate(teamId, {
      onSuccess: () => {
        toast.success('Đã giải tán đội bóng!');
        setEditTeamModalOpen(false);
        const remaining = teams.filter(t => t.id !== teamId);
        setActiveTeamId(remaining[0]?.id ?? null);
      },
      onError: (err) => setModalError(parseApiError(err, 'Lỗi khi xóa đội bóng.')),
    });
  };

  // ── Handlers: player (RHF-driven, nhận values sạch) ────────
  const openAddModal = () => { setEditingPlayer(null); setModalError(''); setPlayerModal('add'); };
  const openEditModal = (player) => { setEditingPlayer(player); setModalError(''); setPlayerModal('edit'); };

  const handleAddSave = (values) => {
    addPlayer.mutate(values, {
      onSuccess: () => { toast.success(`Đã thêm "${values.name}" (áo số ${values.number}) vào đội.`); setPlayerModal(null); },
      onError: (err) => setModalError(parseApiError(err, 'Lỗi khi thêm cầu thủ.')),
    });
  };

  const handleEditSave = (values) => {
    editPlayer.mutate({ editingPlayer, values }, {
      onSuccess: () => { toast.success(`Đã cập nhật cầu thủ "${editingPlayer.name}".`); setPlayerModal(null); },
      onError: (err) => setModalError(parseApiError(err, 'Lỗi khi cập nhật cầu thủ.')),
    });
  };

  const handleImportExcel = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importExcel.mutate(file, {
      onSuccess: (res) => {
        const result = res?.data ?? res;
        const successCount = result?.success ?? 0;
        const failedCount = result?.failed ?? 0;
        const skippedCount = result?.skipped ?? 0;

        if (successCount > 0 || skippedCount > 0) {
          const parts = [];
          if (successCount > 0) parts.push(`${successCount} cầu thủ mới`);
          if (skippedCount > 0) parts.push(`${skippedCount} đã có sẵn (bỏ qua)`);
          if (failedCount > 0) parts.push(`${failedCount} dòng lỗi`);
          toast.success(`Import: ${parts.join(', ')}.`, 5000);
          setPlayerModal(null);
        } else {
          const firstErrors = (result?.errors ?? []).slice(0, 3).map(e2 => `Dòng ${e2.row}: ${e2.reason}`).join(' | ');
          toast.error(firstErrors || 'Không có cầu thủ nào được thêm. Kiểm tra lại file Excel.', 8000);
        }
      },
      onError: (err) => toast.error(parseApiError(err, 'Có lỗi khi nhập dữ liệu Excel.')),
      onSettled: () => { e.target.value = null; },
    });
  };

  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      const { playerApi } = await import('../api');
      const res = await playerApi.downloadImportTemplate();
      downloadBlob(res, 'import-template.xlsx');
    } catch (err) {
      toast.error(parseApiError(err, 'Không thể tải file mẫu Excel.'));
    } finally { setIsDownloadingTemplate(false); }
  };

  const handleExportMatchReport = async (matchId) => {
    try {
      const res = await matchApi.getMatchReport(matchId);
      downloadBlob(res, `BienBanTranDau_${matchId}.pdf`);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải biên bản trận đấu.');
    }
  };

  const handleDeleteConfirm = () => {
    deletePlayer.mutate(deletingPlayer.id, {
      onSuccess: () => { toast.success(`Đã xóa "${deletingPlayer.name}" khỏi đội.`); setDeletingPlayer(null); },
      onError: (err) => toast.error(parseApiError(err, 'Lỗi khi xóa cầu thủ.')),
    });
  };

  const handleOpenPayment = () => {
    if (!activeTeam?.activeSeasonTeamId) {
      toast.error('Không xác định được đăng ký của đội trong mùa giải này. Vui lòng tải lại trang.');
      return;
    }
    setShowPayment(true);
  };

  if (!isLoading && teams.length === 0) {
    return (
      <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] opacity-10 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10"><NoTeamState /></div>
      </div>
    );
  }

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/4 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-[1400px] animate-fade-in relative z-10">

        {!isLoading && activeTeamId && (
          <div className="mb-8 animate-slide-up flex items-center gap-3 flex-wrap">
            {teams.length > 1 && (
              <TeamSwitcher teams={teams} activeTeamId={activeTeamId} onSwitch={handleSwitchTeam}
                onCreateNew={() => navigate('/dang-ky-doi-bong')} />
            )}
            <button type="button" onClick={() => setShowSeasonRegModal(true)}
              className="relative flex items-center gap-2 bg-navy/60 backdrop-blur-xl border border-navy-light rounded-2xl px-4 py-2.5 hover:border-emerald-500/50 transition-colors text-sm font-bold text-gray-300">
              <Trophy className="w-4 h-4 text-emerald-400" /> Đăng ký giải
              {eligibleSeasonCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-md">
                  {eligibleSeasonCount}
                </span>
              )}
            </button>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-2xl mb-8 flex items-start gap-4 animate-slide-up">
            <div className="p-2 bg-yellow-500/20 rounded-xl shrink-0"><AlertTriangle className="w-6 h-6 text-yellow-400" /></div>
            <div>
              <p className="text-yellow-400 font-black text-lg mb-1 tracking-tight">Đội bóng đang chờ duyệt</p>
              <p className="text-yellow-500/80 font-medium">Hồ sơ đăng ký của bạn đã được gửi. Vui lòng chờ Admin xác nhận.</p>
            </div>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'approved' && activeTeam?.registrationStatus === 'pending' && (
          <div className="bg-navy border border-navy-light p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-red-500/20 rounded-xl shrink-0"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
              <div>
                <p className="text-red-500 font-black text-lg mb-1 tracking-tight">Chờ duyệt tham gia giải</p>
                <p className="text-red-400 font-medium">Yêu cầu tham gia giải <strong>{activeTeam.season}</strong> đang chờ Admin xác nhận.</p>
              </div>
            </div>
          </div>
        )}

        {!isLoading && activeTeam?.status === 'approved' && ['approved', 'active'].includes(activeTeam?.registrationStatus) && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-2 bg-emerald-500/20 rounded-xl shrink-0"><CheckCircle2 className="w-6 h-6 text-emerald-400" /></div>
              <div>
                <p className="text-emerald-400 font-black text-lg mb-1 tracking-tight">Đăng ký thành công!</p>
                <p className="text-emerald-500/80 font-medium">Đội đã được duyệt tham gia <strong>{activeTeam.season}</strong>. Thanh toán lệ phí để bốc thăm chia bảng.</p>
              </div>
            </div>
            <button onClick={handleOpenPayment}
              className="px-6 py-3.5 shrink-0 bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3 uppercase tracking-wider text-sm hover:-translate-y-0.5 whitespace-nowrap">
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
                <div className="w-20 h-20 shrink-0 bg-navy-dark/80 backdrop-blur-md border border-neon/40 rounded-3xl shadow-[0_0_30px_rgba(57,255,20,0.2)] relative group overflow-hidden">
                  {activeTeam?.logo ? (
                    <img src={activeTeam.logo} alt={activeTeam.name} className="w-full h-full object-cover relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-white group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: teamKit.bg }}>
                      {getInitials(activeTeam?.name || '')}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2 mb-1.5">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-neon uppercase tracking-tight truncate">
                      {activeTeam?.name}
                    </h1>
                    {activeTeam?.status === 'approved' && <span className="shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Hoạt động</span>}
                    {activeTeam?.status === 'pending' && <span className="shrink-0 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">Chờ Duyệt</span>}
                  </div>
                  <p className="text-blue-400/80 font-bold tracking-wide text-sm">Mùa giải: {activeTeam?.season || '—'}</p>
                </div>
              </>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setEditTeamModalOpen(true)}
                className="bg-navy/60 backdrop-blur-xl text-white font-bold px-4 py-3 rounded-2xl hover:bg-navy transition-colors flex items-center gap-2 border border-navy-light shadow-lg hover:-translate-y-0.5 text-sm whitespace-nowrap">
                <Settings className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Cài đặt</span>
              </button>
              <button onClick={openAddModal} disabled={players.length >= 20}
                className="bg-linear-to-r from-blue-500 to-indigo-600 text-white font-black px-4 py-3 rounded-2xl hover:from-blue-400 hover:to-indigo-500 flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 whitespace-nowrap">
                <UserPlus className="w-4 h-4 shrink-0" /><span className="hidden sm:inline">Thêm cầu thủ</span><span className="sm:hidden">Thêm CT</span>
              </button>
            </div>
          )}
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2 border-b border-navy-light mb-8 animate-fade-in overflow-x-auto custom-scrollbar">
            {[
              { id: 'roster', label: `Đội hình (${players.length})` },
              { id: 'stats', label: 'Thống kê đội' },
              { id: 'matches', label: 'Lịch thi đấu' },
              { id: 'transactions', label: 'Lịch sử giao dịch' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-3 font-black uppercase tracking-wider text-sm border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'border-neon text-neon' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms' }}>

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" /> Toàn thời gian — mọi giải, mọi mùa
                  </p>
                  <div className="flex gap-2">
                    {GRANULARITY_OPTIONS.map(g => (
                      <button key={g.value} onClick={() => setTeamGranularity(g.value)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-bold transition-colors ${teamGranularity === g.value ? 'bg-neon text-navy-dark border-neon' : 'border-navy-light text-gray-400 hover:text-white'}`}>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {isStatsLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
                  </div>
                ) : !statsData?.overview ? (
                  <div className="text-center py-16 bg-navy/30 border border-dashed border-navy-light rounded-3xl">
                    <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 font-medium">Chưa có trận đấu nào đã kết thúc.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <StatBox label="Tổng trận" value={statsData.overview.total_matches_played} color="text-white" />
                      <StatBox label="Thắng" value={statsData.overview.total_wins} color="text-emerald-400" />
                      <StatBox label="Hòa" value={statsData.overview.total_draws} color="text-yellow-400" />
                      <StatBox label="Thua" value={statsData.overview.total_losses} color="text-red-400" />
                      <StatBox label="Hiệu số" value={statsData.overview.goal_difference > 0 ? `+${statsData.overview.goal_difference}` : statsData.overview.goal_difference} color="text-neon" />
                    </div>

                    {statsData.extended && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-navy/60 border border-navy-light rounded-2xl p-5">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Sân nhà / Sân khách</p>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400 mb-1">Sân nhà</p>
                              <p className="text-white font-bold">{statsData.extended.home.wins}T-{statsData.extended.home.draws}H-{statsData.extended.home.losses}B</p>
                              <p className="text-gray-500 text-xs">{statsData.extended.home.goals_for}-{statsData.extended.home.goals_against} bàn</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Sân khách</p>
                              <p className="text-white font-bold">{statsData.extended.away.wins}T-{statsData.extended.away.draws}H-{statsData.extended.away.losses}B</p>
                              <p className="text-gray-500 text-xs">{statsData.extended.away.goals_for}-{statsData.extended.away.goals_against} bàn</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-navy/60 border border-navy-light rounded-2xl p-5">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-orange-400" /> Phong độ hiện tại
                          </p>
                          {statsData.extended.current_streak ? (
                            <p className="text-2xl font-black text-white">
                              {statsData.extended.current_streak.count}× <span className={statsData.extended.current_streak.type === 'W' ? 'text-emerald-400' : statsData.extended.current_streak.type === 'L' ? 'text-red-400' : 'text-yellow-400'}>{statsData.extended.current_streak.type}</span>
                            </p>
                          ) : <p className="text-gray-500 text-sm">Chưa có dữ liệu</p>}
                          <p className="text-gray-500 text-xs mt-2">Sạch lưới: {statsData.extended.clean_sheets} trận</p>
                          <p className="text-gray-500 text-xs">Trung bình {statsData.extended.avg_goals_for_per_match} bàn/trận</p>
                        </div>
                        <div className="bg-navy/60 border border-navy-light rounded-2xl p-5">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Kết quả nổi bật</p>
                          {statsData.extended.biggest_win ? (
                            <p className="text-xs text-emerald-400">Thắng đậm nhất: {statsData.extended.biggest_win.goals_for}-{statsData.extended.biggest_win.goals_against} vs {statsData.extended.biggest_win.opponent_team_name}</p>
                          ) : <p className="text-gray-500 text-xs">Chưa có trận thắng</p>}
                          {statsData.extended.biggest_loss && (
                            <p className="text-xs text-red-400 mt-1">Thua đậm nhất: {statsData.extended.biggest_loss.goals_for}-{statsData.extended.biggest_loss.goals_against} vs {statsData.extended.biggest_loss.opponent_team_name}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {statsData.finance && (
                        <div className="bg-navy/60 border border-navy-light rounded-2xl p-5">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Tài chính
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p className="text-gray-400">Lệ phí đã đóng</p><p className="text-white font-bold text-right">{formatCurrencyVN(statsData.finance.total_registration_fee_paid)}</p>
                            <p className="text-gray-400">Đã hoàn</p><p className="text-white font-bold text-right">{formatCurrencyVN(statsData.finance.total_registration_fee_refunded)}</p>
                            <p className="text-gray-400">Thưởng</p><p className="text-emerald-400 font-bold text-right">{formatCurrencyVN(statsData.finance.total_bonus_payable)}</p>
                            <p className="text-gray-400">Phạt</p><p className="text-red-400 font-bold text-right">{formatCurrencyVN(statsData.finance.total_fine_owed)}</p>
                          </div>
                        </div>
                      )}
                      {statsData.participations && (
                        <div className="bg-navy/60 border border-navy-light rounded-2xl p-5">
                          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-blue-400" /> Lịch sử tham gia
                          </p>
                          <p className="text-sm text-white mb-2">{statsData.participations.tournament_count} giải đấu · {statsData.participations.season_count} mùa giải</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(statsData.participations.participations || []).map((p, i) => (
                              <span key={i} className="text-[10px] bg-navy-dark border border-navy-light px-2 py-1 rounded-lg text-gray-300">
                                {p.season_name} <span className="text-gray-500">({p.registration_status})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-navy/60 border border-navy-light rounded-3xl p-6">
                      <h3 className="text-sm font-black text-white mb-4">Phong độ theo thời gian</h3>
                      <div className="h-[280px]">
                        {statsData.timeSeries.length === 0 ? (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Chưa có dữ liệu</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statsData.timeSeries}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#2A303C" vertical={false} />
                              <XAxis dataKey="bucket" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                              <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} />
                              <Legend />
                              <Bar dataKey="wins" name="Thắng" stackId="a" fill="#10b981" />
                              <Bar dataKey="draws" name="Hòa" stackId="a" fill="#f59e0b" />
                              <Bar dataKey="losses" name="Thua" stackId="a" fill="#ef4444" />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="bg-navy/60 border border-navy-light rounded-3xl p-6">
                      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyan-400" /> Phong độ cầu thủ (toàn thời gian)
                      </h3>
                      {isPerfLoading ? (
                        <div className="text-gray-400 text-sm py-4">Đang tải...</div>
                      ) : playersPerf.length === 0 ? (
                        <div className="text-gray-500 text-sm py-4">Chưa có dữ liệu thi đấu.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm text-gray-300">
                            <thead className="text-xs uppercase text-gray-500 border-b border-navy-light">
                              <tr>
                                <th className="py-2 pr-4">Cầu thủ</th>
                                <th className="py-2 px-2 text-center">Trận</th>
                                <th className="py-2 px-2 text-center">Đá chính</th>
                                <th className="py-2 px-2 text-center">Dự bị</th>
                                <th className="py-2 px-2 text-center">Đội trưởng</th>
                                <th className="py-2 px-2 text-center">Bàn</th>
                                <th className="py-2 px-2 text-center">Kiến tạo</th>
                                <th className="py-2 px-2 text-center">V/Đ</th>
                              </tr>
                            </thead>
                            <tbody>
                              {playersPerf.map(p => (
                                <tr key={p.player_id} className="border-b border-navy-light/50 last:border-0">
                                  <td className="py-2 pr-4 font-bold text-white">{p.player_name}</td>
                                  <td className="py-2 px-2 text-center">{p.total_matches_played}</td>
                                  <td className="py-2 px-2 text-center">{p.total_starter_count}</td>
                                  <td className="py-2 px-2 text-center">{p.total_substitute_count}</td>
                                  <td className="py-2 px-2 text-center">{p.total_captain_count}</td>
                                  <td className="py-2 px-2 text-center text-neon font-bold">{p.total_goals}</td>
                                  <td className="py-2 px-2 text-center">{p.total_assists}</td>
                                  <td className="py-2 px-2 text-center">{p.total_yellow_cards}/{p.total_red_cards}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="space-y-4">
                {allSeasons.length > 1 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                      <Calendar className="w-3.5 h-3.5" /> Mùa:
                    </span>
                    {allSeasons.map(s => (
                      <button key={s.id} onClick={() => setActiveMatchSeasonId(s.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all whitespace-nowrap ${s.id === activeMatchSeasonId ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-navy/50 border-navy-light text-gray-400 hover:text-white hover:border-gray-500'}`}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}

                {isLoadingMatches ? (
                  <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 text-neon animate-spin" /></div>
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
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border whitespace-nowrap ${statusClass}`}>{statusLabel}</span>
                            <span className="text-sm font-medium text-gray-400 whitespace-nowrap">{formatMatchTime(match.start_time)}</span>
                          </div>
                          <p className="text-lg font-black text-white truncate flex items-center gap-2">
                            <span>{match.home_team?.name || 'Đội nhà'}</span>
                            {['completed', 'finished'].includes(match.status) ? (
                              <span className="bg-navy-dark border border-navy-light px-3 py-1 rounded-lg text-neon text-xl tracking-widest tabular-nums mx-2">
                                {match.home_score ?? 0} - {match.away_score ?? 0}
                              </span>
                            ) : <span className="text-gray-500 font-medium mx-2">vs</span>}
                            <span>{match.away_team?.name || 'Đội khách'}</span>
                          </p>
                          <p className="text-sm text-gray-400 mt-1 truncate">Sân: {match.venue?.name || 'Chưa xếp sân'}</p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2 flex-wrap justify-end">
                          {(match.status === 'completed' || match.status === 'finished') && (
                            <button
                              onClick={() => handleExportMatchReport(match.id)}
                              className="w-full sm:w-auto px-4 py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap"
                            >
                              Xuất Biên Bản
                            </button>
                          )}
                          {isActive ? (
                            <button onClick={() => setLineupModalMatch(match)}
                              className="w-full sm:w-auto px-5 py-3 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/30 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap">
                              Xếp Đội Hình
                            </button>
                          ) : (
                            <button onClick={() => navigate(`/tran-dau/${match.id}`)}
                              className="w-full sm:w-auto px-5 py-3 bg-navy-light/50 hover:bg-blue-500/20 text-gray-300 hover:text-blue-400 border border-navy-light hover:border-blue-500/50 rounded-xl font-black uppercase tracking-widest text-xs transition-all whitespace-nowrap">
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

            {activeTab === 'transactions' && <TransactionsTab teamId={activeTeamId} />}

            {activeTab === 'roster' && (
              <div className="space-y-6">
                <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                    <Trophy className="w-28 h-28 text-neon" />
                  </div>
                  <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-5 relative z-10 border-b border-navy-light/50 pb-4">
                    <div className="p-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30"><Trophy className="w-4 h-4 text-yellow-400" /></div>
                    Thống kê đội
                  </h3>
                  {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                      {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-20 rounded-2xl" />)}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 relative z-10">
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
                          <div key={stat.label} className={`${stat.bg} p-4 rounded-2xl border text-center animate-slide-up hover:-translate-y-1 transition-transform duration-300`} style={{ animationDelay: `${200 + idx * 50}ms` }}>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{stat.label}</p>
                            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                  <div className="lg:col-span-4 xl:col-span-4 space-y-6">
                    <div className="space-y-3">
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5" /> Sơ đồ đội hình
                        <span className="normal-case font-medium text-gray-600 hidden sm:inline">— kéo thả cầu thủ để sửa</span>
                      </p>
                      {isLoading ? <div className="skeleton h-72 rounded-2xl" /> : (
                        <RosterPitch players={players} kit={teamKit} onSelectPlayer={openEditModal} onDropPlayer={handleDropOnPitch} />
                      )}
                    </div>

                    <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-500" />
                      <h3 className="text-base font-black text-white flex items-center gap-2.5 mb-5 border-b border-navy-light/50 pb-4 relative z-10">
                        <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30"><Info className="w-4 h-4 text-indigo-400" /></div>
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
                              label: 'Màu áo', value: (
                                <div className="flex items-center gap-2 bg-navy-dark px-3 py-1.5 rounded-lg border border-navy-light">
                                  <div className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0" style={{ backgroundColor: activeTeam?.colorHex }} />
                                  <span className="font-bold text-white text-sm truncate max-w-[90px]">{activeTeam?.primaryColor}</span>
                                </div>
                              )
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
                  </div>

                  <div className="lg:col-span-6 xl:col-span-6 space-y-4">
                    {!isLoading && (
                      <div className="flex gap-2 items-center animate-fade-in bg-navy/40 backdrop-blur-md p-2 rounded-2xl border border-navy-light">
                        <div className="relative flex-1 min-w-0">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 shrink-0" />
                          <input type="text" placeholder="Tìm tên hoặc số áo..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-medium transition-all" />
                        </div>
                        <div className="relative shrink-0">
                          <select value={sortField} onChange={e => setSortField(e.target.value)}
                            className="pl-3 pr-8 py-3 bg-navy-dark border border-navy-light rounded-xl text-white text-sm font-bold focus:outline-none focus:border-blue-500 appearance-none cursor-pointer transition-all">
                            <option value="number">Sắp xếp: Số áo</option>
                            <option value="name">Sắp xếp: Tên</option>
                          </select>
                          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    )}

                    <div className="bg-navy/60 backdrop-blur-2xl border border-navy-light rounded-4xl shadow-2xl shadow-black/40 overflow-hidden">
                      <div className="px-6 py-5 border-b border-navy-light/50 flex items-center justify-between bg-navy-dark/40">
                        <h2 className="text-lg font-black text-white flex items-center gap-2.5 tracking-tight">
                          <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30"><Users className="w-4 h-4 text-blue-400" /></div>
                          Danh Sách Cầu Thủ
                        </h2>
                        {!isLoading && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-blue-400 bg-navy-dark px-3 py-1.5 rounded-xl border border-navy-light shadow-inner">{players.length}/20</span>
                            {players.length >= 20 && (
                              <span className="text-xs text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-2.5 py-1.5 rounded-xl uppercase tracking-widest whitespace-nowrap hidden sm:block">Đủ quân</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap">
                          <thead>
                            <tr className="bg-navy-dark/60 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-navy-light/50">
                              <th className="py-4 px-4 w-14 text-center">STT</th>
                              <th className="py-4 px-4">
                                <button onClick={() => setSortField('name')} className="flex items-center gap-1 hover:text-white transition-colors group">
                                  Cầu thủ <ArrowUpDown className="w-3 h-3 opacity-50 group-hover:opacity-100" />
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
                                <td colSpan={3} className="py-20 text-center text-gray-500">
                                  <Search className="w-12 h-12 mx-auto mb-4 text-navy-light opacity-50" />
                                  <p className="font-bold text-gray-400 text-lg">{players.length === 0 ? 'Chưa có cầu thủ nào trong đội' : 'Không tìm thấy cầu thủ'}</p>
                                  <p className="text-sm mt-1">{players.length === 0 ? 'Nhấn "Thêm CT" để thêm cầu thủ đầu tiên!' : 'Thử thay đổi từ khóa tìm kiếm'}</p>
                                </td>
                              </tr>
                            ) : (
                              paginatedPlayers.map((player, idx) => {
                                const sttNumber = (safePage - 1) * itemsPerPage + idx + 1;
                                return (
                                  <tr key={player.id} draggable
                                    onDragStart={(e) => e.dataTransfer.setData('app/player-id', String(player.id))}
                                    className="hover:bg-navy-light/20 transition-all duration-300 group animate-fade-in cursor-grab active:cursor-grabbing"
                                    style={{ animationDelay: `${idx * 40}ms` }}>
                                    <td className="py-5 px-4 text-center"><span className="font-black text-lg text-gray-500">{sttNumber}</span></td>
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
                                          <div className="flex items-center gap-1.5 mt-1">
                                            <span className="text-[10px] font-black text-gray-300 bg-navy-dark border border-navy-light px-1.5 py-0.5 rounded-md tabular-nums">#{player.number || '—'}</span>
                                            <PosBadge pos={player.position} />
                                          </div>
                                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                                            {player.role === 'captain' && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Đội trưởng</span>}
                                            {player.role === 'vice_captain' && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-blue-400" /> Phó đội trưởng</span>}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-5 px-4">
                                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 sm:group-hover:translate-x-0">
                                        <button onClick={() => openEditModal(player)}
                                          className="w-9 h-9 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all" title="Chỉnh sửa">
                                          <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setDeletingPlayer(player)}
                                          className="w-9 h-9 rounded-xl bg-navy-dark border border-navy-light flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all" title="Xóa">
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
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
                      <div className="flex justify-center">
                        <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage}
                          itemsPerPage={itemsPerPage} onItemsPerPageChange={handleItemsPerPageChange} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {playerModal && (
        <PlayerFormModal
          mode={playerModal}
          initialValues={playerModal === 'edit' ? editingPlayer : undefined}
          formError={modalError}
          isSaving={addPlayer.isPending || editPlayer.isPending}
          onSave={(values) => (playerModal === 'add' ? handleAddSave(values) : handleEditSave(values))}
          onClose={() => { setPlayerModal(null); setModalError(''); }}
          onImportExcel={handleImportExcel}
          onDownloadTemplate={handleDownloadTemplate}
          isDownloadingTemplate={isDownloadingTemplate}
          isImporting={importExcel.isPending}
        />
      )}

      {deletingPlayer && (
        <PlayerDeleteModal playerName={deletingPlayer.name} onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPlayer(null)} isDeleting={deletePlayer.isPending} />
      )}

      {showPayment && activeTeam && (
        <TeamPaymentModal teamName={activeTeam.name} seasonTeamId={activeTeam.activeSeasonTeamId}
          amount={activeTeam.registrationFee} bankInfo={activeTeam.bankInfo} onClose={() => setShowPayment(false)} />
      )}

      {editTeamModalOpen && (
        <EditTeamModal team={activeTeam} onSave={handleEditTeamSave}
          onClose={() => { setEditTeamModalOpen(false); setModalError(''); }}
          isSaving={updateTeam.isPending || deleteTeam.isPending} error={modalError} onDelete={handleDeleteTeam} />
      )}

      {lineupModalMatch && activeTeam && (
        <LineupBuilderModal match={lineupModalMatch} teamId={activeTeam.id} roster={players} onClose={() => setLineupModalMatch(null)} />
      )}

      {showSeasonRegModal && (
        <SeasonRegistrationModal seasons={eligibility} registeringId={registeringSeasonId}
          onRegister={handleRegisterSeason} onClose={() => setShowSeasonRegModal(false)} />
      )}
    </div>
  );
}