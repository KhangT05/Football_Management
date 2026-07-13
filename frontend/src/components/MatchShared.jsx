import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { getInitials, POSITION_LABELS } from '../utils/constants';
import { matchApi, jerseyApi } from '../api';

const POSITION_ALIAS = {
    GK: 'GK', goalkeeper: 'GK',
    DEF: 'DEF', defender: 'DEF',
    MID: 'MID', midfielder: 'MID',
    FW: 'FW', forward: 'FW',
};

export function normalizePosition(pos) {
    return POSITION_ALIAS[pos] ?? 'MID';
}

export const POSITION_ORDER = ['GK', 'DEF', 'MID', 'FW'];

export const POSITION_COLORS = {
    GK: 'bg-amber-400/10 text-amber-400',
    DEF: 'bg-blue-400/10 text-blue-400',
    MID: 'bg-emerald-400/10 text-emerald-400',
    FW: 'bg-red-400/10 text-red-400',
};

export const STATUS_LABEL = {
    scheduled: 'Sắp diễn ra',
    ongoing: 'Đang diễn ra',
    pending_official: 'Chờ xác nhận',
    needs_review: 'Cần rà soát',
    finished: 'Đã kết thúc',
    forfeited: 'Xử thua (forfeit)',
    abandoned: 'Đã hủy giữa chừng',
    postponed: 'Hoãn',
    bye: 'Miễn thi đấu',
    cancelled: 'Đã hủy',
};

export const STATUS_BADGE_COLOR = {
    ongoing: 'bg-red-500/10 border-red-500/20 text-red-400',
    pending_official: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    needs_review: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    finished: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    forfeited: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    abandoned: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
    cancelled: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
};

export const NO_EVENT_STATUSES = new Set(['scheduled', 'cancelled', 'postponed', 'bye']);
export const RESULT_AVAILABLE_STATUSES = new Set(['finished', 'forfeited']);
export const NOT_STARTED_STATUSES = new Set(['scheduled', 'postponed', 'bye']);
export const ONGOING_STATUSES = new Set(['ongoing']);

export function getVsLabel(status) {
    if (ONGOING_STATUSES.has(status)) return '- vs -';
    if (NOT_STARTED_STATUSES.has(status)) return 'TBD';
    return 'VS';
}

// ─── Event constants (dùng chung: MatchModal timeline, MatchDetail timeline
// /header summary, FormationPlayerCell badges) ─────────────────────────────
// Enum thật từ BE (match.lifecycle.service.ts / matchresult.service.ts):
// 'goal' | 'own_goal' | 'yellow_card' | 'second_yellow' | 'red_card' |
// 'penalty_scored' | 'substitution_in' | 'substitution_out'.
// goals: 'goal' VÀ 'penalty_scored' đều tính là bàn thắng (khớp cách BE
// gộp 2 type này vào goals_scored ở _recomputeStatsForPlayers).
export const GOAL_EVENT_TYPES = new Set(['goal', 'penalty_scored']);

export const EVENT_TYPE_LABEL = {
    goal: 'Bàn thắng',
    penalty_scored: 'Bàn thắng (phạt đền)',
    own_goal: 'Phản lưới nhà',
    yellow_card: 'Thẻ vàng',
    second_yellow: 'Thẻ vàng thứ 2 (Đuổi)',
    red_card: 'Thẻ đỏ',
    substitution_in: 'Vào sân',
    substitution_out: 'Ra sân',
};

// Phút kèm bù giờ — field BE trả là `added_minute` (không phải addedMinute,
// đó là field riêng đã transform ở report preview / MatchReportOutput).
// Nhận cả `minute` lẫn `time` để tương thích với event object đã map lại
// (MatchModal map field `minute` -> `time` khi build state).
export function formatMinuteLabel(ev) {
    const added = ev.added_minute ?? ev.addedMinute;
    const minute = ev.minute ?? ev.time;
    return `${minute}${added ? `+${added}` : ''}'`;
}

