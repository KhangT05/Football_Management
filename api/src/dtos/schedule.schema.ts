import { z } from 'zod';

import { venueIdsField, matchTimesField, vnTimeRegex } from '../dtos/fields.schema.js';


const isoDatetime = (fieldName: string) =>
    z.string().datetime().transform(s => new Date(s));


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
    scheduledAt: isoDatetime('scheduledAt'),
    venueId: z.number().int().positive(),
});

export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;