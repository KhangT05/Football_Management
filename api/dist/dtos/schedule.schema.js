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
export const generateFromGroupsSchema = z.object({
    doubleRound: z.boolean().optional(),
    minRestDaysPerTeam: z.number().int().min(0).optional(),
    venueIds: z.array(z.number().int().positive()).min(1, 'venueIds không được rỗng'),
    matchTimes: z
        .array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Định dạng giờ phải là HH:mm'))
        .min(1, 'matchTimes không được rỗng'),
    allowPastDate: z.boolean().optional(),
});
//# sourceMappingURL=schedule.schema.js.map