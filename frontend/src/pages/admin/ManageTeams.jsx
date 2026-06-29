import { useState, useEffect, useCallback, useMemo, Fragment } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, Users,
  ChevronDown, ChevronUp, AlertTriangle, Loader2,
  UserPlus, RefreshCw, Search, CalendarDays, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import useSeasonStore from '../../store/seasonStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';
import TeamFormModal from '../../components/admin/TeamFormModal';
import PlayerFormModal from '../../components/admin/PlayerFormModal';
import Pagination from '../../components/ui/Pagination';
import { useShallow } from 'zustand/react/shallow';
import useAdminUIStore from '../../store/adminUIStore';
import useSeasonTeamStore from '../../store/seasonTeamStore';

const POSITIONS = [
  { value: 'GK', label: 'GK – Thủ môn' },
  { value: 'DEF', label: 'DEF – Hậu vệ' },
  { value: 'MID', label: 'MID – Tiền vệ' },
  { value: 'FW', label: 'FW – Tiền đạo' },
];

const EMPTY_TEAM = { name: '', coach_name: '', description: '', logo: null };
const EMPTY_PLAYER = { name: '', number: '', position: 'FW' };

export default function ManageTeams() {
  const toast = useToastStore();

  // ── Zustand store ──────────────────────────────────────────────
  const { teams, meta, isLoading, error: fetchError,
    fetchAll: fetchTeamsStore,
    create: createTeam,
    update: updateTeam,
    softDelete: deleteTeam,
    fetchPlayers, getPlayersFromCache, playersLoading,
    addNewPlayerToTeam, removePlayers, } = useTeamStore(useShallow(state => ({ teams: state.teams, meta: state.meta, isLoading: state.isLoading, error: state.error, fetchAll: state.fetchAll, create: state.create, update: state.update, softDelete: state.softDelete, fetchPlayers: state.fetchPlayers, getPlayersFromCache: state.getPlayersFromCache, playersLoading: state.playersLoading, addNewPlayerToTeam: state.addNewPlayerToTeam, removePlayers: state.removePlayers })));

  // ── Season filter ────────────────────────────────────
  const { seasons, fetchAll: fetchSeasons } = useSeasonStore(useShallow(state => ({ seasons: state.seasons, fetchAll: state.fetchAll })));
  const [selectedSeasonId, setSelectedSeasonId] = useState('');

  // removed auto-select mùa tốt nhất
  const effectiveSeasonId = selectedSeasonId;

  // Dữ liệu đội theo mùa giải
  const { fetchSeasonTeams, loadingSeasons, errors, getSeasonTeamsFromCache } = useSeasonTeamStore(useShallow(state => ({
    fetchSeasonTeams: state.fetchSeasonTeams,
    loadingSeasons: state.loadingSeasons,
    errors: state.errors,
    getSeasonTeamsFromCache: state.getSeasonTeamsFromCache,
  })));

  const loadingSeasonTeams = loadingSeasons[effectiveSeasonId] || false;
  const seasonTeamsError = errors[effectiveSeasonId] || null;
  const seasonTeams = getSeasonTeamsFromCache(effectiveSeasonId);

  // Khi season thay đổi: load lại
  useEffect(() => {
    if (effectiveSeasonId) {
      fetchSeasonTeams(effectiveSeasonId);
    }
  }, [effectiveSeasonId, fetchSeasonTeams]);

  // Lọc teams: khi có mùa giải → chỉ lấy đội đã được duyệt (approved)
  const approvedSeasonTeamIds = useMemo(
    () => new Set(seasonTeams.filter(st => st.status === 'approved').map(st => st.team_id)),
    [seasonTeams]
  );
  const filteredTeams = useMemo(
    () => effectiveSeasonId
      ? teams.filter(t => approvedSeasonTeamIds.has(t.id))
      : teams,
    [teams, effectiveSeasonId, approvedSeasonTeamIds]
  );

  const { teamFilters, setTeamFilters } = useAdminUIStore(useShallow(state => ({
    teamFilters: state.teamFilters,
    setTeamFilters: state.setTeamFilters,
  })));
  const { search: searchTerm, page: currentPage, limit: itemsPerPage } = teamFilters;
  
  const setSearchTerm = useCallback((val) => setTeamFilters({ search: typeof val === 'function' ? val(searchTerm) : val }), [searchTerm, setTeamFilters]);
  const setCurrentPage = useCallback((val) => setTeamFilters({ page: typeof val === 'function' ? val(currentPage) : val }), [currentPage, setTeamFilters]);

  const setItemsPerPage = useCallback((val) => setTeamFilters({ limit: val, page: 1 }), [setTeamFilters]);
  // ── Debounced search ──────────────────────────────────
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, effectiveSeasonId, setCurrentPage]);

  const totalPages = Math.ceil(filteredTeams.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTeams = filteredTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const refetchTeams = useCallback(() => {
    fetchTeamsStore({ q: debouncedSearch || undefined, sort: 'id', direction: 'asc', per_page: 200, force: !!debouncedSearch });
  }, [fetchTeamsStore, debouncedSearch]);

  useEffect(() => {
    fetchSeasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refetchTeams(); }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── CRUD Modal: Team (useCrudModal) ───────────────────
  const teamCrud = useCrudModal({ emptyForm: EMPTY_TEAM, onSuccess: refetchTeams });
  const [logoPreview, setLogoPreview] = useState(null);

  const openAddTeam = () => {
    setLogoPreview(null);
    teamCrud.openAdd();
  };

  const openEditTeam = (team) => {
    setLogoPreview(team.logo || null);
    teamCrud.openEdit(team, {
      name: team.name,
      coach_name: team.coach_name ?? '',
      description: team.description ?? '',
      logo: null,
    });
  };

  const closeTeamModal = () => {
    setLogoPreview(null);
    teamCrud.closeModal();
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    teamCrud.setForm(prev => ({ ...prev, logo: file }));
    const reader = new FileReader();
    reader.onload = (ev) => setLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveTeam = () => {
    if (!teamCrud.form.name.trim()) { teamCrud.setFormError('Vui lòng nhập tên đội bóng.'); return; }
    const payload = {
      name: teamCrud.form.name.trim(),
      coach_name: teamCrud.form.coach_name.trim() || undefined,
      description: teamCrud.form.description.trim() || undefined,
      logo: teamCrud.form.logo instanceof File ? teamCrud.form.logo : undefined,
    };
    teamCrud.save(async () => {
      if (teamCrud.modal === 'add') {
        await createTeam(payload);
        toast.success(`Đã tạo đội "${payload.name}" thành công!`);
      } else {
        await updateTeam(teamCrud.editing.id, payload);
        toast.success(`Đã cập nhật thông tin đội "${payload.name}".`);
      }
    });
  };

  const handleDeleteTeam = () => {
    const team = teamCrud.deleting;
    teamCrud.confirmDelete(async () => {
      await deleteTeam(team.id);
      if (expandedTeamId === team.id) setExpandedTeamId(null);
      toast.success(`Đã xóa đội "${team.name}".`);
    }).catch((err) => {
      toast.error(err?.response?.data?.message || 'Không thể xóa đội bóng.');
    });
  };

  // ── Expand: Team Roster ────────────────────────────────
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  const toggleTeamExpand = (teamId) => {
    if (expandedTeamId === teamId) {
      setExpandedTeamId(null);
    } else {
      setExpandedTeamId(teamId);
      fetchPlayers(teamId); // dùng cache nếu còn hợp lệ
    }
  };

  // ── CRUD Modal: Player (useCrudModal) ─────────────────
  const [playerTargetTeamId, setPlayerTargetTeamId] = useState(null);
  const playerCrud = useCrudModal({
    emptyForm: EMPTY_PLAYER,
    onSuccess: () => { if (playerTargetTeamId) fetchPlayers(playerTargetTeamId, { force: true }); },
  });

  const openAddPlayer = (teamId) => {
    setPlayerTargetTeamId(teamId);
    playerCrud.openAdd();
  };

  const handleSavePlayer = () => {
    if (!playerCrud.form.name.trim()) { playerCrud.setFormError('Vui lòng nhập tên cầu thủ.'); return; }
    if (!playerCrud.form.number || isNaN(playerCrud.form.number)) { playerCrud.setFormError('Vui lòng nhập số áo hợp lệ.'); return; }
    playerCrud.save(async () => {
      // Dùng addNewPlayerToTeam từ teamStore (2 bước: tạo Player + addToTeam)
      await addNewPlayerToTeam(playerTargetTeamId, {
        name: playerCrud.form.name.trim(),
        jersey_number: parseInt(playerCrud.form.number),
        position: playerCrud.form.position,
      });
      toast.success(`Đã thêm cầu thủ "${playerCrud.form.name.trim()}" vào đội!`);
    });
  };

  // ── Delete Player ──────────────────────────────────────
  const [deletePlayerState, setDeletePlayerState] = useState(null);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState(false);

  const handleDeletePlayer = async () => {
    const { player, teamId } = deletePlayerState;
    setIsDeletingPlayer(true);
    try {
      // Dùng removePlayers từ teamStore (bulk delete đúng route)
      await removePlayers(teamId, [player.id]);
      toast.success('Đã xóa cầu thủ khỏi đội.');
      setDeletePlayerState(null);
      fetchPlayers(teamId, { force: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xóa cầu thủ.');
    } finally {
      setIsDeletingPlayer(false);
    }
  };

  const getTeamRoster = (team) => getPlayersFromCache(team.id);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Đội Bóng</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{effectiveSeasonId ? filteredTeams.length : meta.total}</span>
              {effectiveSeasonId ? ' đội đã được duyệt trong mùa giải' : ' đội trong hệ thống'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetchTeams}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={openAddTeam}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-5 h-5" /> Thêm đội bóng
            </button>
          </div>
        </div>

        {/* Season Selector + Search */}
        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg shadow-black/20">
          {/* Season select */}
          <div className="relative shrink-0">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 pointer-events-none" />
            <select
              value={selectedSeasonId}
              onChange={e => { setSelectedSeasonId(e.target.value); setExpandedTeamId(null); }}
              className="pl-10 pr-8 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white font-bold focus:outline-none focus:border-neon text-sm appearance-none min-w-[200px]"
            >
              <option value="">-- Tất cả mùa giải --</option>
              {seasons.map(s => {
                const icon = { registration_open: '✅', ongoing: '🔴', finished: '✓', upcoming: '⏳', cancelled: '❌' }[s.status] ?? '';
                return <option key={s.id} value={s.id}>{icon} {s.name}</option>;
              })}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên đội..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">Logo</th>
                  <th className="py-4 px-6">Đội bóng</th>
                  <th className="py-4 px-6">HLV</th>
                  <th className="py-4 px-6 text-center">{effectiveSeasonId ? 'Trạng thái mùa giải' : 'Trạng thái'}</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading || loadingSeasonTeams ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-navy-light">
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="py-4 px-6">
                          <div className="skeleton h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : fetchError || seasonTeamsError ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-red-500/50" />
                        <p className="font-semibold">{fetchError || seasonTeamsError}</p>
                        <button
                          onClick={refetchTeams}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                        >Thử lại</button>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">
                          {searchTerm
                            ? `Không tìm thấy đội nào cho "${searchTerm}"`
                            : effectiveSeasonId
                              ? 'Không có đội nào đăng ký trong mùa giải này.'
                              : 'Chưa có đội bóng nào.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTeams.map((team, idx) => (
                    <Fragment key={team.id}>
                      {/* Team Row */}
                      <tr key={team.id} className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                        <td className="py-4 px-6 text-center">
                          {team.logo ? (
                            <img src={team.logo} alt={team.name} className="w-10 h-10 rounded-full object-cover mx-auto border border-navy-light" />
                          ) : (
                        <div className="w-10 h-10 rounded-full bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-base mx-auto text-white">
                              {team.name?.[0]?.toUpperCase()}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-white">{team.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">#{team.id}</p>
                        </td>
                        <td className="py-4 px-6 text-gray-300 text-sm">{team.coach_name || '—'}</td>
                        <td className="py-4 px-6 text-center">
                          {effectiveSeasonId ? (
                            /* Khi lọc theo mùa: chỉ hiện badge Đã duyệt */
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border bg-emerald-400/10 text-emerald-400 border-emerald-400/30">
                              <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              Đã duyệt
                            </span>
                          ) : (
                            /* Khi xem tất cả: hiện Active/Inactive */
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                              team.is_active
                                ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                                : 'bg-red-400/10 text-red-400 border-red-400/30'
                            }`}>
                              {team.is_active ? 'Active' : 'Inactive'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditTeam(team)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors" title="Chỉnh sửa">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={() => teamCrud.setDeleting(team)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors" title="Xóa đội">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleTeamExpand(team.id)}
                              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-bold rounded-lg border transition-all ${
                                expandedTeamId === team.id
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-navy-dark text-gray-300 border-navy-light hover:bg-navy-light'
                              }`}
                            >
                              <Users className="w-4 h-4" />
                              <span className="hidden sm:inline">Đội hình</span>
                              {expandedTeamId === team.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Roster */}
                      {expandedTeamId === team.id && (
                        <tr className="border-b border-navy-light">
                          <td colSpan={5} className="p-0">
                            <div className="bg-navy-dark/60 border-l-4 border-blue-600 px-6 py-5 animate-fade-in">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                  <Users className="w-4 h-4 text-neon" />
                                  Danh sách cầu thủ – {team.name}
                                  <span className="ml-2 bg-navy-light px-2 py-0.5 rounded text-xs text-gray-400 font-normal">
                                {playersLoading[team.id] ? '...' : `${getTeamRoster(team).length} TV`}
                                  </span>
                                </h4>
                                <button
                                  onClick={() => openAddPlayer(team.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                                >
                                  <UserPlus className="w-3.5 h-3.5" /> Thêm cầu thủ
                                </button>
                              </div>

                               {playersLoading[team.id] ? (
                                <div className="space-y-2">
                                  {[1, 2, 3].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
                                </div>
                              ) : getTeamRoster(team).length === 0 ? (
                                <div className="text-center py-8 text-gray-500 text-sm">
                                  Chưa có cầu thủ nào. Nhấn "Thêm cầu thủ" để bắt đầu.
                                </div>
                              ) : (
                                <div className="bg-navy border border-navy-light rounded-xl overflow-hidden">
                                  <table className="w-full text-sm text-left">
                                    <thead>
                                      <tr className="bg-navy-dark text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                                        <th className="py-3 px-4 w-16 text-center">Số</th>
                                        <th className="py-3 px-4">Cầu thủ</th>
                                        <th className="py-3 px-4">Vị trí</th>
                                        <th className="py-3 px-4">Vai trò</th>
                                        <th className="py-3 px-4 text-right">Thao tác</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-light">
                                      {getTeamRoster(team).map(player => (
                                        <tr key={player.id} className="hover:bg-navy-dark/50 transition-colors group">
                                          <td className="py-3 px-4 text-center font-black text-gray-300">{player.jersey_number ?? player.number ?? '—'}</td>
                                          <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                              <div className="w-7 h-7 rounded-full bg-navy-dark border border-navy-light flex items-center justify-center text-xs font-bold text-gray-300">
                                                {(player.player?.name ?? player.name ?? '?')[0]?.toUpperCase()}
                                              </div>
                                              <span className="font-semibold text-white">{player.player?.name ?? player.name ?? '—'}</span>
                                            </div>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 text-xs font-bold rounded bg-navy-dark text-gray-300 border border-navy-light">
                                              {player.position ?? '—'}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${
                                              player.role === 'captain'
                                                ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                                                : 'bg-navy-dark text-gray-400 border-navy-light'
                                            }`}>
                                              {player.role === 'captain' ? '⭐ Đội trưởng' : player.role === 'vice_captain' ? 'Phó' : 'TV'}
                                            </span>
                                          </td>
                                          <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                              <button
                                                onClick={() => setDeletePlayerState({ player, teamId: team.id })}
                                                className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                                                title="Xóa cầu thủ"
                                              >
                                                <Trash2 className="w-3.5 h-3.5" />
                                              </button>
                                            </div>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}

        </div>
      </div>

      {/* Team Add/Edit Modal */}
      {teamCrud.modal && (
        <TeamFormModal
          mode={teamCrud.modal}
          form={teamCrud.form}
          setForm={teamCrud.setForm}
          formError={teamCrud.formError}
          logoPreview={logoPreview}
          isSaving={teamCrud.isSaving}
          onSave={handleSaveTeam}
          onClose={closeTeamModal}
          onLogoChange={handleLogoChange}
        />
      )}

      {/* Player Add Modal */}
      {playerCrud.modal && (
        <PlayerFormModal
          mode={playerCrud.modal}
          form={playerCrud.form}
          setForm={playerCrud.setForm}
          formError={playerCrud.formError}
          isSaving={playerCrud.isSaving}
          onSave={handleSavePlayer}
          onClose={playerCrud.closeModal}
        />
      )}

      {/* Delete Confirm – Team */}
      {teamCrud.deleting && (
        <ConfirmDeleteModal
          title="Xóa đội bóng?"
          message={<>Xóa <strong className="text-white">{teamCrud.deleting.name}</strong>? Hành động này không thể hoàn tác và sẽ xóa toàn bộ cầu thủ.</>}
          onConfirm={handleDeleteTeam}
          onCancel={() => teamCrud.setDeleting(null)}
          isDeleting={teamCrud.isDeleting}
        />
      )}

      {/* Delete Confirm – Player */}
      {deletePlayerState && (
        <ConfirmDeleteModal
          title="Xóa cầu thủ?"
          message={<>Xóa cầu thủ <strong className="text-white">{deletePlayerState.player?.player?.name ?? deletePlayerState.player?.name ?? 'Cầu thủ'}</strong> khỏi đội?</>}
          onConfirm={handleDeletePlayer}
          onCancel={() => setDeletePlayerState(null)}
          isDeleting={isDeletingPlayer}
        />
      )}
    </AdminLayout>
  );
}
