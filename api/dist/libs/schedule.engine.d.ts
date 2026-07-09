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
type TimeWindow = {
    start: number;
    end: number;
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
    /**
     * FIX (player-sharing conflict — tích hợp thẳng vào search, không phải
     * quarantine sau khi ghi): trước đây chỉ check minRestDays theo
     * home_team_id/away_team_id CHÍNH XÁC của match — bỏ sót 2 trường hợp:
     *   1. Cùng team_id nhưng minRestDays quá nhỏ (hoặc =0) vẫn có thể ra 2
     *      slot khác giờ CÙNG NGÀY mà không hề overlap-check theo giờ thực.
     *   2. 2 team KHÁC NHAU (khác season/giải, thậm chí khác season đang
     *      chạy song song — season overlap là HỢP LỆ theo nghiệp vụ) nhưng
     *      share chung 1 player — hoàn toàn không nằm trong minRestDays vì
     *      đó là constraint theo team_id, không theo player.
     *
     * conflictMap + occupiedWindows (optional, mặc định rỗng — giữ
     * backward-compat cho caller chưa truyền, ví dụ KnockoutService nếu
     * chưa update) bổ sung hard constraint riêng, ĐỘC LẬP với minRestDays:
     * slot bị loại nếu rơi vào khung ±ASSUMED_MATCH_DURATION_MS quanh 1
     * match đã có của CHÍNH team này hoặc bất kỳ team nào share player.
     */
    protected findEarliestValidSlot(pool: Slot[], usedSlotIdx: Set<number>, homeTeamId: number, awayTeamId: number, lastPlayedAt: Map<number, number>, minRestDays: number, conflictMap?: Map<number, Set<number>>, occupiedWindows?: Map<number, TimeWindow[]>): number;
    protected loadTakenSlots(venueIds: number[], startDate: Date, rangeEnd: Date): Promise<Set<string>>;
    /**
     * Với 1 tập team đầu vào, trả về Map: team_id -> Set<team_id> gồm CHÍNH
     * NÓ + mọi team KHÁC (không giới hạn trong tập đầu vào — quét toàn hệ
     * thống) có chung ít nhất 1 player active trong roster.
     *
     * Shared giữa ScheduleService (rescheduleMatch — strict, throw ngay
     * trong transaction) và autoScheduleMatches/KnockoutService (search-time
     * avoidance qua loadPlayerConflictContext bên dưới).
     *
     * `client` nhận cả PrismaClient lẫn Prisma.TransactionClient (cùng
     * pattern PlayerService.ensurePlayerRole) — cho phép gọi trong hoặc
     * ngoài transaction tuỳ nơi dùng.
     */
    protected buildTeamConflictMap(client: Prisma.TransactionClient | PrismaClient, teamIds: number[]): Promise<Map<number, Set<number>>>;
    /**
     * Preload BASELINE occupied windows từ DB (bất kỳ season/giải nào,
     * KHÔNG giới hạn theo season đang generate) cho toàn bộ "conflict
     * closure" của teamIds — dùng để seed search TRƯỚC KHI chạy greedy pass,
     * để thuật toán tự né những khung giờ đã bị chiếm bởi chính team này
     * hoặc team share player, thay vì assign rồi mới phát hiện conflict sau
     * khi ghi (quarantine — chỉ còn là safety net cho race hiếm, xem
     * ScheduleService.autoScheduleMatches).
     *
     * excludeMatchIds: dùng khi seed cho 1 match ĐANG ĐƯỢC reschedule (loại
     * chính nó khỏi baseline) — autoScheduleMatches không cần vì match đang
     * xếp lịch luôn có scheduled_at=null, tự động không xuất hiện trong kết
     * quả query (đã filter `scheduled_at: { not: null }`).
     */
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
     * conflictContext (MỚI — optional, backward-compat): load TRƯỚC (I/O,
     * async) bằng loadPlayerConflictContext() ở caller rồi truyền vào đây —
     * giữ đúng nguyên tắc tách I/O (loadTakenSlots/loadPlayerConflictContext,
     * async) ra khỏi search (buildSlotPool/scheduleMatchesWithRetry, sync/
     * CPU-bound), không phá vỡ lý do giữ hàm này sync ở trên. Không truyền
     * (hoặc caller cũ như KnockoutService chưa update) → mặc định rỗng,
     * hành vi y hệt trước đây, KHÔNG có player-conflict avoidance.
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
    protected scheduleMatchesWithRetry(matches: ScheduleCandidateMatch[], pool: Slot[], minRestDays: number, initialLastPlayedAt?: Map<number, number>, conflictContext?: {
        conflictMap: Map<number, Set<number>>;
        occupiedWindows: Map<number, TimeWindow[]>;
    }): GreedyPassResult;
    private runGreedyPass;
    private orderByMostConstrained;
    private isRestDaysSatisfied;
    /**
     * MOVED from ScheduleService — shared by both ScheduleService
     * (autoScheduleMatches, round-robin) and KnockoutService
     * (scheduleMatchBatch, bracket). Same greedy detect-and-revert pass,
     * now callable from either subclass instead of being duplicated.
     *
     * Best-effort pass run AFTER writeScheduleBatch() has written
     * scheduled_at for a batch of matches. Detect-and-revert:
     *
     * 1. Re-read exactly the matches in `writtenMatchIds` that have
     *    scheduled_at set.
     * 2. Build a conflict map for all teams involved (once, reused).
     * 3. Walk in ascending scheduled_at order (earlier-scheduled match wins)
     *    — any match landing in a window already "claimed" by a related
     *    team (itself or a player-sharing team) gets reverted
     *    (scheduled_at=null, venue_id=null) and returned as quarantined.
     *
     * GREEDY, NOT OPTIMAL: a different processing order could keep more
     * matches (this is an independent-set-on-interval-graph problem per
     * team "line" — earliest-start greedy is a reasonable heuristic, not a
     * global optimum when many teams overlap in complex ways).
     */
    /**
     * Best-effort pass chạy SAU KHI writeScheduleBatch() đã ghi scheduled_at
     * cho 1 batch match (autoScheduleMatches). Không sửa được thuật toán
     * search bên trong ScheduleEngine (không có file đó), nên xử lý theo
     * hướng detect-and-revert:
     *
     * 1. Đọc lại đúng các match trong `writtenMatchIds` đã có scheduled_at.
     * 2. Build conflict map cho toàn bộ team liên quan (1 lần, tái sử dụng).
     * 3. Duyệt tuần tự theo scheduled_at tăng dần (match xếp giờ sớm hơn
     *    được ưu tiên giữ) — match nào rơi vào khung giờ đã bị 1 team liên
     *    quan (chính nó hoặc share player) "chiếm" trước đó thì bị revert
     *    (scheduled_at=null, venue_id=null) và trả về trong danh sách quarantined.
     *
     * ĐÂY LÀ GREEDY, KHÔNG PHẢI OPTIMAL: thứ tự xử lý khác có thể giữ được
     * nhiều match hơn (bài toán tương đương independent-set trên interval
     * graph theo từng "line" team — greedy theo earliest-start là heuristic
     * hợp lý nhưng không đảm bảo tối ưu toàn cục khi có nhiều team chồng
     * chéo phức tạp).
     */
    protected quarantinePlayerConflicts(tx: Prisma.TransactionClient, writtenMatchIds: number[]): Promise<number[]>;
}
export {};
//# sourceMappingURL=schedule.engine.d.ts.map