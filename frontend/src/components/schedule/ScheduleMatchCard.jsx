import { Clock, MapPin } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

// GIẢ ĐỊNH: giá trị PhaseType enum ở backend (generated/prisma/client.js).
// Chỉnh lại map này nếu enum thực tế khác — đây chỉ là nhãn hiển thị, không
// ảnh hưởng logic. Key phải khớp EXACT với PhaseType string trả về từ API.
const PHASE_TYPE_LABELS = {
  group_stage: 'Vòng bảng',
  round_of_32: 'Vòng 1/16',
  round_of_16: 'Vòng 1/8',
  quarter_final: 'Tứ kết',
  semi_final: 'Bán kết',
  third_place: 'Tranh hạng 3',
  final: 'Chung kết',
};

/**
 * ScheduleMatchCard — Match card dùng cho trang ScheduleResults (public).
 * Match object cần được enrich với home_team, away_team, venue.
 *
 * FIX: trước đây chỉ hiển thị `Vòng {match.round}` — với match knockout,
 * round là số nội bộ (1, 2, 3...) không có ý nghĩa với người xem (không
 * phân biệt được tứ kết/bán kết/chung kết). Giờ ưu tiên hiển thị
 * phase.name (tên do admin đặt lúc tạo bracket) hoặc nhãn suy ra từ
 * phase.type nếu name trống, fallback về round number chỉ khi match
 * không thuộc phase nào có thông tin phase (vd data cũ/legacy).
 *
 * YÊU CẦU BACKEND: match object phải include phase: { select: { name: true,
 * type: true, format: true } } ở API trả dữ liệu cho trang này — hiện tại
 * chưa xác nhận được vì không có source của controller/route liên quan.
 * Nếu API chưa trả field này, phaseLabel luôn null và card fallback về
 * roundLabel như cũ (không crash, chỉ không có badge mới).
 */
export default function ScheduleMatchCard({ match, idx, onSelectMatch }) {
  const homeName = match.home_team?.name ?? `Đội #${match.home_team_id}`;
  const awayName = match.away_team?.name ?? `Đội #${match.away_team_id}`;
  const homeInitial = homeName[0]?.toUpperCase() ?? '?';
  const awayInitial = awayName[0]?.toUpperCase() ?? '?';
  const hasScore = match.home_score != null && match.away_score != null;
  const venueName = match.venue?.name ?? null;

  const dateLabel = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Chưa xác định';

  const isKnockout = match.phase?.format === 'knockout' || match.phase?.type
    ? match.phase.type !== 'group_stage'
    : false;

  const phaseLabel = match.phase?.name
    || (match.phase?.type ? PHASE_TYPE_LABELS[match.phase.type] : null);

  const roundLabel = phaseLabel
    ? phaseLabel
    : (match.round ? `Vòng ${match.round}` : null);

  return (
    <div
      onClick={() => onSelectMatch(match)}
      className="cursor-pointer bg-navy/60 backdrop-blur-xl border border-navy-light rounded-4xl p-6 sm:p-8 shadow-2xl shadow-black/40 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-300 animate-slide-up group relative overflow-hidden"
      style={{ animationDelay: `${idx * 40}ms` }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Date & Status */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            {dateLabel}
          </div>
          {roundLabel && (
            <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-inner uppercase tracking-widest border ${isKnockout
                ? 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                : 'text-gray-400 bg-navy-dark border-navy-light'
              }`}>
              {roundLabel}
            </span>
          )}
        </div>
        <StatusBadge status={match.status} size="fancy" />
      </div>

      {/* Match Row */}
      <div className="flex items-center justify-between gap-4 relative z-10">
        {/* Home */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0 group/team">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity duration-300"></div>
            {match.home_team?.logo ? (
              <img
                src={match.home_team.logo}
                alt={homeName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300"
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-white text-3xl shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300">
                {homeInitial}
              </div>
            )}
          </div>
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-blue-400 transition-colors">{homeName}</span>
        </div>

        {/* Score / VS */}
        <div className="shrink-0 text-center px-2">
          {hasScore ? (
            <div className="bg-navy-dark border border-navy-light rounded-2xl px-6 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] relative">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-navy-dark border border-navy-light px-2 py-0.5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest">
                Kết quả
              </div>
              <span className={`text-4xl font-black tracking-wider ${match.home_score > match.away_score ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                  match.home_score < match.away_score ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
                }`}>
                {match.home_score}
              </span>
              <span className="text-2xl font-black text-gray-600 mx-3">—</span>
              <span className={`text-4xl font-black tracking-wider ${match.away_score > match.home_score ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                  match.away_score < match.home_score ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
                }`}>
                {match.away_score}
              </span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-md opacity-20"></div>
              <div className="bg-navy-dark border border-navy-light rounded-full w-14 h-14 flex items-center justify-center relative z-10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)]">
                <span className="text-sm font-black text-transparent bg-clip-text bg-linear-to-br from-gray-300 to-gray-500 italic tracking-widest pr-0.5">VS</span>
              </div>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0 group/team">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover/team:opacity-100 transition-opacity duration-300"></div>
            {match.away_team?.logo ? (
              <img
                src={match.away_team.logo}
                alt={awayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300"
                onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-rose-600 to-red-800 flex items-center justify-center font-black text-white text-3xl shadow-lg border-[3px] border-navy-light relative z-10 group-hover/team:scale-105 transition-transform duration-300">
                {awayInitial}
              </div>
            )}
          </div>
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-rose-400 transition-colors">{awayName}</span>
        </div>
      </div>

      {/* Venue */}
      {venueName && (
        <div className="mt-6 pt-4 border-t border-navy-light/50 flex items-center gap-2 text-gray-400 text-xs font-bold relative z-10">
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
          {venueName}
        </div>
      )}
    </div>
  );
}