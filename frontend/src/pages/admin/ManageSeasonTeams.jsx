import React, { useState, useEffect, useCallback, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, Calendar, Trophy, Plus, CheckCircle2, XCircle,
  Trash2, RefreshCw, AlertTriangle, Loader2, Save, Dices,
  Eraser, Edit, Filter, X, ChevronDown, TrendingUp, ChevronLeft, ChevronRight,
  Search, Shirt
} from 'lucide-react';
import { seasonTeamApi, teamApi, userApi, roleApi } from '../../api';
import { useApiQuery, useApiMutation, useCrudModal, useDebouncedValue } from '../../hooks';
import useToastStore from '../../store/toastStore';
import useSeasonStore from '../../store/seasonStore';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmModal from '../../components/admin/ConfirmModal';
import GroupDrawUI from '../../components/admin/GroupDrawUI';
import KnockoutUI from '../../components/admin/KnockoutUI';
import ManageJerseysModal from '../../components/admin/ManageJerseysModal';
import StatusBadge from '../../components/ui/StatusBadge';
import { INPUT, BTN_PRIMARY, BTN_SECONDARY, BTN_ICON } from '../../utils/adminStyles';
import Pagination from '../../components/ui/Pagination';

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'pending', label: '⏳ Chờ duyệt' },
  { value: 'approved', label: '✅ Đã duyệt' },
  { value: 'active', label: '🔵 Đang tham gia' },
  { value: 'rejected', label: '❌ Từ chối' },
  { value: 'withdrawn', label: '🚫 Đã rút' },
];

const SEASON_STATUS_COLORS = {
  registration_open: 'text-emerald-400',
  ongoing: 'text-red-400',
  finished: 'text-gray-400',
  upcoming: 'text-amber-400',
  cancelled: 'text-gray-500',
};



