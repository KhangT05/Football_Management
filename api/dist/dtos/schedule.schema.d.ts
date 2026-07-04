import { z } from 'zod';
export declare const generateScheduleSchema: z.ZodObject<{
    desiredGroupCount: z.ZodNumber;
    minGroupSize: z.ZodNumber;
    maxGroupSize: z.ZodNumber;
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
    doubleRound: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    minRestDaysPerTeam: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const autoScheduleSchema: z.ZodObject<{
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export declare const rescheduleMatchSchema: z.ZodObject<{
    scheduledAt: z.ZodDate;
    venueId: z.ZodNumber;
}, z.core.$strip>;
export declare const generateFromGroupsSchema: z.ZodObject<{
    doubleRound: z.ZodOptional<z.ZodBoolean>;
    minRestDaysPerTeam: z.ZodOptional<z.ZodNumber>;
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
    allowPastDate: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type GenerateFromGroupsDto = z.infer<typeof generateFromGroupsSchema>;
export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;
//# sourceMappingURL=schedule.schema.d.ts.map