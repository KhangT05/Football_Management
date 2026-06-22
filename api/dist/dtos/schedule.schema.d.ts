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
    scheduledAt: z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>;
    venueId: z.ZodNumber;
}, z.core.$strip>;
export type AutoScheduleDto = z.infer<typeof autoScheduleSchema>;
export type GenerateScheduleDto = z.infer<typeof generateScheduleSchema>;
export type RescheduleMatchDto = z.infer<typeof rescheduleMatchSchema>;
//# sourceMappingURL=schedule.schema.d.ts.map