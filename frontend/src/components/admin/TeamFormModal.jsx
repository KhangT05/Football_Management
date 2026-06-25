import { X, UploadCloud, Save, Loader2, AlertTriangle } from 'lucide-react';

/**
 * TeamFormModal — Modal thêm/sửa đội bóng.
 * Dùng trong ManageTeams (admin).
 *
 * @param {'add'|'edit'} mode
 * @param {object}       form        — { name, coach_name, description, logo }
 * @param {Function}     setForm     — setter cho form
 * @param {string|null}  formError
 * @param {string|null}  logoPreview — URL ảnh preview logo
 * @param {boolean}      isSaving
 * @param {Function}     onSave
 * @param {Function}     onClose
 * @param {Function}     onLogoChange — handler khi chọn file logo
 */
export default function TeamFormModal({
  mode,
  form,
  setForm,
  formError,
  logoPreview,
  isSaving,
  onSave,
  onClose,
  onLogoChange,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-navy border border-navy-light rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light bg-navy-dark shrink-0">
          <h3 className="text-lg font-black text-white uppercase tracking-tight">
            {mode === 'add' ? 'Thêm đội bóng mới' : 'Chỉnh sửa đội bóng'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-light transition-colors border border-transparent hover:border-navy-light">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg flex gap-2 animate-fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />{formError}
            </div>
          )}

          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-navy-dark border-2 border-navy-light flex items-center justify-center overflow-hidden">
              {logoPreview
                ? <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                : <UploadCloud className="w-8 h-8 text-gray-500" />
              }
            </div>
            <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-navy-dark border border-navy-light rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              <UploadCloud className="w-4 h-4" />
              {logoPreview ? 'Đổi logo' : 'Tải logo'}
              <input type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Tên đội bóng <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="VD: Kỹ thuật Phần mềm K21"
              className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">HLV / Đội trưởng</label>
            <input
              type="text"
              value={form.coach_name}
              onChange={e => setForm(f => ({ ...f, coach_name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mô tả</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Mô tả ngắn về đội bóng..."
              className="w-full px-4 py-2.5 bg-navy-dark border border-navy-light rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon text-sm resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-navy-light bg-navy-dark flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 font-bold text-gray-400 hover:text-white bg-navy-light rounded-xl border border-navy-light transition-colors">Hủy</button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === 'add' ? 'Tạo đội' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
}
