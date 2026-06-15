import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Plus, Edit, Trash2, Users, X, Save, UploadCloud,
  ChevronDown, ChevronUp, AlertTriangle, Loader2, CheckCircle2, UserPlus
} from 'lucide-react';
import { teamsData, rosterData } from '../../data/data';
import useToastStore from '../../store/toastStore';

// ─── Delete Confirm Modal ───────────────────────────────
function ConfirmDeleteModal({ name, type = 'team', onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Xóa {type === 'team' ? 'đội bóng' : 'cầu thủ'}?</h4>
          <p className="text-sm text-gray-400">Xóa <strong className="text-white">{name}</strong>? Hành động này không thể hoàn tác.</p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 border border-navy-light hover:text-white transition-colors">Hủy</button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

const POSITIONS = [
  { value: 'GK', label: 'GK – Thủ môn' },
  { value: 'DEF', label: 'DEF – Hậu vệ' },
  { value: 'MID', label: 'MID – Tiền vệ' },
  { value: 'FW', label: 'FW – Tiền đạo' },
];

const EMPTY_TEAM = { name: '', short: '', coach: '', logo: '' };
const EMPTY_PLAYER = { name: '', number: '', position: 'FW' };

export default function ManageTeams() {
  const toast = useToastStore();

  // ── Data State ─────────────────────────────────────────
  const [teams, setTeams] = useState(
    teamsData.map(t => ({
      ...t,
      players_count: t.players,
      roster: rosterData.map(p => ({ ...p, teamId: t.id })),
    }))
  );

  // ── Expand State ───────────────────────────────────────
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // ── Team Modal ─────────────────────────────────────────
  const [teamModal, setTeamModal] = useState(null); // null | 'add' | 'edit'
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState(EMPTY_TEAM);
  const [teamFormError, setTeamFormError] = useState('');
  const [isSavingTeam, setIsSavingTeam] = useState(false);

  // ── Player Modal (per-team roster) ────────────────────
  const [playerModal, setPlayerModal] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [playerTargetTeamId, setPlayerTargetTeamId] = useState(null);
  const [playerForm, setPlayerForm] = useState(EMPTY_PLAYER);
  const [playerFormError, setPlayerFormError] = useState('');
  const [isSavingPlayer, setIsSavingPlayer] = useState(false);

  // ── Delete State ───────────────────────────────────────
  const [deleteTeam, setDeleteTeam] = useState(null);
  const [deletePlayer, setDeletePlayer] = useState(null);
  const [isDeletingTeam, setIsDeletingTeam] = useState(false);
  const [isDeletingPlayer, setIsDeletingPlayer] = useState(false);

  // ── Team CRUD ──────────────────────────────────────────
  const openAddTeam = () => {
    setTeamForm(EMPTY_TEAM);
    setTeamFormError('');
    setEditingTeam(null);
    setTeamModal('add');
  };

  const openEditTeam = (team) => {
    setTeamForm({ name: team.name, short: team.short, coach: team.coach, logo: team.logo });
    setTeamFormError('');
    setEditingTeam(team);
    setTeamModal('edit');
  };

  const closeTeamModal = () => { setTeamModal(null); setEditingTeam(null); };

  const handleSaveTeam = async () => {
    if (!teamForm.name.trim()) { setTeamFormError('Vui lòng nhập tên đội bóng.'); return; }
    setIsSavingTeam(true);
    await new Promise(r => setTimeout(r, 500));

    if (teamModal === 'add') {
      const newTeam = {
        id: Date.now(),
        name: teamForm.name.trim(),
        short: teamForm.short.trim() || teamForm.name.trim().slice(0, 4).toUpperCase(),
        logo: teamForm.logo.trim() || '⚽',
        coach: teamForm.coach.trim(),
        players_count: 0,
        roster: [],
      };
      setTeams(prev => [newTeam, ...prev]);
      toast.success(`Đã tạo đội "${newTeam.name}" thành công!`);
    } else {
      setTeams(prev => prev.map(t => t.id === editingTeam.id
        ? { ...t, name: teamForm.name.trim(), short: teamForm.short.trim(), coach: teamForm.coach.trim(), logo: teamForm.logo.trim() }
        : t
      ));
      toast.success(`Đã cập nhật thông tin đội "${teamForm.name}".`);
    }

    setIsSavingTeam(false);
    closeTeamModal();
  };

  const handleDeleteTeam = async () => {
    setIsDeletingTeam(true);
    await new Promise(r => setTimeout(r, 500));
    setTeams(prev => prev.filter(t => t.id !== deleteTeam.id));
    if (expandedTeamId === deleteTeam.id) setExpandedTeamId(null);
    toast.success(`Đã xóa đội "${deleteTeam.name}".`);
    setIsDeletingTeam(false);
    setDeleteTeam(null);
  };

  // ── Player CRUD (within team) ──────────────────────────
  const openAddPlayer = (teamId) => {
    setPlayerTargetTeamId(teamId);
    setPlayerForm(EMPTY_PLAYER);
    setPlayerFormError('');
    setEditingPlayer(null);
    setPlayerModal('add');
  };

  const openEditPlayer = (player, teamId) => {
    setPlayerTargetTeamId(teamId);
    setPlayerForm({ name: player.name, number: player.number, position: player.position });
    setPlayerFormError('');
    setEditingPlayer(player);
    setPlayerModal('edit');
  };

  const closePlayerModal = () => { setPlayerModal(null); setEditingPlayer(null); };

  const handleSavePlayer = async () => {
    if (!playerForm.name.trim()) { setPlayerFormError('Vui lòng nhập tên cầu thủ.'); return; }
    if (!playerForm.number || isNaN(playerForm.number)) { setPlayerFormError('Vui lòng nhập số áo hợp lệ.'); return; }

    const team = teams.find(t => t.id === playerTargetTeamId);
    const duplicate = team?.roster.find(p =>
      String(p.number) === String(playerForm.number) && p.id !== editingPlayer?.id
    );
    if (duplicate) { setPlayerFormError(`Số áo ${playerForm.number} đã tồn tại trong đội này.`); return; }

    setIsSavingPlayer(true);
    await new Promise(r => setTimeout(r, 500));

    if (playerModal === 'add') {
      const newPlayer = {
        id: Date.now(),
        name: playerForm.name.trim(),
        number: parseInt(playerForm.number),
        position: playerForm.position,
        teamId: playerTargetTeamId,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&backgroundColor=0f172a`,
      };
      setTeams(prev => prev.map(t => t.id === playerTargetTeamId
        ? { ...t, roster: [...t.roster, newPlayer], players_count: t.players_count + 1 }
        : t
      ));
      toast.success(`Đã thêm "${newPlayer.name}" vào đội!`);
    } else {
      setTeams(prev => prev.map(t => t.id === playerTargetTeamId
        ? {
            ...t,
            roster: t.roster.map(p => p.id === editingPlayer.id
              ? { ...p, name: playerForm.name.trim(), number: parseInt(playerForm.number), position: playerForm.position }
              : p
            )
          }
        : t
      ));
      toast.success(`Đã cập nhật thông tin cầu thủ "${playerForm.name}".`);
    }

    setIsSavingPlayer(false);
    closePlayerModal();
  };

  const handleDeletePlayer = async () => {
    setIsDeletingPlayer(true);
    await new Promise(r => setTimeout(r, 400));
    const { player, teamId } = deletePlayer;
    setTeams(prev => prev.map(t => t.id === teamId
      ? { ...t, roster: t.roster.filter(p => p.id !== player.id), players_count: t.players_count - 1 }
      : t
    ));
    toast.success(`Đã xóa cầu thủ "${player.name}" khỏi đội.`);
    setIsDeletingPlayer(false);
    setDeletePlayer(null);
  };

  const getTeamRoster = (team) => team.roster || [];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Đội Bóng</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{teams.length}</span> đội tham gia giải đấu
            </p>
          </div>
          <button
            onClick={openAddTeam}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Thêm đội bóng
          </button>
        </div>

        {/* Teams Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-16 text-center">Logo</th>
                  <th className="py-4 px-6">Đội bóng</th>
                  <th className="py-4 px-6 text-center">Số lượng</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => (
                  <React.Fragment key={team.id}>
                    {/* Team Row */}
                    <tr className="border-b border-navy-light hover:bg-navy-dark/70 transition-colors animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                      <td className="py-4 px-6 text-center">
                        <div className="w-10 h-10 rounded-full bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-base mx-auto">
                          {team.logo}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-white">{team.name}</p>
                        <p className="text-xs text-gray-400">HLV: {team.coach || 'Chưa có'} • <span className="font-bold text-neon">{team.short}</span></p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-black text-white text-lg">{getTeamRoster(team).length}</span>
                        <span className="text-gray-400 text-xs ml-1">/ 20</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditTeam(team)} className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors" title="Chỉnh sửa">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteTeam(team)} className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors" title="Xóa đội">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setExpandedTeamId(expandedTeamId === team.id ? null : team.id)}
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
                        <td colSpan={4} className="p-0">
                          <div className="bg-navy-dark/60 border-l-4 border-blue-600 px-6 py-5 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="font-bold text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-neon" />
                                Danh sách cầu thủ – {team.short}
                                <span className="ml-2 bg-navy-light px-2 py-0.5 rounded text-xs text-gray-400 font-normal">
                                  {getTeamRoster(team).length} TV
                                </span>
                              </h4>
                              <button
                                onClick={() => openAddPlayer(team.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                              >
                                <UserPlus className="w-3.5 h-3.5" /> Thêm cầu thủ
                              </button>
                            </div>

                            {getTeamRoster(team).length === 0 ? (
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
                                      <th className="py-3 px-4 text-right">Thao tác</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-navy-light">
                                    {getTeamRoster(team).map(player => (
                                      <tr key={player.id} className="hover:bg-navy-dark/50 transition-colors group">
                                        <td className="py-3 px-4 text-center font-black text-gray-300">{player.number}</td>
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-2">
                                            <img src={player.avatar} alt={player.name} className="w-7 h-7 rounded-full bg-navy-dark border border-navy-light" />
                                            <span className="font-semibold text-white">{player.name}</span>
                                          </div>
                                        </td>
                                        <td className="py-3 px-4">
                                          <span className="px-2 py-0.5 text-xs font-bold rounded bg-navy-dark text-gray-300 border border-navy-light">
                                            {player.position}
                                          </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                          <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditPlayer(player, team.id)} className="p-1.5 rounded text-blue-400 hover:bg-blue-500/10 transition-colors">
                                              <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => setDeletePlayer({ player, teamId: team.id })} className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team Add/Edit Modal */}
      {teamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTeamModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {teamModal === 'add' ? 'Thêm đội bóng mới' : 'Chỉnh sửa đội bóng'}
              </h3>
              <button onClick={closeTeamModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {teamFormError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg animate-fade-in">
                  {teamFormError}
                </div>
              )}

              {/* Logo emoji picker */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-2xl bg-navy-dark border-2 border-navy-light flex items-center justify-center text-4xl">
                  {teamForm.logo || '⚽'}
                </div>
                <input
                  type="text"
                  maxLength={2}
                  value={teamForm.logo}
                  onChange={e => setTeamForm({ ...teamForm, logo: e.target.value })}
                  placeholder="Emoji logo (VD: 🛡️)"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-center text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tên đội bóng <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={e => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="VD: Kỹ thuật Phần mềm K21"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Viết tắt</label>
                  <input
                    type="text"
                    maxLength={8}
                    value={teamForm.short}
                    onChange={e => setTeamForm({ ...teamForm, short: e.target.value.toUpperCase() })}
                    placeholder="KTPM K21"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">HLV / Đội trưởng</label>
                  <input
                    type="text"
                    value={teamForm.coach}
                    onChange={e => setTeamForm({ ...teamForm, coach: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
              <button onClick={closeTeamModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleSaveTeam}
                disabled={isSavingTeam}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {isSavingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {teamModal === 'add' ? 'Tạo đội' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Player Add/Edit Modal */}
      {playerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closePlayerModal} />
          <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                {playerModal === 'add' ? 'Thêm cầu thủ vào đội' : 'Chỉnh sửa cầu thủ'}
              </h3>
              <button onClick={closePlayerModal} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {playerFormError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {playerFormError}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={playerForm.name}
                  onChange={e => setPlayerForm({ ...playerForm, name: e.target.value })}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số áo <span className="text-red-400">*</span></label>
                  <input
                    type="number"
                    min="1" max="99"
                    value={playerForm.number}
                    onChange={e => setPlayerForm({ ...playerForm, number: e.target.value })}
                    placeholder="10"
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
                  <select
                    value={playerForm.position}
                    onChange={e => setPlayerForm({ ...playerForm, position: e.target.value })}
                    className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
                  >
                    {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
              <button onClick={closePlayerModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
              <button
                onClick={handleSavePlayer}
                disabled={isSavingPlayer}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70"
              >
                {isSavingPlayer ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {playerModal === 'add' ? 'Thêm' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm – Team */}
      {deleteTeam && (
        <ConfirmDeleteModal
          name={deleteTeam.name}
          type="team"
          onConfirm={handleDeleteTeam}
          onCancel={() => setDeleteTeam(null)}
          isDeleting={isDeletingTeam}
        />
      )}

      {/* Delete Confirm – Player */}
      {deletePlayer && (
        <ConfirmDeleteModal
          name={deletePlayer.player.name}
          type="player"
          onConfirm={handleDeletePlayer}
          onCancel={() => setDeletePlayer(null)}
          isDeleting={isDeletingPlayer}
        />
      )}
    </AdminLayout>
  );
}
