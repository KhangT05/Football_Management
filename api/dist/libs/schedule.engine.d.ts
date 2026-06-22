import { Slot } from "../types/schedule.type.js";
import { PrismaClient } from "../generated/prisma/client.js";
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
}
//# sourceMappingURL=schedule.engine.d.ts.map