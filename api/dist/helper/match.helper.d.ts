import { MatchEventType, MatchStatus, PhaseFormat, Prisma } from "../generated/prisma/client.js";
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
export type MatchForConfirmFull = Prisma.MatchGetPayload<{
    select: typeof matchForConfirmSelect;
}>;
export type StatDelta = {
    goals: number;
    yellowCards: number;
    redCards: number;
};
export declare const matchForConfirmSelect: {
    id: true;
    status: true;
    home_team_id: true;
    away_team_id: true;
    group_id: true;
    phase_id: true;
    phase: {
        select: {
            format: true;
            season: {
                select: {
                    id: true;
                    tournament: {
                        select: {
                            tournamentRule: {
                                select: {
                                    yellow_cards_suspension: true;
                                    forfeit_score: true;
                                };
                            };
                        };
                    };
                };
            };
        };
    };
    matchResult: {
        select: {
            id: true;
        };
    };
};
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
/**
 * Xác định bàn thắng/trừ điểm có tính cho home hay không.
 * Dùng chung ở _applyScoreDelta (live) và _computeScoreFromEvents (finalize)
 * để đảm bảo 2 nơi không viết 2 ternary khác nhau cho cùng business rule.
 *
 * own_goal:         team đá phản lưới → credit cho đối thủ
 * goal_disallowed:  nếu bàn bị huỷ là own_goal → đảo ngược (trừ về đúng bên đã được cộng)
 * goal/penalty_scored: team ghi → credit cho chính mình
 */
export declare function isCreditedToHomeTeam(homeTeamId: number, eventTeamId: number, type: MatchEventType, wasOwnGoal?: boolean): boolean;
//# sourceMappingURL=match.helper.d.ts.map