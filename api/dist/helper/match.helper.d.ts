import { MatchEventType, MatchPeriod, MatchStatus, PhaseFormat, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { MatchReportPlayerRow } from "../types/matchReport.type.js";
import { ConfirmResultInput, WinnerResolution } from "../types/matchResult.type.js";
import { QueryRequest } from "../types/queryable.type.js";
export declare function isKnockoutFormat(format: PhaseFormat): boolean;
export declare const MATCH_EVENT_SELECT: {
    id: true;
    match_id: true;
    player_id: true;
    team_id: true;
    type: true;
    period: true;
    minute: true;
    added_minute: true;
    created_at: true;
};
export declare const MATCH_RESULT_SELECT: {
    id: true;
    match_id: true;
    home_final_score: true;
    away_final_score: true;
    home_extra_time_score: true;
    away_extra_time_score: true;
    home_penalty_score: true;
    away_penalty_score: true;
    result_type: true;
    status: true;
    notes: true;
    created_at: true;
};
export type MatchEventRow = Prisma.MatchEventGetPayload<{
    select: typeof MATCH_EVENT_SELECT;
}>;
export type MatchResultRow = Prisma.MatchResultGetPayload<{
    select: typeof MATCH_RESULT_SELECT;
}>;
export type StatDelta = {
    goals: number;
    yellowCards: number;
    redCards: number;
};
export declare function toMatchMinute(elapsedSeconds: number): number;
export declare const GOAL_EVENT_TYPES: MatchEventType[];
export declare function statKey(playerId: number, teamId: number): string;
export declare function buildStatDeltas(events: {
    player_id: number | null;
    team_id: number | null;
    type: string;
}[]): {
    played: Set<string>;
    deltas: Map<string, StatDelta>;
};
export declare function toMatchResultCreateInput(matchId: number, input: ConfirmResultInput, resolution: WinnerResolution): Prisma.MatchResultCreateInput;
export declare function toMatchUpdateOnConfirm(resolution: WinnerResolution, targetMatchStatus: MatchStatus): Prisma.MatchUpdateInput;
export declare function buildMatchEventsQueryRequest(query: Record<string, any>): QueryRequest;
export declare function buildStandingsQueryRequest(query: Record<string, any>): QueryRequest;
export declare function buildPlayerStatsQueryRequest(query: Record<string, any>): QueryRequest;
export declare function toMatchResultUpdateOnUphold(note?: string): Prisma.MatchResultUpdateInput;
export declare function toMatchResultUpdateOnOverturn(newHomeScore: number, newAwayScore: number, newWinnerTeamId: number | null, note?: string): Prisma.MatchResultUpdateInput;
export declare function toMatchUpdateOnOverturn(newHomeScore: number, newAwayScore: number): Prisma.MatchUpdateInput;
export declare function nextPowerOf2(n: number): number;
export declare function buildRound1Pairings(seeding: (number | null)[]): {
    home: number | null;
    away: number | null;
}[];
export declare function isCreditedToHomeTeam(homeTeamId: number, eventTeamId: number, type: MatchEventType, wasOwnGoal?: boolean): boolean;
type LineupRow = {
    player_id: number;
    team_id: number;
    position: PlayerPosition;
    lineup_type: 'starter' | 'substitute';
    is_captain: boolean;
    minute_in: number | null;
    minute_out: number | null;
    player: {
        user: {
            name: string;
        };
    };
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
export declare function buildMatchReportPlayerRows(lineup: LineupRow[], jerseyLookup: JerseyLookupRow[], events: EventRow[], teamId: number): MatchReportPlayerRow[];
export interface MatchReportGoalEntry {
    playerName: string;
    minute: number | null;
    addedMinute: number | null;
    isOwnGoal: boolean;
}
export declare function buildGoalsTimeline(events: {
    player_id: number | null;
    team_id: number | null;
    type: MatchEventType;
    minute: number | null;
    added_minute: number | null;
}[], homeTeamId: number, awayTeamId: number, playerNameLookup: Map<number, string>): {
    home: MatchReportGoalEntry[];
    away: MatchReportGoalEntry[];
};
export declare function formatMinuteLabel(e: MatchReportGoalEntry): string;
export declare function assertMinuteInBounds(period: MatchPeriod | null | undefined, minute: number | null | undefined, addedMinute?: number | null): void;
export declare function assertPlayerNotSentOff(tx: Prisma.TransactionClient, matchId: number, playerId: number | null | undefined): Promise<void>;
export declare function findAdvancedChildMatchId(tx: Prisma.TransactionClient, matchId: number): Promise<number | null>;
export declare function isKnockoutBracketSeeded(tx: Prisma.TransactionClient, seasonId: number): Promise<boolean>;
export {};
//# sourceMappingURL=match.helper.d.ts.map