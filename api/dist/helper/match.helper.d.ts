import { MatchEventType, MatchPeriod, MatchStatus, PhaseFormat, PlayerPosition, Prisma } from "../generated/prisma/client.js";
import { QueryRequest } from "../types/queryable.type.js";
import { ConfirmResultInput, WinnerResolution } from "../types/matchResult.type.js";
import { MatchReportPlayerRow } from '../types/matchReport.type.js';
export declare function isKnockoutFormat(format: PhaseFormat): boolean;
export declare const MATCH_EVENT_SELECT: {
    id: true;
    match_id: true;
    player_id: true;
    team_id: true;
    type: true;
    period: true;
    minute: true;
    time_source: true;
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
export declare const PERIOD_BASELINE_MINUTE: Record<MatchPeriod, number>;
export interface EventClockTime {
    time: Date;
    confidence: 'exact' | 'estimated';
}
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
export declare function computeEventClockTime(match: {
    scheduled_at: Date | null;
}, evt: {
    time_source: 'live' | 'estimated';
    created_at: Date;
    period: MatchPeriod | null;
    minute: number | null;
    added_minute: number | null;
}): EventClockTime | null;
/**
 * FIX (type trùng lặp): trước đây `MatchReportEventEntry` (dùng cho thẻ,
 * khai ở types/matchReport.type.ts) và field lõi của `MatchReportGoalEntry`
 * (dùng cho bàn thắng, khai ở đây) là 2 khai báo riêng nhưng CÙNG shape
 * (minute/addedMinute/clockTime/clockConfidence) — khi thêm giờ thực cho
 * goal trước đó, phải nhớ sửa cả 2 nơi, dễ lệch nếu quên 1 bên (thực tế đã
 * xảy ra: card bị bỏ sót clockTime/clockConfidence). Gộp về 1 interface lõi
 * DUY NHẤT ở đây — `matchReport.type.ts` giờ import lại, không tự khai nữa.
 */
export interface MatchReportEventEntry {
    minute: number | null;
    addedMinute: number | null;
    clockTime: Date | null;
    clockConfidence: 'exact' | 'estimated' | null;
}
export interface MatchReportGoalEntry extends MatchReportEventEntry {
    playerName: string;
    isOwnGoal: boolean;
}
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
export declare function toMatchUpdateOnConfirm(resolution: WinnerResolution, targetMatchStatus: MatchStatus, homeHalfTimeScore?: number | null, awayHalfTimeScore?: number | null): Prisma.MatchUpdateInput;
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
    period: MatchPeriod | null;
    time_source: 'live' | 'estimated';
    created_at: Date;
};
export declare function buildMatchReportPlayerRows(lineup: LineupRow[], jerseyLookup: JerseyLookupRow[], events: EventRow[], teamId: number, scheduledAt: Date | null): MatchReportPlayerRow[];
export declare function buildGoalsTimeline(events: {
    player_id: number | null;
    team_id: number | null;
    type: MatchEventType;
    period: MatchPeriod | null;
    minute: number | null;
    added_minute: number | null;
    time_source: 'live' | 'estimated';
    created_at: Date;
}[], homeTeamId: number, awayTeamId: number, playerNameLookup: Map<number, string>, scheduledAt: Date | null): {
    home: MatchReportGoalEntry[];
    away: MatchReportGoalEntry[];
};
export declare function formatMinuteLabel(e: MatchReportGoalEntry): string;
export declare function formatClockLabel(e: MatchReportGoalEntry): string | null;
export declare function assertMinuteInBounds(period: MatchPeriod | null | undefined, minute: number | null | undefined, addedMinute?: number | null): void;
export declare function assertPlayerNotSentOff(tx: Prisma.TransactionClient, matchId: number, playerId: number | null | undefined): Promise<void>;
export declare function findAdvancedChildMatchId(tx: Prisma.TransactionClient, matchId: number): Promise<number | null>;
export declare function isKnockoutBracketSeeded(tx: Prisma.TransactionClient, seasonId: number): Promise<boolean>;
export {};
//# sourceMappingURL=match.helper.d.ts.map