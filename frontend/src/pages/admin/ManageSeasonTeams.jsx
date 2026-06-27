import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, Calendar, Trophy, Plus, CheckCircle2, XCircle,
  Trash2, RefreshCw, AlertTriangle, Loader2, Save, Dices,
  Eraser, Edit, Filter, X, ChevronDown, TrendingUp
} from 'lucide-react';
import { seasonApi, seasonTeamApi, teamApi, groupApi } from '../../api';
import { useApiQuery, useApiMutation, useCrudModal } from '../../hooks';
import useToastStore from '../../store/toastStore';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import StatusBadge from '../../components/ui/StatusBadge';
import { INPUT, BTN_PRIMARY, BTN_SECONDARY, BTN_ICON } from '../../utils/adminStyles';

const STATUS_OPTIONS = [
  { value: '',          label: 'Tất cả trạng thái' },
  { value: 'pending',   label: '⏳ Chờ duyệt' },
  { value: 'approved',  label: '✅ Đã duyệt' },
  { value: 'active',    label: '🔵 Đang tham gia' },
  { value: 'rejected',  label: '❌ Từ chối' },
  { value: 'withdrawn', label: '🚫 Đã rút' },
];

const SEASON_STATUS_COLORS = {
  registration_open: 'text-emerald-400',
  ongoing:           'text-red-400',
  finished:          'text-gray-400',
  upcoming:          'text-amber-400',
  cancelled:         'text-gray-500',
};



