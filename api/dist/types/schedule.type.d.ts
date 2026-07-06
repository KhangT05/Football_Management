import { Match, MatchStatus, Prisma } from "../generated/prisma/client.js";
export type MatchDraft = {
    phase_id: number;
    group_id: number;
    home_team_id: number;
    away_team_id: number;
    round: string;
    status: MatchStatus;
};
export type Slot = {
    venue_id: number;
    date: Date;
    time: string;
    scheduledAtMs: number;
};
export type GenerateOptions = {
    desiredGroupCount: number;
    minGroupSize: number;
    maxGroupSize: number;
    venueIds: number[];
    matchTimes: string[];
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
};
export type ScheduleOptions = Pick<GenerateOptions, 'venueIds' | 'matchTimes'>;
export type OptionalScheduleOptions = Partial<ScheduleOptions>;
export type GenerateResult = {
    groupCount: number;
    groupIds: number[];
    matchesScheduled: number;
    failedMatchIds: number[];
    warnings: string[];
};
export type RescheduleInput = {
    scheduledAt: Date;
    venueId: number;
};
export type ScheduleMatchItem = {
    matchId: number;
    round: string | null;
    homeTeamId: number;
    awayTeamId: number;
    scheduledAt: Date | null;
    venueId: number | null;
    status: MatchStatus;
};
export type SeasonSchedule = {
    seasonId: number;
    totalMatches: number;
    scheduledMatches: number;
    unscheduledMatches: number;
    matches: ScheduleMatchItem[];
};
/**
 * Options cho generateMatchesFromDrawnGroups — KHÁC GenerateOptions:
 * không có desiredGroupCount/minGroupSize/maxGroupSize vì group đã được
 * tạo & bốc thăm sẵn qua GroupService (GroupDrawUI). Chỉ cần thông tin
 * xếp lịch (sân, khung giờ, số ngày nghỉ).
 */
export interface GenerateFromGroupsOptions {
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
    venueIds: number[];
    matchTimes: string[];
    allowPastDate?: boolean;
}
export declare const matchScheduleSelect: {
    readonly id: true;
    readonly round: true;
    readonly home_team_id: true;
    readonly away_team_id: true;
    readonly scheduled_at: true;
    readonly venue_id: true;
    readonly status: true;
};
export type MatchByTeamRow = Pick<Match, 'id' | 'round' | 'home_team_id' | 'away_team_id' | 'scheduled_at' | 'venue_id' | 'status'>;
export type MatchScheduleRow = Prisma.MatchGetPayload<{
    select: typeof matchScheduleSelect;
}>;
//# sourceMappingURL=schedule.type.d.ts.map