// Gom bàn thắng/phản lưới/thẻ của 1 cầu thủ từ mảng events của trận, khớp
// theo `player_id`. events phải giữ nguyên field `player_id` gốc từ BE.
export function getPlayerEventBadges(playerId, events = []) {
    if (!playerId) return { goals: 0, ownGoals: 0, yellows: 0, reds: 0 };
    const pid = String(playerId);
    const playerEvents = events.filter(e => String(e.player_id) === pid);
    return {
        goals: playerEvents.filter(e => GOAL_EVENT_TYPES.has(e.type)).length,
        ownGoals: playerEvents.filter(e => e.type === 'own_goal').length,
        yellows: playerEvents.filter(e => e.type === 'yellow_card').length,
        reds: playerEvents.filter(e => e.type === 'red_card' || e.type === 'second_yellow').length,
    };
}

// Suy ra sơ đồ chiến thuật (vd "4-3-3") từ đội hình đá chính, bỏ thủ môn,
// theo đúng thứ tự POSITION_ORDER (DEF → MID → FWD).
export function computeFormationLabel(starters = []) {
    const counts = {};
    starters.forEach(p => {
        const pos = normalizePosition(p.position);
        if (pos === 'GK') return;
        counts[pos] = (counts[pos] || 0) + 1;
    });
    const parts = POSITION_ORDER.filter(pos => pos !== 'GK' && counts[pos]).map(pos => counts[pos]);
    return parts.length ? parts.join('-') : null;
}

// Gom 1 mảng player (đã có field `position`) thành các row theo
// POSITION_ORDER, bỏ row rỗng. `reverse: true` để hiện GK ở cuối (dưới
// sân) thay vì đầu tiên — tuỳ layout pitch của từng nơi gọi.
export function groupPlayersByPosition(players = [], { reverse = false } = {}) {
    const map = { GK: [], DEF: [], MID: [], FW: [] };
    players.forEach(p => { map[normalizePosition(p.position)].push(p); });
    const rows = POSITION_ORDER.map(pos => ({ pos, players: map[pos] })).filter(r => r.players.length > 0);
    return reverse ? [...rows].reverse() : rows;
}

// Resolve tên cầu thủ cho 1 event, khớp theo `player_id`. `allPlayers` phải
// là mảng canonical đã build sẵn field `player_id` + `name` (xem
// buildTeamPlayers ở MatchModal / tương đương ở MatchDetail) — nếu mảng đó
// đã ưu tiên lineup khi build, hàm này KHÔNG cần biết gì thêm về
// lineup/roster riêng biệt nữa. Fallback event.player (field BE có thể gắn
// sẵn) rồi tới nhãn rõ nghĩa khi hoàn toàn không rõ cầu thủ.
export function resolveEventPlayerName(ev, allPlayers = []) {
    const found = allPlayers.find(p => String(p.player_id) === String(ev.player_id) || String(p.id) === String(ev.player_id));
    if (found?.name) return found.name;
    if (typeof ev.player === 'string' && ev.player) return ev.player;
    return ev.player?.user?.name
        ?? ev.player?.name
        ?? (ev.player_id ? `Cầu thủ #${ev.player_id}` : 'Không rõ cầu thủ');
}

export const DEFAULT_KIT = {
    home: { bg: '#1d4ed8', text: '#ffffff', border: 'rgba(255,255,255,0.5)' },
    away: { bg: '#c2410c', text: '#ffffff', border: 'rgba(255,255,255,0.5)' },
};

function pickJersey(settled) {
    if (!settled || settled.status !== 'fulfilled' || !settled.value) return null;
    const res = settled.value;
    const p = res?.data?.data ?? res?.data ?? res;
    const list = Array.isArray(p) ? p : [];
    return list.find(j => j.type === 'home') ?? list.find(j => j.type === 'away') ?? list[0] ?? null;
}

