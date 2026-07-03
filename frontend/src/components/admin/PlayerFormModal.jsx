import { X, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

const POSITIONS = [
  { value: 'goalkeeper',  label: 'Thủ môn (GK)' },
  { value: 'defender', label: 'Hậu vệ (DEF)' },
  { value: 'midfielder', label: 'Tiền vệ (MID)' },
  { value: 'forward',  label: 'Tiền đạo (FW)' },
];

const ROLES = [
  { value: 'captain', label: '⭐ Đội trưởng' },
  { value: 'vice_captain', label: 'Đội phó' },
  { value: 'player', label: 'Thành viên' },
];

/**
 * PlayerFormModal — Modal thêm/sửa cầu thủ vào đội (dành cho admin).
 */
export default function PlayerFormModal({
  mode,
  form,
  setForm,
  formError,
  isSaving,
  onSave,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-2xl animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark sticky top-0 z-10">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm cầu thủ vào đội' : 'Chỉnh sửa cầu thủ'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />{formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Họ và tên <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name || ''}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Email {mode === 'add' && <span className="text-gray-500 font-normal lowercase">(Tùy chọn)</span>}
              </label>
              <input
                type="email"
                value={form.email || ''}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="player@example.com"
                disabled={mode === 'edit'}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Số áo <span className="text-red-400">*</span>
              </label>
              <input
                type="number" min="1" max="99"
                value={form.number || ''}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
              <select
                value={form.position || 'forward'}
                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
              >
                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ngày sinh</label>
              <input
                type="date"
                value={form.date_of_birth ? (new Date(form.date_of_birth).toISOString().split('T')[0]) : ''}
                onChange={e => setForm(f => ({ ...f, date_of_birth: e.target.value }))}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vai trò</label>
              <select
                value={form.role || 'player'}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
              >
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Chiều cao (cm)</label>
              <input
                type="number" step="0.1" min="100" max="250"
                value={form.height || ''}
                onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
                placeholder="175"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Cân nặng (kg)</label>
              <input
                type="number" step="0.1" min="30" max="150"
                value={form.weight || ''}
                onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
                placeholder="70"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Quốc tịch</label>
              <input
                type="text"
                value={form.nationality || ''}
                onChange={e => setForm(f => ({ ...f, nationality: e.target.value }))}
                placeholder="Việt Nam"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 sticky bottom-0 z-10">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {mode === 'add' ? 'Thêm' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
