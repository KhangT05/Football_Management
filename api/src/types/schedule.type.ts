import { Match, MatchStatus, Prisma } from "../generated/prisma/client.js";

export type MatchDraft = {
    phase_id: number;
    group_id: number;
    home_team_id: number;
    away_team_id: number;
    round: string;
    status: MatchStatus;
};

// FIX (bỏ fixed matchTimes): Slot giờ chỉ cần venue_id + scheduledAtMs — thời
// điểm start được tính liên tục (dailyStartTime + k*(duration+buffer)), không
// còn khái niệm "1 trong N khung giờ cố định trong ngày" nữa. Xem
// ScheduleEngine.buildSlotPool.
export type Slot = {
    venue_id: number;
    scheduledAtMs: number;
};

// NEW: filter áp dụng cho autoScheduleMatches — cho phép admin chọn xếp lịch
// cho 1 tập round/group cụ thể (vd tạo cùng lúc vòng 1,2,3 cho 5 bảng), thay
// vì luôn xếp TOÀN BỘ match chưa scheduled_at của season. Dùng chung cho cả
// GenerateOptions, GenerateFromGroupsOptions, và lời gọi autoScheduleMatches
// trực tiếp (endpoint /schedule) để re-schedule phần còn lại sau này.
export type AutoScheduleFilterOptions = {
    rounds?: number[];
    groupIds?: number[];
};

// FIX (thay matchTimes: string[] bằng continuous window + buffer): trước đây
// chỉ đá được đúng N khung giờ cố định/ngày (vd 08:00, 15:00) — 2 trận cùng
// sân khác matchTimes có thể sát nhau bất kỳ khoảng cách nào nếu admin nhập
// 2 giờ gần nhau. Giờ chỉ cần khung giờ hoạt động trong ngày (dailyStartTime
// → dailyEndTime) + khoảng cách tối thiểu bufferMinutes giữa 2 trận CÙNG SÂN
// — slot tự sinh liên tục theo bước (ASSUMED_MATCH_DURATION_MS + buffer).
export type ScheduleOptions = {
    venueIds: number[];
    dailyStartTime: string; // "HH:mm", giờ VN
    dailyEndTime: string;   // "HH:mm", giờ VN
    bufferMinutes?: number; // mặc định DEFAULT_VENUE_BUFFER_MINUTES (30) — xem schedule.engine.ts
    excludedDates?: string[];
};

// Dùng khi advance knockout — venueIds/dailyStartTime/dailyEndTime có thể chưa có
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

// NEW: bufferMinutes optional — mặc định DEFAULT_VENUE_BUFFER_MINUTES nếu
// không truyền. Dùng cho rescheduleMatch (đổi lịch 1 trận thủ công).
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

// NEW: DTO cho round-selector FE (GenerateScheduleModal) — cho biết mỗi round
// group_stage còn bao nhiêu match chưa xếp lịch, để FE disable round đã xếp
// hết và cho phép chọn nhiều round cùng lúc khi generate.
export type RoundSummary = {
    round: number;
    total: number;
    unscheduled: number;
    fullyScheduled: boolean;
};

export const matchScheduleSelect = {
    id: true,
    round: true,
    home_team_id: true,
    away_team_id: true,
    scheduled_at: true,
    venue_id: true,
    status: true,
} as const satisfies Prisma.MatchSelect;

export interface MatchByTeamRow {
    id: number;
    round: string | null;
    scheduled_at: Date | null;
    played_at: Date | null;
    venue_id: number | null;
    status: string;
    home_score: number | null;
    away_score: number | null;
    home_team_id: number;
    away_team_id: number;
    home_team: { id: number; name: string; logo: string | null };
    away_team: { id: number; name: string; logo: string | null };
    venue: { id: number; name: string } | null;
    phase: { id: number; name: string; type: string; format: string } | null;
}

export type DateRangeOverride = {
    dateRangeStart?: Date;
    dateRangeEnd?: Date;
};

export type MatchSlotOption = {
    venueId: number;
    venueName: string;
    scheduledAt: string; // ISO
};

export type UnscheduledMatchOption = {
    id: number;
    homeTeamId: number;
    homeTeamName: string;
    awayTeamId: number;
    awayTeamName: string;
};

export type MatchScheduleRow = Prisma.MatchGetPayload<{ select: typeof matchScheduleSelect }>;