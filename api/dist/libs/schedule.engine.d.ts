import { Slot } from "../types/schedule.type.js";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";
export type ScheduleCandidateMatch = {
    id: number;
    home_team_id: number;
    away_team_id: number;
    round: string | null;
};
export type GreedyPassResult = {
    updates: {
        id: number;
        scheduledAt: Date;
        venueId: number;
    }[];
    unscheduled: number[];
};
export declare const ASSUMED_MATCH_DURATION_MS: number;
export declare const DEFAULT_VENUE_BUFFER_MINUTES = 30;
type TimeWindow = {
    start: number;
    end: number;
};
export declare class ScheduleEngine {
    protected readonly prisma: PrismaClient;
    constructor(prisma: PrismaClient);
    /**
     * FIX (bỏ fixed matchTimes, chuyển continuous slot): trước đây pool chỉ
     * gồm đúng N khung giờ cố định/ngày (matchTimes: string[]) — 2 trận cùng
     * sân ở 2 matchTimes gần nhau vẫn được coi hợp lệ dù cách nhau <30p, và
     * admin phải tự đoán khung giờ "đủ xa" nhau. Giờ sinh slot LIÊN TỤC từ
     * dailyStartTime đến dailyEndTime, mỗi slot cách slot trước đúng
     * `ASSUMED_MATCH_DURATION_MS + bufferMinutes` — invariant "cách quãng tối
     * thiểu" nằm ngay trong cách sinh pool, không cần validate rời rạc sau.
     *
     * takenWindows (Map venue_id -> danh sách [start,end] các trận ĐÃ có
     * scheduled_at trong DB, KHÔNG giới hạn theo grid của lần generate này)
     * được check bằng OVERLAP + buffer, không phải exact-timestamp-match như
     * bản Set<string> cũ — vì trận đã tồn tại có thể không nằm đúng trên grid
     * của lần build này (buffer/dailyStartTime khác lần trước).
     */
    protected buildSlotPool(venueIds: number[], startDate: Date, rangeEnd: Date, dailyStartTime: string, dailyEndTime: string, bufferMinutes: number, takenWindows: Map<number, TimeWindow[]>, excludedDates?: string[]): Slot[];
    protected vnTimeToUtc(date: Date, vnTime: string): Date;
    protected findEarliestValidSlot(pool: Slot[], usedSlotIdx: Set<number>, homeTeamId: number, awayTeamId: number, lastPlayedAt: Map<number, number>, minRestDays: number, conflictMap?: Map<number, Set<number>>, occupiedWindows?: Map<number, TimeWindow[]>): number;
    protected findAvailableSlotsForMatch(pool: Slot[], homeTeamId: number, awayTeamId: number, playedTimesByTeam: Map<number, number[]>, minRestDays: number, conflictMap: Map<number, Set<number>>, occupiedWindows: Map<number, TimeWindow[]>, limit: number): Slot[];
    protected loadTakenVenueWindows(venueIds: number[], startDate: Date, rangeEnd: Date): Promise<Map<number, TimeWindow[]>>;
    protected buildTeamConflictMap(client: Prisma.TransactionClient | PrismaClient, teamIds: number[]): Promise<Map<number, Set<number>>>;
    protected loadPlayerConflictContext(client: Prisma.TransactionClient | PrismaClient, teamIds: number[], excludeMatchIds?: number[]): Promise<{
        conflictMap: Map<number, Set<number>>;
        occupiedWindows: Map<number, TimeWindow[]>;
    }>;
    private hasWindowConflict;
    private recordWindow;
    protected writeScheduleBatch(updates: {
        id: number;
        scheduledAt: Date;
        venueId: number;
    }[]): Promise<number[]>;
    protected scheduleMatchesWithRetry(matches: ScheduleCandidateMatch[], pool: Slot[], minRestDays: number, initialLastPlayedAt?: Map<number, number>, conflictContext?: {
        conflictMap: Map<number, Set<number>>;
        occupiedWindows: Map<number, TimeWindow[]>;
    }): GreedyPassResult;
    private runGreedyPass;
    private orderByMostConstrained;
    private isRestDaysSatisfied;
    protected quarantinePlayerConflicts(tx: Prisma.TransactionClient, writtenMatchIds: number[]): Promise<number[]>;
}
export {};
//# sourceMappingURL=schedule.engine.d.ts.map