// ─── Helpers ──────────────────────────────────────────────────────────────────
import { MatchEventType, MatchPeriod, PhaseFormat } from "../generated/prisma/client.js";
import { createAppError } from "../common/app.error.js";
import { MAX_ADDED_MINUTE, MINUTE_BOUNDS } from "../types/match.type.js";
export function isKnockoutFormat(format) {
    return format === PhaseFormat.knockout;
}
export const MATCH_EVENT_SELECT = {
    id: true,
    match_id: true,
    player_id: true,
    team_id: true,
    type: true,
    period: true,
    minute: true,
    time_source: true,
    added_minute: true,
    created_at: true,
};
export const MATCH_RESULT_SELECT = {
    id: true,
    match_id: true,
    home_final_score: true,
    away_final_score: true,
    home_extra_time_score: true,
    away_extra_time_score: true,
    home_penalty_score: true,
    away_penalty_score: true,
    result_type: true,
    status: true,
    notes: true,
    created_at: true,
};
// Baseline lý thuyết (chưa tính bù giờ — bù giờ là hướng phát triển sau,
// để field trống hiện tại nghĩa là dùng baseline chuẩn 45/90/105/120).
export const PERIOD_BASELINE_MINUTE = {
    first_half: 0,
    second_half: 45,
    extra_time_first: 90,
    extra_time_second: 105,
    penalty_shootout: 120,
};
/**
 * Tính giờ hiển thị cho 1 event.
 * - time_source='live': dùng created_at thẳng — admin đã bấm ngay lúc xảy ra,
 *   sai số chỉ là độ trễ thao tác (vài giây), coi là chính xác.
 * - time_source='estimated': suy từ scheduled_at + minute, baseline lý
 *   thuyết theo period (KHÔNG bù giờ thực tế — xem PERIOD_BASELINE_MINUTE).
 *   Đây là ước lượng thô, sai số có thể vài phút/hàng chục phút nếu hiệp
 *   trước đó có bù giờ dài hoặc nghỉ giữa hiệp không chuẩn 15p. Hướng phát
 *   triển sau: thêm Match.first_half_added_time/second_half_added_time để
 *   bù chính xác hơn — hàm này đã tách baseline riêng để dễ nâng cấp, không
 *   cần đổi chữ ký khi thêm bù giờ.
 */
