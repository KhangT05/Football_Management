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
    scheduledAtMs: number;
};
export type AutoScheduleFilterOptions = {
    rounds?: number[];
    groupIds?: number[];
};
export type ScheduleOptions = {
    venueIds: number[];
    dailyStartTime: string;
    dailyEndTime: string;
    bufferMinutes?: number;
    excludedDates?: string[];
};
export type OptionalScheduleOptions = Partial<ScheduleOptions> & DateRangeOverride;
export type GenerateOptions = ScheduleOptions & AutoScheduleFilterOptions & {
    desiredGroupCount: number;
    minGroupSize: number;
    maxGroupSize: number;
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
};
/**
 * Options cho generateMatchesFromDrawnGroups — KHÁC GenerateOptions: không có
 * desiredGroupCount/minGroupSize/maxGroupSize vì group đã được tạo & bốc
 * thăm sẵn qua GroupService (GroupDrawUI). rounds/groupIds ở đây không ảnh
 * hưởng bước TẠO match (luôn tạo đủ mọi round cho mọi group đã bốc thăm) —
 * chỉ áp dụng cho bước xếp lịch (autoScheduleMatches) chạy ngay sau đó.
 */
export interface GenerateFromGroupsOptions extends ScheduleOptions, AutoScheduleFilterOptions {
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
    allowPastDate?: boolean;
}
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
    bufferMinutes?: number;
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
export type RoundSummary = {
    round: number;
    total: number;
    unscheduled: number;
    fullyScheduled: boolean;
};
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
export type DateRangeOverride = {
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
};
export type MatchSlotOption = {
    venueId: number;
    venueName: string;
    scheduledAt: string;
};
export type UnscheduledMatchOption = {
    id: number;
    homeTeamId: number;
    homeTeamName: string;
    awayTeamId: number;
    awayTeamName: string;
};
export type MatchScheduleRow = Prisma.MatchGetPayload<{
    select: typeof matchScheduleSelect;
}>;
//# sourceMappingURL=schedule.type.d.ts.map