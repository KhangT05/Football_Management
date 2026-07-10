import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { DEFAULT_KIT } from './MatchShared';

function TeamSide({ name, logo, jerseyImage, kit, isWinner, reverse }) {
    const displayName = name || '—';
    const badgeKit = kit ?? DEFAULT_KIT[reverse ? 'away' : 'home'];

    return (
        <div className={`flex-1 flex ${reverse ? 'flex-col md:flex-row' : 'flex-col-reverse md:flex-row-reverse'} items-center gap-2 md:gap-4 ${reverse ? 'text-center md:text-left' : 'text-center md:text-right'}`}>
            {jerseyImage ? (
                <img
                    src={jerseyImage}
                    alt={`${displayName} jersey`}
                    className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full object-contain bg-navy-dark p-1 border-2"
                    style={{ borderColor: badgeKit.border }}
                />
            ) : logo ? (
                <img
                    src={logo}
                    alt={displayName}
                    className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full object-cover border-2"
                    style={{ borderColor: badgeKit.border }}
                />
            ) : (
                // Không có logo/jersey ảnh → chấm tròn tô theo màu áo thật
                // (cùng style với FormationPlayerDot ở sơ đồ đội hình), thay
                // vì ô xám cố định như bản cũ.
                <div
                    className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-full flex items-center justify-center font-black text-sm md:text-xl border-2 shadow-md shadow-black/20"
                    style={{ backgroundColor: badgeKit.bg, color: badgeKit.text, borderColor: badgeKit.border }}
                >
                    {displayName.substring(0, 2).toUpperCase()}
                </div>
            )}
            <span className={`text-sm md:text-xl ${isWinner ? 'font-black text-white' : 'font-semibold text-gray-200'}`}>{displayName}</span>
        </div>
    );
}

/**
 * match shape kỳ vọng (bổ sung so với bản cũ):
 * - kitA / kitB?: { bg, text, border } — màu áo home/away, resolve sẵn ở
 *   component cha bằng jerseyApi.getBySeasonTeam (BATCH 1 lần cho cả list,
 *   KHÔNG fetch trong MatchRow — tránh N+1 khi render nhiều trận).
 * - jerseyImageA / jerseyImageB?: string — ảnh áo nếu SeasonTeamJersey có
 *   image_url, ưu tiên hiển thị trước logo.
 * Nếu cha chưa truyền kitA/kitB, fallback về DEFAULT_KIT (home: xanh dương,
 * away: cam) — không vỡ layout, chỉ mất màu thật.
 */
export default function MatchRow({ match, isResult }) {
    // scoreA/scoreB có thể null (chưa có kết quả, hoặc match cancelled/bye) —
    // guard trước khi so sánh để tránh NaN/false-positive winner.
    const hasScore = match.scoreA != null && match.scoreB != null;
    const isAWin = isResult && hasScore && match.scoreA > match.scoreB;
    const isBWin = isResult && hasScore && match.scoreB > match.scoreA;

    return (
        <div className="bg-navy border border-navy-light rounded-2xl p-4 md:p-6 transition-all duration-300 hover:border-blue-300 hover:shadow-md shadow-lg shadow-black/20">
            <div className={`flex items-center justify-between text-[11px] md:text-sm font-bold uppercase tracking-wider border-b border-navy-light pb-3 mb-4 ${isResult ? 'text-gray-400' : 'text-neon'}`}>
                <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 shrink-0" />{match.date ?? '—'}</div>
                {match.location && (
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 shrink-0" />{match.location}</div>
                )}
            </div>
            <div className="flex items-center justify-between gap-1 md:gap-4">
                <TeamSide
                    name={match.teamA}
                    logo={match.logoA}
                    jerseyImage={match.jerseyImageA}
                    kit={match.kitA}
                    isWinner={isAWin}
                    reverse={false}
                />
                <div className="shrink-0 w-24 md:w-32 flex justify-center">
                    {isResult && hasScore ? (
                        <div className="flex flex-col items-center">
                            <span className="text-2xl md:text-4xl font-black text-red-500 tracking-widest">
                                {match.scoreA}<span className="text-gray-300 mx-1 md:mx-2">-</span>{match.scoreB}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">FT</span>
                        </div>
                    ) : isResult ? (
                        // isResult=true nhưng không có score (cancelled/bye lọt vào tab
                        // kết quả) — tránh render "undefined-undefined".
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">—</span>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Clock className="w-4 h-4 md:w-6 md:h-6 text-neon mb-1" />
                            <span className="text-sm md:text-xl font-bold text-neon">{match.time ?? '--:--'}</span>
                        </div>
                    )}
                </div>
                <TeamSide
                    name={match.teamB}
                    logo={match.logoB}
                    jerseyImage={match.jerseyImageB}
                    kit={match.kitB}
                    isWinner={isBWin}
                    reverse={true}
                />
            </div>
        </div>
    );
}