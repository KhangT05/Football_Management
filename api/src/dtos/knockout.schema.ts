import { z } from 'zod';
import { PhaseType } from '../generated/prisma/client.js';
import {
    venueIdsField,
    matchTimesField
} from '../dtos/fields.schema.js';

// third_place CỐ TÌNH KHÔNG nằm trong list này. Bracket tree hiện tại
// (round/slot_number, source_a/source_b) là cây nhị phân thuần túy — trận
// tranh hạng 3 là 1 match đơn giữa 2 đội THUA bán kết, không phải node
// trong cây. Nhét nó vào generic generate() sẽ phải fake ra 1 "slot" không
// có source link hợp lệ theo invariant hiện tại (source_a/b phải trỏ tới
// slot round trước, còn third_place lấy LOSER chứ không phải WINNER).
// => Cần 1 flow riêng (tạo match đơn sau khi 2 bán kết finish), CHƯA
// implement. Nếu cần, đây là follow-up riêng, không patch chung vào đây.
export const KNOCKOUT_PHASE_TYPES = [
    PhaseType.round_of_16,
    PhaseType.quarter_final,
    PhaseType.semi_final,
    PhaseType.final,
] as const;

const legsSchema = z.union([z.literal(1), z.literal(2)]);

// discriminatedUnion thay vì object với field optional — Zod validate theo
// đúng branch dựa trên `kind`, tránh trường hợp gửi {kind:'standing', teamId:5}
// pass validation vì teamId bị ignore âm thầm.
const seedSourceSchema = z.discriminatedUnion('kind', [
    z.object({
        kind: z.literal('standing'),
        groupId: z.number().int().positive(),
        rank: z.number().int().positive(),
    }),
    z.object({
        kind: z.literal('manual'),
        teamId: z.number().int().positive(),
    }),
]);

export const knockoutGenerateOptionsSchema = z.object({
    seasonId: z.number().int().positive(),
    seeds: z.array(seedSourceSchema)
        .min(2, 'Cần ít nhất 2 seed cho knockout')
        .refine(seeds => {
            const manualIds = seeds.filter(s => s.kind === 'manual').map(s => s.teamId);
            return new Set(manualIds).size === manualIds.length;
        }, 'seeds (manual) không được trùng teamId')
        .refine(seeds => {
            // Trùng (groupId, rank) là lỗi input rõ ràng — không thể 2 seed
            // cùng trỏ 1 hạng của 1 bảng. Trùng teamId SAU KHI resolve
            // standing->teamId (vd data lỗi 2 team cùng group_id+rank trong
            // DB) được check ở service layer, không check được ở đây vì
            // schema không có quyền query DB.
            const standingKeys = seeds
                .filter(s => s.kind === 'standing')
                .map(s => `${s.groupId}:${s.rank}`);
            return new Set(standingKeys).size === standingKeys.length;
        }, 'seeds (standing) không được trùng groupId+rank'),
    legs: legsSchema,
    phaseTypeOverride: z.nativeEnum(PhaseType)
        .refine(
            (t): t is typeof KNOCKOUT_PHASE_TYPES[number] =>
                (KNOCKOUT_PHASE_TYPES as readonly PhaseType[]).includes(t),
            'phaseTypeOverride phải là 1 trong các round knockout hợp lệ (không gồm third_place)',
        )
        .optional(),
});
export const swapSeedsRequestSchema = z.object({
    slotIdA: z.number().int().positive(),
    sideA: z.enum(['home', 'away']),
    slotIdB: z.number().int().positive(),
    sideB: z.enum(['home', 'away']),
});
export type SwapSeedsRequestDto = z.infer<typeof swapSeedsRequestSchema>;
export const advanceWinnerInputSchema = z.object({
    matchId: z.number().int().positive(),
    winnerTeamId: z.number().int().positive(),
});

export const knockoutSeedModeSchema = z.enum(['straight', 'cross', 'random']);

export const autoSeedKnockoutRequestSchema = z.object({
    groupIds: z.array(z.number().int().positive()).min(2),
    topN: z.number().int().min(1),
    mode: knockoutSeedModeSchema,
    legs: z.union([z.literal(1), z.literal(2)]),
    phaseTypeOverride: z.nativeEnum(PhaseType).optional(),
    venueIds: z.array(z.number().int().positive()).optional(),
    dailyStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    dailyEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    bufferMinutes: z.number().int().positive().optional(),
    dateRangeStart: z.coerce.date().optional(),
    dateRangeEnd: z.coerce.date().optional(),
});


export const generateKnockoutRequestSchema = knockoutGenerateOptionsSchema.omit({
    seasonId: true,
});

export const advanceWinnerRequestSchema = advanceWinnerInputSchema.extend({
    venueIds: z.array(z.number().int().positive()).optional(),
    dailyStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    dailyEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    bufferMinutes: z.number().int().positive().optional(),
    dateRangeStart: z.coerce.date().optional(),
    dateRangeEnd: z.coerce.date().optional(),
}).refine(
    d => !d.dailyStartTime || !d.dailyEndTime || d.dailyStartTime < d.dailyEndTime,
    { path: ['dailyEndTime'], message: 'dailyEndTime phải sau dailyStartTime' },
);

export type AutoSeedKnockoutRequestDto = z.infer<typeof autoSeedKnockoutRequestSchema>;
export type KnockoutGenerateOptionsDto = z.infer<typeof knockoutGenerateOptionsSchema>;
export type GenerateKnockoutRequestDto = z.infer<typeof generateKnockoutRequestSchema>;
export type AdvanceWinnerRequestDto = z.infer<typeof advanceWinnerRequestSchema>;
export type AdvanceWinnerInputDto = z.infer<typeof advanceWinnerInputSchema>;

export const scheduleKnockoutBracketRequestSchema = z.object({
    venueIds: z.array(z.number().int().positive()).optional(),
    dailyStartTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    dailyEndTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'HH:mm').optional(),
    bufferMinutes: z.number().int().positive().optional(),
    dateRangeStart: z.coerce.date().optional(),
    dateRangeEnd: z.coerce.date().optional(),
}).refine(
    d => !d.dailyStartTime || !d.dailyEndTime || d.dailyStartTime < d.dailyEndTime,
    { path: ['dailyEndTime'], message: 'dailyEndTime phải sau dailyStartTime' },
);

export type ScheduleKnockoutBracketRequestDto = z.infer<typeof scheduleKnockoutBracketRequestSchema>;