import { z } from "zod"
import { Season, SeasonStatus } from "../generated/prisma/client.js";

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
})

// All-or-nothing: hasBankInfo bên PaymentService check `&&` cả 3 field, nên
// điền thiếu 1-2 field sẽ bị PaymentService âm thầm coi như KHÔNG có bank
// info (bank_info: null) — không có lỗi nào báo cho admin biết. Chặn ngay ở
// validation layer thay vì để lộ ra runtime silently.
const bankAllOrNothing = (data: {
    bank_id?: string | null;
    bank_account_no?: string | null;
    bank_account_name?: string | null;
}) => {
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

export type SeasonListItem = Pick<
    Season,
    | "id"
    | "name"
    | "status"
    | "start_date"
    | "end_date"
    | "registration_deadline"
    | "max_teams" | 'cancel_reason' | 'is_registration_open' | 'group_count' | 'pitch_type'
    | 'bank_id' | 'bank_account_no' | 'bank_account_name'
> & {
    tournament: {
        id: number;
        name: string;
    };
    _count: {
        phases: number;
    };
};
// BulkSeasonTeamActionSchema — dùng chung cho cả bulk-approve và bulk-reject.
// ids KHÔNG được rỗng (service đã có early-return cho []  nhưng chặn ngay ở
// validation layer để trả lỗi rõ ràng thay vì trả về {succeeded:[],failed:[]}
// im lặng khi FE gửi nhầm body rỗng).
//
// Dedupe bằng transform: service dùng `ids` trực tiếp trong raw SQL
// `IN (...)` và loop qua `sortedIds` — nếu có id trùng lặp trong request,
// loop sẽ xử lý cùng 1 season_team 2 lần trong cùng transaction (dùng
// snapshot recordMap cũ, không refetch), dẫn tới currentApprovedCount bị
// cộng dư và id đó xuất hiện lặp trong `succeeded`. Chặn ở đây rẻ hơn nhiều
// so với việc sửa logic loop trong service.
//
// Giới hạn max 100: bulk action không nên cho phép payload vô hạn (tránh
// FOR UPDATE lock quá nhiều row cùng lúc, và query IN (...) quá dài).
export const BulkSeasonTeamActionSchema = z.object({
    ids: z
        .array(z.number().int().positive())
        .min(1, "ids không được rỗng")
        .max(100, "Chỉ được xử lý tối đa 100 team trong 1 lần")
        .transform((ids) => Array.from(new Set(ids))),
});

export type BulkSeasonTeamActionDto = z.infer<typeof BulkSeasonTeamActionSchema>;
export type CreateSeasonDto = z.infer<typeof createSeasonSchema>
export type UpdateSeasonDto = z.infer<typeof updateSeasonSchema>
export type UpdateSeasonStatusDto = z.infer<typeof UpdateSeasonStatusSchema>
export type CancelSeasonDto = z.infer<typeof CancelSeasonSchema>;