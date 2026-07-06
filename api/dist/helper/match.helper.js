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
export const matchForConfirmSelect = {
    id: true,
    status: true,
    home_team_id: true,
    away_team_id: true,
    group_id: true,
    phase_id: true,
    phase: {
        select: {
            format: true,
            season: {
                select: {
                    id: true,
                    tournament: {
                        select: {
                            tournamentRule: {
                                select: { yellow_cards_suspension: true, forfeit_score: true },
                            },
                        },
                    },
                },
            },
        },
    },
    matchResult: { select: { id: true } },
};
// ─── Minute rounding ──────────────────────────────────────────────────────────
// Business rule: mọi mốc thời gian trận đấu lưu theo phút, làm tròn LÊN
// (ceil), không floor. 0s-60s -> phút 1. Không có phút 0.
export function toMatchMinute(elapsedSeconds) {
    if (elapsedSeconds < 0)
        throw createAppError('VALIDATION_ERROR', `elapsedSeconds không thể âm: ${elapsedSeconds}`);
    return Math.max(1, Math.ceil(elapsedSeconds / 60));
}
// ─── Goal-minute uniqueness ───────────────────────────────────────────────────
// Business rule: không cho phép 2 bàn thắng (goal/own_goal/penalty_scored)
// trùng phút CHO CÙNG 1 TEAM (team_id trên MatchEvent). Khác team, cùng phút
// vẫn hợp lệ — VD home ghi bàn phút 45 và away cũng ghi bàn phút 45 là 2 sự
// kiện độc lập, không conflict. Không áp dụng cho thẻ/thay người.
//
// LƯU Ý own_goal: team_id của own_goal = team của cầu thủ đá phản lưới
// (không phải team hưởng lợi — xem isCreditedToHomeTeam bên dưới). Guard này
// dedup theo "team có cầu thủ ghi/phản lưới", KHÔNG phải "team được cộng vào
// tỉ số". Nếu business muốn cấm theo team HƯỞNG LỢI, phải đảo ngược team_id
// cho own_goal trước khi gọi guard — hiện KHÔNG làm vậy (ASSUMPTION, xem note
// ở _assertNoGoalMinuteConflict trong match.lifecycle.service.ts).
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
export function toMatchUpdateOnConfirm(resolution, targetMatchStatus) {
    return {
        status: targetMatchStatus,
        played_at: new Date(),
        home_score: resolution.homeFinal,
        away_score: resolution.awayFinal,
        pending_official_at: null,
        manual_home_score: null,
        manual_away_score: null,
        finalize_result_type: null,
        finalize_home_half_time: null,
        finalize_away_half_time: null,
        finalize_home_penalty: null,
        finalize_away_penalty: null,
    };
}
export function buildMatchEventsQueryRequest(query) {
    return {
        // Simple filters (defined in config.filterable)
        type: query.type,
        period: query.period,
        // Complex filters — nếu có
        filter: {
            ...query.filter, // passed as ?filter[type]=goal&filter[period]=first_half
        },
        // Pagination + sort
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
        // Search
        q: query.q,
    };
}
export function buildStandingsQueryRequest(query) {
    return {
        // Simple filters
        is_active: true, // fixed by service
        // Complex filter: group_id
        filter: query.groupId ? { group_id: { eq: query.groupId } } : {},
        // Pagination + sort
        page: query.page,
        per_page: query.per_page,
        sort: query.sort,
        direction: query.direction,
    };
}
export function buildPlayerStatsQueryRequest(query) {
    return {
        // Complex filter: team_id
        filter: query.teamId ? { team_id: { eq: query.teamId } } : {},
        // Pagination + sort
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
// → helpers/bracket.helper.ts
export function nextPowerOf2(n) {
    let p = 1;
    while (p < n)
        p *= 2;
    return p;
}
// → helpers/bracket.helper.ts
// Cross-seeding chuẩn: seed[i] vs seed[n-1-i] (KHÔNG phải seed[2i] vs
// seed[2i+1]). Với input seed order là rank-major theo nhiều group
// (VD [A1,B1,A2,B2] khi seed 2 bảng x top2), công thức này cho R1 =
// (A1 vs B2), (B1 vs A2) — tránh 2 đội cùng bảng gặp nhau ngay round 1.
export function buildRound1Pairings(seeding) {
    const n = seeding.length;
    return Array.from({ length: n / 2 }, (_, i) => ({
        home: seeding[i] ?? null,
        away: seeding[n - 1 - i] ?? null,
    }));
}
/**
 * Xác định bàn thắng/trừ điểm có tính cho home hay không.
 * Dùng chung ở _applyScoreDelta (live), _computeScoreFromEvents (finalize)
 * VÀ buildGoalsTimeline (report) để đảm bảo 3 nơi không viết 3 ternary khác
 * nhau cho cùng business rule own_goal/goal_disallowed.
 *
 * own_goal:         team đá phản lưới → credit cho đối thủ
 * goal_disallowed:  nếu bàn bị huỷ là own_goal → đảo ngược (trừ về đúng bên đã được cộng)
 * goal/penalty_scored: team ghi → credit cho chính mình
 */
export function isCreditedToHomeTeam(homeTeamId, eventTeamId, type, wasOwnGoal) {
    if (type === MatchEventType.own_goal) {
        return eventTeamId !== homeTeamId; // team đá phản → đối thủ được điểm
    }
    if (type === MatchEventType.goal_disallowed && wasOwnGoal) {
        return eventTeamId !== homeTeamId; // huỷ own_goal → trừ của đối thủ
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
// FIX: trước đây hàm này tự viết ternary riêng để xác định creditTeamId
// (own_goal → đảo home/away), trùng lặp và có thể lệch với
// isCreditedToHomeTeam nếu rule thay đổi sau này mà quên sync 2 chỗ. Giờ
// gọi thẳng isCreditedToHomeTeam để đảm bảo 1 nguồn sự thật duy nhất.
//
// FIX: ev.team_id không được null-check trước đây — event có team_id=null
// (dữ liệu thiếu/join lỗi) sẽ rơi vào nhánh `away` một cách âm thầm. Giờ
// skip hẳn event đó thay vì đoán.
export function buildGoalsTimeline(events, homeTeamId, awayTeamId, playerNameLookup) {
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
        const entry = {
            playerName: playerNameLookup.get(ev.player_id) ?? 'Unknown',
            minute: ev.minute,
            addedMinute: ev.added_minute,
            isOwnGoal,
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
// match.helper.ts — chỉ thay hàm assertMinuteInBounds, phần còn lại của file giữ nguyên
export function assertMinuteInBounds(period, minute, addedMinute) {
    // penalty_shootout không có khái niệm "phút thi đấu" — không tồn tại trong
    // MINUTE_BOUNDS, trước đây sẽ rơi vào nhánh INTERNAL_SERVER_ERROR sai chỗ.
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
// ── Sent-off player guard ────────────────────────────────────────────────
// Gap có thật: BE hiện chỉ chặn "2 thẻ vàng cùng type" (findFirst yellow_card),
// không có khái niệm "cầu thủ đã bị truất quyền" (red_card hoặc second_yellow)
// → sau khi bị đuổi, cầu thủ đó vẫn có thể được ghi thêm goal/card/sub_in ở BE,
// vỡ invariant bóng đá cơ bản. Check này BẮT BUỘC chạy trong transaction đã lock
// match row (không phải check rời trước lock — race giữa 2 event cùng lúc cho
// cùng player vẫn có thể lọt nếu check ở ngoài FOR UPDATE).
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
//# sourceMappingURL=match.helper.js.map