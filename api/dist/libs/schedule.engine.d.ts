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
    /**
     * FIX: Slot giờ cache `scheduledAtMs` (epoch ms, đã tính vnTimeToUtc) ngay
     * tại thời điểm build — trước đây field này KHÔNG được lưu, khiến 2 nơi
     * downstream tự tính lại timestamp theo 2 cách khác nhau:
     *   - findEarliestValidSlot dùng `date.getTime()` — bỏ qua giờ trong ngày,
     *     rest-days constraint sai lệch tới ~23h59 tuỳ giờ đá.
     *   - orderByMostConstrained dùng `vnTimeToUtc(date, time).getTime()` — đúng.
     * MRV ordering và assignment thật do đó dùng 2 nguồn sự thật khác nhau
     * trong cùng 1 pass. Cache 1 lần tại đây, mọi nơi khác đọc lại giá trị
     * này thay vì tính lại.
     *
     * Yêu cầu: type Slot (types/schedule.type.ts) cần thêm field
     * `scheduledAtMs: number`.
     */
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
     *
     * KHÔNG đánh dấu async: toàn bộ thân hàm CPU-bound, không có await bên
     * trong. Đánh dấu async ở đây không khiến nó non-blocking — Node vẫn
     * chạy hết computation đồng bộ trước khi resolve Promise, chỉ tạo ảo
     * giác "đã async hoá" và bắt buộc caller phải nhớ await (nếu quên,
     * destructure trên Promise object → undefined → crash ở writeScheduleBatch).
     * Giữ sync — caller gọi thẳng, không cần await.
     *
     * Với scale hiện tại (SCHEDULE_RESTARTS=20 × MRV O(candidates × pool),
     * vài chục match/giải sinh viên) block event loop trong thời gian ngắn,
     * chấp nhận được. Nếu tournament scale lên vài trăm match/pool vài nghìn
     * slot, cần chủ động yield (vd setImmediate giữa các attempt) — thêm
     * async suông không giải quyết vấn đề này.
     *
     * @param initialLastPlayedAt map lastPlayedAt (ms epoch) theo team_id,
     *   seed sẵn TRƯỚC khi chạy pass đầu. Dùng cho knockout khi cần tôn
     *   trọng rest-days tính từ trận vòng bảng cuối cùng của mỗi team.
     *   Round-robin không cần, bỏ trống (mặc định map rỗng).
     */
    protected scheduleMatchesWithRetry(matches: ScheduleCandidateMatch[], pool: Slot[], minRestDays: number, initialLastPlayedAt?: Map<number, number>): GreedyPassResult;
    private runGreedyPass;
    private orderByMostConstrained;
    private isRestDaysSatisfied;
}
//# sourceMappingURL=schedule.engine.d.ts.map