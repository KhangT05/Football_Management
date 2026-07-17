import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  UserPlus, Edit, X, AlertTriangle, CheckCircle2, Loader2,
  Info, UploadCloud, FileDown, Mail,
} from 'lucide-react';
import { getAdminPlayerFormSchema } from '../../schemas/playerFormSchema';

const POSITIONS = [
  { value: 'goalkeeper', label: 'GK – Thủ môn' },
  { value: 'defender', label: 'DEF – Hậu vệ' },
  { value: 'midfielder', label: 'MID – Tiền vệ' },
  { value: 'forward', label: 'FW – Tiền đạo' },
];

const ROLES = [
  { value: 'player', label: 'Thành viên' },
  { value: 'vice_captain', label: 'Phó đội trưởng' },
  { value: 'captain', label: 'Đội trưởng' },
];

/**
 * REFACTORED — chuyển sang react-hook-form. Modal tự quản lý form state
 * (uncontrolled), KHÔNG còn nhận `form`/`setForm` từ cha nữa.
 *
 * Props mới:
 *  - mode: 'add' | 'edit'
 *  - initialValues: object dùng làm defaultValues (bắt buộc khi mode='edit')
 *  - onSave(values): được gọi với dữ liệu đã qua zod-validate khi submit
 *  - formError: lỗi trả về từ server (hiển thị banner đỏ đầu form)
 *  - isSaving, onClose, onImportExcel, onDownloadTemplate,
 *    isDownloadingTemplate, isImporting: giữ nguyên như cũ
 */
export default function PlayerFormModal({
  mode,
  initialValues,
  formError,
  isSaving,
  onSave,
  onClose,
  onImportExcel,
  onDownloadTemplate,
  isDownloadingTemplate,
  isImporting,
}) {
  const isAdd = mode === 'add';
  const schema = getAdminPlayerFormSchema(mode);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      name: '',
      student_code: '',
      date_of_birth: '',
      number: '',
      position: 'midfielder',
      role: 'player',
      ...initialValues,
    },
  });

  const emailValue = isAdd ? watch('email') : '';
  const emailMissing = isAdd && !String(emailValue ?? '').trim();

  const submit = handleSubmit((values) => onSave(values));

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-scale-in flex flex-col overflow-hidden max-h-[92vh]"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
              {isAdd ? <UserPlus className="w-5 h-5 text-blue-400" /> : <Edit className="w-5 h-5 text-blue-400" />}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {isAdd ? 'Thêm cầu thủ' : 'Chỉnh sửa cầu thủ'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 md:p-10 space-y-6 relative z-10 overflow-y-auto custom-scrollbar">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center gap-3 animate-fade-in font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {formError}
            </div>
          )}

          {/* Import Excel — chỉ hiện khi thêm mới */}
          {isAdd && onImportExcel && (
            <div className="bg-emerald-950 border-2 border-emerald-500 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500 rounded-lg shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-emerald-950" />
                </div>
                <p className="text-sm text-emerald-50 font-semibold leading-relaxed">
                  Thêm nhiều cầu thủ cùng lúc bằng file Excel. Tải file mẫu, điền thông tin rồi upload lại.
                  File mẫu yêu cầu cột <span className="font-black text-emerald-300">Email</span> — thiếu email dòng đó sẽ import lỗi.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  disabled={isDownloadingTemplate}
                  className="flex-1 px-4 py-3.5 font-bold bg-emerald-50 text-emerald-900 border-2 border-emerald-500 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-100 transition-all duration-300 text-sm disabled:opacity-60"
                >
                  {isDownloadingTemplate ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                  Tải file mẫu
                </button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    id="import-excel-modal"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={onImportExcel}
                    disabled={isSaving || isImporting}
                  />
                  <label
                    htmlFor="import-excel-modal"
                    className={`w-full px-4 py-3.5 font-bold bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 ${isSaving || isImporting ? 'opacity-70 pointer-events-none' : ''
                      }`}
                  >
                    {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                    {isImporting ? 'Đang import...' : 'Import Excel'}
                  </label>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 text-center">— hoặc nhập tay 1 cầu thủ bên dưới —</p>
            </div>
          )}

          {/* Email — chỉ mode add */}
          {isAdd && (
            <div
              className={`space-y-2 rounded-2xl p-4 border-2 transition-colors ${emailMissing ? 'border-amber-500/50 bg-amber-500/5' : 'border-blue-500/30 bg-blue-500/5'
                }`}
            >
              <label className="flex items-center gap-2 text-xs font-black text-gray-300 uppercase tracking-wider ml-1">
                <Mail className="w-4 h-4 text-blue-400" />
                Email tài khoản <span className="text-red-400">* Bắt buộc</span>
              </label>
              <input
                type="email"
                placeholder="player@example.com"
                {...register('email')}
                className="w-full px-5 py-4 bg-navy/60 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-base transition-all font-bold"
              />
              {errors.email ? (
                <p className="text-[11px] text-amber-400 font-bold ml-1">⚠ {errors.email.message}</p>
              ) : (
                <p className="text-[11px] text-gray-400 ml-1 leading-relaxed">
                  Dùng để liên kết cầu thủ với tài khoản. Nếu email chưa có tài khoản, hệ thống sẽ tự tạo tài khoản mới và gửi email mời đặt mật khẩu (hiệu lực 24h).
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Họ tên cầu thủ {isAdd && <span className="text-red-400">*</span>}
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              {...register('name')}
              className={`w-full px-5 py-4 border rounded-2xl text-sm transition-all font-bold ${isAdd
                ? 'bg-navy/50 border-navy-light text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                : 'bg-navy-dark/50 border-navy-light/50 text-gray-400 cursor-not-allowed'
                }`}
              title={!isAdd ? 'Họ tên được quản lý ở phần tài khoản' : ''}
              disabled={!isAdd}
            />
            {errors.name && <p className="text-[11px] text-red-400 font-bold ml-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
              Mã số sinh viên (MSSV)
            </label>
            <input
              type="text"
              placeholder="VD: B20DCCN123"
              {...register('student_code')}
              className={`w-full px-5 py-4 border rounded-2xl text-sm transition-all font-bold ${isAdd
                ? 'bg-navy/50 border-navy-light text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                : 'bg-navy-dark/50 border-navy-light/50 text-gray-400 cursor-not-allowed'
                }`}
              title={!isAdd ? 'MSSV được quản lý ở phần tài khoản' : ''}
              disabled={!isAdd}
            />
          </div>

          {isAdd && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Ngày sinh
              </label>
              <input
                type="date"
                {...register('date_of_birth')}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                Số áo <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="99"
                placeholder="10"
                {...register('number')}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-black text-center transition-all"
              />
              {errors.number && <p className="text-[11px] text-red-400 font-bold ml-1 text-center">{errors.number.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Vị trí</label>
              <select
                {...register('position')}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold appearance-none cursor-pointer text-center"
              >
                {POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Vai trò trong đội</label>
            <select
              {...register('role')}
              className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold appearance-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end gap-4 relative z-10 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-3.5 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-2xl transition-all duration-300">
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSaving || isSubmitting}
            className="px-8 py-3.5 font-black bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center gap-3 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 disabled:opacity-70 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] uppercase tracking-wider text-sm hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSaving || isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {isAdd ? 'LƯU CẦU THỦ' : 'CẬP NHẬT'}
          </button>
        </div>
      </form>
    </div>
  );
}