export function useMatchExtras(match) {
    const [matchResult, setMatchResult] = useState(null);
    const [jerseys, setJerseys] = useState({ home: null, away: null });

    useEffect(() => {
        let cancelled = false;
        setTimeout(() => { if (!cancelled) setMatchResult(null); }, 0);

        if (!match || !RESULT_AVAILABLE_STATUSES.has(match.status)) return;
        if (typeof matchApi.getMatchResult !== 'function') return;

        matchApi.getMatchResult(match.id).then(res => {
            if (cancelled) return;
            const r = res?.data?.data ?? res?.data ?? res;
            setMatchResult(r ?? null);
        }).catch(err => console.warn('[useMatchExtras] getMatchResult failed:', err));

        return () => { cancelled = true; };
    }, [match]);

    useEffect(() => {
        let cancelled = false;
        setTimeout(() => { if (!cancelled) setJerseys({ home: null, away: null }); }, 0);

        if (!match) return;
        const homeSeasonTeamId = match.home_season_team_id ?? match.home_team?.season_team_id ?? null;
        const awaySeasonTeamId = match.away_season_team_id ?? match.away_team?.season_team_id ?? null;
        if (!homeSeasonTeamId && !awaySeasonTeamId) return;

        Promise.allSettled([
            homeSeasonTeamId ? jerseyApi.getBySeasonTeam(homeSeasonTeamId) : Promise.resolve(null),
            awaySeasonTeamId ? jerseyApi.getBySeasonTeam(awaySeasonTeamId) : Promise.resolve(null),
        ]).then(([h, a]) => {
            if (cancelled) return;
            setJerseys({ home: pickJersey(h), away: pickJersey(a) });
        });

        return () => { cancelled = true; };
    }, [match]);

    const kitFor = (side) => {
        const jersey = jerseys[side];
        if (jersey?.primary_color) {
            return {
                bg: jersey.primary_color,
                text: jersey.secondary_color || '#ffffff',
                border: 'rgba(255,255,255,0.5)',
            };
        }
        return DEFAULT_KIT[side];
    };

    // FIX: điểm chính thức nằm ở matchResult.home_final_score/away_final_score
    // (endpoint getMatchResult riêng), KHÔNG phải match.home_score/away_score
    // — match object không có 2 field này (đã confirm ở MatchDetail). Nơi
    // nào đang đọc match.home_score/match.away_score trực tiếp để tính
    // hasScore/hiện tỉ số (MatchModal) SẼ KHÔNG BAO GIỜ hiện được tỉ số thật.
    // Expose sẵn finalScore ở đây để mọi nơi gọi useMatchExtras dùng chung 1
    // nguồn, tránh lặp lại lỗi.
    const finalHomeScore = matchResult?.home_final_score ?? match?.home_score ?? null;
    const finalAwayScore = matchResult?.away_final_score ?? match?.away_score ?? null;
    const hasScore = RESULT_AVAILABLE_STATUSES.has(match?.status)
        && finalHomeScore != null && finalAwayScore != null;

    // "Thắng" ưu tiên matchResult.winner_team_id — bắt buộc dùng field này
    // cho case hoà ở tỉ số chính nhưng đã có người thắng qua đá luân lưu.
    // Chỉ fallback so sánh finalHomeScore/finalAwayScore khi matchResult
    // chưa có winner_team_id (trận hoà thật, không đá pen).
    const homeIsWinner = hasScore && match && (
        matchResult?.winner_team_id != null
            ? matchResult.winner_team_id === match.home_team_id
            : finalHomeScore > finalAwayScore
    );
    const awayIsWinner = hasScore && match && (
        matchResult?.winner_team_id != null
            ? matchResult.winner_team_id === match.away_team_id
            : finalAwayScore > finalHomeScore
    );

    const isPenaltyResult = matchResult?.result_type === 'penalty'
        && matchResult?.home_penalty_score != null
        && matchResult?.away_penalty_score != null;
    const isExtraTimeResult = matchResult?.result_type === 'extra_time';

    return {
        matchResult, jerseys, kitFor, isPenaltyResult, isExtraTimeResult,
        finalHomeScore, finalAwayScore, hasScore, homeIsWinner, awayIsWinner,
    };
}

const AVATAR_PRESET = {
    lg: {
        box: 'w-20 h-20 md:w-32 md:h-32', text: 'text-3xl md:text-5xl',
        rounded: 'rounded-full', title: 'mt-4 text-lg md:text-2xl',
    },
    md: {
        box: 'w-16 h-16 sm:w-20 sm:h-20', text: 'text-2xl',
        rounded: 'rounded-2xl', title: 'mt-3 text-sm sm:text-base',
    },
};

