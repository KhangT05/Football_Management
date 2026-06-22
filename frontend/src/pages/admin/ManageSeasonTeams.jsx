import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Users, Calendar, Trophy, Plus, CheckCircle2, XCircle,
  Trash2, RefreshCw, AlertTriangle, Loader2, Save, X, Dices, Eraser, Edit
} from 'lucide-react';
import { seasonApi, seasonTeamApi, teamApi, groupApi } from '../../api';
import { useApiQuery, useApiMutation, useCrudModal } from '../../hooks';
import useToastStore from '../../store/toastStore';

// ─── Shared Modal Component ─────────────────────────────────
function Modal({ title, icon: Icon, iconClass, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            {Icon && <Icon className={`w-5 h-5 ${iconClass}`} />}
            {title}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-navy-light bg-navy-dark shrink-0 flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, isLoading, isDestructive = true }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className={`relative bg-navy border ${isDestructive ? 'border-red-500/30' : 'border-blue-500/30'} rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4`}>
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'}`}>
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">{title}</h4>
          <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: message }}></p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors">Hủy</button>
          <button onClick={onConfirm} disabled={isLoading} className={`flex-1 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-70 text-white ${isDestructive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT = "w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm";

export default function ManageSeasonTeams() {
  const toast = useToastStore();
  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'draw'

  // --- Seasons ---
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('');

  useEffect(() => {
    seasonApi.getAll({ per_page: 100, sort: 'id', direction: 'desc' })
      .then(res => {
        const payload = (typeof res?.status === 'boolean') ? res.data : res;
        const data = Array.isArray(payload?.data) ? payload.data : [];
        setSeasons(data);
        if (data.length > 0) setSelectedSeason(data[0].id.toString());
      })
      .catch(() => toast.error('Lỗi khi tải danh sách mùa giải.'));
  }, [toast]);

  // --- Season Teams ---
  const { data: seasonTeams, isLoading: loadingTeams, fetch: fetchSeasonTeams } = useApiQuery(
    (params) => seasonTeamApi.getAll(params),
    { autoFetch: false, perPage: 100 }
  );

  const reloadTeams = useCallback(() => {
    if (selectedSeason) {
      fetchSeasonTeams({ season_id: selectedSeason, per_page: 100 });
    }
  }, [selectedSeason, fetchSeasonTeams]);

  useEffect(() => { reloadTeams(); }, [reloadTeams]);

  // --- Actions: Status ---
  const statusMutation = useApiMutation();
  const handleUpdateStatus = (id, newStatus) => {
    statusMutation.mutate(async () => {
      await seasonTeamApi.updateStatus(id, { status: newStatus });
      toast.success(`Đã đổi trạng thái thành ${newStatus}!`);
      reloadTeams();
    }).catch(err => toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật trạng thái.'));
  };

  // --- Actions: Delete ---
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

  // --- Actions: Add Team directly ---
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
        status: 'approved' // auto approve if admin adds
      });
      toast.success('Đã thêm đội vào mùa giải!');
      reloadTeams();
    }).catch(err => addTeamModal.setFormError(err?.response?.data?.message || 'Lỗi khi thêm đội.'));
  };

  // --- Draw Groups ---
  const [drawForm, setDrawForm] = useState({ phase_id: '', teams_per_group: 4 });
  const drawMutation = useApiMutation();
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

  // --- Manual Group Assign ---
  const assignModal = useCrudModal({ emptyForm: { group_id: '' } });
  const openAssignGroup = (st) => {
    assignModal.openEdit(st, { group_id: st.group_id || '' });
  };
  const handleAssign = () => {
    if (!assignModal.form.group_id) { assignModal.setFormError('Vui lòng nhập ID bảng!'); return; }
    assignModal.save(async () => {
      await seasonTeamApi.assignGroup(assignModal.editing.id, { group_id: Number(assignModal.form.group_id) });
      toast.success('Đã xếp đội vào bảng thủ công!');
      reloadTeams();
    }).catch(err => assignModal.setFormError(err?.response?.data?.message || 'Lỗi khi xếp bảng.'));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30';
      case 'pending': return 'bg-amber-400/10 text-amber-400 border-amber-400/30';
      case 'rejected': return 'bg-red-400/10 text-red-400 border-red-400/30';
      case 'active': return 'bg-blue-400/10 text-blue-400 border-blue-400/30';
      default: return 'bg-gray-400/10 text-gray-400 border-gray-400/30';
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-400" /> Quản lý Mùa giải & Bốc thăm
            </h2>
            <p className="text-gray-400 text-sm mt-1">Duyệt đội đăng ký và tiến hành chia bảng ngẫu nhiên.</p>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-sm font-bold text-gray-400">Mùa giải:</span>
            <select 
              className="bg-navy border border-navy-light rounded-xl px-4 py-2.5 text-white font-bold outline-none focus:border-neon min-w-[200px]"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              {seasons.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-navy-light">
          <button 
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'teams' ? 'border-neon text-neon' : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'}`}
            onClick={() => setActiveTab('teams')}
          >
            Danh sách đội đăng ký
          </button>
          <button 
            className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'draw' ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'}`}
            onClick={() => setActiveTab('draw')}
          >
            <Dices className="w-4 h-4" /> Bốc thăm chia bảng
          </button>
        </div>

        {/* Tab Content: Teams */}
        {activeTab === 'teams' && (
          <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
            <div className="p-4 border-b border-navy-light flex justify-between items-center bg-navy-dark">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" /> Danh sách ({seasonTeams.length})
              </h3>
              <div className="flex gap-2">
                <button onClick={reloadTeams} disabled={loadingTeams} className="p-2 rounded-lg bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors">
                  <RefreshCw className={`w-4 h-4 ${loadingTeams ? 'animate-spin' : ''}`} />
                </button>
                <button onClick={openAddTeam} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors shadow-md">
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
                    <th className="py-4 px-6 text-center">Group ID</th>
                    <th className="py-4 px-6 text-right">Duyệt</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-light">
                  {loadingTeams ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Đang tải...</td></tr>
                  ) : seasonTeams.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-gray-500"><Users className="w-8 h-8 mx-auto mb-2 opacity-30" /> Chưa có đội nào đăng ký</td></tr>
                  ) : (
                    seasonTeams.map(st => (
                      <tr key={st.id} className="hover:bg-navy-dark/70 transition-colors">
                        <td className="py-4 px-6 text-center text-gray-500 text-xs font-mono">#{st.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-navy-dark border border-navy-light flex items-center justify-center font-bold text-xs text-white">
                              {st.team?.logo ? <img src={st.team.logo} alt="logo" className="w-full h-full object-cover rounded" /> : st.team?.name?.[0]}
                            </div>
                            <span className="font-bold text-white">{st.team?.name || 'Unknown Team'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusStyle(st.status)} uppercase`}>
                            {st.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          {st.group_id ? (
                            <span className="font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
                              Bảng #{st.group_id}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          {st.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus(st.id, 'approved')} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors" title="Duyệt đăng ký">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleUpdateStatus(st.id, 'rejected')} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors" title="Từ chối">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button onClick={() => openAssignGroup(st)} className="p-1.5 rounded-lg bg-navy-light text-blue-400 hover:text-white transition-colors border border-transparent hover:border-blue-500/40" title="Xếp bảng thủ công">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeletingId(st.id)} className="p-1.5 rounded-lg bg-navy-light text-red-400 hover:text-white transition-colors border border-transparent hover:border-red-500/40" title="Xóa khỏi giải">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Draw Groups */}
        {activeTab === 'draw' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
              <div className="p-6 bg-navy-dark border-b border-navy-light">
                <h3 className="font-black text-white text-lg flex items-center gap-2">
                  <Dices className="w-6 h-6 text-purple-400" /> Bốc thăm chia bảng
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Hệ thống sẽ lấy toàn bộ các đội <strong className="text-emerald-400">Đã Duyệt (Approved)</strong> của mùa giải và phân bổ ngẫu nhiên vào các Bảng (Groups) thuộc Phase chỉ định.
                </p>
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-400 mb-1">CẢNH BÁO QUAN TRỌNG</p>
                    <p className="text-xs text-red-200/80">
                      Chỉ tiến hành bốc thăm khi <strong>TẤT CẢ CÁC ĐỘI ĐƯỢC DUYỆT ĐÃ HOÀN TẤT THANH TOÁN</strong> thực tế. Do hệ thống không quản lý trạng thái thanh toán riêng, việc bốc thăm sẽ mặc định áp dụng cho tất cả đội <strong className="text-white uppercase">Approved</strong>.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phase ID <span className="text-red-400">*</span></label>
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
                    className="w-full py-3.5 rounded-xl font-black text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:scale-100"
                  >
                    {drawMutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Dices className="w-5 h-5" />}
                    TIẾN HÀNH BỐC THĂM
                  </button>

                  <button 
                    onClick={handleClearDraw}
                    disabled={clearDrawMutation.isLoading}
                    className="w-full py-3 rounded-xl font-bold text-red-400 bg-navy-dark border border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                  >
                    {clearDrawMutation.isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eraser className="w-4 h-4" />}
                    Xóa kết quả chia bảng
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 p-6 flex flex-col items-center justify-center text-center">
              <Trophy className="w-16 h-16 text-gray-600 mb-4 opacity-50" />
              <h4 className="text-xl font-black text-gray-300">Kết quả bốc thăm</h4>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Danh sách đội chia vào từng bảng có thể được theo dõi sau khi bốc thăm tại mục Danh sách đội với Group ID tương ứng.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* --- Modals --- */}

      {/* Add Team Modal */}
      {addTeamModal.modal && (
        <Modal
          title="Thêm đội vào mùa giải"
          icon={Plus} iconClass="text-emerald-400"
          onClose={addTeamModal.closeModal}
          footer={<>
            <button onClick={addTeamModal.closeModal} className="px-5 py-2.5 font-bold text-gray-400 bg-navy-light rounded-xl hover:text-white transition-colors border border-navy-light">Hủy</button>
            <button onClick={handleAddTeam} disabled={addTeamModal.isSaving} className="px-6 py-2.5 font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70">
              {addTeamModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Thêm đội
            </button>
          </>}
        >
          {addTeamModal.formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{addTeamModal.formError}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Chọn đội bóng <span className="text-red-400">*</span></label>
            <select 
              className={INPUT}
              value={addTeamModal.form.team_id}
              onChange={e => addTeamModal.setForm({ team_id: e.target.value })}
            >
              <option value="">-- Chọn một đội --</option>
              {allTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {/* Assign Group Modal */}
      {assignModal.modal && (
        <Modal
          title="Xếp bảng thủ công"
          icon={Edit} iconClass="text-blue-400"
          onClose={assignModal.closeModal}
          footer={<>
            <button onClick={assignModal.closeModal} className="px-5 py-2.5 font-bold text-gray-400 bg-navy-light rounded-xl hover:text-white transition-colors border border-navy-light">Hủy</button>
            <button onClick={handleAssign} disabled={assignModal.isSaving} className="px-6 py-2.5 font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70">
              {assignModal.isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu thay đổi
            </button>
          </>}
        >
          {assignModal.formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{assignModal.formError}</div>}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Group ID <span className="text-red-400">*</span></label>
            <input 
              type="number"
              className={INPUT}
              placeholder="VD: 12"
              value={assignModal.form.group_id}
              onChange={e => assignModal.setForm({ group_id: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-2">Đội <strong className="text-white">{assignModal.editing?.team?.name}</strong> sẽ được xếp vào bảng mang ID này.</p>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
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