export function computeEventClockTime(match, evt) {
    if (evt.time_source === 'live') {
        return { time: evt.created_at, confidence: 'exact' };
    }
    if (!match.scheduled_at || evt.minute == null || !evt.period)
        return null;
    if (evt.period === MatchPeriod.penalty_shootout)
        return null; // pen không có "phút" thật
    const baseline = PERIOD_BASELINE_MINUTE[evt.period];
    // minute lưu theo chuẩn cumulative bóng đá (hiệp 2: 46-90...), nên
    // KHÔNG cộng thêm baseline vào minute — minute tự nó đã là tổng phút.
    const totalMinutes = evt.minute + (evt.added_minute ?? 0);
    return {
        time: new Date(match.scheduled_at.getTime() + totalMinutes * 60_000),
        confidence: 'estimated',
    };
}
// ─── Minute rounding ──────────────────────────────────────────────────────────
export function toMatchMinute(elapsedSeconds) {
    if (elapsedSeconds < 0)
        throw createAppError('VALIDATION_ERROR', `elapsedSeconds không thể âm: ${elapsedSeconds}`);
    return Math.max(1, Math.ceil(elapsedSeconds / 60));
}
export const GOAL_EVENT_TYPES = [
    MatchEventType.goal,
    MatchEventType.own_goal,
    MatchEventType.penalty_scored,
];
// ─── Helpers ──────────────────────────────────────────────────────────────────
export function statKey(playerId, teamId) {
    return `${playerId}:${teamId}`;
}
export function buildStatDeltas(events) {
    const played = new Set();
    const deltas = new Map();
    for (const ev of events) {
        if (!ev.player_id || !ev.team_id)
            continue;
        const k = statKey(ev.player_id, ev.team_id);
        played.add(k);
        const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
        switch (ev.type) {
            case MatchEventType.goal:
            case MatchEventType.penalty_scored:
                d.goals++;
                break;
            case MatchEventType.yellow_card:
                d.yellowCards++;
                break;
            case MatchEventType.red_card:
            case MatchEventType.second_yellow:
                d.redCards++;
                break;
        }
        deltas.set(k, d);
    }
    return { played, deltas };
}
export function toMatchResultCreateInput(matchId, input, resolution) {
    return {
        match: { connect: { id: matchId } },
        winner_team: resolution.winnerTeamId
            ? { connect: { id: resolution.winnerTeamId } }
            : undefined,
        home_extra_time_score: input.homeExtraTime ?? null,
        away_extra_time_score: input.awayExtraTime ?? null,
        home_penalty_score: input.homePenalty ?? null,
        away_penalty_score: input.awayPenalty ?? null,
        home_final_score: resolution.homeFinal,
        away_final_score: resolution.awayFinal,
        result_type: input.resultType,
        status: 'official',
        notes: input.notes ?? null,
    };
}
// FIX (half-time score bị mất vĩnh viễn sau confirm): trước đây hàm này
// LUÔN null hoá finalize_home_half_time/finalize_away_half_time khi confirm
// — nhưng MatchResult KHÔNG có cột nào lưu half-time score cả (xem
// MATCH_RESULT_SELECT phía trên, và matchResultSelect ở match.queries.ts —
// không nơi nào có field này). Match.finalize_home_half_time/away_half_time
// vì vậy là NƠI DUY NHẤT có thể lưu half-time score sau khi trận kết thúc.
// getMatchReport() (matchresult.service.ts) đọc đúng 2 field này làm nguồn
// hiển thị (score.homeHalfTime/awayHalfTime) — null hoá cứng ở đây khiến
// half-time LUÔN biến mất ngay khi confirm, bất kể referee đã nhập gì ở
// finalizeMatch(). Giờ nhận thêm 2 tham số optional, forward giá trị vào
// thay vì null cứng — chỉ null khi thực sự không có data (VD manual score
// hoặc admin nhập nhanh không kèm half-time).
export function toMatchUpdateOnConfirm(resolution, targetMatchStatus, homeHalfTimeScore, awayHalfTimeScore) {
    return {
        status: targetMatchStatus,
        played_at: new Date(),
        home_score: resolution.homeFinal,
        away_score: resolution.awayFinal,
        pending_official_at: null,
        manual_home_score: null,
        manual_away_score: null,
        finalize_result_type: null,
        finalize_home_half_time: homeHalfTimeScore ?? null,
        finalize_away_half_time: awayHalfTimeScore ?? null,
        finalize_home_penalty: null,
        finalize_away_penalty: null,
        finalize_home_extra_time: null, // NEW — dọn staging field sau confirm
        finalize_away_extra_time: null, // NEW
    };
}
export function buildMatchEventsQueryRequest(query) {
    return {
        type: query.type,
        period: query.period,
        filter: {
            ...query.filter,
        },
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
        q: query.q,
    };
}
export function buildStandingsQueryRequest(query) {
    return {
        is_active: true,
        filter: query.groupId ? { group_id: { eq: query.groupId } } : {},
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
    };
}
export function buildPlayerStatsQueryRequest(query) {
    return {
        filter: query.teamId ? { team_id: { eq: query.teamId } } : {},
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
    };
}
export function toMatchResultUpdateOnUphold(note) {
    return {
        status: 'official',
        appeal_note: note ?? null,
    };
}
export function toMatchResultUpdateOnOverturn(newHomeScore, newAwayScore, newWinnerTeamId, note) {
    return {
        home_final_score: newHomeScore,
        away_final_score: newAwayScore,
        winner_team: newWinnerTeamId
            ? { connect: { id: newWinnerTeamId } }
            : { disconnect: true },
        status: 'overturned',
        appeal_note: note ?? null,
    };
}
export function toMatchUpdateOnOverturn(newHomeScore, newAwayScore) {
    return {
        home_score: newHomeScore,
        away_score: newAwayScore,
    };
}
export function nextPowerOf2(n) {
    let p = 1;
    while (p < n)
        p *= 2;
    return p;
}
export function buildRound1Pairings(seeding) {
    const n = seeding.length;
    return Array.from({ length: n / 2 }, (_, i) => ({
        home: seeding[i] ?? null,
        away: seeding[n - 1 - i] ?? null,
    }));
}
export function isCreditedToHomeTeam(homeTeamId, eventTeamId, type, wasOwnGoal) {
    if (type === MatchEventType.own_goal) {
        return eventTeamId !== homeTeamId;
    }
    if (type === MatchEventType.goal_disallowed && wasOwnGoal) {
        return eventTeamId !== homeTeamId;
    }
    return eventTeamId === homeTeamId;
}
export function buildMatchReportPlayerRows(lineup, jerseyLookup, events, teamId) {
    const jerseyMap = new Map();
    for (const j of jerseyLookup)
        jerseyMap.set(`${j.team_id}:${j.player_id}`, j.jersey_number);
    const eventsByPlayer = new Map();
    for (const ev of events) {
        if (!ev.player_id)
            continue;
        const arr = eventsByPlayer.get(ev.player_id) ?? [];
        arr.push(ev);
        eventsByPlayer.set(ev.player_id, arr);
    }
    const toEntries = (evs, types) => evs.filter(e => types.includes(e.type))
        .sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))
        .map(e => ({ minute: e.minute, addedMinute: e.added_minute }));
    return lineup
        .filter(l => l.team_id === teamId)
        .map(l => {
        const evs = eventsByPlayer.get(l.player_id) ?? [];
        return {
            playerId: l.player_id,
            jerseyNumber: jerseyMap.get(`${teamId}:${l.player_id}`) ?? null,
            fullName: l.player.user.name,
            position: l.position,
            isCaptain: l.is_captain,
            isStarting: l.lineup_type === 'starter',
            minuteIn: l.minute_in,
            minuteOut: l.minute_out,
            goals: toEntries(evs, [MatchEventType.goal, MatchEventType.penalty_scored]),
            ownGoals: toEntries(evs, [MatchEventType.own_goal]),
            yellowCards: toEntries(evs, [MatchEventType.yellow_card]),
            redCards: toEntries(evs, [MatchEventType.red_card, MatchEventType.second_yellow]),
        };
    })
        .sort((a, b) => Number(b.isStarting) - Number(a.isStarting) || (a.jerseyNumber ?? 999) - (b.jerseyNumber ?? 999));
}
export function buildGoalsTimeline(events, homeTeamId, awayTeamId, playerNameLookup, scheduledAt) {
    const home = [];
    const away = [];
    for (const ev of events) {
        if (!ev.player_id || ev.team_id === null)
            continue;
        const isGoalType = ev.type === MatchEventType.goal || ev.type === MatchEventType.penalty_scored;
        const isOwnGoal = ev.type === MatchEventType.own_goal;
        if (!isGoalType && !isOwnGoal)
            continue;
        const creditedHome = isCreditedToHomeTeam(homeTeamId, ev.team_id, ev.type);
        const clock = computeEventClockTime({ scheduled_at: scheduledAt }, ev);
        const entry = {
            playerName: playerNameLookup.get(ev.player_id) ?? 'Unknown',
            minute: ev.minute,
            addedMinute: ev.added_minute,
            isOwnGoal,
            clockTime: clock?.time ?? null, // NEW
            clockConfidence: clock?.confidence ?? null, // NEW: 'exact' | 'estimated' | null
        };
        (creditedHome ? home : away).push(entry);
    }
    const byMinute = (a, b) => (a.minute ?? 0) - (b.minute ?? 0);
    return { home: home.sort(byMinute), away: away.sort(byMinute) };
}
export function formatMinuteLabel(e) {
    const base = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
    return e.isOwnGoal ? `${base} (OG)` : base;
}
export function formatClockLabel(e) {
    if (!e.clockTime)
        return null;
    const hh = e.clockTime.getHours().toString().padStart(2, '0');
    const mm = e.clockTime.getMinutes().toString().padStart(2, '0');
    const prefix = e.clockConfidence === 'estimated' ? '~' : '';
    return `${prefix}${hh}:${mm}`;
}
export function assertMinuteInBounds(period, minute, addedMinute) {
    if (period === MatchPeriod.penalty_shootout)
        return;
    if (minute === null || minute === undefined || !Number.isInteger(minute)) {
        throw createAppError('VALIDATION_ERROR', `minute phải là số nguyên, nhận được: ${minute}`);
    }
    if (addedMinute != null) {
        if (!Number.isInteger(addedMinute) || addedMinute < 0 || addedMinute > MAX_ADDED_MINUTE) {
            throw createAppError('VALIDATION_ERROR', `addedMinute phải trong khoảng 0-${MAX_ADDED_MINUTE}, nhận được: ${addedMinute}`);
        }
    }
    if (!period) {
        throw createAppError('CONFLICT', `Match chưa xác định period hiện tại — gọi transitionPeriod trước khi ghi event`);
    }
    const bounds = MINUTE_BOUNDS[period];
    if (!bounds) {
        throw createAppError('INTERNAL_SERVER_ERROR', `Không có minute bounds định nghĩa cho period '${period}'`);
    }
    const [min, max] = bounds;
    if (minute < min || minute > max) {
        throw createAppError('VALIDATION_ERROR', `minute=${minute} không hợp lệ cho period '${period}' (khoảng cho phép: ${min}-${max})`);
    }
}
export async function assertPlayerNotSentOff(tx, matchId, playerId) {
    if (!playerId)
        return;
    const sentOff = await tx.matchEvent.findFirst({
        where: {
            match_id: matchId,
            player_id: playerId,
            type: { in: [MatchEventType.red_card, MatchEventType.second_yellow] },
        },
        select: { id: true },
    });
    if (sentOff) {
        throw createAppError('CONFLICT', `Player ${playerId} đã bị truất quyền thi đấu (thẻ đỏ/thẻ vàng thứ 2) trong trận ${matchId} — không thể ghi thêm sự kiện`);
    }
}
export async function findAdvancedChildMatchId(tx, matchId) {
    const slot = await tx.bracketSlot.findFirst({
        where: { match_id: matchId },
        select: {
            fed_as_a: { select: { match_id: true } },
            fed_as_b: { select: { match_id: true } },
        },
    });
    return slot?.fed_as_a?.[0]?.match_id ?? slot?.fed_as_b?.[0]?.match_id ?? null;
}
export async function isKnockoutBracketSeeded(tx, seasonId) {
    const knockoutPhase = await tx.phase.findFirst({
        where: {
            season_id: seasonId,
            format: PhaseFormat.knockout,
            matches: { some: {} },
        },
        select: { id: true },
    });
    return knockoutPhase !== null;
}
//# sourceMappingURL=match.helper.js.map