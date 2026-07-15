import { Clock, MapPin, Trophy } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { RESULT_AVAILABLE_STATUSES } from '../MatchShared';

/**
 * ScheduleMatchCard — Match card dùng cho trang ScheduleResults (public).
 * Match object cần được enrich với home_team, away_team, venue.
 *
 * phase info: BE (schedule.service.ts) giờ select kèm phase {id, name, type,
 * format} — trước đây chỉ có `round` (String), và match knockout không set
 * round nên hiển thị sai (round=0/không có nhãn). Chấp nhận field name có
 * thể là `phase` (object) hoặc `phaseName`/`phaseFormat` (flattened, tuỳ
 * endpoint) — ưu tiên object trước, fallback field phẳng.
 *
 * `view` prop: 'detailed' (mặc định, card lớn có logo 2 bên) hoặc 'compact'
 * (row gọn, giống layout kiểu livescore).
 */

// ── Helpers đọc field match — chấp nhận nhiều dạng tuỳ endpoint ────────

function getPhaseInfo(m) {
  return {
    format: m.phase?.format ?? m.phaseFormat ?? null,
    name: m.phase?.name ?? m.phaseName ?? null,
  };
}

// result_type quyết định label "Sau hiệp phụ" / "KT (Luân lưu)" — có thể
// nằm ở match.result_type (flattened từ MatchResult) hoặc
// match.matchResult.result_type (nested). CHƯA XÁC NHẬN được field thật từ
// schedule.service.ts (không có trong context) — nếu sai tên, chỉ cần sửa
// trong hàm này, không phải sửa rải rác trong component.
function getResultType(m) {
  return m.result_type ?? m.resultType ?? m.matchResult?.result_type ?? null;
}

function getPenaltyScore(m) {
  const home = m.home_penalty_score ?? m.homePenaltyScore ?? m.matchResult?.home_penalty_score ?? null;
  const away = m.away_penalty_score ?? m.awayPenaltyScore ?? m.matchResult?.away_penalty_score ?? null;
  return home != null && away != null ? { home, away } : null;
}

function getExtraTimeScore(m) {
  const home = m.home_extra_time_score ?? m.homeExtraTimeScore ?? m.matchResult?.home_extra_time_score ?? null;
  const away = m.away_extra_time_score ?? m.awayExtraTimeScore ?? m.matchResult?.away_extra_time_score ?? null;
  return home != null && away != null ? { home, away } : null;
}

// Thẻ đỏ: chấp nhận field đếm sẵn (home_red_cards/away_red_cards) hoặc tự
// đếm từ match.events nếu BE trả kèm event list thô. Nếu BE dùng tên field
// khác, chỉ cần sửa ở đây.
function hasRedCard(m, side) {
  const countField = side === 'home'
    ? (m.home_red_cards ?? m.homeRedCards)
    : (m.away_red_cards ?? m.awayRedCards);
  if (countField != null) return Number(countField) > 0;

  const teamId = side === 'home'
    ? (m.home_team_id ?? m.home_team?.id)
    : (m.away_team_id ?? m.away_team?.id);
  const events = m.events ?? m.matchEvents ?? null;
  if (Array.isArray(events)) {
    return events.some(e => e.team_id === teamId && (e.type === 'red_card' || e.type === 'second_yellow'));
  }
  return false;
}

function formatMatchDate(dateStr) {
  if (!dateStr) return 'Chưa xác định';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Hôm Nay';
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (d.toDateString() === tomorrow.toDateString()) return 'Ngày Mai';
  const weekdayLabel = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][d.getDay()];
  return `${weekdayLabel}, ${d.getDate()}/${d.getMonth() + 1}`;
}

