import { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  Search, Filter, Plus, Edit, Trash2, X, UploadCloud,
  ChevronLeft, ChevronRight, User, Loader2, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { initialPlayers, teamsData } from '../../data/data';
import useToastStore from '../../store/toastStore';

// ─── Reusable Modal ────────────────────────────────────
function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-navy-light bg-navy-dark shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Delete Confirm Modal ───────────────────────────────
function ConfirmDeleteModal({ player, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Xóa cầu thủ?</h4>
          <p className="text-sm text-gray-400">Bạn có chắc muốn xóa <strong className="text-white">{player?.name}</strong> khỏi hệ thống? Hành động này không thể hoàn tác.</p>
        </div>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 hover:text-white border border-navy-light transition-colors">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

const POSITIONS = ['GK', 'DEF', 'MID', 'FW'];
const EMPTY_FORM = { name: '', number: '', position: 'FW', team: '', goals: 0 };
const PAGE_SIZE = 8;

export default function ManagePlayers() {
  const toast = useToastStore();

  // ── Data State ─────────────────────────────────────────
  const [players, setPlayers] = useState(initialPlayers);

  // ── UI State ───────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTeam, setFilterTeam] = useState('All');
  const [filterPos, setFilterPos] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // ── Modal State ────────────────────────────────────────
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // ── Delete Confirm State ───────────────────────────────
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Computed: filtered + paginated ────────────────────
  const filtered = players.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.number).includes(searchTerm);
    const matchTeam = filterTeam === 'All' || p.team === filterTeam;
    const matchPos = filterPos === 'All' || p.position === filterPos;
    return matchName && matchTeam && matchPos;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Handlers ──────────────────────────────────────────
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormError('');
    setEditingPlayer(null);
    setModalMode('add');
  };

  const openEdit = (player) => {
    setFormData({
      name: player.name,
      number: player.number,
      position: player.position,
      team: player.team,
      goals: player.goals,
    });
    setFormError('');
    setEditingPlayer(player);
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingPlayer(null);
    setFormData(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Vui lòng nhập họ tên cầu thủ.';
    if (!formData.number || isNaN(formData.number)) return 'Vui lòng nhập số áo hợp lệ.';
    if (!formData.team) return 'Vui lòng chọn đội bóng.';
    // Check duplicate jersey number in same team
    const conflict = players.find(p =>
      p.team === formData.team &&
      String(p.number) === String(formData.number) &&
      p.id !== editingPlayer?.id
    );
    if (conflict) return `Số áo ${formData.number} đã có trong đội ${formData.team}.`;
    return '';
  };

  const handleSave = async () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500)); // Simulate API call

    if (modalMode === 'add') {
      const newPlayer = {
        id: Date.now(),
        name: formData.name.trim(),
        number: parseInt(formData.number),
        position: formData.position,
        team: formData.team,
        teamLogo: teamsData.find(t => t.name === formData.team)?.logo || '⚽',
        goals: parseInt(formData.goals) || 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&backgroundColor=e2e8f0`,
      };
      setPlayers(prev => [newPlayer, ...prev]);
      toast.success(`Đã thêm cầu thủ "${newPlayer.name}" thành công!`);
    } else {
      setPlayers(prev => prev.map(p => p.id === editingPlayer.id
        ? { ...p, name: formData.name.trim(), number: parseInt(formData.number), position: formData.position, team: formData.team, goals: parseInt(formData.goals) || 0 }
        : p
      ));
      toast.success(`Đã cập nhật thông tin cầu thủ "${formData.name}" thành công!`);
    }

    setIsSaving(false);
    closeModal();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 500));
    setPlayers(prev => prev.filter(p => p.id !== deletingPlayer.id));
    toast.success(`Đã xóa cầu thủ "${deletingPlayer.name}" khỏi hệ thống.`);
    setIsDeleting(false);
    setDeletingPlayer(null);
  };

  const uniqueTeams = ['All', ...new Set(players.map(p => p.team))];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Cầu Thủ</h2>
            <p className="text-gray-400 text-sm mt-1">
              <span className="font-bold text-neon">{players.length}</span> cầu thủ trong hệ thống
            </p>
          </div>
          <button
            onClick={openAdd}
            className="shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-5 h-5" /> Thêm cầu thủ
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-navy p-4 rounded-xl border border-navy-light flex flex-col sm:flex-row gap-3 shadow-lg shadow-black/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc số áo..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={filterTeam}
              onChange={e => { setFilterTeam(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white text-sm focus:outline-none focus:border-neon"
            >
              <option value="All">Tất cả đội</option>
              {teamsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <select
              value={filterPos}
              onChange={e => { setFilterPos(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white text-sm focus:outline-none focus:border-neon"
            >
              <option value="All">Mọi vị trí</option>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-navy border border-navy-light rounded-xl shadow-lg shadow-black/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-navy-dark border-b border-navy-light text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 text-center w-14">Avatar</th>
                  <th className="py-4 px-6">Cầu thủ</th>
                  <th className="py-4 px-6 text-center">Số áo</th>
                  <th className="py-4 px-6 text-center">Vị trí</th>
                  <th className="py-4 px-6">Đội bóng</th>
                  <th className="py-4 px-6 text-center">Bàn thắng</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-light">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <User className="w-10 h-10 text-gray-600" />
                        <p className="font-semibold">Không tìm thấy cầu thủ nào.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-navy-dark/70 transition-colors group animate-fade-in" style={{ animationDelay: `${idx * 30}ms` }}>
                      <td className="py-3 px-6">
                        <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full border border-navy-light bg-navy-dark mx-auto block" />
                      </td>
                      <td className="py-3 px-6 font-bold text-white">{p.name}</td>
                      <td className="py-3 px-6 text-center font-black text-gray-300 text-lg">{p.number}</td>
                      <td className="py-3 px-6 text-center">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                          p.position === 'GK' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' :
                          p.position === 'DEF' ? 'bg-blue-400/10 text-blue-400 border-blue-400/30' :
                          p.position === 'MID' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30' :
                          'bg-red-400/10 text-red-400 border-red-400/30'
                        }`}>
                          {p.position}
                        </span>
                      </td>
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{p.teamLogo}</span>
                          <span className="text-gray-300 font-medium text-sm">{p.team}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-center font-black text-neon text-lg">{p.goals > 0 ? p.goals : <span className="text-gray-600 font-normal text-sm">—</span>}</td>
                      <td className="py-3 px-6">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-2 rounded-lg bg-navy-dark text-blue-400 hover:bg-blue-500/10 border border-navy-light hover:border-blue-500/40 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingPlayer(p)}
                            className="p-2 rounded-lg bg-navy-dark text-red-400 hover:bg-red-500/10 border border-navy-light hover:border-red-500/40 transition-colors"
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

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex items-center justify-between gap-4 text-sm text-gray-400 flex-wrap">
            <span>
              Hiển thị <strong className="text-white">{(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)}</strong> / <strong className="text-white">{filtered.length}</strong> cầu thủ
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    page === safePage ? 'bg-blue-600 text-white' : 'hover:bg-navy-light text-gray-400 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1.5 rounded-lg hover:bg-navy-light transition-colors disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <Modal
          title={modalMode === 'add' ? 'Thêm cầu thủ mới' : 'Chỉnh sửa thông tin cầu thủ'}
          onClose={closeModal}
          footer={
            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl transition-colors border border-navy-light">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-md shadow-emerald-500/20"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {modalMode === 'add' ? 'Tạo cầu thủ' : 'Lưu thay đổi'}
              </button>
            </div>
          }
        >
          {/* Avatar preview */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-navy-light bg-navy-dark flex items-center justify-center overflow-hidden relative group cursor-pointer">
              {editingPlayer?.avatar ? (
                <img src={editingPlayer.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UploadCloud className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {formError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ và tên <span className="text-red-400">*</span></label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số áo <span className="text-red-400">*</span></label>
                <input
                  name="number"
                  type="number"
                  min="1" max="99"
                  value={formData.number}
                  onChange={handleFormChange}
                  placeholder="10"
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
                >
                  <option value="GK">GK – Thủ môn</option>
                  <option value="DEF">DEF – Hậu vệ</option>
                  <option value="MID">MID – Tiền vệ</option>
                  <option value="FW">FW – Tiền đạo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Đội bóng <span className="text-red-400">*</span></label>
              <select
                name="team"
                value={formData.team}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
              >
                <option value="">-- Chọn đội bóng --</option>
                {teamsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số bàn thắng</label>
              <input
                name="goals"
                type="number"
                min="0"
                value={formData.goals}
                onChange={handleFormChange}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm text-center font-bold"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deletingPlayer && (
        <ConfirmDeleteModal
          player={deletingPlayer}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPlayer(null)}
          isDeleting={isDeleting}
        />
      )}
    </AdminLayout>
  );
}
