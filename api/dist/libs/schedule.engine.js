import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { MatchStatus, Prisma } from "../generated/prisma/client.js";
import { shuffle } from "./array.utils.js";
// Số lần thử lại greedy scheduling với thứ tự match xáo trộn khác nhau, giữ
// lại kết quả có ít match thất bại nhất. Dùng CHUNG cho ScheduleService
// (round-robin) và KnockoutService (bracket).
const SCHEDULE_RESTARTS = 20;
export class ScheduleEngine {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    buildSlotPool(venueIds, startDate, rangeEnd, matchTimes, takenSet) {
        const slots = [];
        const cursor = new Date(startDate);
        while (cursor <= rangeEnd) {
            for (const venueId of venueIds) {
                for (const time of matchTimes) {
                    const dt = this.vnTimeToUtc(cursor, time);
                    if (!takenSet.has(`${venueId}_${dt.toISOString()}`)) {
                        slots.push({
                            venue_id: venueId,
                            date: new Date(cursor),
                            time,
                            scheduledAtMs: dt.getTime(),
                        });
                    }
                }
            }
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }
        return slots.sort((a, b) => a.scheduledAtMs - b.scheduledAtMs);
    }
    vnTimeToUtc(date, vnTime) {
        const [h, m] = vnTime.split(':').map(Number);
        const vnDateStr = formatInTimeZone(date, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        const localStr = `${vnDateStr}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        return fromZonedTime(localStr, 'Asia/Ho_Chi_Minh');
    }
    findEarliestValidSlot(pool, usedSlotIdx, homeTeamId, awayTeamId, lastPlayedAt, minRestDays) {
        const minRestMs = minRestDays * 24 * 60 * 60 * 1000;
        for (let i = 0; i < pool.length; i++) {
            if (usedSlotIdx.has(i))
                continue;
            const slotTime = pool[i].scheduledAtMs; // FIX: dùng giá trị cache, không phải date.getTime()
            const homeLast = lastPlayedAt.get(homeTeamId);
            const awayLast = lastPlayedAt.get(awayTeamId);
            if (homeLast !== undefined && slotTime - homeLast < minRestMs)
                continue;
            if (awayLast !== undefined && slotTime - awayLast < minRestMs)
                continue;
            return i;
        }
        return -1;
    }
    async loadTakenSlots(venueIds, startDate, rangeEnd) {
        const taken = await this.prisma.match.findMany({
            where: {
                venue_id: { in: venueIds },
                scheduled_at: { not: null, gte: startDate, lte: rangeEnd },
                status: { not: MatchStatus.cancelled },
            },
            select: { venue_id: true, scheduled_at: true },
        });
        return new Set(taken.map(m => `${m.venue_id}_${m.scheduled_at.toISOString()}`));
    }
    async writeScheduleBatch(updates) {
        if (updates.length === 0)
            return [];
        try {
            const scheduledCases = updates.map(u => Prisma.sql `WHEN ${u.id} THEN ${u.scheduledAt}`);
            const venueCases = updates.map(u => Prisma.sql `WHEN ${u.id} THEN ${u.venueId}`);
            const ids = updates.map(u => u.id);
            await this.prisma.$executeRaw `
                    UPDATE matches
                    SET scheduled_at = CASE id ${Prisma.join(scheduledCases, ' ')} END,
                        venue_id     = CASE id ${Prisma.join(venueCases, ' ')} END
                    WHERE id IN (${Prisma.join(ids)})
                `;
            return [];
        }
        catch (err) {
            // FIX: log trước khi fallback — trước đây catch rỗng, không có
            // cách nào phân biệt "hết slot" (logic) vs "DB lỗi" (infra) khi
            // debug incident chỉ dựa vào failedMatchIds ở tầng caller.
            console.error('[ScheduleEngine] Bulk UPDATE thất bại, fallback per-row:', err);
            const failed = [];
            for (const u of updates) {
                try {
                    await this.prisma.match.update({
                        where: { id: u.id },
                        data: { scheduled_at: u.scheduledAt, venue_id: u.venueId },
                    });
                }
                catch (rowErr) {
                    console.error(`[ScheduleEngine] Match ${u.id} update thất bại:`, rowErr);
                    failed.push(u.id);
                }
            }
            return failed;
        }
    }
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
    scheduleMatchesWithRetry(matches, pool, minRestDays, initialLastPlayedAt) {
        let best = null;
        for (let attempt = 0; attempt < SCHEDULE_RESTARTS; attempt++) {
            const result = this.runGreedyPass(matches, pool, minRestDays, attempt, initialLastPlayedAt);
            if (!best || result.unscheduled.length < best.unscheduled.length) {
                best = result;
                if (best.unscheduled.length === 0)
                    break; // tìm được lịch hoàn chỉnh, dừng sớm
            }
        }
        return best;
    }
    // ─── Greedy scheduling pass (1 lần thử, dùng nội bộ bởi scheduleMatchesWithRetry) ─
    runGreedyPass(matches, pool, minRestDays, attemptSeed, initialLastPlayedAt) {
        const lastPlayedAt = new Map(initialLastPlayedAt ?? []);
        const usedSlotIdx = new Set();
        const updates = [];
        const unscheduled = [];
        const byRound = new Map();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }
        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            const roundMatches = byRound.get(round);
            // attempt 0 = thứ tự gốc (deterministic, dễ debug/reproduce).
            // attempt > 0 = MRV ordering trên bản shuffle khác nhau mỗi lần,
            // tránh tie-break luôn rơi vào cùng 1 cục bộ tối ưu.
            const ordered = attemptSeed === 0
                ? roundMatches
                : this.orderByMostConstrained(shuffle([...roundMatches]), pool, usedSlotIdx, lastPlayedAt, minRestDays);
            for (const match of ordered) {
                const slotIdx = this.findEarliestValidSlot(pool, usedSlotIdx, match.home_team_id, match.away_team_id, lastPlayedAt, minRestDays);
                if (slotIdx === -1) {
                    unscheduled.push(match.id);
                    continue;
                }
                const slot = pool[slotIdx];
                const scheduledAt = new Date(slot.scheduledAtMs); // FIX: khỏi gọi lại vnTimeToUtc
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
    // nó cần. Proxy, không phải đếm chính xác theo lý thuyết CSP đầy đủ
    // (không tính ảnh hưởng dây chuyền các match sau), nhưng đủ tốt để cải
    // thiện tỷ lệ thành công so với thứ tự cố định ban đầu.
    orderByMostConstrained(candidates, pool, usedSlotIdx, lastPlayedAt, minRestDays) {
        const withDegree = candidates.map(match => {
            let degree = 0;
            for (let idx = 0; idx < pool.length; idx++) {
                if (usedSlotIdx.has(idx))
                    continue;
                const candidateAt = pool[idx].scheduledAtMs; // FIX: dùng giá trị cache, cùng nguồn với findEarliestValidSlot
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
    isRestDaysSatisfied(teamId, candidateAtMs, lastPlayedAt, minRestDays) {
        const last = lastPlayedAt.get(teamId);
        if (last === undefined)
            return true;
        const diffDays = Math.abs(candidateAtMs - last) / (24 * 60 * 60 * 1000);
        return diffDays >= minRestDays;
    }
}
//# sourceMappingURL=schedule.engine.js.map