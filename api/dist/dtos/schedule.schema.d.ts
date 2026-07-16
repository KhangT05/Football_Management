import { z } from 'zod';
export declare const generateScheduleSchema: z.ZodObject<{
    doubleRound: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    minRestDaysPerTeam: z.ZodOptional<z.ZodNumber>;
    venueIds: z.ZodArray<z.ZodNumber>;
    dailyStartTime: z.ZodString;
    dailyEndTime: z.ZodString;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
    excludedDates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    desiredGroupCount: z.ZodNumber;
    minGroupSize: z.ZodNumber;
    maxGroupSize: z.ZodNumber;
}, z.core.$strip>;
export declare const autoScheduleSchema: z.ZodObject<{
    rounds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    groupIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    allowPastDate: z.ZodOptional<z.ZodBoolean>;
    venueIds: z.ZodArray<z.ZodNumber>;
    dailyStartTime: z.ZodString;
    dailyEndTime: z.ZodString;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
    excludedDates: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const rescheduleMatchSchema: z.ZodObject<{
    scheduledAt: z.ZodDate;
    venueId: z.ZodNumber;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const generateFromGroupsSchema: z.ZodObject<{
    doubleRound: z.ZodOptional<z.ZodBoolean>;
    minRestDaysPerTeam: z.ZodOptional<z.ZodNumber>;
    venueIds: z.ZodArray<z.ZodNumber>;
    dailyStartTime: z.ZodString;
    dailyEndTime: z.ZodString;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
    excludedDates: z.ZodOptional<z.ZodArray<z.ZodString>>;
    rounds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    groupIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    allowPastDate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
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
//# sourceMappingURL=schedule.schema.d.ts.map