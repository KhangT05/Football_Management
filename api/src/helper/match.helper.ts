// ─── Helpers ──────────────────────────────────────────────────────────────────

import { MatchEventType, MatchStatus, PhaseFormat, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { MatchReportEventEntry, MatchReportPlayerRow } from "../types/matchReport.type.js";
import { ConfirmResultInput, WinnerResolution } from "../types/matchResult.type.js";
import { QueryRequest } from "../types/queryable.type.js";
import { createAppError } from "../common/app.error.js";

export function isKnockoutFormat(format: PhaseFormat): boolean {
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
} satisfies Prisma.MatchEventSelect;

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
} satisfies Prisma.MatchResultSelect;

// ─── Types ────────────────────────────────────────────────────────────────────

export type MatchEventRow = Prisma.MatchEventGetPayload<{ select: typeof MATCH_EVENT_SELECT }>;
export type MatchResultRow = Prisma.MatchResultGetPayload<{ select: typeof MATCH_RESULT_SELECT }>;

export type MatchForConfirmFull = Prisma.MatchGetPayload<{
    select: typeof matchForConfirmSelect;
}>;

export type StatDelta = {
    goals: number;
    yellowCards: number;
    redCards: number;
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
} satisfies Prisma.MatchSelect;

// ─── Minute rounding ──────────────────────────────────────────────────────────
// Business rule: mọi mốc thời gian trận đấu lưu theo phút, làm tròn LÊN
// (ceil), không floor. 0s-60s -> phút 1. Không có phút 0.

