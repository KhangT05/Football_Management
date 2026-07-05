import { useId } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserPlus, Edit, X, AlertTriangle, CheckCircle2, Loader2,
  Info, UploadCloud, FileDown, Camera,
} from 'lucide-react';

// FIX: giá trị value phải khớp PlayerPosition enum của backend
// (goalkeeper | defender | midfielder | forward) — trước đây dùng
// GK/DEF/MID/FW nên mọi request thêm/sửa cầu thủ bị Zod reject ở backend
// (position: Invalid enum value), gây lỗi khi bấm "Thêm cầu thủ".
const POSITIONS = [
  { value: 'goalkeeper', label: 'Thủ môn' },
  { value: 'defender', label: 'Hậu vệ' },
  { value: 'midfielder', label: 'Tiền vệ' },
  { value: 'forward', label: 'Tiền đạo' },
];

/**
 * mode: 'add' | 'edit'
 * onSave(values) — callback DUY NHẤT, cha (MyTeam) tự dispatch theo mode.
 *   add:  { name, user_email, date_of_birth, position, number }
 *   edit: { number, position }
 */
export default function PlayerFormModal({
  mode,
  player,
  usedNumbers = [],
  onSave,
  onClose,
  isSaving,
  serverError,
  onImportExcel,
  onDownloadTemplate,
  isDownloadingTemplate,
  isImporting,
}) {
  const isAdd = mode === 'add';
  const fileInputId = useId(); // tránh đụng id tĩnh khi có nhiều modal / HMR

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: isAdd
      ? { name: '', user_email: '', date_of_birth: '', position: 'midfielder', number: '' }
      : { number: player?.number ?? '', position: player?.position ?? 'midfielder' },
  });

  const numberTakenBy = (value) =>
    usedNumbers.find((p) => String(p.number) === String(value) && p.id !== player?.id);

  const submit = handleSubmit((values) => {
    onSave?.(values);
  });

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative bg-navy-dark/95 backdrop-blur-2xl border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-md animate-scale-in flex flex-col overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light relative z-10 bg-navy/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
              {isAdd ? <UserPlus className="w-5 h-5 text-blue-400" /> : <Edit className="w-5 h-5 text-blue-400" />}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {isAdd ? 'Thêm cầu thủ' : 'Chỉnh sửa'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-navy-light transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 relative z-10">
          {player?.avatar && (
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-[3px] border-navy-light overflow-hidden relative group cursor-pointer shadow-lg shadow-black/50">
                <img src={player.avatar} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </div>
            </div>
          )}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center gap-3 animate-fade-in shadow-[0_0_20px_rgba(239,68,68,0.1)] font-medium">
              <AlertTriangle className="w-5 h-5 shrink-0" /> {serverError}
            </div>
          )}

          {/* Import Excel block — chỉ hiện khi thêm mới */}
          {isAdd && onImportExcel && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30 shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-400/90 font-medium leading-relaxed">
                  Thêm nhiều cầu thủ cùng lúc bằng file Excel. Tải file mẫu, điền thông tin rồi upload lại.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  disabled={isDownloadingTemplate}
                  className="flex-1 px-4 py-3.5 font-bold bg-navy-dark text-gray-200 border border-navy-light rounded-xl flex items-center justify-center gap-2 hover:bg-navy-light hover:text-white transition-all duration-300 text-sm disabled:opacity-60"
                >
                  {isDownloadingTemplate ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileDown className="w-5 h-5" />}
                  Tải file mẫu
                </button>
                <div className="relative flex-1">
                  <input
                    type="file"
                    id={fileInputId}
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={onImportExcel}
                    disabled={isSaving || isImporting}
                  />
                  <label
                    htmlFor={fileInputId}
                    className={`w-full px-4 py-3.5 font-bold bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-500 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 ${isSaving || isImporting ? 'opacity-70 pointer-events-none' : ''
                      }`}
                  >
                    <UploadCloud className="w-5 h-5" /> Import Excel
                  </label>
                </div>
              </div>
            </div>
          )}

          {isAdd ? (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Họ và tên <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register('name', { required: 'Vui lòng nhập tên cầu thủ.' })}
                  className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold"
                />
                {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  placeholder="player@example.com"
                  {...register('user_email', { required: 'Vui lòng nhập email cầu thủ.' })}
                  className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold"
                />
                <p className="text-[11px] text-gray-500 ml-1">
                  Nếu email chưa có tài khoản, hệ thống sẽ tự tạo tài khoản mới.
                </p>
                {errors.user_email && <p className="text-xs text-red-400 ml-1">{errors.user_email.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
                  Ngày sinh <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  {...register('date_of_birth', { required: 'Vui lòng nhập ngày sinh.' })}
                  className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm transition-all font-bold"
                />
                {errors.date_of_birth && <p className="text-xs text-red-400 ml-1">{errors.date_of_birth.message}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 text-center">
                {player?.name}
              </label>
              <p className="text-[11px] text-gray-500 text-center">
                Tên và thông tin hồ sơ gắn với tài khoản, chỉnh ở phần quản lý tài khoản.
              </p>
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
                {...register('number', {
                  required: 'Vui lòng nhập số áo hợp lệ.',
                  validate: (v) => {
                    const conflict = numberTakenBy(v);
                    return conflict ? `Số áo ${v} đã được dùng bởi ${conflict.name}.` : true;
                  },
                })}
                className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-sm font-black text-center transition-all"
              />
              {errors.number && <p className="text-xs text-red-400 mt-1">{errors.number.message}</p>}
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
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end gap-4 relative z-10">
          <button type="button" onClick={onClose} className="px-6 py-3.5 font-bold text-gray-400 hover:text-white hover:bg-navy-light rounded-2xl transition-all duration-300">
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 font-black bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center gap-3 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 disabled:opacity-70 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] uppercase tracking-wider text-sm hover:-translate-y-0.5"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            {isAdd ? 'LƯU CẦU THỦ' : 'CẬP NHẬT'}
          </button>
        </div>
      </form>
    </div>
  );
}