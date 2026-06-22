import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, Users, X, Save, UploadCloud,
  ChevronDown, ChevronUp, AlertTriangle, Loader2, CheckCircle2,
  UserPlus, RefreshCw, Search
} from 'lucide-react';
import { useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useTeamStore from '../../store/teamStore';
import ConfirmDeleteModal from '../../components/admin/ConfirmDeleteModal';

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
  const {
    teams, meta, isLoading, error: fetchError,
    fetchAll: fetchTeamsStore,
    create: createTeam,
    update: updateTeam,
    softDelete: deleteTeam,
    fetchPlayers, getPlayersFromCache, playersLoading,
    addNewPlayerToTeam, removePlayers,
  } = useTeamStore();

  // ── Debounced search ──────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  const refetchTeams = useCallback(() => {
    fetchTeamsStore({ q: debouncedSearch || undefined, sort: 'created_at', direction: 'desc', force: !!debouncedSearch });
  }, [fetchTeamsStore, debouncedSearch]);

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
              <span className="font-bold text-neon">{meta.total}</span> đội tham gia giải đấu
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

        {/* Search */}
        <div className="bg-navy p-4 rounded-xl border border-navy-light flex gap-3 shadow-lg shadow-black/20">
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
                  <th className="py-4 px-6 text-center">Trạng thái</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-navy-light">
                      {[1, 2, 3, 4, 5].map(j => (
                        <td key={j} className="py-4 px-6">
                          <div className="skeleton h-4 w-full rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : fetchError ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-red-400">
                      <div className="flex flex-col items-center gap-3">
                        <AlertTriangle className="w-10 h-10 text-red-500/50" />
                        <p className="font-semibold">{fetchError}</p>
                        <button
                          onClick={refetchTeams}
                          className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-600/30 transition-colors"
                        >Thử lại</button>
                      </div>
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Users className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">
                          {searchTerm ? `Không tìm thấy đội nào cho "${searchTerm}"` : 'Chưa có đội bóng nào.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  teams.map((team, idx) => (
                    <React.Fragment key={team.id}>
                      {/* Team Row */}
                      <tr className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
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
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                            team.is_active
                              ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                              : 'bg-red-400/10 text-red-400 border-red-400/30'
                          }`}>
                            {team.is_active ? 'Active' : 'Inactive'}
                          </span>
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
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team Add/Edit Modal */}
      {teamCrud.modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTeamModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {teamCrud.modal === 'add' ? 'Thêm đội bóng mới' : 'Chỉnh sửa đội bóng'}
              </h3>
              <button onClick={closeTeamModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {teamCrud.formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{teamCrud.formError}
                </div>
              )}

              {/* Logo Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-navy-dark border-2 border-navy-light flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-gray-500" />
                  )}
                </div>
                <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-navy-dark border border-navy-light rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  {logoPreview ? 'Đổi logo' : 'Tải logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tên đội bóng <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={teamCrud.form.name}
                  onChange={e => teamCrud.setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="VD: Kỹ thuật Phần mềm K21"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">HLV / Đội trưởng</label>
                <input
                  type="text"
                  value={teamCrud.form.coach_name}
                  onChange={e => teamCrud.setForm(f => ({ ...f, coach_name: e.target.value }))}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mô tả</label>
                <textarea
                  rows={3}
                  value={teamCrud.form.description}
                  onChange={e => teamCrud.setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Mô tả ngắn về đội bóng..."
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 shrink-0">
              <button onClick={closeTeamModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleSaveTeam}
                disabled={teamCrud.isSaving}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {teamCrud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {teamCrud.modal === 'add' ? 'Tạo đội' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player Add Modal */}
      {playerCrud.modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={playerCrud.closeModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {playerCrud.modal === 'add' ? 'Thêm cầu thủ vào đội' : 'Chỉnh sửa cầu thủ'}
              </h3>
              <button onClick={playerCrud.closeModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {playerCrud.formError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />{playerCrud.formError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên <span className="text-red-400">*</span></label>
                <input type="text" value={playerCrud.form.name} onChange={e => playerCrud.setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số áo <span className="text-red-400">*</span></label>
                  <input type="number" min="1" max="99" value={playerCrud.form.number} onChange={e => playerCrud.setForm(f => ({ ...f, number: e.target.value }))} placeholder="10"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm text-center font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
                  <select value={playerCrud.form.position} onChange={e => playerCrud.setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm">
                    {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
              <button onClick={playerCrud.closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button onClick={handleSavePlayer} disabled={playerCrud.isSaving}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70">
                {playerCrud.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {playerCrud.modal === 'add' ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
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