function formatMatchTime(dateStr) {
  if (!dateStr) return '--:--';
  return new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// Nhãn ngắn cho compact view — kết hợp status + result_type vì StatusBadge
// hiện chỉ biết match.status (scheduled/ongoing/finished...), không phân
// biệt được full_time/extra_time/penalty.
// Nhãn ngắn cho compact view — kết hợp status + result_type vì StatusBadge
// hiện chỉ biết match.status (scheduled/ongoing/finished...), không phân
// biệt được full_time/extra_time/penalty.
function getCompactStatusLabel(m) {
  const resultType = getResultType(m);
  if (m.status === 'finished' || m.status === 'forfeited') {
    if (m.status === 'forfeited') return 'Xử thua';
    if (resultType === 'penalty') return 'KT (Luân lưu)';
    if (resultType === 'extra_time') return 'Sau hiệp phụ';
    return 'Kết thúc';
  }
  if (m.status === 'ongoing') return 'Đang diễn ra';
  if (m.status === 'cancelled') return 'Đã hủy';
  if (m.status === 'postponed') return 'Hoãn';
  if (m.status === 'bye') return 'Miễn thi đấu';
  if (m.status === 'abandoned') return 'Bỏ dở';
  if (m.status === 'pending_official') return 'Chờ xác nhận';
  if (m.status === 'needs_review') return 'Cần xem xét';
  return null; // scheduled: hiện giờ đá thay vì nhãn trạng thái
}

// Nhãn phụ đặt cạnh/dưới StatusBadge ở detailed view
function getResultQualifierLabel(resultType) {
  if (resultType === 'penalty') return 'Luân lưu';
  if (resultType === 'extra_time') return 'Hiệp phụ';
  return null;
}

const RedCardDot = () => (
  <span
    className="inline-block w-2 h-3 bg-red-500 rounded-[2px] shrink-0"
    title="Có thẻ đỏ"
  />
);

function TeamCrest({ team, fallbackInitial, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  if (team?.logo) {
    return (
      <img
        src={team.logo}
        alt={team?.name}
        className={`${dim} rounded object-contain bg-white shrink-0`}
        onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
      />
    );
  }
  return (
    <div className={`${dim} rounded bg-linear-to-br from-gray-500 to-gray-700 flex items-center justify-center text-[10px] font-black text-white shrink-0`}>
      {fallbackInitial}
    </div>
  );
}

export default function ScheduleMatchCard({ match, idx, onSelectMatch, view = 'detailed' }) {
  const homeName = match.home_team?.name ?? `Đội #${match.home_team_id}`;
  const awayName = match.away_team?.name ?? `Đội #${match.away_team_id}`;
  const homeInitial = homeName[0]?.toUpperCase() ?? '?';
  const awayInitial = awayName[0]?.toUpperCase() ?? '?';
  // FIX: BE trả điểm số trọn ở home_final_score/away_final_score (từ matchResult),
  // không phải home_score/away_score (chỉ dùng cho live ongoing). Các trọn
  // đã kết thúc dùng home_final_score.
  const homeScore = match.home_final_score ?? match.home_score ?? null;
  const awayScore = match.away_final_score ?? match.away_score ?? null;
  const hasScore = RESULT_AVAILABLE_STATUSES.has(match.status) && homeScore != null && awayScore != null;
  const venueName = match.venue?.name ?? null;

  const dateLabel = match.scheduled_at
    ? new Date(match.scheduled_at).toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'Chưa xác định';

  const { format: phaseFormat, name: phaseName } = getPhaseInfo(match);
  const isKnockout = phaseFormat === 'knockout';
  const stageLabel = isKnockout ? phaseName : (match.round ? `Vòng ${match.round}` : null);

  const resultType = getResultType(match);
  const penalty = getPenaltyScore(match);
  const extraTime = getExtraTimeScore(match);
  const qualifierLabel = getResultQualifierLabel(resultType);
  const compactStatusLabel = getCompactStatusLabel(match);
  const homeRed = hasRedCard(match, 'home');
  const awayRed = hasRedCard(match, 'away');

  // ── COMPACT VIEW — row gọn kiểu livescore ─────────────────────────
  if (view === 'compact') {
    return (
      <div
        onClick={() => onSelectMatch(match)}
        className="cursor-pointer bg-navy/60 backdrop-blur-xl border border-navy-light rounded-2xl px-4 py-3 shadow-lg hover:border-blue-500/50 transition-all duration-200 animate-slide-up"
        style={{ animationDelay: `${idx * 30}ms` }}
      >
        {stageLabel && (
          <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isKnockout ? 'text-amber-400' : 'text-gray-500'}`}>
            {stageLabel}
          </div>
        )}
        <div className="flex items-center gap-3">
          {/* Teams + score */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest team={match.home_team} fallbackInitial={homeInitial} />
                <span className="text-sm font-bold text-white truncate">{homeName}</span>
                {homeRed && <RedCardDot />}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-base font-black ${hasScore
                  ? (homeScore > awayScore ? 'text-neon' : homeScore < awayScore ? 'text-gray-500' : 'text-white')
                  : 'text-gray-500'}`}>
                  {hasScore ? homeScore : '-'}
                </span>
                {penalty && <span className="text-xs font-bold text-gray-400">({penalty.home})</span>}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <TeamCrest team={match.away_team} fallbackInitial={awayInitial} />
                <span className="text-sm font-bold text-white truncate">{awayName}</span>
                {awayRed && <RedCardDot />}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-base font-black ${hasScore
                  ? (awayScore > homeScore ? 'text-neon' : awayScore < homeScore ? 'text-gray-500' : 'text-white')
                  : 'text-gray-500'}`}>
                  {hasScore ? awayScore : '-'}
                </span>
                {penalty && <span className="text-xs font-bold text-gray-400">({penalty.away})</span>}
              </div>
            </div>
          </div>

          {/* Status / date */}
          <div className="text-right shrink-0 pl-3 border-l border-navy-light/60 min-w-[96px]">
            {compactStatusLabel ? (
              <p className="text-[11px] font-black text-amber-300 uppercase tracking-wide leading-tight">{compactStatusLabel}</p>
            ) : (
              <p className="text-[11px] font-black text-blue-300 uppercase tracking-wide leading-tight">{formatMatchTime(match.scheduled_at)}</p>
            )}
            <p className="text-[11px] font-bold text-gray-500 mt-0.5">{formatMatchDate(match.scheduled_at)}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── DETAILED VIEW — card lớn (thiết kế gốc, bổ sung thẻ đỏ/hiệp phụ/luân lưu) ──
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
          {stageLabel && (
            <span className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full shadow-inner uppercase tracking-widest ${isKnockout
              ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
              : 'text-gray-400 bg-navy-dark border border-navy-light'
              }`}>
              {isKnockout && <Trophy className="w-3 h-3" />}
              {stageLabel}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={match.status} size="fancy" />
          {qualifierLabel && (
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wide">{qualifierLabel}</span>
          )}
        </div>
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
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-blue-400 transition-colors inline-flex items-center justify-center gap-1.5">
            {homeName}
            {homeRed && <RedCardDot />}
          </span>
        </div>

        {/* Score / VS */}
        <div className="shrink-0 text-center px-2">
          {hasScore ? (
            <div className={`flex items-center justify-center bg-navy-dark border border-navy-light rounded-2xl px-6 py-3 shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] relative ${extraTime && penalty ? 'mb-10' : (extraTime || penalty) ? 'mb-6' : ''}`}>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-navy-dark border border-navy-light px-2 py-0.5 rounded-full text-[9px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {qualifierLabel ?? 'Kết quả'}
              </div>
              <span className={`text-4xl font-black tracking-wider ${homeScore > awayScore ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                homeScore < awayScore ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
                }`}>
                {homeScore}
              </span>
              <span className="text-2xl font-black text-gray-600 mx-3 flex items-center pb-1">-</span>
              <span className={`text-4xl font-black tracking-wider ${awayScore > homeScore ? 'text-neon drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]' :
                awayScore < homeScore ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'text-white'
                }`}>
                {awayScore}
              </span>
              {extraTime && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-gray-400">
                  (Hiệp phụ: <span className="text-white">{extraTime.home}</span> - <span className="text-white">{extraTime.away}</span>)
                </div>
              )}
              {penalty && (
                <div className={`absolute ${extraTime ? '-bottom-12' : '-bottom-6'} left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-gray-400`}>
                  (Luân lưu: <span className="text-white">{penalty.home}</span> - <span className="text-white">{penalty.away}</span>)
                </div>
              )}
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
          <span className="font-bold text-white text-sm sm:text-base text-center line-clamp-2 w-full group-hover/team:text-rose-400 transition-colors inline-flex items-center justify-center gap-1.5">
            {awayName}
            {awayRed && <RedCardDot />}
          </span>
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