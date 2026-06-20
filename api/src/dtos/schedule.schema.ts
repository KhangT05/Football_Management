import { z } from 'zod';

const vnTimeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const isoDatetime = (fieldName: string) =>
    z.string().datetime().transform(s => new Date(s));

const venueIdsField = z
    .array(z.number().int().positive())
    .min(1);

const matchTimesField = z
    .array(z.string().regex(vnTimeRegex))
    .min(1);

export const generateScheduleSchema = z.object({
    desiredGroupCount: z.number().int().min(1),
    minGroupSize: z.number().int().min(2),
    maxGroupSize: z.number().int().min(2),
    venueIds: venueIdsField,
    startDate: isoDatetime('startDate'),
    matchTimes: matchTimesField,
    doubleRound: z.boolean().optional().default(true),
    minRestDaysPerTeam: z.number().int().min(1).optional(),
});

export const autoScheduleSchema = z.object({
    venueIds: venueIdsField,
    startDate: isoDatetime('startDate'),
    matchTimes: matchTimesField,
});

export const rescheduleMatchSchema = z.object({
    scheduledAt: isoDatetime('scheduledAt'),
    venueId: z.number().int().positive(),
});

export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;