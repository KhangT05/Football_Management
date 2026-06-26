// ─── Helpers ──────────────────────────────────────────────────────────────────

import { MatchEventType, MatchStatus, PhaseFormat, Prisma } from "../generated/prisma/client.js";
import { ConfirmResultInput, WinnerResolution } from "../types/matchResult.type.js";
import { QueryRequest } from "../types/queryable.type.js";

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
