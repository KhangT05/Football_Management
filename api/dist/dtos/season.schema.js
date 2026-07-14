import { z } from "zod";
export const SeasonStatusSchema = z.enum([
    "upcoming",
    "registration_open",
    "ongoing",
    "finished",
    "cancelled",
]);
export const PitchType = z.enum([
    "san_5",
    "san_7",
    "san_11"
]);
export const CancelSeasonSchema = z.object({
    cancel_reason: z.string().trim().min(1, "cancel_reason is required").max(500),
});
const baseSeasonSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    start_date: z.coerce.date().optional().nullable(),
    end_date: z.coerce.date().optional().nullable(),
    registration_deadline: z.coerce.date().optional().nullable(),
    max_teams: z.number().int().positive(),
    is_registration_open: z.boolean().optional().default(false),
    is_active: z.boolean().optional().default(true),
    tournament_id: z.number().int().positive(),
    tournament_rule_id: z.number().int().positive(),
    group_count: z.number().int().min(1).default(1),
    pitch_type: PitchType.optional().default("san_5"), // <-- add this
    bank_id: z.string().trim().min(1).max(20).optional().nullable(),
    bank_account_no: z.string().trim().min(1).max(50).optional().nullable(),
    bank_account_name: z.string().trim().min(1).max(255).optional().nullable(),
});
// All-or-nothing: hasBankInfo bên PaymentService check `&&` cả 3 field, nên
// điền thiếu 1-2 field sẽ bị PaymentService âm thầm coi như KHÔNG có bank
// info (bank_info: null) — không có lỗi nào báo cho admin biết. Chặn ngay ở
// validation layer thay vì để lộ ra runtime silently.
const bankAllOrNothing = (data) => {
    const filled = [data.bank_id, data.bank_account_no, data.bank_account_name]
        .filter(v => v != null && v !== '');
    return filled.length === 0 || filled.length === 3;
};
const bankRefineOpts = {
    message: 'bank_id, bank_account_no, bank_account_name phải cùng có hoặc cùng để trống',
    path: ['bank_id'],
};
export const createSeasonSchema = baseSeasonSchema.refine(bankAllOrNothing, bankRefineOpts);
export const updateSeasonSchema = baseSeasonSchema
    .omit({ tournament_id: true })
    .partial()
    .refine(bankAllOrNothing, bankRefineOpts);
// Manual transition (admin bấm hoặc gọi API): upcoming→registration_open,
// registration_open→ongoing, ongoing→finished. Đây là lối đi SONG SONG với
// cron tự động (SeasonService.runAutoTransitions) — không loại trừ nhau:
// admin có thể chủ động bấm sớm hơn ngày dự kiến (VD giải sẵn sàng sớm),
// hoặc bấm bù nếu cron miss/chưa chạy; cron tự động bấm hộ nếu tới ngày mà
// chưa ai bấm tay. cancelled không nằm trong enum này vì đi qua
// CancelSeasonSchema/route riêng (cancel_reason bắt buộc).
export const UpdateSeasonStatusSchema = z.object({
    status: SeasonStatusSchema.exclude(["cancelled"]),
});
//# sourceMappingURL=season.schema.js.map