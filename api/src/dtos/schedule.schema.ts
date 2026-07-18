import { z } from 'zod';

import { venueIdsField, vnTimeRegex } from '../dtos/fields.schema.js';
import { ScheduleOptions } from '../types/schedule.type.js';

const dailyTimeField = z.string().regex(vnTimeRegex ?? /^([01]\d|2[0-3]):[0-5]\d$/, 'Định dạng giờ phải là HH:mm');

const scheduleWindowFields = {
    venueIds: venueIdsField,
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
    excludedDates: z.array(z.string()).optional(),
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
    ...scheduleWindowFields,
    rounds: z.array(z.number().int().positive()).optional(),
    groupIds: z.array(z.number().int().positive()).optional(),
    allowPastDate: z.boolean().optional(),
}).refine(scheduleWindowRefine, {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
});
export const getAvailableSlotsSchema = z.object({
    ...scheduleWindowFields,
    limit: z.number().int().positive().max(200).optional(),
}).refine(scheduleWindowRefine, { path: ['dailyEndTime'], message: '...' });

const seasonDefaultsFields = {
    venueIds: venueIdsField,
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
};

export const seasonScheduleDefaultsSchema = z.object({
    ...seasonDefaultsFields,
}).refine(scheduleWindowRefine, {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
});
export interface GenerateScheduleDto {
    desiredGroupCount: number;
    minGroupSize: number;
    maxGroupSize: number;
    venueIds: number[];
    dailyStartTime: string;
    dailyEndTime: string;
    bufferMinutes?: number;
    excludedDates?: string[];
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
}

export interface GenerateFromGroupsDto {
    doubleRound?: boolean;
    minRestDaysPerTeam?: number;
    venueIds: number[];
    dailyStartTime: string;
    dailyEndTime: string;
    bufferMinutes?: number;
    excludedDates?: string[];
    rounds?: number[];
    groupIds?: number[];
    allowPastDate?: boolean;
}

export interface AutoScheduleDto {
    venueIds: number[];
    dailyStartTime: string;
    dailyEndTime: string;
    bufferMinutes?: number;
    excludedDates?: string[];
    rounds?: number[];
    groupIds?: number[];
    allowPastDate?: boolean;
}

export interface RescheduleMatchDto {
    scheduledAt: Date;
    venueId: number;
    bufferMinutes?: number;
}

export interface GetAvailableSlotsDto extends ScheduleOptions {
    limit?: number;
}
export interface SeasonScheduleDefaultsDto {
    venueIds: number[];
    dailyStartTime: string;
    dailyEndTime: string;
    bufferMinutes?: number;
}