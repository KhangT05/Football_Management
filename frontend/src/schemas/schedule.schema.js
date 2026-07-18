import { z } from 'zod';

const vnTimeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dailyTimeField = z.string().regex(vnTimeRegex, 'Định dạng giờ phải là HH:mm');



export const scheduleWindowFields = {
    venueIds: z.array(z.number().int().positive()).min(1, 'Chọn ít nhất 1 sân'),
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
    excludedDates: z.array(z.string()).optional(),
};

const scheduleWindowRefine = (d) => d.dailyStartTime < d.dailyEndTime;
const scheduleWindowRefineOpts = {
    path: ['dailyEndTime'],
    message: 'dailyEndTime phải sau dailyStartTime',
};

// ─── Form GenerateScheduleModal khi season CHƯA có bảng (tự tạo bảng mới) ──
export const generateScheduleSchema = z.object({
    desiredGroupCount: z.number().int().min(1),
    minGroupSize: z.number().int().min(2),
    maxGroupSize: z.number().int().min(2),
    ...scheduleWindowFields,
    doubleRound: z.boolean().optional().default(true),
    minRestDaysPerTeam: z.number().int().min(1).optional(),
}).refine(scheduleWindowRefine, scheduleWindowRefineOpts);

// ─── Form GenerateScheduleModal khi season ĐÃ có bảng (sinh match từ group có sẵn) ──
export const generateFromGroupsSchema = z.object({
    doubleRound: z.boolean().optional(),
    minRestDaysPerTeam: z.number().int().min(0).optional(),
    ...scheduleWindowFields,
    rounds: z.array(z.number().int().positive()).optional(),
    groupIds: z.array(z.number().int().positive()).optional(),
    allowPastDate: z.boolean().optional(),
}).refine(scheduleWindowRefine, scheduleWindowRefineOpts);

// ─── NEW: payload cho POST .../matches/:matchId/available-slots ──────────
// Không cần matchId trong body — matchId đi theo route param.
export const getAvailableSlotsSchema = z.object({
    ...scheduleWindowFields,
    limit: z.number().int().positive().max(200).optional(),
}).refine(scheduleWindowRefine, scheduleWindowRefineOpts);

// ─── Reschedule 1 match — DÙNG CHUNG cho cả "sửa lịch đã có" (RescheduleModal)
// và "gán thủ công trận chưa xếp" (ManualAssignMatchModal): payload khớp hệt
// RescheduleMatchDto phía BE, không cần schema riêng.
export const rescheduleMatchSchema = z.object({
    scheduledAt: z.string().min(1, 'Chọn thời gian'), // FE giữ string (datetime-local/ISO), convert sang Date ngay trước khi gọi API
    venueId: z.number().int().positive('Chọn sân'),
    bufferMinutes: z.number().int().positive().optional(),
});

export const manualAssignFormSchema = rescheduleMatchSchema.extend({
    matchId: z.number().int().positive('Chưa chọn trận'),
});

export const seasonScheduleDefaultsSchema = z.object({
    venueIds: z.array(z.number().int().positive()).min(1, 'Chọn ít nhất 1 sân'),
    dailyStartTime: dailyTimeField,
    dailyEndTime: dailyTimeField,
    bufferMinutes: z.number().int().positive().optional(),
}).refine(d => d.dailyStartTime < d.dailyEndTime, scheduleWindowRefineOpts);