export function TeamAvatar({ name, side, logo, jersey, size = 'md' }) {
    const p = AVATAR_PRESET[size] ?? AVATAR_PRESET.md;
    const gradientCls = side === 'home'
        ? 'border-navy-light from-blue-700 to-cyan-800 shadow-blue-900/30 hover:border-blue-400'
        : 'border-navy-light from-amber-700 to-orange-800 shadow-amber-900/30 hover:border-amber-400';
    const jerseyBorderCls = side === 'home' ? 'border-blue-500/30' : 'border-amber-500/30';
    const jerseyImg = jersey?.image_url;

    return (
        <div className="flex flex-col items-center flex-1 max-w-[200px]">
            {jerseyImg ? (
                <img
                    src={jerseyImg}
                    alt={`${name} jersey`}
                    className={`${p.box} ${p.rounded} object-contain bg-navy-dark p-1.5 border-2 ${jerseyBorderCls} shadow-lg`}
                />
            ) : logo ? (
                <img
                    src={logo}
                    alt={name}
                    className={`${p.box} ${p.rounded} object-cover border-2 ${jerseyBorderCls} shadow-lg`}
                />
            ) : (
                <div className={`${p.box} ${p.rounded} border-2 bg-linear-to-br flex items-center justify-center font-black ${p.text} text-white shadow-lg transition-colors duration-300 ${gradientCls}`}>
                    {getInitials(name)}
                </div>
            )}
            <h2 className={`${p.title} text-center font-black text-white uppercase tracking-widest line-clamp-2`}>
                {name}
            </h2>
        </div>
    );
}

export function TeamBadge({ name, logo, kit, size = 20 }) {
    const dim = `${size}px`;
    if (logo) {
        return (
            <img
                src={logo}
                alt={name}
                style={{ width: dim, height: dim }}
                className="rounded-full object-cover border border-white/30 shrink-0"
            />
        );
    }
    return (
        <div
            style={{ width: dim, height: dim, backgroundColor: kit?.bg ?? '#0b1220', color: kit?.text ?? '#ffffff' }}
            className="rounded-full flex items-center justify-center text-[9px] font-black border border-white/30 shrink-0"
        >
            {getInitials(name)[0]}
        </div>
    );
}

