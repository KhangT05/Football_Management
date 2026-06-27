import { z } from 'zod';
import { venueIdsField, matchTimesField } from '../dtos/fields.schema.js';
const isoDatetime = (fieldName) => z.string().datetime().transform(s => new Date(s));
export const generateScheduleSchema = z.object({
    desiredGroupCount: z.number().int().min(1),
    minGroupSize: z.number().int().min(2),
    maxGroupSize: z.number().int().min(2),
    venueIds: venueIdsField,
    matchTimes: matchTimesField,
    doubleRound: z.boolean().optional().default(true),
    minRestDaysPerTeam: z.number().int().min(1).optional(),
});
export const autoScheduleSchema = z.object({
    venueIds: venueIdsField,
    matchTimes: matchTimesField,
});
export const rescheduleMatchSchema = z.object({
    scheduledAt: z.date(),
    venueId: z.number().int().positive(),
});
//# sourceMappingURL=schedule.schema.js.map