export default function ManageSeasonTeams() {
  const toastError = useToastStore((state) => state.error);
  const toastSuccess = useToastStore((state) => state.success);
  const [activeTab, setActiveTab] = useState('teams');

  // ── Seasons ─────────────────────────────────────────────────
  const { seasons, fetchAll: fetchSeasons } = useSeasonStore();
  const [selectedSeason, setSelectedSeason] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterSeasonStatus, setFilterSeasonStatus] = useState('');

  useEffect(() => {
    fetchSeasons({ per_page: 100, sort: 'id', direction: 'desc' });
  }, [fetchSeasons]);

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
      fetchSeasonTeams({ season_id: selectedSeason, per_page: 500, sort: 'id', direction: 'asc' });
    } else {
      fetchSeasonTeams({ per_page: 500, sort: 'id', direction: 'asc' }); // Lấy tất cả khi không chọn mùa
    }
  }, [selectedSeason, fetchSeasonTeams]);

  useEffect(() => { reloadTeams(); }, [reloadTeams, selectedSeason]);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 400);

  // ── Client-side filter by status and search ───────────────────────────
  const seasonTeams = useMemo(() => {
    let filtered = allSeasonTeams;
    if (selectedSeason) {
      filtered = filtered.filter(st => String(st.season_id) === String(selectedSeason));
    }
    if (filterStatus) {
      filtered = filtered.filter(st => st.status === filterStatus);
    }
    if (debouncedSearch) {
      const lower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(st => st.team?.name?.toLowerCase().includes(lower));
    }
    return filtered;
  }, [allSeasonTeams, selectedSeason, filterStatus, debouncedSearch]);

  // ── Pagination ───────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (newLimit) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [filterStatus, selectedSeason, debouncedSearch]);

  const totalPages = Math.ceil(seasonTeams.length / itemsPerPage) || 1;
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTeams = seasonTeams.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  // ── Summary stats ───────────────────────────────────────────
  const stats = useMemo(() => {
    let base = allSeasonTeams;
    if (selectedSeason) {
      base = base.filter(st => String(st.season_id) === String(selectedSeason));
    }
    return {
      total: base.length,
      pending: base.filter(s => s.status === 'pending').length,
      approved: base.filter(s => s.status === 'approved').length,
      active: base.filter(s => s.status === 'active').length,
      rejected: base.filter(s => s.status === 'rejected').length,
      withdrawn: base.filter(s => s.status === 'withdrawn').length,
    };
  }, [allSeasonTeams, selectedSeason]);

  // ── Actions: Status ─────────────────────────────────────────
  const statusMutation = useApiMutation();
  const handleUpdateStatus = (id, newStatus) => {
    const st = allSeasonTeams.find(s => s.id === id);
    statusMutation.mutate(async () => {
      await seasonTeamApi.updateStatus(id, { status: newStatus });
      if (newStatus === 'approved') {
        await seasonTeamApi.approve(id);
      } else if (newStatus === 'rejected') {
        await seasonTeamApi.delete(id);
      } else {
        await seasonTeamApi.updateStatus(id, { status: newStatus });
      }

      if (newStatus === 'approved' && st?.user_id) {
        try {
          const rolesRes = await roleApi.getRoles();
          const rPayload = (typeof rolesRes?.status === 'boolean') ? rolesRes.data : rolesRes;
          const roles = Array.isArray(rPayload?.data) ? rPayload.data : Array.isArray(rPayload) ? rPayload : [];

          const leaderRole = roles.find(r => ['leader', 'đội trưởng', 'doitruong'].includes(r.name.toLowerCase()));

          if (leaderRole) {
            const userRes = await userApi.getUserById(st.user_id);
            const uPayload = (typeof userRes?.status === 'boolean') ? userRes.data : userRes;
            const user = uPayload?.data || uPayload;

            const currentRoleIds = user?.roles?.map(r => r.id) || [];

            if (!currentRoleIds.includes(leaderRole.id)) {
              await userApi.updateProfile(st.team.user_id, { role_ids: [...currentRoleIds, leaderRole.id] });
              toastSuccess(`Đã tự động cấp quyền Đội trưởng cho user đăng ký.`);
            }
          }
        } catch (e) {
          console.error("Lỗi khi cấp quyền Leader", e);
        }
      }

      toastSuccess(`Đã cập nhật trạng thái thành "${newStatus}"!`);
      reloadTeams();
    }).catch(err => toastError(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái.'));
  };

  // ── Actions: Delete ─────────────────────────────────────────
  const deleteMutation = useApiMutation();
  const [deletingId, setDeletingId] = useState(null);
  const [jerseyModalTeam, setJerseyModalTeam] = useState(null);
  const confirmDelete = () => {
    deleteMutation.mutate(async () => {
      await seasonTeamApi.delete(deletingId);
      toastSuccess('Đã xóa đội khỏi mùa giải.');
      setDeletingId(null);
      reloadTeams();
    }).catch(err => toastError(err?.response?.data?.message || 'Lỗi khi xóa.'));
  };

  // ── Actions: Add Team ───────────────────────────────────────
  const [allTeams, setAllTeams] = useState([]);
  const addTeamModal = useCrudModal({ emptyForm: { team_id: '', season_id: '' } });

  const openAddTeam = () => {
    if (allTeams.length === 0) {
      teamApi.getTeams({ per_page: 200 }).then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        setAllTeams(Array.isArray(payload?.data) ? payload.data : []);
      });
    }
    addTeamModal.openAdd({ team_id: '', season_id: selectedSeason || '' });
  };

  const handleAddTeam = () => {
    if (!addTeamModal.form.season_id) { addTeamModal.setFormError('Vui lòng chọn mùa giải.'); return; }
    if (!addTeamModal.form.team_id) { addTeamModal.setFormError('Vui lòng chọn đội bóng.'); return; }
    addTeamModal.save(async () => {
      await seasonTeamApi.adminAdd({
        season_id: Number(addTeamModal.form.season_id),
        team_id: Number(addTeamModal.form.team_id),
        status: 'approved',
      });
      toastSuccess('Đã thêm đội vào mùa giải!');
      reloadTeams();
    }).catch(err => addTeamModal.setFormError(err?.response?.data?.message || 'Lỗi khi thêm đội.'));
  };

  // ── Manual Group Assign ─────────────────────────────────────
  const assignModal = useCrudModal({ emptyForm: { group_id: '' } });
  const openAssignGroup = (st) => assignModal.openEdit(st, { group_id: st.group_id || '' });
  const handleAssign = () => {
    if (!assignModal.form.group_id) { assignModal.setFormError('Vui lòng nhập ID bảng!'); return; }
    assignModal.save(async () => {
      await seasonTeamApi.assignGroup(assignModal.editing.id, { group_id: Number(assignModal.form.group_id) });
      toastSuccess('Đã xếp đội vào bảng thủ công!');
      reloadTeams();
    }).catch(err => assignModal.setFormError(err?.response?.data?.message || 'Lỗi khi xếp bảng.'));
  };

  // ── Actions: Transfer Team ──────────────────────────────────
  const transferModal = useCrudModal({ emptyForm: { target_season_id: '' } });
  const openTransferTeam = (st) => {
    transferModal.openEdit(st, { target_season_id: '' });
  };
  const handleTransferTeam = () => {
    if (!transferModal.form.target_season_id) { transferModal.setFormError('Vui lòng chọn mùa giải đích.'); return; }
    transferModal.save(async () => {
      await seasonTeamApi.transferSeason(transferModal.editing.id, { season_id: Number(transferModal.form.target_season_id) });
      toastSuccess('Đã chuyển đội sang mùa giải mới!');
      reloadTeams();
    }).catch(err => transferModal.setFormError(err?.response?.data?.message || 'Lỗi khi chuyển đội.'));
  };

  const selectedSeasonObj = seasons.find(s => String(s.id) === String(selectedSeason));

  return (
    <AdminLayout>
      <div className="w-full space-y-6 animate-fade-in pb-20">

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
                { value: 'ongoing', label: '🔴 Đang diễn' },
                { value: 'upcoming', label: '⏳ Sắp tới' },
                { value: 'finished', label: '✓ Kết thúc' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setFilterSeasonStatus(opt.value); setSelectedSeason(''); }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black border transition-all ${filterSeasonStatus === opt.value
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

        {/* ── Content ─────────────────────────── */}
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Tổng số', value: stats.total, color: 'blue', icon: Users },
              { label: 'Chờ duyệt', value: stats.pending, color: 'amber', icon: Calendar },
              { label: 'Đã duyệt', value: stats.approved, color: 'emerald', icon: CheckCircle2 },
              { label: 'Hoạt động', value: stats.active, color: 'sky', icon: TrendingUp },
              { label: 'Từ chối', value: stats.rejected, color: 'red', icon: XCircle },
              { label: 'Đã rút', value: stats.withdrawn, color: 'gray', icon: X },
              // eslint-disable-next-line no-unused-vars
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
            <button
              className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'knockout' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('knockout')}
            >
              <Trophy className="w-4 h-4" /> Vòng Knockout
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[900px]">
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
                      {[1, 2, 3, 4, 5, 6].map(j => (
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
                  paginatedTeams.map(st => (
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
                            onClick={() => setJerseyModalTeam(st)}
                            className="p-1.5 rounded-lg bg-navy-light text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 shadow-sm transition-all active:scale-90"
                            title="Quản lý áo đấu"
                          >
                            <Shirt className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAssignGroup(st)}
                            className="p-1.5 rounded-lg bg-navy-light text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 shadow-sm transition-all active:scale-90"
                            title="Xếp bảng thủ công"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openTransferTeam(st)}
                            className="p-1.5 rounded-lg bg-navy-light text-purple-400 hover:text-white hover:bg-purple-600 border border-purple-500/20 hover:border-purple-500 shadow-sm transition-all active:scale-90"
                            title="Chuyển giải"
                          >
                            <RefreshCw className="w-4 h-4" />
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
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm đội bóng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-navy border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 text-sm transition-colors"
                    />
                  </div>
                  {/* Status filter */}
                  <div className="relative w-full sm:w-auto shrink-0">
                    <select
                      className="w-full sm:w-auto bg-navy border border-navy-light rounded-lg pl-8 pr-8 py-2 text-white font-bold outline-none focus:border-neon text-sm appearance-none cursor-pointer"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
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
                          {[1, 2, 3, 4, 5, 6].map(j => (
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
                      paginatedTeams.map(st => (
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
                                onClick={() => setJerseyModalTeam(st)}
                                className="p-1.5 rounded-lg bg-navy-light text-emerald-400 hover:text-white hover:bg-emerald-600 border border-emerald-500/20 hover:border-emerald-500 shadow-sm transition-all active:scale-90"
                                title="Quản lý áo đấu"
                              >
                                <Shirt className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openAssignGroup(st)}
                                className="p-1.5 rounded-lg bg-navy-light text-blue-400 hover:text-white hover:bg-blue-600 border border-blue-500/20 hover:border-blue-500 shadow-sm transition-all active:scale-90"
                                title="Xếp bảng thủ công"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openTransferTeam(st)}
                                className="p-1.5 rounded-lg bg-navy-light text-purple-400 hover:text-white hover:bg-purple-600 border border-purple-500/20 hover:border-purple-500 shadow-sm transition-all active:scale-90"
                                title="Chuyển giải"
                              >
                                <RefreshCw className="w-4 h-4" />
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-navy-light bg-navy-dark rounded-b-xl">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}

            </div>
          )}

          {/* ── Tab: Draw Groups ────────────────────────────────── */}
          {activeTab === 'draw' && (
            <GroupDrawUI seasonId={selectedSeason ? Number(selectedSeason) : null} />
          )}
          {/* ── Tab: Knockout ──────────────────────────────────── */}
          {activeTab === 'knockout' && (
            <KnockoutUI seasonId={selectedSeason} />
          )}

        </>
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
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Chọn mùa giải <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={addTeamModal.form.season_id}
                  onChange={e => addTeamModal.setForm({ ...addTeamModal.form, season_id: e.target.value })}
                  className={INPUT}
                >
                  <option value="">-- Chọn mùa giải --</option>
                  {seasons.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Chọn đội bóng <span className="text-red-400">*</span>
              </label>
              <select
                className={INPUT}
                value={addTeamModal.form.team_id}
                onChange={e => addTeamModal.setForm({ ...addTeamModal.form, team_id: e.target.value })}
              >
                <option value="">-- Chọn một đội --</option>
                {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
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

      {/* ── Transfer Team Modal ─────────────────────────────────── */}
      {transferModal.modal && (
        <AdminModal
          title="Chuyển mùa giải"
          icon={RefreshCw} iconClass="text-purple-400"
          onClose={transferModal.closeModal}
          footer={<>
            <button onClick={transferModal.closeModal} className={BTN_SECONDARY}>Hủy</button>
            <button onClick={handleTransferTeam} disabled={transferModal.isSaving} className="flex items-center gap-2 px-6 py-2.5 font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all active:scale-[.98] disabled:opacity-70">
              {transferModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Xác nhận chuyển
            </button>
          </>}
        >
          {transferModal.formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{transferModal.formError}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Mùa giải đích <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={transferModal.form.target_season_id}
                onChange={e => transferModal.setForm({ target_season_id: e.target.value })}
                className={INPUT}
              >
                <option value="">-- Chọn mùa giải --</option>
                {seasons.map(s => (
                  <option key={s.id} value={s.id} disabled={s.id === transferModal.editing?.season_id}>
                    {s.name} - {s.status} {s.id === transferModal.editing?.season_id ? '(Hiện tại)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Đội <strong className="text-white">{transferModal.editing?.team?.name}</strong> sẽ được chuyển khỏi mùa giải hiện tại và sang mùa giải này với trạng thái Chờ duyệt.
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
      {/* Jersey Modal */}
      <ManageJerseysModal
        isOpen={!!jerseyModalTeam}
        onClose={() => setJerseyModalTeam(null)}
        seasonTeam={jerseyModalTeam}
      />

    </AdminLayout>
  );
}
