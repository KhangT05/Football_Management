import { z } from 'zod';
export declare const generateScheduleSchema: z.ZodObject<{
    doubleRound: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    minRestDaysPerTeam: z.ZodOptional<z.ZodNumber>;
    venueIds: z.ZodArray<z.ZodNumber>;
    dailyStartTime: z.ZodString;
    dailyEndTime: z.ZodString;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
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
    rounds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    groupIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    allowPastDate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type GenerateFromGroupsDto = z.infer<typeof generateFromGroupsSchema>;
export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;
//# sourceMappingURL=schedule.schema.d.ts.map