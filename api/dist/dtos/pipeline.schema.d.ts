import { z } from "zod";
export declare const AdvancePipelineSchema: z.ZodObject<{
    venueIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    dailyStartTime: z.ZodOptional<z.ZodString>;
    dailyEndTime: z.ZodOptional<z.ZodString>;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
    dateRangeStart: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateRangeEnd: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    excludedDates: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type AdvancePipelineDto = z.infer<typeof AdvancePipelineSchema>;
//# sourceMappingURL=pipeline.schema.d.ts.map