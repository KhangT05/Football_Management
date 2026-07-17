import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { editTeamSchema } from '../../schemas/teamFormSchema';

export default function EditTeamModal({ team, onSave, onClose, isSaving, error, onDelete }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const {
        register, handleSubmit, formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(editTeamSchema),
        defaultValues: {
            name: team?.name ?? '',
            coach_name: team?.captain !== '—' ? team?.captain : '',
            phone: team?.phone !== '—' ? team?.phone : '',
            description: team?.description ?? '',
            color_hex: team?.colorHex ?? '#334155',
        },
    });

    const submit = handleSubmit((values) => onSave(values));

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <form onSubmit={submit} className="relative bg-navy-dark/95 border border-navy-light rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-8 py-6 border-b border-navy-light bg-navy/40">
                    <h3 className="text-xl font-black text-white uppercase">Cài đặt đội bóng</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tên đội bóng *</label>
                        <input {...register('name')} className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white text-sm font-bold" />
                        {errors.name && <p className="text-[11px] text-red-400 font-bold ml-1">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Huấn luyện viên</label>
                        <input {...register('coach_name')} className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white text-sm font-bold" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">SĐT liên hệ</label>
                        <input {...register('phone')} className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white text-sm font-bold" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Mô tả</label>
                        <textarea rows={3} {...register('description')} className="w-full px-5 py-4 bg-navy/50 border border-navy-light rounded-2xl text-white text-sm font-medium resize-none" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Màu áo chính</label>
                        <div className="flex items-center gap-4 bg-navy/50 border border-navy-light rounded-2xl px-5 py-3">
                            <input type="color" {...register('color_hex')} className="w-12 h-12 rounded cursor-pointer border-none bg-transparent" />
                            <span className="text-gray-400 text-sm">Dùng để hiển thị áo đấu / sơ đồ đội hình</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-navy-light/50">
                        {!confirmDelete ? (
                            <button type="button" onClick={() => setConfirmDelete(true)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 border border-red-500/30 hover:bg-red-500/10 text-sm font-bold">
                                <Trash2 className="w-4 h-4" /> Giải tán đội bóng
                            </button>
                        ) : (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-3">
                                <p className="text-sm text-red-400 font-bold">Chắc chắn muốn xóa "{team?.name}"? Không thể hoàn tác.</p>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 py-2.5 rounded-lg text-gray-300 border border-navy-light text-sm font-bold">Hủy</button>
                                    <button type="button" onClick={() => onDelete(team.id)} disabled={isSaving}
                                        className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold disabled:opacity-60">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Xác nhận xóa'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-8 py-6 border-t border-navy-light bg-navy/40 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-6 py-3.5 font-bold text-gray-400 hover:text-white">Hủy</button>
                    <button type="submit" disabled={isSaving || isSubmitting}
                        className="px-8 py-3.5 font-black bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center gap-3 disabled:opacity-70">
                        {isSaving || isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        LƯU THAY ĐỔI
                    </button>
                </div>
            </form>
        </div>
    );
}