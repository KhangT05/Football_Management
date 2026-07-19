import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, AlertTriangle } from 'lucide-react';
import { classFormSchema } from '../../schemas/class.schema';

export default function ClassFormModal({ mode, initialData, isSaving, onSave, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(classFormSchema),
    defaultValues: { name: '', is_active: true, ...initialData },
  });

  // Reset form mỗi khi đổi item đang edit / chuyển sang add mới
  useEffect(() => {
    reset({ name: '', is_active: true, ...initialData });
  }, [initialData, reset]);

  const onSubmit = (values) => onSave(values);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'add' ? 'Thêm Lớp học Mới' : 'Cập nhật Lớp học'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'add' ? 'Nhập thông tin cho lớp học mới' : 'Chỉnh sửa thông tin lớp học'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* handleSubmit của RHF tự preventDefault + chạy zod validate trước khi gọi onSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white">
          {/* Tên Lớp */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Tên lớp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              autoFocus
              {...register('name')}
              className={`w-full px-4 py-3 bg-gray-50 border ${errors.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all`}
              placeholder="VD: CNTT1, K21-DTVT2..."
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {errors.name.message}
              </p>
            )}
          </div>

          {/* Trạng thái */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="pr-4">
              <label className="text-sm font-bold text-gray-900 block">Trạng thái hoạt động</label>
              <span className="text-xs text-gray-500">Cho phép hoặc vô hiệu hóa lớp học này</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input type="checkbox" className="sr-only peer" {...register('is_active')} />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-xl text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-900 font-bold transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>Đang lưu...</>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {mode === 'add' ? 'Tạo mới' : 'Cập nhật'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}