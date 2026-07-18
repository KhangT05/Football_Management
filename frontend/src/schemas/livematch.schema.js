import { z } from 'zod';

// Phải khớp 1-1 với BE MINUTE_BOUNDS (types/match.type.ts). Nếu BE đổi
// MAX_ADDED_MINUTE hoặc bound theo period, sửa tay ở đây — FE không import
// trực tiếp từ BE nên có rủi ro drift, cần review khi BE đổi.
export const MINUTE_BOUNDS_BY_PERIOD = {
    first_half: [1, 45],
    second_half: [46, 90],
    extra_time_first: [91, 105],
    extra_time_second: [106, 120],
};

export const PERIOD_LABELS = {
    first_half: 'Hiệp 1',
    second_half: 'Hiệp 2',
    extra_time_first: 'Hiệp phụ 1',
    extra_time_second: 'Hiệp phụ 2',
};

export const PERIOD_ORDER = ['first_half', 'second_half', 'extra_time_first', 'extra_time_second'];

const periodEnum = z.enum(PERIOD_ORDER);

// minute: input tầng UI (MinuteInput) đã strip mọi ký tự không phải digit
// (không thể gõ dấu trừ) — zod ở đây chỉ còn nhiệm vụ chặn range theo period,
// KHÔNG cần .nonnegative() riêng vì digit-only input đã đảm bảo >= 0, nhưng
// giữ lại làm defense-in-depth (phòng paste giá trị âm qua devtools/API test).
const minuteField = z.coerce
    .number({ invalid_type_error: 'Phút phải là số' })
    .int('Phút phải là số nguyên')
    .nonnegative('Phút không được âm');

const secondField = z.coerce.number().int().min(0).max(59).default(0);

const eventBaseSchema = z.object({
    id: z.union([z.number(), z.string()]),
    period: periodEnum,
    minute: minuteField,
    second: secondField,
    isSaved: z.boolean().optional(),
});

export const goalEventSchema = eventBaseSchema.extend({
    type: z.literal('goal'),
    player: z.string().min(1, 'Chọn cầu thủ ghi bàn'),
});

export const yellowEventSchema = eventBaseSchema.extend({
    type: z.literal('yellow'),
    player: z.string().min(1, 'Chọn cầu thủ nhận thẻ'),
});

export const redEventSchema = eventBaseSchema.extend({
    type: z.literal('red'),
    player: z.string().min(1, 'Chọn cầu thủ nhận thẻ'),
});

export const substitutionEventSchema = eventBaseSchema.extend({
    type: z.literal('substitution'),
    playerIn: z.string().min(1, 'Chọn cầu thủ vào sân'),
    playerOut: z.string().min(1, 'Chọn cầu thủ ra sân'),
});

// NOTE: không dùng .refine() ở từng branch (playerIn !== playerOut) vì
// z.discriminatedUnion yêu cầu member là ZodObject thuần — .refine() trả về
// ZodEffects, không tương thích. Cross-field check (playerIn/out, sent-off
// order, duplicate yellow) dồn hết vào superRefine ở cấp mảng bên dưới.
export const matchEventSchema = z.discriminatedUnion('type', [
    goalEventSchema,
    yellowEventSchema,
    redEventSchema,
    substitutionEventSchema,
]);

/**
 * effective type cho thẻ vàng: 2 thẻ vàng trong CÙNG 1 trận -> đuổi (luật
 * bóng đá cứng, IFAB — KHÔNG đọc từ TournamentRule). TournamentRule chỉ chi
 * phối treo thi đấu các trận SAU do tích lũy thẻ, xem
 * computeSuspensionWarnings() bên dưới — 2 việc khác nhau.
 */
function getEffectiveYellowType(evt, sortedSamePlayerYellows) {
    const idx = sortedSamePlayerYellows.findIndex(e => e.id === evt.id);
    return idx > 0 ? 'second_yellow' : 'yellow';
}

/**
 * Factory: build array schema theo isKnockout của trận (round-robin không
 * có hiệp phụ -> bound extra_time bị chặn hoàn toàn, không chỉ chặn theo
 * range).
 */
