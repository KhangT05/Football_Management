import { CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RESULT_AVAILABLE_STATUSES } from './MatchShared'
// Map đầy đủ theo MatchStatus enum thật (scheduled, ongoing, pending_official,
// needs_review, finished, cancelled, postponed, bye, abandoned, forfeited).
// Trước đây chỉ có 3 key ('LIVE'/'FT'/fallback), mọi status khác rơi vào
// fallback "Sắp diễn ra" — sai cho forfeited/abandoned/cancelled/postponed/bye.
const STATUS_CFG = {
  scheduled: {
    bar: 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dot: 'bg-blue-500',
    label: 'Sắp diễn ra',
  },
  ongoing: {
    bar: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]',
    badge: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500 animate-pulse',
    label: 'Trực tiếp',
  },
  pending_official: {
    bar: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Chờ xác nhận',
  },
  needs_review: {
    bar: 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500 animate-pulse',
    label: 'Cần rà soát',
  },
  finished: {
    bar: 'bg-gray-500',
    badge: 'bg-navy-light text-gray-400 border-navy-light/50',
    dot: 'bg-gray-500',
    label: 'Đã kết thúc',
  },
  forfeited: {
    bar: 'bg-orange-500',
    badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    dot: 'bg-orange-500',
    label: 'Xử thua',
  },
  abandoned: {
    bar: 'bg-gray-600',
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dot: 'bg-gray-500',
    label: 'Đã hủy giữa chừng',
  },
  postponed: {
    bar: 'bg-amber-600',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
    label: 'Hoãn',
  },
  bye: {
    bar: 'bg-purple-500',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    dot: 'bg-purple-500',
    label: 'Miễn thi đấu',
  },
  cancelled: {
    bar: 'bg-gray-600',
    badge: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    dot: 'bg-gray-500',
    label: 'Đã hủy',
  },
};
const DEFAULT_CFG = STATUS_CFG.scheduled;

function TeamRow({ name, score, showScore }) {
  const displayName = name || '—';
  return (
    <div className="flex justify-between items-center group/team">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-navy-light to-navy flex items-center justify-center border border-navy-light/80 shadow-inner group-hover/team:border-blue-500/30 transition-colors">
          <span className="text-xs font-black text-gray-300">{displayName.substring(0, 2).toUpperCase()}</span>
        </div>
        <span className="font-bold text-white text-lg group-hover/team:text-blue-400 transition-colors">{displayName}</span>
      </div>
      {showScore
        ? <span className="text-xl font-black text-white">{score}</span>
        : <span className="text-[10px] font-black text-blue-400 border border-blue-500/30 rounded-lg px-2.5 py-1 bg-blue-500/10">VS</span>
      }
    </div>
  );
}

export default function MatchCard({ id, status, time, teamA, teamB, scoreA, scoreB }) {
  const cfg = STATUS_CFG[status] ?? DEFAULT_CFG;
  const showScore = RESULT_AVAILABLE_STATUSES.has(status) && scoreA != null && scoreB != null;

  if (!id) {
    // Fail loud thay vì silent-default id=3 và route sai trận trong production.
    console.error('MatchCard: thiếu id, không thể tạo link — kiểm tra dữ liệu upstream');
    return null;
  }

  return (
    <Link to={`/tran-dau/${id}`} className="block bg-navy/60 backdrop-blur-lg border border-navy-light shadow-lg shadow-black/20 rounded-2xl p-5 hover:border-blue-500/50 hover:bg-navy hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${cfg.bar} group-hover:w-1.5 transition-all duration-300`} />
      <div className="flex justify-between items-center mb-5 pl-3">
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
        <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 bg-navy-dark px-2.5 py-1 rounded-lg border border-navy-light/50">
          <CalendarDays className="w-3.5 h-3.5" /> {time}
        </span>
      </div>
      <div className="space-y-4 pl-3">
        <TeamRow name={teamA} score={scoreA} showScore={showScore} />
        <TeamRow name={teamB} score={scoreB} showScore={showScore} />
      </div>
    </Link>
  );
}