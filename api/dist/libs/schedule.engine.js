import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { MatchStatus, Prisma } from "../generated/prisma/client.js";
import { shuffle } from "./array.utils.js";
// Nguồn chân lý DUY NHẤT cho "1 trận chiếm bao lâu" khi tính overlap —
// dùng ở CẢ ScheduleEngine (greedy search) LẪN ScheduleService
// (rescheduleMatch, quarantine pass). Trước đây ScheduleService tự định
// nghĩa 1 bản riêng — dễ lệch giá trị nếu sửa 1 chỗ quên chỗ kia. Export ra
// đây, ScheduleService import lại thay vì tự khai báo.
export const ASSUMED_MATCH_DURATION_MS = 2 * 60 * 60 * 1000; // 2h (đá + nghỉ + dự phòng)
// Status không tính vào conflict/occupancy check — trận đã huỷ/xử thua
// không còn giữ chỗ lịch của team/player nữa.
const NON_BLOCKING_STATUSES = [MatchStatus.cancelled, MatchStatus.forfeited];
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
    findEarliestValidSlot(pool, usedSlotIdx, homeTeamId, awayTeamId, lastPlayedAt, minRestDays, conflictMap = new Map(), occupiedWindows = new Map()) {
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
            const windowStart = slotTime - ASSUMED_MATCH_DURATION_MS;
            const windowEnd = slotTime + ASSUMED_MATCH_DURATION_MS;
            if (this.hasWindowConflict(homeTeamId, windowStart, windowEnd, conflictMap, occupiedWindows))
                continue;
            if (this.hasWindowConflict(awayTeamId, windowStart, windowEnd, conflictMap, occupiedWindows))
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
    async buildTeamConflictMap(client, teamIds) {
        const uniqueTeamIds = [...new Set(teamIds)];
        const map = new Map();
        for (const t of uniqueTeamIds)
            map.set(t, new Set([t]));
        if (uniqueTeamIds.length === 0)
            return map;
        const rosterRows = await client.teamPlayer.findMany({
            where: { team_id: { in: uniqueTeamIds }, deleted_at: null },
            select: { team_id: true, player_id: true },
        });
        const playerIds = [...new Set(rosterRows.map(r => r.player_id))];
        if (playerIds.length === 0)
            return map;
        // Toàn bộ team (kể cả NGOÀI uniqueTeamIds) mà các player này đang có
        // mặt — bắt buộc quét không giới hạn: player có thể ở team C mà C
        // không nằm trong input ban đầu.
        const allRosterRows = await client.teamPlayer.findMany({
            where: { player_id: { in: playerIds }, deleted_at: null },
            select: { team_id: true, player_id: true },
        });
        const teamsByPlayer = new Map();
        for (const row of allRosterRows) {
            if (!teamsByPlayer.has(row.player_id))
                teamsByPlayer.set(row.player_id, new Set());
            teamsByPlayer.get(row.player_id).add(row.team_id);
        }
        for (const row of rosterRows) {
            const linked = teamsByPlayer.get(row.player_id) ?? new Set();
            for (const t of linked)
                map.get(row.team_id).add(t);
        }
        return map;
    }
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
    async loadPlayerConflictContext(client, teamIds, excludeMatchIds = []) {
        const conflictMap = await this.buildTeamConflictMap(client, teamIds);
        const allRelevantTeamIds = new Set();
        for (const linked of conflictMap.values())
            for (const t of linked)
                allRelevantTeamIds.add(t);
        const existing = await client.match.findMany({
            where: {
                ...(excludeMatchIds.length ? { id: { notIn: excludeMatchIds } } : {}),
                scheduled_at: { not: null },
                status: { notIn: NON_BLOCKING_STATUSES },
                OR: [
                    { home_team_id: { in: [...allRelevantTeamIds] } },
                    { away_team_id: { in: [...allRelevantTeamIds] } },
                ],
            },
            select: { home_team_id: true, away_team_id: true, scheduled_at: true },
        });
        const occupiedWindows = new Map();
        for (const m of existing) {
            const t = m.scheduled_at.getTime();
            const start = t - ASSUMED_MATCH_DURATION_MS;
            const end = t + ASSUMED_MATCH_DURATION_MS;
            for (const teamId of [m.home_team_id, m.away_team_id]) {
                if (!allRelevantTeamIds.has(teamId))
                    continue;
                if (!occupiedWindows.has(teamId))
                    occupiedWindows.set(teamId, []);
                occupiedWindows.get(teamId).push({ start, end });
            }
        }
        return { conflictMap, occupiedWindows };
    }
    hasWindowConflict(teamId, start, end, conflictMap, occupiedWindows) {
        const linked = conflictMap.get(teamId) ?? new Set([teamId]);
        for (const tid of linked) {
            const windows = occupiedWindows.get(tid);
            if (windows?.some(w => start <= w.end && w.start <= end))
                return true;
        }
        return false;
    }
    recordWindow(teamId, start, end, conflictMap, occupiedWindows) {
        const linked = conflictMap.get(teamId) ?? new Set([teamId]);
        for (const tid of linked) {
            if (!occupiedWindows.has(tid))
                occupiedWindows.set(tid, []);
            occupiedWindows.get(tid).push({ start, end });
        }
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
    scheduleMatchesWithRetry(matches, pool, minRestDays, initialLastPlayedAt, conflictContext) {
        const conflictMap = conflictContext?.conflictMap ?? new Map();
        const baseOccupiedWindows = conflictContext?.occupiedWindows ?? new Map();
        let best = null;
        for (let attempt = 0; attempt < SCHEDULE_RESTARTS; attempt++) {
            const result = this.runGreedyPass(matches, pool, minRestDays, attempt, initialLastPlayedAt, conflictMap, baseOccupiedWindows);
            if (!best || result.unscheduled.length < best.unscheduled.length) {
                best = result;
                if (best.unscheduled.length === 0)
                    break; // tìm được lịch hoàn chỉnh, dừng sớm
            }
        }
        return best;
    }
    // ─── Greedy scheduling pass (1 lần thử, dùng nội bộ bởi scheduleMatchesWithRetry) ─
    runGreedyPass(matches, pool, minRestDays, attemptSeed, initialLastPlayedAt, conflictMap, baseOccupiedWindows) {
        const lastPlayedAt = new Map(initialLastPlayedAt ?? []);
        const usedSlotIdx = new Set();
        const updates = [];
        const unscheduled = [];
        // Clone baseline occupied windows MỖI attempt — không được để các
        // assignment của attempt trước rò rỉ sang attempt sau (mỗi attempt
        // phải bắt đầu lại từ đúng baseline DB, chỉ khác nhau ở thứ tự xử
        // lý match nhờ shuffle/MRV).
        const occupiedWindows = new Map();
        for (const [teamId, windows] of baseOccupiedWindows)
            occupiedWindows.set(teamId, [...windows]);
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
                : this.orderByMostConstrained(shuffle([...roundMatches]), pool, usedSlotIdx, lastPlayedAt, minRestDays, conflictMap, occupiedWindows);
            for (const match of ordered) {
                const slotIdx = this.findEarliestValidSlot(pool, usedSlotIdx, match.home_team_id, match.away_team_id, lastPlayedAt, minRestDays, conflictMap, occupiedWindows);
                if (slotIdx === -1) {
                    unscheduled.push(match.id);
                    continue;
                }
                const slot = pool[slotIdx];
                const scheduledAt = new Date(slot.scheduledAtMs); // FIX: khỏi gọi lại vnTimeToUtc
                usedSlotIdx.add(slotIdx);
                lastPlayedAt.set(match.home_team_id, scheduledAt.getTime());
                lastPlayedAt.set(match.away_team_id, scheduledAt.getTime());
                const windowStart = slot.scheduledAtMs - ASSUMED_MATCH_DURATION_MS;
                const windowEnd = slot.scheduledAtMs + ASSUMED_MATCH_DURATION_MS;
                this.recordWindow(match.home_team_id, windowStart, windowEnd, conflictMap, occupiedWindows);
                this.recordWindow(match.away_team_id, windowStart, windowEnd, conflictMap, occupiedWindows);
                updates.push({ id: match.id, scheduledAt, venueId: slot.venue_id });
            }
        }
        return { updates, unscheduled };
    }
    // MRV heuristic: với mỗi match còn lại trong round, đếm số slot hợp lệ
    // (chưa used, thoả rest-days cho cả 2 team, VÀ không rơi vào window đã
    // bị chiếm bởi team/player liên quan) TẠI THỜI ĐIỂM HIỆN TẠI — không
    // commit, chỉ đếm để sort. Match nào có ít lựa chọn nhất xử lý trước,
    // giảm rủi ro nó bị match khác "tiện tay" chiếm mất slot duy nhất nó
    // cần. Proxy, không phải đếm chính xác theo lý thuyết CSP đầy đủ (không
    // tính ảnh hưởng dây chuyền các match sau), nhưng đủ tốt để cải thiện tỷ
    // lệ thành công so với thứ tự cố định ban đầu.
    orderByMostConstrained(candidates, pool, usedSlotIdx, lastPlayedAt, minRestDays, conflictMap, occupiedWindows) {
        const withDegree = candidates.map(match => {
            let degree = 0;
            for (let idx = 0; idx < pool.length; idx++) {
                if (usedSlotIdx.has(idx))
                    continue;
                const candidateAt = pool[idx].scheduledAtMs; // FIX: dùng giá trị cache, cùng nguồn với findEarliestValidSlot
                if (!this.isRestDaysSatisfied(match.home_team_id, candidateAt, lastPlayedAt, minRestDays))
                    continue;
                if (!this.isRestDaysSatisfied(match.away_team_id, candidateAt, lastPlayedAt, minRestDays))
                    continue;
                const windowStart = candidateAt - ASSUMED_MATCH_DURATION_MS;
                const windowEnd = candidateAt + ASSUMED_MATCH_DURATION_MS;
                if (this.hasWindowConflict(match.home_team_id, windowStart, windowEnd, conflictMap, occupiedWindows))
                    continue;
                if (this.hasWindowConflict(match.away_team_id, windowStart, windowEnd, conflictMap, occupiedWindows))
                    continue;
                degree++;
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
    // ----------------------------------------------------------
    // PLAYER-SHARED-ROSTER CONFLICT DETECTION (quarantine safety-net)
    // ----------------------------------------------------------
    // buildTeamConflictMap / loadPlayerConflictContext giờ nằm ở
    // ScheduleEngine (base class) — dùng chung với KnockoutService. Chỉ còn
    // quarantinePlayerConflicts ở đây, vì nó gắn với write path riêng của
    // autoScheduleMatches (revert scheduled_at sau khi ghi bulk).
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
    async quarantinePlayerConflicts(tx, writtenMatchIds) {
        if (writtenMatchIds.length === 0)
            return [];
        const written = await tx.match.findMany({
            where: {
                id: { in: writtenMatchIds },
                scheduled_at: { not: null },
                status: { notIn: NON_BLOCKING_STATUSES },
            },
            select: { id: true, home_team_id: true, away_team_id: true, scheduled_at: true },
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });
        if (written.length === 0)
            return [];
        const allTeamIds = [...new Set(written.flatMap(m => [m.home_team_id, m.away_team_id]))];
        const conflictMap = await this.buildTeamConflictMap(tx, allTeamIds);
        const overlaps = (aStart, aEnd, bStart, bEnd) => aStart <= bEnd && bStart <= aEnd;
        // occupied: team_id -> danh sách khung giờ [start, end] đã "chốt"
        const occupied = new Map();
        const rejectedIds = [];
        for (const m of written) {
            const t = m.scheduled_at.getTime();
            const start = t - ASSUMED_MATCH_DURATION_MS;
            const end = t + ASSUMED_MATCH_DURATION_MS;
            const linked = new Set([
                ...(conflictMap.get(m.home_team_id) ?? new Set([m.home_team_id])),
                ...(conflictMap.get(m.away_team_id) ?? new Set([m.away_team_id])),
            ]);
            let hasConflict = false;
            for (const tid of linked) {
                const slots = occupied.get(tid);
                if (slots?.some(s => overlaps(s.start, s.end, start, end))) {
                    hasConflict = true;
                    break;
                }
            }
            if (hasConflict) {
                rejectedIds.push(m.id);
                continue;
            }
            for (const tid of linked) {
                if (!occupied.has(tid))
                    occupied.set(tid, []);
                occupied.get(tid).push({ start, end });
            }
        }
        if (rejectedIds.length > 0) {
            await tx.match.updateMany({
                where: { id: { in: rejectedIds } },
                data: { scheduled_at: null, venue_id: null },
            });
        }
        return rejectedIds;
    }
}
//# sourceMappingURL=schedule.engine.js.map