export function toMatchMinute(elapsedSeconds: number): number {
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

export const GOAL_EVENT_TYPES: MatchEventType[] = [
    MatchEventType.goal,
    MatchEventType.own_goal,
    MatchEventType.penalty_scored,
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function statKey(playerId: number, teamId: number): string {
    return `${playerId}:${teamId}`;
}

export function buildStatDeltas(
    events: { player_id: number | null; team_id: number | null; type: string }[],
): { played: Set<string>; deltas: Map<string, StatDelta> } {
    const played = new Set<string>();
    const deltas = new Map<string, StatDelta>();

    for (const ev of events) {
        if (!ev.player_id || !ev.team_id) continue;
        const k = statKey(ev.player_id, ev.team_id);
        played.add(k);

        const d = deltas.get(k) ?? { goals: 0, yellowCards: 0, redCards: 0 };
        switch (ev.type as MatchEventType) {
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

export function toMatchResultCreateInput(
    matchId: number,
    input: ConfirmResultInput,
    resolution: WinnerResolution,
): Prisma.MatchResultCreateInput {
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

export function toMatchUpdateOnConfirm(
    resolution: WinnerResolution,
    targetMatchStatus: MatchStatus,
): Prisma.MatchUpdateInput {
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
export function buildMatchEventsQueryRequest(query: Record<string, any>): QueryRequest {
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

export function buildStandingsQueryRequest(query: Record<string, any>): QueryRequest {
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

export function buildPlayerStatsQueryRequest(query: Record<string, any>): QueryRequest {
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

export function toMatchResultUpdateOnUphold(note?: string): Prisma.MatchResultUpdateInput {
    return {
        status: 'official',
        appeal_note: note ?? null,
    };
}

export function toMatchResultUpdateOnOverturn(
    newHomeScore: number,
    newAwayScore: number,
    newWinnerTeamId: number | null,
    note?: string,
): Prisma.MatchResultUpdateInput {
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

export function toMatchUpdateOnOverturn(
    newHomeScore: number,
    newAwayScore: number,
): Prisma.MatchUpdateInput {
    return {
        home_score: newHomeScore,
        away_score: newAwayScore,
    };
}

// → helpers/bracket.helper.ts
export function nextPowerOf2(n: number): number {
    let p = 1;
    while (p < n) p *= 2;
    return p;
}

// → helpers/bracket.helper.ts
export function buildRound1Pairings(
    seeding: (number | null)[],
): { home: number | null; away: number | null }[] {
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
export function isCreditedToHomeTeam(
    homeTeamId: number,
    eventTeamId: number,
    type: MatchEventType,
    wasOwnGoal?: boolean,
): boolean {
    if (type === MatchEventType.own_goal) {
        return eventTeamId !== homeTeamId; // team đá phản → đối thủ được điểm
    }
    if (type === MatchEventType.goal_disallowed && wasOwnGoal) {
        return eventTeamId !== homeTeamId; // huỷ own_goal → trừ của đối thủ
    }
    return eventTeamId === homeTeamId;
}
type LineupRow = {
    player_id: number;
    team_id: number;
    position: PlayerPosition;
    lineup_type: 'starter' | 'substitute';
    is_captain: boolean;
    minute_in: number | null;
    minute_out: number | null;
    player: { user: { name: string } };
};

type JerseyLookupRow = {
    team_id: number;
    player_id: number;
    jersey_number: number;
};

type EventRow = {
    player_id: number | null;
    team_id: number | null;
    type: MatchEventType;
    minute: number | null;
    added_minute: number | null;
};

export function buildMatchReportPlayerRows(
    lineup: LineupRow[],
    jerseyLookup: JerseyLookupRow[],
    events: EventRow[],
    teamId: number,
): MatchReportPlayerRow[] {
    const jerseyMap = new Map<string, number>();
    for (const j of jerseyLookup) jerseyMap.set(`${j.team_id}:${j.player_id}`, j.jersey_number);

    const eventsByPlayer = new Map<number, EventRow[]>();
    for (const ev of events) {
        if (!ev.player_id) continue;
        const arr = eventsByPlayer.get(ev.player_id) ?? [];
        arr.push(ev);
        eventsByPlayer.set(ev.player_id, arr);
    }

    const toEntries = (evs: EventRow[], types: MatchEventType[]): MatchReportEventEntry[] =>
        evs.filter(e => types.includes(e.type))
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
export interface MatchReportGoalEntry {
    playerName: string;
    minute: number | null;
    addedMinute: number | null;
    isOwnGoal: boolean;
}

export function buildGoalsTimeline(
    events: { player_id: number | null; team_id: number | null; type: MatchEventType; minute: number | null; added_minute: number | null }[],
    homeTeamId: number,
    awayTeamId: number,
    playerNameLookup: Map<number, string>, // player_id -> full name (join sẵn từ MatchLineup/TeamPlayer)
): { home: MatchReportGoalEntry[]; away: MatchReportGoalEntry[] } {
    const home: MatchReportGoalEntry[] = [];
    const away: MatchReportGoalEntry[] = [];

    for (const ev of events) {
        if (!ev.player_id) continue;

        const isGoalType = ev.type === MatchEventType.goal || ev.type === MatchEventType.penalty_scored;
        const isOwnGoal = ev.type === MatchEventType.own_goal;
        if (!isGoalType && !isOwnGoal) continue;

        // creditTeam: goal thường -> team_id chính chủ. own_goal -> đảo ngược sang đối thủ.
        const creditTeamId = isOwnGoal
            ? (ev.team_id === homeTeamId ? awayTeamId : homeTeamId)
            : ev.team_id;

        const entry: MatchReportGoalEntry = {
            playerName: playerNameLookup.get(ev.player_id) ?? 'Unknown',
            minute: ev.minute,
            addedMinute: ev.added_minute,
            isOwnGoal,
        };

        (creditTeamId === homeTeamId ? home : away).push(entry);
    }

    const byMinute = (a: MatchReportGoalEntry, b: MatchReportGoalEntry) => (a.minute ?? 0) - (b.minute ?? 0);
    return { home: home.sort(byMinute), away: away.sort(byMinute) };
}
export function formatMinuteLabel(e: MatchReportGoalEntry): string {
    const base = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
    return e.isOwnGoal ? `${base} (OG)` : base;
}