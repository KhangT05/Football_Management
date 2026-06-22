// import { z } from 'zod';
// import { MatchEventType, MatchPeriod, MatchResultType } from '../generated/prisma/client.js';

// // ============================================================
// // SCHEDULE — generate / auto-schedule / reschedule
// // ============================================================

// const HHMM_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

// export const ScheduleOptionsSchema = z.object({
//     venueIds: z.array(z.coerce.number().int().positive()).min(1, 'venueIds không được rỗng'),
//     matchTimes: z.array(z.string().regex(HHMM_REGEX, 'matchTimes phải dạng HH:mm')).min(1, 'matchTimes không được rỗng'),
//     // 0=Sun..6=Sat — thêm cho multi-day league (đá cuối tuần, không phải mọi ngày liên tục)
//     allowedWeekdays: z.array(z.number().int().min(0).max(6)).optional(),
// });

// export const GenerateOptionsSchema = ScheduleOptionsSchema.extend({
//     doubleRound: z.boolean().optional().default(true),
//     desiredGroupCount: z.coerce.number().int().positive().optional().default(1),
//     minGroupSize: z.coerce.number().int().positive().optional().default(2),
//     maxGroupSize: z.coerce.number().int().positive().optional().default(99),
//     minRestDaysPerTeam: z.coerce.number().int().nonnegative().optional(),
// }).refine(d => d.minGroupSize <= d.maxGroupSize, {
//     message: 'minGroupSize phải <= maxGroupSize',
//     path: ['minGroupSize'],
// });

// export const RescheduleSchema = z.object({
//     scheduledAt: z.coerce.date(),
//     venueId: z.coerce.number().int().positive(),
// });

// export type ScheduleOptionsDto = z.infer<typeof ScheduleOptionsSchema>;
// export type GenerateOptionsDto = z.infer<typeof GenerateOptionsSchema>;
// export type RescheduleDto = z.infer<typeof RescheduleSchema>;

// // ============================================================
// // MATCH LIFECYCLE — record event / finalize / forfeit / abandon / appeal
// // ============================================================

// // Thay cho RecordEventInput viết tay trong match-lifecycle.service.ts — nếu đưa schema
// // này làm nguồn validate duy nhất ở route layer, đổi service sang dùng
// // `type RecordEventInput = z.infer<typeof RecordEventSchema>` để tránh 2 nơi định nghĩa
// // shape lệch nhau khi 1 trong 2 bị sửa mà quên sửa chỗ kia.
// export const RecordEventSchema = z
//     .object({
//         playerId: z.coerce.number().int().positive().optional(),
//         teamId: z.coerce.number().int().positive().optional(),
//         type: z.nativeEnum(MatchEventType),
//         minute: z.coerce.number().int().min(0).max(130).optional(), // 130 chừa chỗ hiệp phụ — bù giờ riêng ở addedMinute
//         addedMinute: z.coerce.number().int().min(0).max(15).optional(),
//         note: z.string().max(500).optional(),
//         subOutPlayerId: z.coerce.number().int().positive().optional(),
//         // bắt buộc khi type=goal_disallowed và bàn bị huỷ ban đầu là own_goal — xem comment
//         // ở MatchLifecycleService.RecordEventInput, không có voided_event_id để tự suy ra.
//         wasOwnGoal: z.boolean().optional(),
//     })
//     .refine(
//         d => {
//             const needsTeam: MatchEventType[] = [
//                 MatchEventType.goal,
//                 MatchEventType.own_goal,
//                 MatchEventType.penalty_scored,
//                 MatchEventType.goal_disallowed,
//             ];
//             return !needsTeam.includes(d.type) || d.teamId !== undefined;
//         },
//         { message: 'teamId bắt buộc cho event type ghi/huỷ điểm', path: ['teamId'] },
//     )
//     .refine(
//         d => {
//             const needsPlayer: MatchEventType[] = [
//                 MatchEventType.yellow_card,
//                 MatchEventType.red_card,
//                 MatchEventType.second_yellow,
//                 MatchEventType.card_rescinded,
//             ];
//             return !needsPlayer.includes(d.type) || d.playerId !== undefined;
//         },
//         { message: 'playerId bắt buộc cho event type liên quan thẻ', path: ['playerId'] },
//     );

// export const TransitionPeriodSchema = z.object({
//     period: z.nativeEnum(MatchPeriod),
// });

// export const FinalizeMatchSchema = z
//     .object({
//         resultType: z.nativeEnum(MatchResultType).optional().default(MatchResultType.full_time),
//         homePenaltyScore: z.coerce.number().int().nonnegative().optional(),
//         awayPenaltyScore: z.coerce.number().int().nonnegative().optional(),
//     })
//     .refine(d => d.resultType !== MatchResultType.penalty || (d.homePenaltyScore !== undefined && d.awayPenaltyScore !== undefined), {
//         message: 'resultType penalty cần homePenaltyScore và awayPenaltyScore',
//         path: ['homePenaltyScore'],
//     });

// export const ForfeitMatchSchema = z.object({
//     forfeitingTeamId: z.coerce.number().int().positive(),
// });

// export const AbandonMatchSchema = z.object({
//     minute: z.coerce.number().int().min(0).max(130),
//     reason: z.string().max(1000).optional(),
// });

// export const FileAppealSchema = z.object({
//     reason: z.string().min(1, 'reason bắt buộc').max(1000),
// });

// export const ResolveAppealSchema = z
//     .object({
//         resolution: z.enum(['uphold', 'overturn']),
//         newHomeScore: z.coerce.number().int().nonnegative().optional(),
//         newAwayScore: z.coerce.number().int().nonnegative().optional(),
//         note: z.string().min(1, 'note bắt buộc').max(1000),
//     })
//     .refine(d => d.resolution !== 'overturn' || (d.newHomeScore !== undefined && d.newAwayScore !== undefined), {
//         message: 'overturn cần newHomeScore và newAwayScore',
//         path: ['newHomeScore'],
//     });

// export type RecordEventDto = z.infer<typeof RecordEventSchema>;
// export type TransitionPeriodDto = z.infer<typeof TransitionPeriodSchema>;
// export type FinalizeMatchDto = z.infer<typeof FinalizeMatchSchema>;
// export type ForfeitMatchDto = z.infer<typeof ForfeitMatchSchema>;
// export type AbandonMatchDto = z.infer<typeof AbandonMatchSchema>;
// export type FileAppealDto = z.infer<typeof FileAppealSchema>;
// export type ResolveAppealDto = z.infer<typeof ResolveAppealSchema>;