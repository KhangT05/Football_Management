import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Slot } from "../types/schedule.type.js";
import { MatchStatus, Prisma, PrismaClient } from "../generated/prisma/client.js";
// GIẢ ĐỊNH: shuffle nằm cùng thư mục libs/ như ScheduleEngine (đúng path đã
// thấy trong ScheduleService gốc: '../libs/array.utils.js'). Nếu
// schedule.engine.ts KHÔNG cùng cấp libs/, đổi lại đường dẫn dưới đây.
import { shuffle } from "./array.utils.js";

export type ScheduleCandidateMatch = {
    id: number;
    home_team_id: number;
    away_team_id: number;
    round: string | null;
};

export type GreedyPassResult = {
    updates: { id: number; scheduledAt: Date; venueId: number }[];
    unscheduled: number[];
};

// Số lần thử lại greedy scheduling với thứ tự match xáo trộn khác nhau, giữ
// lại kết quả có ít match thất bại nhất. Greedy chọn-slot-sớm-nhất theo 1
// thứ tự cố định KHÔNG đảm bảo tìm ra lịch khả thi dù lịch đó tồn tại — đây
// là cách giảm rủi ro "failedMatchIds giả" với chi phí thấp, không cần CSP
// solver thật. Dùng CHUNG cho ScheduleService (round-robin) và
// KnockoutService (bracket) — trước đây 2 nơi tự implement riêng, dễ lệch
// khi fix bug 1 bên quên bên kia (đã xảy ra thật với allowPastDate).
const SCHEDULE_RESTARTS = 20;

export class ScheduleEngine {

    constructor(
        protected readonly prisma: PrismaClient
    ) {
    }

    protected buildSlotPool(
        venueIds: number[],
        startDate: Date,
        rangeEnd: Date,
        matchTimes: string[],
        takenSet: Set<string>,
    ): Slot[] {
        const slots: Slot[] = [];
        const cursor = new Date(startDate);

        while (cursor <= rangeEnd) {
            for (const venueId of venueIds) {
                for (const time of matchTimes) {
                    const dt = this.vnTimeToUtc(cursor, time);
                    if (!takenSet.has(`${venueId}_${dt.toISOString()}`)) {
                        slots.push({ venue_id: venueId, date: new Date(cursor), time });
                    }
                }
            }
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }

        return slots.sort((a, b) => {
            const d = a.date.getTime() - b.date.getTime();
            return d !== 0 ? d : a.time.localeCompare(b.time);
        });
    }

