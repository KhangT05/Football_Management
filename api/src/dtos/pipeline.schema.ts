// src/dtos/pipeline.schema.ts
import { z } from "zod";

// Field set khớp OptionalScheduleOptions (schedule.type.ts) — cùng shape với
// ConfirmOfficialDto/ForfeitMatchDto bên match.schema.ts, chỉ khác toàn bộ
// optional vì round_robin-only pipeline không cần venue/thời gian gì cả.
// TODO-CONFIRM: field name suy từ cách dùng trong customPipeline.service.ts
// (groupService/knockoutService nhận scheduleOptions) — verify lại đúng field
// thật trong schedule.type.ts trước khi merge, tôi không có file đó trong context.
export const AdvancePipelineSchema = z.object({
    venueIds: z.array(z.number().int().positive()).optional(),
    dailyStartTime: z.string().optional(),
    dailyEndTime: z.string().optional(),
    bufferMinutes: z.number().int().nonnegative().optional(),
    dateRangeStart: z.coerce.date().optional(),
    dateRangeEnd: z.coerce.date().optional(),
    excludedDates: z.array(z.string()).optional(),
});

export type AdvancePipelineDto = z.infer<typeof AdvancePipelineSchema>;