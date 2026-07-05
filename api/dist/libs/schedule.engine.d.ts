import { Slot } from "../types/schedule.type.js";
import { PrismaClient } from "../generated/prisma/client.js";
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
export declare class ScheduleEngine {
    protected readonly prisma: PrismaClient;
    constructor(prisma: PrismaClient);
    protected buildSlotPool(venueIds: number[], startDate: Date, rangeEnd: Date, matchTimes: string[], takenSet: Set<string>): Slot[];
    protected vnTimeToUtc(date: Date, vnTime: string): Date;
    protected findEarliestValidSlot(pool: Slot[], usedSlotIdx: Set<number>, homeTeamId: number, awayTeamId: number, lastPlayedAt: Map<number, number>, minRestDays: number): number;
    protected loadTakenSlots(venueIds: number[], startDate: Date, rangeEnd: Date): Promise<Set<string>>;
    protected writeScheduleBatch(updates: {
        id: number;
        scheduledAt: Date;
        venueId: number;
    }[]): Promise<number[]>;
    /**
     * SHARED scheduler — dùng bởi cả ScheduleService.autoScheduleMatches
     * (round-robin) và KnockoutService.scheduleMatchBatch (bracket).
     * Trước đây mỗi bên tự viết greedy pass + MRV ordering + multi-restart
     * riêng dù cùng thuật toán 100% — dedupe tại đây, caller chỉ cần build
     * pool + list match rồi gọi 1 hàm.
     *
     * @param initialLastPlayedAt map lastPlayedAt (ms epoch) theo team_id,
     *   seed sẵn TRƯỚC khi chạy pass đầu. Dùng cho knockout khi cần tôn
     *   trọng rest-days tính từ trận vòng bảng cuối cùng của mỗi team,
     *   không chỉ tính nội bộ trong các match knockout đang xếp. Round-robin
     *   gốc không cần, bỏ trống (mặc định map rỗng).
     */
    protected scheduleMatchesWithRetry(matches: ScheduleCandidateMatch[], pool: Slot[], minRestDays: number, initialLastPlayedAt?: Map<number, number>): Promise<GreedyPassResult>;
    private runGreedyPass;
    private orderByMostConstrained;
    private isRestDaysSatisfied;
}
//# sourceMappingURL=schedule.engine.d.ts.map