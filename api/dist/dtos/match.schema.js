import { z } from 'zod';
import { MatchEventType, MatchPeriod, MatchResultType } from '../generated/prisma/client.js';
// ─── Record event ─────────────────────────────────────────────────────────────
export const RecordEventSchema = z
    .object({
    playerId: z.coerce.number().int().positive().optional(),
    teamId: z.coerce.number().int().positive().optional(),
    type: z.nativeEnum(MatchEventType),
    minute: z.coerce.number().int().min(0).max(130).optional(),
    addedMinute: z.coerce.number().int().min(0).max(15).optional(),
    note: z.string().max(500).optional(),
    subOutPlayerId: z.coerce.number().int().positive().optional(),
    // bắt buộc khi type=goal_disallowed và bàn bị huỷ ban đầu là own_goal — xem RecordEventInput
    wasOwnGoal: z.boolean().optional(),
})
    .refine(d => {
    const requiresTeam = [
        MatchEventType.goal,
        MatchEventType.own_goal,
        MatchEventType.penalty_scored,
        MatchEventType.goal_disallowed,
    ];
    return !requiresTeam.includes(d.type) || d.teamId !== undefined;
}, { path: ['teamId'] })
    .refine(d => {
    const requiresPlayer = [
        MatchEventType.yellow_card,
        MatchEventType.red_card,
        MatchEventType.second_yellow,
        MatchEventType.card_rescinded,
    ];
    return !requiresPlayer.includes(d.type) || d.playerId !== undefined;
}, { path: ['playerId'] })
    .refine(
// goal_disallowed của own_goal cần wasOwnGoal để isCreditedToHomeTeam đảo đúng hướng trừ
d => d.type !== MatchEventType.goal_disallowed || d.wasOwnGoal !== undefined || d.teamId !== undefined, { path: ['wasOwnGoal'] });
// ─── Period transition ────────────────────────────────────────────────────────
export const TransitionPeriodSchema = z.object({
    period: z.nativeEnum(MatchPeriod),
});
// ─── Finalize ─────────────────────────────────────────────────────────────────
export const FinalizeMatchSchema = z
    .object({
    resultType: z.nativeEnum(MatchResultType).optional().default(MatchResultType.full_time),
    homePenaltyScore: z.coerce.number().int().nonnegative().optional(),
    awayPenaltyScore: z.coerce.number().int().nonnegative().optional(),
})
    .refine(d => d.resultType !== MatchResultType.penalty
    || (d.homePenaltyScore !== undefined && d.awayPenaltyScore !== undefined), { path: ['homePenaltyScore'] });
// ─── Forfeit ──────────────────────────────────────────────────────────────────
export const ForfeitMatchSchema = z.object({
    forfeitingTeamId: z.coerce.number().int().positive(),
});
// ─── Abandon ─────────────────────────────────────────────────────────────────
export const AbandonMatchSchema = z.object({
    minute: z.coerce.number().int().min(0).max(130),
    reason: z.string().max(1000).optional(),
});
// ─── Appeal / protest ────────────────────────────────────────────────────────
export const FileDisputeSchema = z.object({
    reason: z.string().min(1).max(1000),
});
export const ResolveAppealSchema = z
    .object({
    // 'uphold'/'overturn' là input action của admin — không phải MatchResultStatus trong DB.
    // MatchResultStatus.overturned là trạng thái ghi DB SAU KHI admin chọn 'overturn'.
    // Enum Prisma không dùng được ở đây vì shape không khớp (protested/official/under_review
    // không phải lựa chọn hợp lệ cho admin action này).
    resolution: z.enum(['uphold', 'overturn']),
    newHomeScore: z.coerce.number().int().nonnegative().optional(),
    newAwayScore: z.coerce.number().int().nonnegative().optional(),
    note: z.string().min(1).max(1000),
})
    .refine(d => d.resolution !== 'overturn' || (d.newHomeScore !== undefined && d.newAwayScore !== undefined), { path: ['newHomeScore'] });
//# sourceMappingURL=match.schema.js.map