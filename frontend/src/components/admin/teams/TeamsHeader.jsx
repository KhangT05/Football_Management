import { Plus, RefreshCw } from 'lucide-react';

export default function TeamsHeader({ metaTotal, isLoading, onRefetch, onAddTeam }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Quản lý Đội Bóng</h2>
        <p className="text-gray-400 text-sm mt-1">
          <span className="font-bold text-neon">{metaTotal || 0}</span> đội trong hệ thống
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onRefetch}
          disabled={isLoading}
          className="p-2.5 rounded-xl bg-navy border border-navy-light text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          title="Tải lại"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onAddTeam}
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-emerald-500/20 transition-all"
        >
          <Plus className="w-5 h-5" /> Thêm đội bóng
        </button>
      </div>
    </div>
  );
}
