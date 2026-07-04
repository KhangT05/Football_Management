import { Match, MatchStatus, Prisma } from "../generated/prisma/client.js";

export type MatchDraft = {
    phase_id: number;
    group_id: number;
    home_team_id: number;
    away_team_id: number;
    round: string;
    status: MatchStatus;
};

export type Slot = { venue_id: number; date: Date; time: string };

export type GenerateOptions = {
    desiredGroupCount: number;
    minGroupSize: number;
    maxGroupSize: number;
    venueIds: number[];
    matchTimes: string[];
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
};

export type ScheduleOptions = Pick<
    GenerateOptions,
    'venueIds' | 'matchTimes'
>;
// Dùng khi advance knockout — venueIds/matchTimes có thể chưa có
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
// ─── Projection cho Queryable<Match> ─────────────────────────────────────────
// Derive type trực tiếp từ Prisma schema qua MatchGetPayload thay vì khai tay
// 1 interface song song với `select` — tránh drift khi schema đổi field/nullability.
// KHÔNG dùng type này làm response DTO cho tsoa: Prisma payload type là generic
// mapped type, tsoa khó introspect đúng (giống lý do SeasonTeamWithRelations phải
// khai tay thay vì dùng Prisma.SeasonTeamGetPayload trực tiếp). ScheduleMatchItem
// (flat, ở trên) mới là DTO băng qua controller boundary.
export const matchScheduleSelect = {
    id: true,
    round: true,
    home_team_id: true,
    away_team_id: true,
    scheduled_at: true,
    venue_id: true,
    status: true,
} as const satisfies Prisma.MatchSelect;

// Shape thực tế trả về bởi findMatchesByTeam — khớp đúng `select` dùng trong query.
// Dùng Pick<Match, ...> thay vì Match để compiler tự bắt mismatch nếu select đổi mà quên sync type.
export type MatchByTeamRow = Pick<Match,
    'id' | 'round' | 'home_team_id' | 'away_team_id' | 'scheduled_at' | 'venue_id' | 'status'>;


export type MatchScheduleRow = Prisma.MatchGetPayload<{ select: typeof matchScheduleSelect }>;
