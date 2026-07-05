import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function PlayerDeleteModal({ playerName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onCancel} />
      <div className="relative bg-navy-dark/90 backdrop-blur-xl border border-red-500/30 rounded-4xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 animate-scale-in">
        <div className="absolute inset-0 bg-linear-to-b from-red-500/5 to-transparent rounded-4xl pointer-events-none"></div>
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center space-y-2">
          <h4 className="text-2xl font-black text-white tracking-tight">Xóa cầu thủ?</h4>
          <p className="text-gray-400 leading-relaxed text-sm">
            Xóa <strong className="text-red-400 font-bold">{playerName}</strong> khỏi đội? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex gap-3 w-full mt-4">
          <button onClick={onCancel} className="flex-1 py-3.5 rounded-xl font-bold bg-navy-light/50 text-gray-300 border border-navy-light hover:bg-navy-light hover:text-white transition-all duration-300">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3.5 rounded-xl font-bold bg-linear-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 flex items-center justify-center gap-2 disabled:opacity-70 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
}