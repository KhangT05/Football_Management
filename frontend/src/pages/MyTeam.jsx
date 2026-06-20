import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Trophy, Info, Settings, Trash2, Edit,
  ShieldOff, ArrowRight, X, Loader2, AlertTriangle,
  CheckCircle2, Camera, Search, ArrowUpDown, CreditCard, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { initialPlayers } from '../data/data';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

// ─── Skeleton Row ─────────────────────────────────────────
function PlayerRowSkeleton() {
  return (
    <tr>
      <td className="py-4 px-6"><div className="skeleton h-6 w-8 mx-auto rounded" /></td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="skeleton w-10 h-10 rounded-full shrink-0" />
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
      </td>
      <td className="py-4 px-6"><div className="skeleton h-6 w-14 rounded-lg mx-auto" /></td>
      <td className="py-4 px-6"><div className="skeleton h-5 w-8 mx-auto rounded" /></td>
      <td className="py-4 px-6">
        <div className="flex justify-end gap-2">
          <div className="skeleton w-8 h-8 rounded-lg" />
          <div className="skeleton w-8 h-8 rounded-lg" />
        </div>
      </td>
    </tr>
  );
}

// ─── Empty State ──────────────────────────────────────────
function NoTeamState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-navy-light border-2 border-dashed border-navy-light flex items-center justify-center">
        <ShieldOff className="w-10 h-10 text-gray-500" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-white">Bạn chưa có đội bóng</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Hãy đăng ký đội bóng để tham gia giải đấu và quản lý đội hình của bạn.
        </p>
      </div>
      <Link
        to="/dang-ky-doi-bong"
        className="flex items-center gap-2 px-6 py-3 bg-neon text-navy font-bold rounded-xl shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:bg-neon-hover transition-all duration-200"
      >
        <UserPlus className="w-4 h-4" /> Đăng Ký Đội Bóng
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────
function ConfirmDeleteModal({ playerName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-navy border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 animate-slide-up">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h4 className="text-lg font-black text-white mb-1">Xóa cầu thủ?</h4>
          <p className="text-sm text-gray-400">
            Xóa <strong className="text-white">{playerName}</strong> khỏi đội? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-bold bg-navy-light text-gray-300 border border-navy-light hover:text-white transition-colors">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors">
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Player Add/Edit Modal ────────────────────────────────
function PlayerModal({ mode, player, onSave, onClose, isSaving, error }) {
  const [form, setForm] = useState({
    name: player?.name || '',
    number: player?.number || '',
    position: player?.position || 'MID',
    goals: player?.goals || 0,
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm cầu thủ vào đội' : 'Chỉnh sửa cầu thủ'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Avatar */}
          {player?.avatar && (
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full border-2 border-navy-light overflow-hidden relative group cursor-pointer">
                <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Họ tên */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Số áo */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Số áo <span className="text-red-400">*</span>
              </label>
              <input
                name="number"
                type="number"
                min="1" max="99"
                value={form.number}
                onChange={handleChange}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm font-bold text-center transition-colors"
              />
            </div>

            {/* Vị trí */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
              <select
                name="position"
                value={form.position}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm transition-colors"
              >
                <option value="GK">GK – Thủ môn</option>
                <option value="DEF">DEF – Hậu vệ</option>
                <option value="MID">MID – Tiền vệ</option>
                <option value="FW">FW – Tiền đạo</option>
              </select>
            </div>
          </div>

          {/* Bàn thắng (chỉ khi edit) */}
          {mode === 'edit' && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Số bàn thắng</label>
              <input
                name="goals"
                type="number"
                min="0"
                value={form.goals}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm font-bold text-center transition-colors"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">
            Hủy
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="px-6 py-2.5 font-bold bg-neon text-navy rounded-xl flex items-center gap-2 hover:bg-neon-hover transition-colors disabled:opacity-70 shadow-[0_0_12px_rgba(57,255,20,0.25)]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {mode === 'add' ? 'Thêm vào đội' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Position Badge ───────────────────────────────────────
function PosBadge({ pos }) {
  const styles = {
    GK:  'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
    DEF: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
    MID: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
    FW:  'bg-red-400/10 text-red-400 border-red-400/30',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${styles[pos] || 'bg-gray-400/10 text-gray-400 border-gray-400/30'}`}>
      {pos}
    </span>
  );
}

// ─── Payment Modal (Mock UI) ───────────────────────────────
function PaymentModal({ teamName, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-lg animate-slide-up overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neon" /> Thanh toán Lệ phí giải
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-emerald-300 font-bold mb-1">Đội bóng của bạn đã được duyệt!</p>
              <p className="text-gray-300">Vui lòng hoàn tất thanh toán lệ phí để chính thức có tên trong danh sách bốc thăm chia bảng.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
                <QrCode className="w-full h-full text-black" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Chuyển khoản Online</p>
                <p className="text-xs text-gray-400 mt-1">Quét mã QR qua ứng dụng ngân hàng hoặc Momo</p>
              </div>
              <div className="mt-2 text-xs font-mono bg-navy px-3 py-1.5 rounded text-gray-300 w-full">
                ND: {teamName} LE PHI
              </div>
            </div>
            
            <div className="border border-navy-light bg-navy-dark rounded-xl p-5 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-navy rounded-full border border-navy-light flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Thanh toán trực tiếp</p>
                <p className="text-xs text-gray-400 mt-1">Gặp BTC tại Văn phòng Khoa CNTT (Phòng E3.1)</p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 italic">
            * Sau khi thanh toán, vui lòng liên hệ Admin qua Fanpage để được xác nhận.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 font-bold bg-navy-light text-white rounded-xl hover:bg-gray-700 transition-colors">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────
export default function MyTeam() {
  const { user } = useAuthStore();
  const toast = useToastStore();

  const [isLoading, setIsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);

  // UI State
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('number');
  const [showPayment, setShowPayment] = useState(false);

  // Modal State
  const [playerModal, setPlayerModal] = useState(null); // null | 'add' | 'edit'
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [modalError, setModalError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Confirm State
  const [deletingPlayer, setDeletingPlayer] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setTeam({
        name: 'KTPM K21',
        emoji: '🛡️',
        status: 'approved',
        captain: 'Nguyễn Văn A',
        phone: '0123 456 789',
        primaryColor: 'Đỏ đen',
        colorHex: '#dc2626',
        registeredAt: '12/03/2026',
        season: '2026',
      });
      setPlayers(initialPlayers.map(p => ({ ...p })));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [user?.id]);

  // Filtered + sorted players
  const displayed = players
    .filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      String(p.number).includes(search)
    )
    .sort((a, b) => {
      if (sortField === 'number') return a.number - b.number;
      if (sortField === 'name') return a.name.localeCompare(b.name);
      if (sortField === 'goals') return b.goals - a.goals;
      return 0;
    });

  // ── Validate form ────────────────────────────────────────
  const validateForm = useCallback((form, excludeId = null) => {
    if (!form.name?.trim()) return 'Vui lòng nhập họ tên cầu thủ.';
    if (!form.number || isNaN(form.number)) return 'Vui lòng nhập số áo hợp lệ.';
    const conflict = players.find(p => String(p.number) === String(form.number) && p.id !== excludeId);
    if (conflict) return `Số áo ${form.number} đã được dùng bởi ${conflict.name}.`;
    return '';
  }, [players]);

  // ── ADD Player ───────────────────────────────────────────
  const openAddModal = () => {
    setEditingPlayer(null);
    setModalError('');
    setPlayerModal('add');
  };

  const handleAddSave = async (form) => {
    const err = validateForm(form);
    if (err) { setModalError(err); return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));
    const newPlayer = {
      id: Date.now(),
      name: form.name.trim(),
      number: parseInt(form.number),
      position: form.position,
      goals: 0,
      team: team.name,
      teamLogo: team.emoji,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}&backgroundColor=0f172a`,
    };
    setPlayers(prev => [...prev, newPlayer]);
    setIsSaving(false);
    setPlayerModal(null);
    toast.success(`Đã thêm "${newPlayer.name}" (áo số ${newPlayer.number}) vào đội!`);
  };

  // ── EDIT Player ──────────────────────────────────────────
  const openEditModal = (player) => {
    setEditingPlayer(player);
    setModalError('');
    setPlayerModal('edit');
  };

  const handleEditSave = async (form) => {
    const err = validateForm(form, editingPlayer.id);
    if (err) { setModalError(err); return; }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setPlayers(prev => prev.map(p => p.id === editingPlayer.id
      ? { ...p, name: form.name.trim(), number: parseInt(form.number), position: form.position, goals: parseInt(form.goals) || 0 }
      : p
    ));
    setIsSaving(false);
    setPlayerModal(null);
    toast.success(`Đã cập nhật thông tin cầu thủ "${form.name}".`);
  };

  // ── DELETE Player ─────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 500));
    setPlayers(prev => prev.filter(p => p.id !== deletingPlayer.id));
    toast.success(`Đã xóa cầu thủ "${deletingPlayer.name}" khỏi đội.`);
    setIsDeleting(false);
    setDeletingPlayer(null);
  };

  const toggleSort = (field) => setSortField(field);

  // ── No team ──────────────────────────────────────────────
  if (!isLoading && !team) {
    return (
      <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <NoTeamState />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-dark min-h-[calc(100vh-80px)] py-12">
      <div className="container mx-auto px-4 max-w-6xl animate-fade-in">

        {/* ─── Status Banners ─────────────────────────────── */}
        {!isLoading && team.status === 'pending' && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mb-6 flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-bold text-sm mb-1">Đội bóng đang chờ duyệt</p>
              <p className="text-yellow-200/70 text-sm">Hồ sơ đăng ký của bạn đã được gửi. Vui lòng chờ Admin xác nhận. Trong thời gian này, bạn vẫn có thể chuẩn bị nhân sự.</p>
            </div>
          </div>
        )}

        {!isLoading && team.status === 'approved' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl mb-6 flex sm:items-center justify-between gap-4 flex-col sm:flex-row animate-fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-emerald-400 font-bold text-sm mb-1">Đăng ký thành công!</p>
                <p className="text-emerald-200/70 text-sm">Đội bóng đã được duyệt. Hãy thanh toán lệ phí để tham gia bốc thăm chia bảng.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPayment(true)}
              className="px-5 py-2.5 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" /> Thanh toán lệ phí
            </button>
          </div>
        )}

        {/* ─── Team Header ─────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-slide-up">
          <div className="flex items-center gap-4">
            {isLoading ? (
              <>
                <div className="skeleton w-20 h-20 rounded-2xl" />
                <div className="space-y-2">
                  <div className="skeleton h-8 w-40 rounded" />
                  <div className="skeleton h-4 w-56 rounded" />
                </div>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-navy border-2 border-neon rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(57,255,20,0.2)] animate-fade-in">
                  {team.emoji}
                </div>
                <div>
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <h1 className="text-3xl font-extrabold text-white uppercase italic tracking-wider">{team.name}</h1>
                    {team.status === 'approved' && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Chờ Thanh Toán
                      </span>
                    )}
                    {team.status === 'pending' && (
                      <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Chờ Duyệt
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 font-medium">Khoa Công nghệ thông tin • Mùa giải {team.season}</p>
                </div>
              </>
            )}
          </div>

          {!isLoading && (
            <div className="flex items-center gap-3 animate-fade-in">
              <button className="bg-navy-light text-white font-bold px-4 py-2.5 rounded-xl hover:bg-navy transition-colors flex items-center gap-2 border border-navy-light text-sm">
                <Settings className="w-4 h-4" /> Cài đặt đội
              </button>
              <button
                onClick={openAddModal}
                disabled={players.length >= 20}
                className="bg-neon text-navy font-bold px-4 py-2.5 rounded-xl hover:bg-neon-hover flex items-center gap-2 shadow-[0_0_12px_rgba(57,255,20,0.25)] text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" /> Thêm cầu thủ
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Players Table ──────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{ animationDelay: '80ms' }}>

            {/* Search + sort bar */}
            {!isLoading && (
              <div className="flex gap-3 items-center animate-fade-in">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên hoặc số áo..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-navy border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
                  />
                </div>
                <select
                  value={sortField}
                  onChange={e => toggleSort(e.target.value)}
                  className="px-3 py-2.5 bg-navy border border-navy-light rounded-xl text-white text-sm focus:outline-none focus:border-neon shrink-0"
                >
                  <option value="number">Sắp xếp: Số áo</option>
                  <option value="name">Sắp xếp: Tên</option>
                  <option value="goals">Sắp xếp: Bàn thắng</option>
                </select>
              </div>
            )}

            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-navy-light flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-neon" /> Danh Sách Cầu Thủ
                </h2>
                {!isLoading && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 bg-navy-dark px-3 py-1 rounded-lg border border-navy-light">
                      {players.length} / 20
                    </span>
                    {players.length >= 20 && (
                      <span className="text-xs text-amber-400 font-semibold bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-lg">
                        Đủ quân số
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-navy-dark text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                      <th className="py-4 px-6 w-16 text-center">
                        <button onClick={() => toggleSort('number')} className="flex items-center gap-1 mx-auto hover:text-white transition-colors">
                          Số <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-4 px-6">
                        <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-white transition-colors">
                          Cầu thủ <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-4 px-6 text-center">Vị trí</th>
                      <th className="py-4 px-6 text-center">
                        <button onClick={() => toggleSort('goals')} className="flex items-center gap-1 mx-auto hover:text-white transition-colors">
                          ⚽ <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-light">
                    {isLoading ? (
                      <>
                        <PlayerRowSkeleton />
                        <PlayerRowSkeleton />
                        <PlayerRowSkeleton />
                        <PlayerRowSkeleton />
                        <PlayerRowSkeleton />
                      </>
                    ) : displayed.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-500">
                          <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                          Không tìm thấy cầu thủ nào.
                        </td>
                      </tr>
                    ) : (
                      displayed.map((player, idx) => (
                        <tr
                          key={player.id}
                          className="hover:bg-navy-light/30 transition-colors group animate-fade-in"
                          style={{ animationDelay: `${idx * 35}ms` }}
                        >
                          <td className="py-4 px-6 text-center">
                            <span className="font-black text-xl text-white">{player.number}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={player.avatar}
                                alt={player.name}
                                className="w-10 h-10 rounded-full bg-navy-dark border border-navy-light shrink-0"
                              />
                              <div>
                                <p className="font-bold text-white">{player.name}</p>
                                <p className="text-xs text-gray-500">MSSV: {String(player.id).padStart(8, '0')}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <PosBadge pos={player.position} />
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span className="font-black text-neon text-lg">
                              {player.goals > 0 ? player.goals : <span className="text-gray-600 font-normal text-sm">—</span>}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditModal(player)}
                                className="w-8 h-8 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 transition-colors"
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingPlayer(player)}
                                className="w-8 h-8 rounded-lg bg-navy-dark border border-navy-light flex items-center justify-center text-red-400 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
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
                <div className="px-6 py-3 bg-navy-dark border-t border-navy-light text-xs text-gray-500 flex items-center justify-between">
                  <span>Hiển thị {displayed.length} / {players.length} cầu thủ</span>
                  {search && (
                    <button onClick={() => setSearch('')} className="text-neon hover:underline font-semibold">
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ─── Sidebar ─────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-6 animate-slide-up" style={{ animationDelay: '160ms' }}>
            {/* Team Info Card */}
            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5 border-b border-navy-light pb-4">
                <Info className="w-5 h-5 text-neon" /> Thông tin chung
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex justify-between">
                      <div className="skeleton h-4 w-24 rounded" />
                      <div className="skeleton h-4 w-20 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3.5">
                  {[
                    { label: 'Đội trưởng', value: team.captain },
                    { label: 'SĐT liên hệ', value: team.phone },
                    {
                      label: 'Màu áo',
                      value: (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: team.colorHex }} />
                          <span>{team.primaryColor}</span>
                        </div>
                      )
                    },
                    { label: 'Ngày đăng ký', value: team.registeredAt },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className="text-white font-bold text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-navy border border-navy-light rounded-2xl shadow-lg shadow-black/20 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Trophy className="w-24 h-24 text-neon" />
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-5 relative z-10 border-b border-navy-light pb-4">
                <Trophy className="w-5 h-5 text-yellow-400" /> Thống kê giải đấu
              </h3>
              {isLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  {[
                    { label: 'Trận đấu', value: '5', color: 'text-white' },
                    {
                      label: 'Bàn thắng',
                      value: players.reduce((s, p) => s + (p.goals || 0), 0),
                      color: 'text-neon'
                    },
                    { label: 'Thắng', value: '4', color: 'text-blue-400' },
                    { label: 'Xếp hạng', value: '#1', color: 'text-yellow-400' },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      className="bg-navy-dark p-4 rounded-xl border border-navy-light text-center animate-slide-up"
                      style={{ animationDelay: `${200 + idx * 60}ms` }}
                    >
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick actions */}
            {!isLoading && (
              <div className="bg-navy border border-navy-light rounded-2xl p-4 space-y-2 animate-fade-in">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Thao tác nhanh</h3>
                <button
                  onClick={openAddModal}
                  disabled={players.length >= 20}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-neon/10 text-neon border border-neon/30 hover:bg-neon/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4" /> Thêm cầu thủ mới
                </button>
                <Link
                  to="/dang-ky-doi-bong"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold bg-navy-dark text-gray-300 border border-navy-light hover:bg-navy-light hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" /> Chỉnh sửa đăng ký đội
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Player Add/Edit Modal ──────────────────────────── */}
      {playerModal && (
        <PlayerModal
          mode={playerModal}
          player={editingPlayer}
          onSave={playerModal === 'add' ? handleAddSave : handleEditSave}
          onClose={() => { setPlayerModal(null); setModalError(''); }}
          isSaving={isSaving}
          error={modalError}
        />
      )}

      {/* ─── Delete Confirm ───────────────────────────────── */}
      {deletingPlayer && (
        <ConfirmDeleteModal
          playerName={deletingPlayer.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingPlayer(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* ─── Payment Modal ────────────────────────────────── */}
      {showPayment && team && (
        <PaymentModal 
          teamName={team.name} 
          onClose={() => setShowPayment(false)} 
        />
      )}
    </div>
  );
}