    protected vnTimeToUtc(date: Date, vnTime: string): Date {
        const [h, m] = vnTime.split(':').map(Number);
        const vnDateStr = formatInTimeZone(date, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        const localStr = `${vnDateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        return fromZonedTime(localStr, 'Asia/Ho_Chi_Minh');
    }

    protected findEarliestValidSlot(
        pool: Slot[],
        usedSlotIdx: Set<number>,
        homeTeamId: number,
        awayTeamId: number,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): number {
        const minRestMs = minRestDays * 24 * 60 * 60 * 1000;

        for (let i = 0; i < pool.length; i++) {
            if (usedSlotIdx.has(i)) continue;
            const slotTime = pool[i]!.date.getTime();
            const homeLast = lastPlayedAt.get(homeTeamId);
            const awayLast = lastPlayedAt.get(awayTeamId);
            if (homeLast !== undefined && slotTime - homeLast < minRestMs) continue;
            if (awayLast !== undefined && slotTime - awayLast < minRestMs) continue;
            return i;
        }
        return -1;
    }

    protected async loadTakenSlots(venueIds: number[], startDate: Date, rangeEnd: Date): Promise<Set<string>> {
        const taken = await this.prisma.match.findMany({
            where: {
                venue_id: { in: venueIds },
                scheduled_at: { not: null, gte: startDate, lte: rangeEnd },
                status: { not: MatchStatus.cancelled },
            },
            select: { venue_id: true, scheduled_at: true },
        });
        return new Set(taken.map(m => `${m.venue_id}_${m.scheduled_at!.toISOString()}`));
    }

    protected async writeScheduleBatch(
        updates: { id: number; scheduledAt: Date; venueId: number }[],
    ): Promise<number[]> {
        if (updates.length === 0) return [];

        try {
            const scheduledCases = updates.map(u => Prisma.sql`WHEN ${u.id} THEN ${u.scheduledAt}`);
            const venueCases = updates.map(u => Prisma.sql`WHEN ${u.id} THEN ${u.venueId}`);
            const ids = updates.map(u => u.id);

            await this.prisma.$executeRaw`
                    UPDATE matches
                    SET scheduled_at = CASE id ${Prisma.join(scheduledCases, ' ')} END,
                        venue_id     = CASE id ${Prisma.join(venueCases, ' ')} END
                    WHERE id IN (${Prisma.join(ids)})
                `;
            return [];
        } catch {
            // Bulk fail → fallback per-row để isolate conflict
            const failed: number[] = [];
            for (const u of updates) {
                try {
                    await this.prisma.match.update({
                        where: { id: u.id },
                        data: { scheduled_at: u.scheduledAt, venue_id: u.venueId },
                    });
                } catch {
                    failed.push(u.id);
                }
            }
            return failed;
        }
    }

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
    protected async scheduleMatchesWithRetry(
        matches: ScheduleCandidateMatch[],
        pool: Slot[],
        minRestDays: number,
        initialLastPlayedAt?: Map<number, number>,
    ): Promise<GreedyPassResult> {
        let best: GreedyPassResult | null = null;

        for (let attempt = 0; attempt < SCHEDULE_RESTARTS; attempt++) {
            const result = this.runGreedyPass(matches, pool, minRestDays, attempt, initialLastPlayedAt);
            if (!best || result.unscheduled.length < best.unscheduled.length) {
                best = result;
                if (best.unscheduled.length === 0) break; // tìm được lịch hoàn chỉnh, dừng sớm
            }
        }

        return best!;
    }

    // ─── Greedy scheduling pass (1 lần thử, dùng nội bộ bởi scheduleMatchesWithRetry) ─

    private runGreedyPass(
        matches: ScheduleCandidateMatch[],
        pool: Slot[],
        minRestDays: number,
        attemptSeed: number,
        initialLastPlayedAt?: Map<number, number>,
    ): GreedyPassResult {
        const lastPlayedAt = new Map<number, number>(initialLastPlayedAt ?? []);
        const usedSlotIdx = new Set<number>();
        const updates: { id: number; scheduledAt: Date; venueId: number }[] = [];
        const unscheduled: number[] = [];

        const byRound = new Map<number, ScheduleCandidateMatch[]>();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }

        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            const roundMatches = byRound.get(round)!;

            // attempt 0 = thứ tự gốc (deterministic, dễ debug/reproduce).
            // attempt > 0 = MRV ordering trên bản shuffle khác nhau mỗi lần,
            // tránh tie-break luôn rơi vào cùng 1 cục bộ tối ưu.
            const ordered = attemptSeed === 0
                ? roundMatches
                : this.orderByMostConstrained(
                    shuffle([...roundMatches]), pool, usedSlotIdx, lastPlayedAt, minRestDays,
                );

            for (const match of ordered) {
                const slotIdx = this.findEarliestValidSlot(
                    pool, usedSlotIdx,
                    match.home_team_id, match.away_team_id,
                    lastPlayedAt, minRestDays,
                );

                if (slotIdx === -1) { unscheduled.push(match.id); continue; }

                const slot = pool[slotIdx]!;
                const scheduledAt = this.vnTimeToUtc(slot.date, slot.time);

                usedSlotIdx.add(slotIdx);
                lastPlayedAt.set(match.home_team_id, scheduledAt.getTime());
                lastPlayedAt.set(match.away_team_id, scheduledAt.getTime());
                updates.push({ id: match.id, scheduledAt, venueId: slot.venue_id });
            }
        }

        return { updates, unscheduled };
    }

    // MRV heuristic: với mỗi match còn lại trong round, đếm số slot hợp lệ
    // (chưa used, thoả rest-days cho cả 2 team) TẠI THỜI ĐIỂM HIỆN TẠI —
    // không commit, chỉ đếm để sort. Match nào có ít lựa chọn nhất xử lý
    // trước, giảm rủi ro nó bị match khác "tiện tay" chiếm mất slot duy nhất
    // nó cần. Đây là proxy, không phải đếm chính xác theo lý thuyết CSP đầy
    // đủ (không tính ảnh hưởng dây chuyền các match sau), nhưng đủ tốt để
    // cải thiện tỷ lệ thành công so với thứ tự cố định ban đầu.
    private orderByMostConstrained(
        candidates: ScheduleCandidateMatch[],
        pool: Slot[],
        usedSlotIdx: Set<number>,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): ScheduleCandidateMatch[] {
        const withDegree = candidates.map(match => {
            let degree = 0;
            for (let idx = 0; idx < pool.length; idx++) {
                if (usedSlotIdx.has(idx)) continue;
                const slot = pool[idx]!;
                const candidateAt = this.vnTimeToUtc(slot.date, slot.time).getTime();
                if (this.isRestDaysSatisfied(match.home_team_id, candidateAt, lastPlayedAt, minRestDays)
                    && this.isRestDaysSatisfied(match.away_team_id, candidateAt, lastPlayedAt, minRestDays)) {
                    degree++;
                }
            }
            return { match, degree };
        });

        withDegree.sort((a, b) => a.degree - b.degree);
        return withDegree.map(w => w.match);
    }

    private isRestDaysSatisfied(
        teamId: number,
        candidateAtMs: number,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
    ): boolean {
        const last = lastPlayedAt.get(teamId);
        if (last === undefined) return true;
        const diffDays = Math.abs(candidateAtMs - last) / (24 * 60 * 60 * 1000);
        return diffDays >= minRestDays;
    }
}