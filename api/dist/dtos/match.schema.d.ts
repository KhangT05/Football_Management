import { z } from 'zod';
export declare const RecordEventSchema: z.ZodObject<{
    playerId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    teamId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    type: z.ZodEnum<{
        readonly goal: "goal";
        readonly own_goal: "own_goal";
        readonly yellow_card: "yellow_card";
        readonly red_card: "red_card";
        readonly second_yellow: "second_yellow";
        readonly substitution_in: "substitution_in";
        readonly substitution_out: "substitution_out";
        readonly penalty_scored: "penalty_scored";
        readonly penalty_missed: "penalty_missed";
        readonly card_rescinded: "card_rescinded";
        readonly goal_disallowed: "goal_disallowed";
    }>;
    minute: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    addedMinute: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    note: z.ZodOptional<z.ZodString>;
    subOutPlayerId: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    wasOwnGoal: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const TransitionPeriodSchema: z.ZodObject<{
    period: z.ZodEnum<{
        readonly first_half: "first_half";
        readonly second_half: "second_half";
        readonly extra_time_first: "extra_time_first";
        readonly extra_time_second: "extra_time_second";
        readonly penalty_shootout: "penalty_shootout";
    }>;
}, z.core.$strip>;
export declare const FinalizeMatchSchema: z.ZodObject<{
    resultType: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly full_time: "full_time";
        readonly extra_time: "extra_time";
        readonly penalty: "penalty";
        readonly forfeit: "forfeit";
        readonly walkover: "walkover";
    }>>>;
    homeHalfTimeScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    awayHalfTimeScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    homePenaltyScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    awayPenaltyScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const ManualScoreSchema: z.ZodObject<{
    homeScore: z.ZodCoercedNumber<unknown>;
    awayScore: z.ZodCoercedNumber<unknown>;
    resultType: z.ZodEnum<{
        readonly full_time: "full_time";
        readonly extra_time: "extra_time";
        readonly penalty: "penalty";
        readonly forfeit: "forfeit";
        readonly walkover: "walkover";
    }>;
    homePenalty: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    awayPenalty: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const ConfirmOfficialSchema: z.ZodObject<{
    venueIds: z.ZodOptional<z.ZodArray<z.ZodCoercedNumber<unknown>>>;
    matchTimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const ForfeitMatchSchema: z.ZodObject<{
    forfeitingTeamId: z.ZodCoercedNumber<unknown>;
    venueIds: z.ZodOptional<z.ZodArray<z.ZodCoercedNumber<unknown>>>;
    matchTimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const AbandonMatchSchema: z.ZodObject<{
    minute: z.ZodCoercedNumber<unknown>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const FileDisputeSchema: z.ZodObject<{
    reason: z.ZodString;
}, z.core.$strip>;
export declare const ResolveAppealSchema: z.ZodObject<{
    resolution: z.ZodEnum<{
        uphold: "uphold";
        overturn: "overturn";
    }>;
    newHomeScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    newAwayScore: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
    note: z.ZodString;
}, z.core.$strip>;
export declare const DeleteEventQuerySchema: z.ZodObject<{
    venueIds: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<number[] | undefined, string | undefined>>;
    matchTimes: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string[] | undefined, string | undefined>>;
}, z.core.$strip>;
export type DeleteEventQueryDto = z.infer<typeof DeleteEventQuerySchema>;
export type RecordEventDto = z.infer<typeof RecordEventSchema>;
export type TransitionPeriodDto = z.infer<typeof TransitionPeriodSchema>;
export type FinalizeMatchDto = z.infer<typeof FinalizeMatchSchema>;
export type ManualScoreDto = z.infer<typeof ManualScoreSchema>;
export type ConfirmOfficialDto = z.infer<typeof ConfirmOfficialSchema>;
export type ForfeitMatchDto = z.infer<typeof ForfeitMatchSchema>;
export type AbandonMatchDto = z.infer<typeof AbandonMatchSchema>;
export type FileDisputeDto = z.infer<typeof FileDisputeSchema>;
export type ResolveAppealDto = z.infer<typeof ResolveAppealSchema>;
//# sourceMappingURL=match.schema.d.ts.map