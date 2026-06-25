import { X, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

const POSITIONS = [
  { value: 'GK',  label: 'GK – Thủ môn' },
  { value: 'DEF', label: 'DEF – Hậu vệ' },
  { value: 'MID', label: 'MID – Tiền vệ' },
  { value: 'FW',  label: 'FW – Tiền đạo' },
];

/**
 * PlayerFormModal — Modal thêm cầu thủ vào đội (dành cho admin).
 * Dùng trong ManageTeams (admin).
 *
 * @param {'add'|'edit'} mode
 * @param {object}       form        — { name, number, position }
 * @param {Function}     setForm
 * @param {string|null}  formError
 * @param {boolean}      isSaving
 * @param {Function}     onSave
 * @param {Function}     onClose
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
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm cầu thủ vào đội' : 'Chỉnh sửa cầu thủ'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />{formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Họ và tên <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Số áo <span className="text-red-400">*</span>
              </label>
              <input
                type="number" min="1" max="99"
                value={form.number}
                onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
                placeholder="10"
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vị trí</label>
              <select
                value={form.position}
                onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white focus:outline-none focus:border-neon text-sm"
              >
                {POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3">
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
