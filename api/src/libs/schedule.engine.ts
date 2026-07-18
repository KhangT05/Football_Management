import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Slot } from "../types/schedule.type.js";
import { MatchStatus, Prisma, PrismaClient } from "../generated/prisma/client.js";
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

export const ASSUMED_MATCH_DURATION_MS = 2 * 60 * 60 * 1000; // 2h (đá + nghỉ + dự phòng)

// NEW: nguồn chân lý DUY NHẤT cho "cách quãng tối thiểu giữa 2 trận cùng sân
// cùng ngày" khi caller không truyền bufferMinutes — dùng ở ScheduleService,
// KnockoutService, và làm mặc định cho rescheduleMatch.
export const DEFAULT_VENUE_BUFFER_MINUTES = 30;

const NON_BLOCKING_STATUSES: MatchStatus[] = [MatchStatus.cancelled, MatchStatus.forfeited];
const SCHEDULE_RESTARTS = 20;

type TimeWindow = { start: number; end: number };

export class ScheduleEngine {

    constructor(
        protected readonly prisma: PrismaClient
    ) {
    }

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
    protected buildSlotPool(
        venueIds: number[],
        startDate: Date,
        rangeEnd: Date,
        dailyStartTime: string,
        dailyEndTime: string,
        bufferMinutes: number,
        takenWindows: Map<number, TimeWindow[]>,
        excludedDates: string[] = [], // NEW — xem comment ScheduleOptions.excludedDates
    ): Slot[] {
        const slots: Slot[] = [];
        const bufferMs = bufferMinutes * 60_000;
        const stepMs = ASSUMED_MATCH_DURATION_MS + bufferMs;
        const excludedSet = new Set(excludedDates);
        const cursor = new Date(startDate);
        while (cursor <= rangeEnd) {
            // NEW: so theo NGÀY-LỊCH-VN của cursor (không phải UTC date) — nhất
            // quán với vnTimeToUtc bên dưới, tránh lệch ngày do VN = UTC+7.
            const vnDateStr = formatInTimeZone(cursor, 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
            if (excludedSet.has(vnDateStr)) {
                cursor.setUTCDate(cursor.getUTCDate() + 1);
                continue;
            }
            for (const venueId of venueIds) {
                const dayStartMs = this.vnTimeToUtc(cursor, dailyStartTime).getTime();
                const dayEndMs = this.vnTimeToUtc(cursor, dailyEndTime).getTime();
                const windows = takenWindows.get(venueId) ?? [];
                for (let t = dayStartMs; t + ASSUMED_MATCH_DURATION_MS <= dayEndMs; t += stepMs) {
                    const slotEnd = t + ASSUMED_MATCH_DURATION_MS;
                    const conflicts = windows.some(w => t < w.end + bufferMs && (w.start - bufferMs) < slotEnd);
                    if (conflicts) continue;
                    slots.push({ venue_id: venueId, scheduledAtMs: t });
                }
            }
            cursor.setUTCDate(cursor.getUTCDate() + 1);
        }
        return slots.sort((a, b) => a.scheduledAtMs - b.scheduledAtMs);
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
        conflictMap: Map<number, Set<number>> = new Map(),
        occupiedWindows: Map<number, TimeWindow[]> = new Map(),
    ): number {
        const minRestMs = minRestDays * 24 * 60 * 60 * 1000;

        for (let i = 0; i < pool.length; i++) {
            if (usedSlotIdx.has(i)) continue;
            const slotTime = pool[i]!.scheduledAtMs;
            const homeLast = lastPlayedAt.get(homeTeamId);
            const awayLast = lastPlayedAt.get(awayTeamId);
            if (homeLast !== undefined && slotTime - homeLast < minRestMs) continue;
            if (awayLast !== undefined && slotTime - awayLast < minRestMs) continue;

            const windowStart = slotTime - ASSUMED_MATCH_DURATION_MS;
            const windowEnd = slotTime + ASSUMED_MATCH_DURATION_MS;
            if (this.hasWindowConflict(homeTeamId, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;
            if (this.hasWindowConflict(awayTeamId, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;

            return i;
        }
        return -1;
    }

    protected findAvailableSlotsForMatch(
        pool: Slot[],
        homeTeamId: number,
        awayTeamId: number,
        playedTimesByTeam: Map<number, number[]>,
        minRestDays: number,
        conflictMap: Map<number, Set<number>>,
        occupiedWindows: Map<number, TimeWindow[]>,
        limit: number,
    ): Slot[] {
        const minRestMs = minRestDays * 24 * 60 * 60 * 1000;
        const results: Slot[] = [];

        for (const slot of pool) {
            if (results.length >= limit) break;
            const t = slot.scheduledAtMs;

            const restOk = (teamId: number) => {
                const times = playedTimesByTeam.get(teamId);
                if (!times) return true;
                return times.every(pt => Math.abs(t - pt) >= minRestMs);
            };
            if (!restOk(homeTeamId) || !restOk(awayTeamId)) continue;

            const windowStart = t - ASSUMED_MATCH_DURATION_MS;
            const windowEnd = t + ASSUMED_MATCH_DURATION_MS;
            if (this.hasWindowConflict(homeTeamId, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;
            if (this.hasWindowConflict(awayTeamId, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;

            results.push(slot);
        }
        return results;
    }

    protected async loadTakenVenueWindows(
        venueIds: number[],
        startDate: Date,
        rangeEnd: Date,
    ): Promise<Map<number, TimeWindow[]>> {
        const taken = await this.prisma.match.findMany({
            where: {
                venue_id: { in: venueIds },
                scheduled_at: { not: null, gte: startDate, lte: rangeEnd },
                status: { not: MatchStatus.cancelled },
            },
            select: { venue_id: true, scheduled_at: true },
        });

        const map = new Map<number, TimeWindow[]>();
        for (const m of taken) {
            if (m.venue_id === null) continue;
            const t = m.scheduled_at!.getTime();
            const list = map.get(m.venue_id) ?? [];
            list.push({ start: t, end: t + ASSUMED_MATCH_DURATION_MS });
            map.set(m.venue_id, list);
        }
        return map;
    }

    protected async buildTeamConflictMap(
        client: Prisma.TransactionClient | PrismaClient,
        teamIds: number[],
    ): Promise<Map<number, Set<number>>> {
        const uniqueTeamIds = [...new Set(teamIds)];
        const map = new Map<number, Set<number>>();
        for (const t of uniqueTeamIds) map.set(t, new Set([t]));
        if (uniqueTeamIds.length === 0) return map;

        // FIX: TeamPlayer không có team_id/deleted_at — team_id nằm trên
        // SeasonTeam (quan hệ season_team_id -> SeasonTeam.team_id), phải join
        // qua season_team để lọc theo team. Cũng bỏ deleted_at vì cột này
        // không tồn tại trên TeamPlayer trong schema hiện tại.
        const rosterRows = await client.teamPlayer.findMany({
            where: { season_team: { team_id: { in: uniqueTeamIds } } },
            select: { player_id: true, season_team: { select: { team_id: true } } },
        });
        const playerIds = [...new Set(rosterRows.map(r => r.player_id))];
        if (playerIds.length === 0) return map;

        const allRosterRows = await client.teamPlayer.findMany({
            where: { player_id: { in: playerIds } },
            select: { player_id: true, season_team: { select: { team_id: true } } },
        });

        const teamsByPlayer = new Map<number, Set<number>>();
        for (const row of allRosterRows) {
            const tId = row.season_team.team_id;
            if (!teamsByPlayer.has(row.player_id)) teamsByPlayer.set(row.player_id, new Set());
            teamsByPlayer.get(row.player_id)!.add(tId);
        }

        for (const row of rosterRows) {
            const rowTeamId = row.season_team.team_id;
            const linked = teamsByPlayer.get(row.player_id) ?? new Set<number>();
            for (const t of linked) map.get(rowTeamId)!.add(t);
        }

        return map;
    }

    protected async loadPlayerConflictContext(
        client: Prisma.TransactionClient | PrismaClient,
        teamIds: number[],
        excludeMatchIds: number[] = [],
    ): Promise<{
        conflictMap: Map<number, Set<number>>;
        occupiedWindows: Map<number, TimeWindow[]>;
    }> {
        const conflictMap = await this.buildTeamConflictMap(client, teamIds);

        const allRelevantTeamIds = new Set<number>();
        for (const linked of conflictMap.values()) for (const t of linked) allRelevantTeamIds.add(t);

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

        const occupiedWindows = new Map<number, TimeWindow[]>();
        for (const m of existing) {
            const t = m.scheduled_at!.getTime();
            const start = t - ASSUMED_MATCH_DURATION_MS;
            const end = t + ASSUMED_MATCH_DURATION_MS;
            for (const teamId of [m.home_team_id, m.away_team_id]) {
                if (!allRelevantTeamIds.has(teamId)) continue;
                if (!occupiedWindows.has(teamId)) occupiedWindows.set(teamId, []);
                occupiedWindows.get(teamId)!.push({ start, end });
            }
        }

        return { conflictMap, occupiedWindows };
    }

    private hasWindowConflict(
        teamId: number,
        start: number,
        end: number,
        conflictMap: Map<number, Set<number>>,
        occupiedWindows: Map<number, TimeWindow[]>,
    ): boolean {
        const linked = conflictMap.get(teamId) ?? new Set<number>([teamId]);
        for (const tid of linked) {
            const windows = occupiedWindows.get(tid);
            if (windows?.some(w => start <= w.end && w.start <= end)) return true;
        }
        return false;
    }

    private recordWindow(
        teamId: number,
        start: number,
        end: number,
        conflictMap: Map<number, Set<number>>,
        occupiedWindows: Map<number, TimeWindow[]>,
    ): void {
        const linked = conflictMap.get(teamId) ?? new Set<number>([teamId]);
        for (const tid of linked) {
            if (!occupiedWindows.has(tid)) occupiedWindows.set(tid, []);
            occupiedWindows.get(tid)!.push({ start, end });
        }
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
        } catch (err) {
            console.error('[ScheduleEngine] Bulk UPDATE thất bại, fallback per-row:', err);
            const failed: number[] = [];
            for (const u of updates) {
                try {
                    await this.prisma.match.update({
                        where: { id: u.id },
                        data: { scheduled_at: u.scheduledAt, venue_id: u.venueId },
                    });
                } catch (rowErr) {
                    console.error(`[ScheduleEngine] Match ${u.id} update thất bại:`, rowErr);
                    failed.push(u.id);
                }
            }
            return failed;
        }
    }

    protected scheduleMatchesWithRetry(
        matches: ScheduleCandidateMatch[],
        pool: Slot[],
        minRestDays: number,
        initialLastPlayedAt?: Map<number, number>,
        conflictContext?: {
            conflictMap: Map<number, Set<number>>;
            occupiedWindows: Map<number, TimeWindow[]>;
        },
    ): GreedyPassResult {
        const conflictMap = conflictContext?.conflictMap ?? new Map<number, Set<number>>();
        const baseOccupiedWindows = conflictContext?.occupiedWindows ?? new Map<number, TimeWindow[]>();

        let best: GreedyPassResult | null = null;

        for (let attempt = 0; attempt < SCHEDULE_RESTARTS; attempt++) {
            const result = this.runGreedyPass(
                matches, pool, minRestDays, attempt, initialLastPlayedAt, conflictMap, baseOccupiedWindows,
            );
            if (!best || result.unscheduled.length < best.unscheduled.length) {
                best = result;
                if (best.unscheduled.length === 0) break;
            }
        }

        return best!;
    }

    private runGreedyPass(
        matches: ScheduleCandidateMatch[],
        pool: Slot[],
        minRestDays: number,
        attemptSeed: number,
        initialLastPlayedAt: Map<number, number> | undefined,
        conflictMap: Map<number, Set<number>>,
        baseOccupiedWindows: Map<number, TimeWindow[]>,
    ): GreedyPassResult {
        const lastPlayedAt = new Map<number, number>(initialLastPlayedAt ?? []);
        const usedSlotIdx = new Set<number>();
        const updates: { id: number; scheduledAt: Date; venueId: number }[] = [];
        const unscheduled: number[] = [];

        const occupiedWindows = new Map<number, TimeWindow[]>();
        for (const [teamId, windows] of baseOccupiedWindows) occupiedWindows.set(teamId, [...windows]);

        const byRound = new Map<number, ScheduleCandidateMatch[]>();
        for (const m of matches) {
            const r = parseInt(m.round ?? '0', 10);
            const bucket = byRound.get(r) ?? [];
            bucket.push(m);
            byRound.set(r, bucket);
        }

        for (const round of [...byRound.keys()].sort((a, b) => a - b)) {
            const roundMatches = byRound.get(round)!;

            const ordered = attemptSeed === 0
                ? roundMatches
                : this.orderByMostConstrained(
                    shuffle([...roundMatches]), pool, usedSlotIdx, lastPlayedAt, minRestDays,
                    conflictMap, occupiedWindows,
                );

            for (const match of ordered) {
                const slotIdx = this.findEarliestValidSlot(
                    pool, usedSlotIdx,
                    match.home_team_id, match.away_team_id,
                    lastPlayedAt, minRestDays,
                    conflictMap, occupiedWindows,
                );

                if (slotIdx === -1) { unscheduled.push(match.id); continue; }

                const slot = pool[slotIdx]!;
                const scheduledAt = new Date(slot.scheduledAtMs);

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

    private orderByMostConstrained(
        candidates: ScheduleCandidateMatch[],
        pool: Slot[],
        usedSlotIdx: Set<number>,
        lastPlayedAt: Map<number, number>,
        minRestDays: number,
        conflictMap: Map<number, Set<number>>,
        occupiedWindows: Map<number, TimeWindow[]>,
    ): ScheduleCandidateMatch[] {
        const withDegree = candidates.map(match => {
            let degree = 0;
            for (let idx = 0; idx < pool.length; idx++) {
                if (usedSlotIdx.has(idx)) continue;
                const candidateAt = pool[idx]!.scheduledAtMs;
                if (!this.isRestDaysSatisfied(match.home_team_id, candidateAt, lastPlayedAt, minRestDays)) continue;
                if (!this.isRestDaysSatisfied(match.away_team_id, candidateAt, lastPlayedAt, minRestDays)) continue;

                const windowStart = candidateAt - ASSUMED_MATCH_DURATION_MS;
                const windowEnd = candidateAt + ASSUMED_MATCH_DURATION_MS;
                if (this.hasWindowConflict(match.home_team_id, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;
                if (this.hasWindowConflict(match.away_team_id, windowStart, windowEnd, conflictMap, occupiedWindows)) continue;

                degree++;
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

    protected async quarantinePlayerConflicts(
        tx: Prisma.TransactionClient,
        writtenMatchIds: number[],
    ): Promise<number[]> {
        if (writtenMatchIds.length === 0) return [];

        const written = await tx.match.findMany({
            where: {
                id: { in: writtenMatchIds },
                scheduled_at: { not: null },
                status: { notIn: NON_BLOCKING_STATUSES },
            },
            select: { id: true, home_team_id: true, away_team_id: true, scheduled_at: true },
            orderBy: [{ scheduled_at: 'asc' }, { id: 'asc' }],
        });
        if (written.length === 0) return [];

        const allTeamIds = [...new Set(written.flatMap(m => [m.home_team_id, m.away_team_id]))];
        const conflictMap = await this.buildTeamConflictMap(tx, allTeamIds);

        const overlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number) =>
            aStart <= bEnd && bStart <= aEnd;

        const occupied = new Map<number, { start: number; end: number }[]>();
        const rejectedIds: number[] = [];

        for (const m of written) {
            const t = m.scheduled_at!.getTime();
            const start = t - ASSUMED_MATCH_DURATION_MS;
            const end = t + ASSUMED_MATCH_DURATION_MS;

            const linked = new Set<number>([
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
                if (!occupied.has(tid)) occupied.set(tid, []);
                occupied.get(tid)!.push({ start, end });
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