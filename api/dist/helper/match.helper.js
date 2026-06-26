// ─── Helpers ──────────────────────────────────────────────────────────────────
import { MatchEventType, PhaseFormat } from "../generated/prisma/client.js";
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
export function buildRound1Pairings(seeding) {
    const n = seeding.length;
    return Array.from({ length: n / 2 }, (_, i) => ({
        home: seeding[i] ?? null,
        away: seeding[n - 1 - i] ?? null,
    }));
}
/**
 * Xác định bàn thắng/trừ điểm có tính cho home hay không.
 * Dùng chung ở _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
 * để đảm bảo 2 nơi không viết 2 ternary khác nhau cho cùng business rule.
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
//# sourceMappingURL=match.helper.js.map