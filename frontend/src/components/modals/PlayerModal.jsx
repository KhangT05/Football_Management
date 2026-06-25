import { useState } from 'react';
import { X, CheckCircle2, Loader2, AlertTriangle, Camera } from 'lucide-react';

/**
 * PlayerModal — Modal thêm/sửa cầu thủ dành cho người dùng (không phải admin).
 * Dùng trong trang MyTeam.
 *
 * @param {'add'|'edit'} mode
 * @param {object|null}  player    — Player data khi edit
 * @param {Function}     onSave    — Callback nhận form data
 * @param {Function}     onClose
 * @param {boolean}      isSaving
 * @param {string}       error
 */
export default function PlayerModal({ mode, player, onSave, onClose, isSaving, error }) {
  const [form, setForm] = useState({
    name:     player?.name     || '',
    number:   player?.number   || '',
    position: player?.position || 'MID',
    goals:    player?.goals    || 0,
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
          {/* Avatar preview khi edit */}
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
              name="name" type="text"
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
                name="number" type="number" min="1" max="99"
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
                name="goals" type="number" min="0"
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
