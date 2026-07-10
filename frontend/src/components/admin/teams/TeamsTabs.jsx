import { Users, CheckCircle2 } from 'lucide-react';

export default function TeamsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex bg-navy border-b border-navy-light overflow-x-auto scrollbar-hide">
      <button
        onClick={() => setActiveTab('teams')}
        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
          activeTab === 'teams'
            ? 'border-emerald-500 text-emerald-400'
            : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'
        }`}
      >
        <Users className="w-4 h-4" /> Danh sách Đội bóng
      </button>
      <button
        onClick={() => setActiveTab('approve_teams')}
        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
          activeTab === 'approve_teams'
            ? 'border-neon text-neon'
            : 'border-transparent text-gray-400 hover:text-white hover:bg-navy-light/50'
        }`}
      >
        <CheckCircle2 className="w-4 h-4" /> Duyệt Đội bóng đăng ký giải
      </button>
    </div>
  );
}