export default function ManageSeasonTeams() {
  const toast = useToastStore();
  const [activeTab, setActiveTab] = useState('teams');

  // ── Seasons ─────────────────────────────────────────────────
  const [seasons, setSeasons]             = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [filterStatus, setFilterStatus]   = useState('');
  const [filterSeasonStatus, setFilterSeasonStatus] = useState('');

  useEffect(() => {
    seasonApi.getAll({ per_page: 100, sort: 'id', direction: 'desc' })
      .then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        const data = Array.isArray(payload?.data) ? payload.data : [];
        setSeasons(data);
      })
      .catch(() => toast.error('Lỗi khi tải danh sách mùa giải.'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filtered seasons (dropdown filter) ────────────────────
  const filteredSeasons = useMemo(() => {
    if (!filterSeasonStatus) return seasons;
    return seasons.filter(s => s.status === filterSeasonStatus);
  }, [seasons, filterSeasonStatus]);

  // ── Season Teams ─────────────────────────────────────────────
  const { data: allSeasonTeams, isLoading: loadingTeams, fetch: fetchSeasonTeams } = useApiQuery(
    (params) => seasonTeamApi.getAll(params),
    { autoFetch: false, perPage: 200 }
  );

  const reloadTeams = useCallback(() => {
    if (selectedSeason) {
      fetchSeasonTeams({ season_id: selectedSeason, per_page: 200 });
    } else {
      fetchSeasonTeams({ per_page: 500 }); // Lấy tất cả khi không chọn mùa
    }
  }, [selectedSeason, fetchSeasonTeams]);

  useEffect(() => { reloadTeams(); }, [reloadTeams]);

  // ── Client-side filter by status ───────────────────────────
  const seasonTeams = useMemo(() => {
    if (!filterStatus) return allSeasonTeams;
    return allSeasonTeams.filter(st => st.status === filterStatus);
  }, [allSeasonTeams, filterStatus]);

  // ── Summary stats ───────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     allSeasonTeams.length,
    pending:   allSeasonTeams.filter(s => s.status === 'pending').length,
    approved:  allSeasonTeams.filter(s => s.status === 'approved').length,
    active:    allSeasonTeams.filter(s => s.status === 'active').length,
    rejected:  allSeasonTeams.filter(s => s.status === 'rejected').length,
    withdrawn: allSeasonTeams.filter(s => s.status === 'withdrawn').length,
  }), [allSeasonTeams]);

  // ── Actions: Status ─────────────────────────────────────────
  const statusMutation = useApiMutation();
  const handleUpdateStatus = (id, newStatus) => {
    statusMutation.mutate(async () => {
      await seasonTeamApi.updateStatus(id, { status: newStatus });
      toast.success(`Đã cập nhật trạng thái thành "${newStatus}"!`);
      reloadTeams();
    }).catch(err => toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái.'));
  };

  // ── Actions: Delete ─────────────────────────────────────────
  const deleteMutation = useApiMutation();
  const [deletingId, setDeletingId] = useState(null);
  const confirmDelete = () => {
    deleteMutation.mutate(async () => {
      await seasonTeamApi.delete(deletingId);
      toast.success('Đã xóa đội khỏi mùa giải.');
      setDeletingId(null);
      reloadTeams();
    }).catch(err => toast.error(err?.response?.data?.message || 'Lỗi khi xóa.'));
  };

  // ── Actions: Add Team ───────────────────────────────────────
  const [allTeams, setAllTeams] = useState([]);
  const addTeamModal = useCrudModal({ emptyForm: { team_id: '' } });

  const openAddTeam = () => {
    if (allTeams.length === 0) {
      teamApi.getTeams({ per_page: 200 }).then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        setAllTeams(Array.isArray(payload?.data) ? payload.data : []);
      });
    }
    addTeamModal.openAdd();
  };

  const handleAddTeam = () => {
    if (!addTeamModal.form.team_id) {
      addTeamModal.setFormError('Vui lòng chọn đội bóng.'); return;
    }
    addTeamModal.save(async () => {
      await seasonTeamApi.adminAdd({
        season_id: Number(selectedSeason),
        team_id: Number(addTeamModal.form.team_id),
        status: 'approved',
      });
      toast.success('Đã thêm đội vào mùa giải!');
      reloadTeams();
    }).catch(err => addTeamModal.setFormError(err?.response?.data?.message || 'Lỗi khi thêm đội.'));
  };

  // ── Draw Groups ─────────────────────────────────────────────
  const [drawForm, setDrawForm] = useState({ phase_id: '', teams_per_group: 4 });
  const drawMutation      = useApiMutation();
  const clearDrawMutation = useApiMutation();

  const handleDraw = () => {
    if (!drawForm.phase_id) { toast.error('Vui lòng nhập ID của Phase!'); return; }
    drawMutation.mutate(async () => {
      await groupApi.drawGroups(Number(drawForm.phase_id), { teams_per_group: Number(drawForm.teams_per_group) });
      toast.success('Bốc thăm chia bảng thành công!');
      reloadTeams();
    }).catch(err => toast.error(err?.response?.data?.message || 'Lỗi khi bốc thăm.'));
  };

  const handleClearDraw = () => {
    if (!drawForm.phase_id) { toast.error('Vui lòng nhập ID của Phase để xóa!'); return; }
    if (!window.confirm('Xóa kết quả bốc thăm của Phase này?')) return;
    clearDrawMutation.mutate(async () => {
      await groupApi.clearDraw(Number(drawForm.phase_id));
      toast.success('Đã xóa kết quả chia bảng!');
      reloadTeams();
    }).catch(err => toast.error(err?.response?.data?.message || 'Lỗi khi xóa kết quả.'));
  };

  // ── Manual Group Assign ─────────────────────────────────────
  const assignModal = useCrudModal({ emptyForm: { group_id: '' } });
  const openAssignGroup = (st) => assignModal.openEdit(st, { group_id: st.group_id || '' });
  const handleAssign = () => {
    if (!assignModal.form.group_id) { assignModal.setFormError('Vui lòng nhập ID bảng!'); return; }
    assignModal.save(async () => {
      await seasonTeamApi.assignGroup(assignModal.editing.id, { group_id: Number(assignModal.form.group_id) });
      toast.success('Đã xếp đội vào bảng thủ công!');
      reloadTeams();
    }).catch(err => assignModal.setFormError(err?.response?.data?.message || 'Lỗi khi xếp bảng.'));
  };

  const selectedSeasonObj = seasons.find(s => String(s.id) === String(selectedSeason));

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" /> Quản lý Mùa giải & Bốc thăm
            </h2>
            <p className="text-gray-400 text-sm mt-1">Duyệt đội đăng ký và tiến hành chia bảng ngẫu nhiên.</p>
          </div>

          {/* Season Selector + Season Status Filter */}
          <div className="flex flex-col gap-2 min-w-[260px]">
            {/* Season status quick filter */}
            <div className="flex gap-1.5 flex-wrap">
              {[
                { value: '', label: 'Tất cả' },
                { value: 'registration_open', label: '✅ Mở ĐK' },
                { value: 'ongoing',           label: '🔴 Đang diễn' },
                { value: 'upcoming',          label: '⏳ Sắp tới' },
                { value: 'finished',          label: '✓ Kết thúc' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterSeasonStatus(opt.value); setSelectedSeason(''); }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${
                    filterSeasonStatus === opt.value
                      ? 'bg-neon/10 border-neon/40 text-neon'
                      : 'bg-navy border-navy-light text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Season dropdown */}
            <div className="relative">
              <select
                className="w-full bg-navy border border-navy-light rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-neon focus:ring-1 focus:ring-neon/20 text-sm appearance-none cursor-pointer transition-all shadow-md shadow-black/15"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                <option value="">-- Chọn mùa giải --</option>
                {filteredSeasons.map(s => {
                  const icon = { registration_open: '✅', ongoing: '🔴', finished: '✓', upcoming: '⏳', cancelled: '❌' }[s.status] ?? '';
                  return <option key={s.id} value={s.id}>{icon} {s.name}</option>;
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Selected season status badge */}
            {selectedSeasonObj && (
              <div className={`text-xs font-bold flex items-center gap-1.5 ${SEASON_STATUS_COLORS[selectedSeasonObj.status] ?? 'text-gray-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {selectedSeasonObj.name} — {selectedSeasonObj.status}
              </div>
            )}
          </div>
        </div>

        {/* ── Empty state: chưa chọn mùa ───────────────────────── */}
        {!selectedSeason && (
          <div className="bg-navy border border-navy-light rounded-2xl py-20 text-center text-gray-500 shadow-xl shadow-black/20">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="font-semibold text-lg">Vui lòng chọn mùa giải để xem danh sách đăng ký</p>
          </div>
        )}

        {/* ── Content khi đã chọn mùa ─────────────────────────── */}
        {selectedSeason && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Tổng số', value: stats.total,     color: 'blue',    icon: Users },
                { label: 'Chờ duyệt', value: stats.pending,  color: 'amber',   icon: Calendar },
                { label: 'Đã duyệt',  value: stats.approved, color: 'emerald', icon: CheckCircle2 },
                { label: 'Hoạt động', value: stats.active,   color: 'sky',     icon: TrendingUp },
                { label: 'Từ chối',   value: stats.rejected, color: 'red',     icon: XCircle },
                { label: 'Đã rút',    value: stats.withdrawn,color: 'gray',    icon: X },
              ].map(({ label, value, color, icon: Icon }) => (
                <div
                  key={label}
                  onClick={() => setFilterStatus(prev => prev === label.toLowerCase() ? '' : '')}
                  className={`bg-navy border border-navy-light rounded-xl p-4 shadow-lg shadow-black/15 hover:border-${color}-500/40 transition-all cursor-pointer group`}
                >
                  <div className={`text-2xl font-black text-${color}-400 group-hover:scale-110 transition-transform`}>{value}</div>
                  <div className="text-xs text-gray-400 font-bold mt-1 flex items-center gap-1">
                    <Icon className={`w-3 h-3 text-${color}-400`} />
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-navy-light">
              <button
                className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'teams' ? 'border-neon text-neon' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('teams')}
              >
                Danh sách đội đăng ký
              </button>
              <button
                className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'draw' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                onClick={() => setActiveTab('draw')}
              >
                <Dices className="w-4 h-4" /> Bốc thăm chia bảng
              </button>
            </div>

            {/* ── Tab: Teams ─────────────────────────────────────── */}
            {activeTab === 'teams' && (
              <div className="bg-navy border border-navy-light rounded-2xl shadow-xl shadow-black/20 overflow-hidden">

                {/* Table header with filter */}
                <div className="p-4 border-b border-navy-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-navy-dark">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    Danh sách ({seasonTeams.length}
                    {filterStatus && <span className="text-gray-400"> / {allSeasonTeams.length}</span>})
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Status filter */}
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="pl-8 pr-8 py-2 bg-navy border border-navy-light rounded-lg text-white text-xs font-bold focus:outline-none focus:border-neon appearance-none cursor-pointer transition-all"
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                    {filterStatus && (
                      <button onClick={() => setFilterStatus('')} className="p-2 rounded-lg text-gray-400 hover:text-white border border-navy-light hover:border-gray-500 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={reloadTeams} disabled={loadingTeams} className={BTN_ICON}>
                      <RefreshCw className={`w-4 h-4 ${loadingTeams ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={openAddTeam} className={BTN_PRIMARY}>
                      <Plus className="w-4 h-4" /> Thêm đội
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap min-w-[700px]">
                    <thead>
                      <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6 w-16 text-center">ID</th>
                        <th className="py-4 px-6">Đội bóng</th>
                        <th className="py-4 px-6 text-center">Trạng thái</th>
                        <th className="py-4 px-6 text-center">Group</th>
                        <th className="py-4 px-6 text-center">Duyệt</th>
                        <th className="py-4 px-6 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-navy-light/50">
                      {loadingTeams ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <tr key={i}>
                            {[1,2,3,4,5,6].map(j => (
                              <td key={j} className="py-4 px-6"><div className="skeleton h-5 w-full rounded" /></td>
                            ))}
                          </tr>
                        ))
                      ) : seasonTeams.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-16 text-center text-gray-500">
                            <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="font-semibold">{filterStatus ? 'Không có đội nào với trạng thái này' : 'Chưa có đội nào đăng ký'}</p>
                            {filterStatus && (
                              <button onClick={() => setFilterStatus('')} className="mt-3 text-xs text-blue-400 hover:text-blue-300 underline">
                                Xóa bộ lọc
                              </button>
                            )}
                          </td>
                        </tr>
                      ) : (
                        seasonTeams.map(st => (
                          <tr key={st.id} className="hover:bg-navy-dark/70 transition-colors group">
                            <td className="py-4 px-6 text-center text-gray-500 text-xs font-mono">#{st.id}</td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-xs text-white shadow-md overflow-hidden">
                                  {st.team?.logo
                                    ? <img src={st.team.logo} alt="logo" className="w-full h-full object-cover" />
                                    : <span className="text-sm font-black text-neon">{st.team?.name?.[0]}</span>
                                  }
                                </div>
                                <div>
                                  <p className="font-bold text-white text-sm">{st.team?.name || 'Unknown Team'}</p>
                                  {st.team?.city && <p className="text-gray-500 text-xs">{st.team.city}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <StatusBadge status={st.status} variant="seasonTeam" />
                            </td>
                            <td className="py-4 px-6 text-center">
                              {st.group_id ? (
                                <span className="font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30 text-xs shadow-sm shadow-purple-500/10">
                                  Bảng #{st.group_id}
                                </span>
                              ) : (
                                <span className="text-gray-500 text-xs">—</span>
                              )}
                            </td>
                            <td className="py-4 px-6 text-center">
                              {st.status === 'pending' && (
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleUpdateStatus(st.id, 'approved')}
                                    className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-90"
                                    title="Duyệt đăng ký"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(st.id, 'rejected')}
                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 shadow-sm shadow-red-500/10 hover:shadow-red-500/20 transition-all active:scale-90"
                                    title="Từ chối"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => openAssignGroup(st)}
                                  className="p-1.5 rounded-lg bg-navy-light text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 shadow-sm transition-all active:scale-90"
                                  title="Xếp bảng thủ công"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeletingId(st.id)}
                                  className="p-1.5 rounded-lg bg-navy-light text-red-400 hover:text-white hover:bg-red-600 border border-red-500/20 hover:border-red-500 shadow-sm transition-all active:scale-90"
                                  title="Xóa khỏi giải"
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
              </div>
            )}

            {/* ── Tab: Draw Groups ────────────────────────────────── */}
            {activeTab === 'draw' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-navy border border-navy-light rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
                  <div className="p-6 bg-navy-dark border-b border-navy-light">
                    <h3 className="font-black text-white text-lg flex items-center gap-2">
                      <Dices className="w-6 h-6 text-purple-400" /> Bốc thăm chia bảng
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      Hệ thống sẽ lấy toàn bộ các đội <strong className="text-emerald-400">Đã Duyệt (Approved)</strong> và phân bổ ngẫu nhiên vào các Bảng thuộc Phase chỉ định.
                    </p>
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-400 mb-1">CẢNH BÁO QUAN TRỌNG</p>
                        <p className="text-xs text-red-200/80">
                          Chỉ tiến hành bốc thăm khi <strong>TẤT CẢ CÁC ĐỘI ĐƯỢC DUYỆT ĐÃ HOÀN TẤT THANH TOÁN</strong> thực tế.
                          Hiện có <strong className="text-white">{stats.approved}</strong> đội Approved.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Phase ID <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          value={drawForm.phase_id}
                          onChange={e => setDrawForm({ ...drawForm, phase_id: e.target.value })}
                          placeholder="VD: 1"
                          className={INPUT + " font-mono text-center text-lg font-bold"}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Số đội / Bảng</label>
                        <input
                          type="number" min="2" max="8"
                          value={drawForm.teams_per_group}
                          onChange={e => setDrawForm({ ...drawForm, teams_per_group: e.target.value })}
                          className={INPUT + " text-center text-lg font-bold"}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4 border-t border-navy-light">
                      <button
                        onClick={handleDraw}
                        disabled={drawMutation.isLoading}
                        className="w-full py-3.5 rounded-xl font-black text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 flex items-center justify-center gap-2 transition-all active:scale-[.98] disabled:opacity-70"
                      >
                        {drawMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dices className="w-5 h-5" />}
                        TIẾN HÀNH BỐC THĂM
                      </button>

                      <button
                        onClick={handleClearDraw}
                        disabled={clearDrawMutation.isLoading}
                        className="w-full py-3 rounded-xl font-bold text-red-400 bg-navy-dark border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/5 hover:shadow-red-500/10 disabled:opacity-70 active:scale-[.98]"
                      >
                        {clearDrawMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
                        Xóa kết quả chia bảng
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-navy border border-navy-light rounded-2xl shadow-xl shadow-black/20 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 shadow-lg shadow-purple-500/10">
                    <Trophy className="w-10 h-10 text-purple-400 opacity-80" />
                  </div>
                  <h4 className="text-xl font-black text-gray-300">Kết quả bốc thăm</h4>
                  <p className="text-sm text-gray-500 mt-2 max-w-xs leading-relaxed">
                    Danh sách đội chia vào từng bảng có thể được theo dõi sau khi bốc thăm tại mục <strong className="text-white">Danh sách đội</strong> với Group ID tương ứng.
                  </p>
                  {stats.approved > 0 && (
                    <div className="mt-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 font-bold">
                      {stats.approved} đội đã sẵn sàng bốc thăm
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add Team Modal ──────────────────────────────────────── */}
      {addTeamModal.modal && (
        <AdminModal
          title="Thêm đội vào mùa giải"
          icon={Plus} iconClass="text-emerald-400"
          onClose={addTeamModal.closeModal}
          footer={<>
            <button onClick={addTeamModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleAddTeam} disabled={addTeamModal.isSaving} className={BTN_PRIMARY}>
              {addTeamModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Thêm đội
            </button>
          </>}
        >
          {addTeamModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{addTeamModal.formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Chọn đội bóng <span className="text-red-400">*</span>
            </label>
            <select
              className={INPUT}
              value={addTeamModal.form.team_id}
              onChange={e => addTeamModal.setForm({ team_id: e.target.value })}
            >
              <option value="">-- Chọn một đội --</option>
              {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </AdminModal>
      )}

      {/* ── Assign Group Modal ──────────────────────────────────── */}
      {assignModal.modal && (
        <AdminModal
          title="Xếp bảng thủ công"
          icon={Edit} iconClass="text-blue-400"
          onClose={assignModal.closeModal}
          footer={<>
            <button onClick={assignModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleAssign} disabled={assignModal.isSaving} className="flex items-center gap-2 px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-[.98] disabled:opacity-70">
              {assignModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </>}
        >
          {assignModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{assignModal.formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Group ID <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              className={INPUT}
              placeholder="VD: 12"
              value={assignModal.form.group_id}
              onChange={e => assignModal.setForm({ group_id: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">
              Đội <strong className="text-white">{assignModal.editing?.team?.name}</strong> sẽ được xếp vào bảng mang ID này.
            </p>
          </div>
        </AdminModal>
      )}

      {/* ── Delete Confirm ──────────────────────────────────────── */}
      {deletingId && (
        <ConfirmModal
          title="Xác nhận xóa?"
          message={`Xóa đội <strong class="text-white">#${deletingId}</strong> khỏi mùa giải hiện tại?`}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
          isLoading={deleteMutation.isLoading}
        />
      )}
    </AdminLayout>
  );
}
