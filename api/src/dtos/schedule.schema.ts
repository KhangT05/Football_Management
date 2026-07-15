import { z } from 'zod';

import { venueIdsField, vnTimeRegex } from '../dtos/fields.schema.js';

const dailyTimeField = z.string().regex(vnTimeRegex ?? /^([01]\d|2[0-3]):[0-5]\d$/, 'Định dạng giờ phải là HH:mm');

const scheduleWindowFields = {
    venueIds: venueIdsField,
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
};

const scheduleWindowRefine = <T extends { dailyStartTime: string; dailyEndTime: string }>(d: T) =>
    d.dailyStartTime < d.dailyEndTime;

export const generateScheduleSchema = z.object({
    desiredGroupCount: z.number().int().min(1),
    minGroupSize: z.number().int().min(2),
    maxGroupSize: z.number().int().min(2),
    ...scheduleWindowFields,
    doubleRound: z.boolean().optional().default(true),
    minRestDaysPerTeam: z.number().int().min(1).optional(),
}).refine(scheduleWindowRefine, {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
});

export const autoScheduleSchema = z.object({
    ...scheduleWindowFields,
    rounds: z.array(z.number().int().positive()).optional(),
    groupIds: z.array(z.number().int().positive()).optional(),
    allowPastDate: z.boolean().optional(),
}).refine(scheduleWindowRefine, {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
});

export const rescheduleMatchSchema = z.object({
    scheduledAt: z.date(),
    venueId: z.number().int().positive(),
    bufferMinutes: z.number().int().positive().optional(),
});

export const generateFromGroupsSchema = z.object({
    doubleRound: z.boolean().optional(),
    minRestDaysPerTeam: z.number().int().min(0).optional(),
    venueIds: z.array(z.number().int().positive()).min(1, 'venueIds không được rỗng'),
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
    rounds: z.array(z.number().int().positive()).optional(),
    groupIds: z.array(z.number().int().positive()).optional(),
    allowPastDate: z.boolean().optional(),
}).refine(scheduleWindowRefine, {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
});

export type GenerateFromGroupsDto = z.infer<typeof generateFromGroupsSchema>;
export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;