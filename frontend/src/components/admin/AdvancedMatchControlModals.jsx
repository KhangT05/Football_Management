import { useState } from 'react';
import { X, Save, Loader2, AlertTriangle, ShieldAlert, Gavel, Scale } from 'lucide-react';
import { matchApi } from '../../api';

// ── 1. Transition Period Modal ──────────────────────────────────────────────
export function TransitionPeriodModal({ isOpen, onClose, match, onSuccess }) {
  const [period, setPeriod] = useState('second_half');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await matchApi.transitionPeriod(match.id, { period });
      onSuccess(`Chuyển sang hiệp: ${period}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi khi chuyển hiệp.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-navy border border-navy-light rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-navy-light flex items-center justify-between bg-navy-dark/50">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Chuyển Hiệp</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}
          <form id="period-form" onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-bold text-gray-300 uppercase">Chọn Hiệp mới:</label>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:border-emerald-500"
            >
              <option value="first_half">Hiệp 1 (First Half)</option>
              <option value="second_half">Hiệp 2 (Second Half)</option>
              <option value="extra_time_first">Hiệp phụ 1 (ET 1)</option>
              <option value="extra_time_second">Hiệp phụ 2 (ET 2)</option>
              <option value="penalty_shootout">Luân lưu (Penalty Shootout)</option>
            </select>
          </form>
        </div>
        <div className="px-6 py-4 bg-navy-dark/50 border-t border-navy-light flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white">Hủy</button>
          <button form="period-form" type="submit" disabled={isSaving} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 2. Forfeit Match Modal ──────────────────────────────────────────────────
export function ForfeitMatchModal({ isOpen, onClose, match, onSuccess }) {
  const [forfeitingTeamId, setForfeitingTeamId] = useState(match?.home_team_id || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await matchApi.forfeitMatch(match.id, { forfeitingTeamId: Number(forfeitingTeamId) });
      onSuccess('Xử thua thành công.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi xử thua.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-navy border border-red-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-navy-light flex items-center gap-3 bg-red-500/10">
          <ShieldAlert className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Xử Thua (Forfeit)</h3>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}
          <p className="text-gray-400 text-sm mb-4">
            Đội bị xử thua sẽ bị tính thua 0-3 (theo mặc định hệ thống).
            Hành động này sẽ <strong>KẾT THÚC</strong> trận đấu ngay lập tức.
          </p>
          <form id="forfeit-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Đội bị xử thua:</label>
            <select
              value={forfeitingTeamId}
              onChange={e => setForfeitingTeamId(e.target.value)}
              className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:border-red-500"
            >
              <option value={match.home_team_id}>{match.home_team?.name || 'Đội nhà'}</option>
              <option value={match.away_team_id}>{match.away_team?.name || 'Đội khách'}</option>
            </select>
          </form>
        </div>
        <div className="px-6 py-4 bg-navy-dark/50 border-t border-navy-light flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white">Hủy</button>
          <button form="forfeit-form" type="submit" disabled={isSaving} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />} Xác nhận Xử Thua
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 3. Abandon Match Modal ──────────────────────────────────────────────────
export function AbandonMatchModal({ isOpen, onClose, match, currentMinute, onSuccess }) {
  const [minute, setMinute] = useState(currentMinute || 0);
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await matchApi.abandonMatch(match.id, { minute: Number(minute), reason });
      onSuccess('Hủy trận thành công.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi hủy trận.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-navy border border-orange-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-navy-light flex items-center gap-3 bg-orange-500/10">
          <AlertTriangle className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Hủy Trận Đấu (Abandon)</h3>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}
          <p className="text-gray-400 text-sm mb-4">
            Sử dụng khi trận đấu không thể tiếp tục (ví dụ: thời tiết xấu, bạo loạn).
            Kết quả của trận đấu sẽ do BTC giải quyết sau.
          </p>
          <form id="abandon-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Phút hủy trận:</label>
              <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength="3" value={minute} onChange={e => setMinute(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Lý do hủy:</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Mô tả lý do..." className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white resize-none" />
            </div>
          </form>
        </div>
        <div className="px-6 py-4 bg-navy-dark/50 border-t border-navy-light flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white">Thoát</button>
          <button form="abandon-form" type="submit" disabled={isSaving} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertTriangle className="w-4 h-4" />} Hủy Trận
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 4. Dispute Modal (Appeal / Protest) ─────────────────────────────────────
export function DisputeModal({ isOpen, onClose, match, type, onSuccess }) {
  const [reason, setReason] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;
  const isAppeal = type === 'appeal';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) { setError('Lý do không được để trống.'); return; }
    setIsSaving(true);
    setError('');
    try {
      if (isAppeal) {
        await matchApi.appeal(match.id, { reason });
      } else {
        await matchApi.protest(match.id, { reason });
      }
      onSuccess(`Đã nộp đơn ${isAppeal ? 'Kháng cáo' : 'Khiếu nại'} thành công.`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi khi gửi đơn.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-navy border border-purple-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-navy-light flex items-center gap-3 bg-purple-500/10">
          <Gavel className="w-6 h-6 text-purple-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">{isAppeal ? 'Nộp Kháng Cáo' : 'Nộp Khiếu Nại'}</h3>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}
          <form id="dispute-form" onSubmit={handleSubmit}>
            <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Lý do chi tiết <span className="text-red-400">*</span></label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white resize-none focus:border-purple-500" placeholder="Mô tả lý do..." />
          </form>
        </div>
        <div className="px-6 py-4 bg-navy-dark/50 border-t border-navy-light flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white">Hủy</button>
          <button form="dispute-form" type="submit" disabled={isSaving} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Gửi Đơn
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 5. Resolve Appeal Modal ─────────────────────────────────────────────────
export function ResolveAppealModal({ isOpen, onClose, match, onSuccess }) {
  const [resolution, setResolution] = useState('uphold');
  const [newHomeScore, setNewHomeScore] = useState(match?.result?.home_score || 0);
  const [newAwayScore, setNewAwayScore] = useState(match?.result?.away_score || 0);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) { setError('Vui lòng nhập ghi chú.'); return; }
    setIsSaving(true);
    setError('');
    try {
      const payload = { resolution, note };
      if (resolution === 'overturn') {
        payload.newHomeScore = Number(newHomeScore);
        payload.newAwayScore = Number(newAwayScore);
      }
      await matchApi.resolveAppeal(match.id, payload);
      onSuccess('Đã giải quyết kháng cáo thành công.');
    } catch (err) {
      setError(err?.response?.data?.message || 'Lỗi khi giải quyết kháng cáo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-navy-dark/90 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-navy border border-blue-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-navy-light flex items-center gap-3 bg-blue-500/10">
          <Scale className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Giải Quyết Kháng Cáo</h3>
        </div>
        <div className="p-6">
          {error && <div className="mb-4 text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-lg">{error}</div>}
          <form id="resolve-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Quyết định:</label>
              <select value={resolution} onChange={e => setResolution(e.target.value)} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white focus:border-blue-500">
                <option value="uphold">Giữ nguyên quyết định ban đầu (Uphold)</option>
                <option value="overturn">Đảo ngược quyết định (Overturn)</option>
              </select>
            </div>
            
            {resolution === 'overturn' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Tỉ số Đội nhà mới:</label>
                  <input type="number" min="0" value={newHomeScore} onChange={e => setNewHomeScore(e.target.value)} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Tỉ số Đội khách mới:</label>
                  <input type="number" min="0" value={newAwayScore} onChange={e => setNewAwayScore(e.target.value)} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-300 uppercase mb-2">Ghi chú (bắt buộc) <span className="text-red-400">*</span></label>
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full bg-navy-dark border border-navy-light rounded-xl px-4 py-3 text-white resize-none" placeholder="Nhập lý do cho quyết định này..." />
            </div>
          </form>
        </div>
        <div className="px-6 py-4 bg-navy-dark/50 border-t border-navy-light flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 font-bold text-gray-400 hover:text-white">Thoát</button>
          <button form="resolve-form" type="submit" disabled={isSaving} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