export function PlayerItem({ tp, isCap }) {
    const rawName = tp.player?.user?.name || tp.player?.name || tp.name || '';
    const name = rawName.trim() || `#${tp.player_id ?? '?'}`;
    const jersey = tp.jersey_number ?? '?';
    const captain = isCap ?? !!tp.is_captain;
    const pos = tp.position ? normalizePosition(tp.position) : null;

    return (
        <li className="flex items-center gap-2.5 py-2 border-b border-navy-light/50 last:border-0 relative group">
            <span className="w-7 text-right font-mono text-neon font-bold text-xs shrink-0">
                #{jersey}
            </span>
            <span className="font-medium text-white text-sm flex-1 truncate flex items-center gap-2">
                {name}
                {captain && (
                    <span className="w-4 h-4 flex items-center justify-center bg-amber-500/20 text-amber-500 text-[10px] font-black rounded-full border border-amber-500/30" title="Đội trưởng">
                        C
                    </span>
                )}
            </span>
            {pos && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${POSITION_COLORS[pos] ?? 'bg-gray-400/10 text-gray-400'}`}>
                    {POSITION_LABELS[pos] ?? tp.position}
                </span>
            )}
        </li>
    );
}

const DOT_PRESET = {
    md: 'w-11 h-11 sm:w-14 sm:h-14 text-sm sm:text-lg',
    sm: 'w-9 h-9 sm:w-11 sm:h-11 text-[10px] sm:text-sm',
};

export function FormationPlayerDot({ tp, kit, size = 'sm' }) {
    const rawName = tp.player?.user?.name || tp.player?.name || tp.name || '';
    const name = rawName.trim() || `#${tp.player_id ?? tp.id ?? '?'}`;
    const jersey = tp.jersey_number ?? '?';
    const isCap = !!tp.is_captain;
    const dotCls = DOT_PRESET[size] ?? DOT_PRESET.sm;

    return (
        <div className="flex flex-col items-center gap-1.5 w-[64px] sm:w-[88px] shrink-0 group">
            <div className="relative">
                <div
                    className={`${dotCls} rounded-full border-2 flex items-center justify-center font-black shadow-md shadow-black/40 transition-transform group-hover:scale-110 group-hover:ring-2 group-hover:ring-white/40`}
                    style={{
                        backgroundColor: kit?.bg ?? '#0b1220',
                        color: kit?.text ?? '#ffffff',
                        borderColor: kit?.border ?? 'rgba(255,255,255,0.7)',
                    }}
                >
                    {jersey}
                </div>
                {isCap && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 sm:w-5 sm:h-5 flex items-center justify-center bg-amber-500 text-white text-[8px] sm:text-[10px] font-black rounded-full border-2 border-black/20 shadow-sm">
                        C
                    </span>
                )}
            </div>
            <span
                className="text-[9px] sm:text-[10px] font-bold text-white text-center leading-tight px-1 sm:px-1.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 shadow-sm w-full wrap-break-words group-hover:bg-black/70 transition-all"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                title={name}
            >
                {name}
            </span>
        </div>
    );
}

// ─── FormationPlayerCell: dot có số áo theo màu kit thật + badge sự kiện
// (⚽/OG/🟨/🟥) + captain — dùng chung cho MatchModal & MatchDetail. `tp`
// PHẢI có shape canonical: { player_id, name, jersey_number, is_captain }.
// `events` là mảng events thô của trận (đã có field `player_id`), badge
// tính trực tiếp từ đây, không cần thêm request nào.
export function FormationPlayerCell({ tp, kit, events = [] }) {
    const displayName = (tp.name || '').trim() || `#${tp.player_id ?? tp.id ?? '?'}`;
    const badges = getPlayerEventBadges(tp.player_id ?? tp.id, events);
    const hasBadge = badges.goals > 0 || badges.ownGoals > 0 || badges.yellows > 0 || badges.reds > 0;

    // FIX: kitFor() (useMatchExtras) trả về shape {bg, text, border} — bản
    // cũ đọc kit?.primaryColor/shirt_color/color (field không tồn tại
    // trong shape thật) nên LUÔN rơi về default '#1d4ed8' hard-code, phớt
    // lờ màu áo thật đã fetch từ jerseyApi. Dùng đúng field bg/text/border,
    // khớp với cách TeamBadge/FormationPlayerDot đang dùng kit.
    const shirtColor = kit?.bg ?? '#1d4ed8';
    const numberColor = kit?.text ?? '#ffffff';
    const borderColor = kit?.border ?? 'rgba(255,255,255,0.75)';

    return (
        <div className="flex flex-col items-center w-16 sm:w-18 shrink-0">
            <div className="relative">
                <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-2 shadow-lg shadow-black/30"
                    style={{ backgroundColor: shirtColor, color: numberColor, borderColor }}
                >
                    {tp.jersey_number ?? '-'}
                </div>

                {tp.is_captain && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 border border-amber-200 rounded-full flex items-center justify-center text-[8px] font-black text-black shadow">
                        C
                    </span>
                )}

                {hasBadge && (
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-black/85 rounded-full px-1 py-px whitespace-nowrap">
                        {badges.goals > 0 && (
                            <span className="text-[9px] leading-none">⚽{badges.goals > 1 ? badges.goals : ''}</span>
                        )}
                        {badges.ownGoals > 0 && (
                            <span className="text-[8px] leading-none font-black text-red-400">OG{badges.ownGoals > 1 ? badges.ownGoals : ''}</span>
                        )}
                        {badges.yellows > 0 && <span className="text-[9px] leading-none">🟨</span>}
                        {badges.reds > 0 && <span className="text-[9px] leading-none">🟥</span>}
                    </div>
                )}
            </div>

            <span
                className="mt-2 w-full text-center text-[10px] sm:text-[11px] font-bold text-white! leading-snug px-1 py-0.5 rounded bg-black/30 wrap-break-words"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
                title={displayName}
            >
                {displayName}
            </span>
        </div>
    );
}

export function FormationRow({ players, kit, events = [] }) {
    if (!players.length) return null;
    return (
        <div className="flex justify-evenly items-start w-full px-1 sm:px-6">
            {players.map(tp => (
                <FormationPlayerCell key={tp.id ?? tp.player_id} tp={tp} kit={kit} events={events} />
            ))}
        </div>
    );
}