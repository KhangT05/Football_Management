import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { Slot } from "../types/schedule.type.js";
import { MatchStatus, Prisma, PrismaClient } from "../generated/prisma/client.js";

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
}