export function buildEventsArraySchema(isKnockout) {
    return z.array(matchEventSchema).superRefine((events, ctx) => {
        // ─── 1. Period + minute bound per event ──────────────────────────────
        events.forEach((evt, idx) => {
            const isExtraTime = evt.period === 'extra_time_first' || evt.period === 'extra_time_second';
            if (!isKnockout && isExtraTime) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [idx, 'period'],
                    message: 'Vòng bảng không có hiệp phụ — không thể ghi sự kiện ở hiệp này',
                });
                return;
            }
            const bounds = MINUTE_BOUNDS_BY_PERIOD[evt.period];
            if (bounds) {
                const [min, max] = bounds;
                if (evt.minute < min || evt.minute > max) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        path: [idx, 'minute'],
                        message: `Phút hợp lệ cho ${PERIOD_LABELS[evt.period]}: ${min}-${max}`,
                    });
                }
            }
            if (evt.type === 'substitution' && evt.playerIn === evt.playerOut) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [idx, 'playerIn'],
                    message: 'Cầu thủ vào và ra không được trùng nhau',
                });
            }
        });

        // ─── 2. Duplicate yellow trong cùng submit (chưa qua second_yellow) ──
        const yellowsByPlayer = new Map();
        events.forEach((evt, idx) => {
            if (evt.type !== 'yellow' || !evt.player) return;
            const arr = yellowsByPlayer.get(evt.player) ?? [];
            arr.push({ ...evt, _idx: idx });
            yellowsByPlayer.set(evt.player, arr);
        });
        for (const [, arr] of yellowsByPlayer) {
            if (arr.length <= 2) continue;
            // >2 thẻ vàng cho cùng 1 cầu thủ trong 1 trận là không thể xảy ra hợp
            // lệ (thẻ vàng thứ 2 luôn = đuổi) — báo lỗi rõ ràng để admin sửa data.
            arr.slice(2).forEach(e => {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [e._idx, 'type'],
                    message: 'Cầu thủ đã bị truất quyền thi đấu từ thẻ vàng thứ 2 — không thể có thẻ vàng thứ 3',
                });
            });
        }

        // ─── 3. Sent-off order: cầu thủ bị đuổi không được có event SAU đó ───
        // Thứ tự dựa trên `id` (Date.now() lúc admin tạo dòng) — phản ánh đúng
        // thứ tự thao tác, KHÔNG dùng `minute` vì admin gõ tay, có thể trùng/sai.
        const sorted = [...events]
            .map((e, idx) => ({ ...e, _idx: idx }))
            .sort((a, b) => String(a.id).localeCompare(String(b.id)));

        const yellowCountSoFar = new Map();
        const sentOffAt = new Map(); // player -> _idx của event khiến bị đuổi

        for (const evt of sorted) {
            const involvedPlayer = evt.type === 'substitution' ? evt.playerOut : evt.player;

            if (involvedPlayer && sentOffAt.has(involvedPlayer)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [evt._idx, evt.type === 'substitution' ? 'playerOut' : 'player'],
                    message: 'Cầu thủ đã bị truất quyền thi đấu trước đó (thẻ đỏ/thẻ vàng thứ 2) — không thể ghi thêm sự kiện',
                });
                continue;
            }

            if (evt.type === 'yellow' && evt.player) {
                const count = (yellowCountSoFar.get(evt.player) ?? 0) + 1;
                yellowCountSoFar.set(evt.player, count);
                if (count >= 2) sentOffAt.set(evt.player, evt._idx);
            }
            if (evt.type === 'red' && evt.player) {
                sentOffAt.set(evt.player, evt._idx);
            }
        }
    });
}

export function buildLiveMatchFormSchema(isKnockout) {
    return z.object({
        homeEvents: buildEventsArraySchema(isKnockout),
        awayEvents: buildEventsArraySchema(isKnockout),
    });
}

// ─── Score correction modals (ET / penalty) ──────────────────────────────

export const extraTimeScoreSchema = z
    .object({
        home: z.coerce.number({ invalid_type_error: 'Bắt buộc nhập số' }).int().nonnegative(),
        away: z.coerce.number({ invalid_type_error: 'Bắt buộc nhập số' }).int().nonnegative(),
        baseHome: z.number().int().nonnegative(),
        baseAway: z.number().int().nonnegative(),
    })
    .superRefine((v, ctx) => {
        if (v.home < v.baseHome) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['home'], message: 'Không thể thấp hơn tỉ số 90 phút' });
        }
        if (v.away < v.baseAway) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['away'], message: 'Không thể thấp hơn tỉ số 90 phút' });
        }
    });

export const penaltyScoreSchema = z
    .object({
        home: z.coerce.number({ invalid_type_error: 'Bắt buộc nhập số' }).int().nonnegative(),
        away: z.coerce.number({ invalid_type_error: 'Bắt buộc nhập số' }).int().nonnegative(),
    })
    .refine(v => v.home !== v.away, {
        message: 'Loạt sút luân lưu không thể hoà',
        path: ['home'],
    });

/**
 * Cảnh báo (KHÔNG blocking) khi thêm thẻ vàng sẽ đẩy cầu thủ tới ngưỡng treo
 * thi đấu trận SAU — ngưỡng lấy từ TournamentRule.yellow_cards_suspension,
 * KHÁC hoàn toàn với rule "2 vàng = đuổi trận này" ở trên.
 *
 * @param events  toàn bộ event 1 phía (home hoặc away) đang soạn trong form
 * @param accumulatedYellowsByPlayer  Map<playerId, số thẻ vàng tích luỹ TRƯỚC trận này>
 *        (đọc từ PlayerStatistic.accumulated_yellow_cards — season hiện tại)
 * @param yellowCardsSuspension  TournamentRule.yellow_cards_suspension (default 3)
 */
export function computeSuspensionWarnings(events, accumulatedYellowsByPlayer, yellowCardsSuspension) {
    const newYellowsThisMatch = new Map();
    for (const evt of events) {
        if (evt.type !== 'yellow' || !evt.player) continue;
        newYellowsThisMatch.set(evt.player, (newYellowsThisMatch.get(evt.player) ?? 0) + 1);
    }

    const warnings = [];
    for (const [playerId, addedCount] of newYellowsThisMatch) {
        const prevAccum = accumulatedYellowsByPlayer.get(playerId) ?? 0;
        const projected = prevAccum + Math.min(addedCount, 1); // hệ thống chỉ cộng dồn tới khi bị "reset" bởi treo — xấp xỉ +1 cho hiển thị
        if (projected >= yellowCardsSuspension) {
            warnings.push({ playerId, projected, threshold: yellowCardsSuspension });
        }
    }
    return warnings;
}