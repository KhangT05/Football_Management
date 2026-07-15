import { z } from 'zod';
export declare const KNOCKOUT_PHASE_TYPES: readonly ["round_of_16", "quarter_final", "semi_final", "final"];
export declare const knockoutGenerateOptionsSchema: z.ZodObject<{
    seasonId: z.ZodNumber;
    seeds: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"standing">;
        groupId: z.ZodNumber;
        rank: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"manual">;
        teamId: z.ZodNumber;
    }, z.core.$strip>], "kind">>;
    legs: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
    phaseTypeOverride: z.ZodOptional<z.ZodEnum<{
        readonly group_stage: "group_stage";
        readonly round_of_16: "round_of_16";
        readonly quarter_final: "quarter_final";
        readonly semi_final: "semi_final";
        readonly third_place: "third_place";
        readonly final: "final";
    }> & z.ZodType<"round_of_16" | "quarter_final" | "semi_final" | "final", "group_stage" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final", z.core.$ZodTypeInternals<"round_of_16" | "quarter_final" | "semi_final" | "final", "group_stage" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final">>>;
}, z.core.$strip>;
export declare const swapSeedsRequestSchema: z.ZodObject<{
    slotIdA: z.ZodNumber;
    sideA: z.ZodEnum<{
        home: "home";
        away: "away";
    }>;
    slotIdB: z.ZodNumber;
    sideB: z.ZodEnum<{
        home: "home";
        away: "away";
    }>;
}, z.core.$strip>;
export type SwapSeedsRequestDto = z.infer<typeof swapSeedsRequestSchema>;
export declare const advanceWinnerInputSchema: z.ZodObject<{
    matchId: z.ZodNumber;
    winnerTeamId: z.ZodNumber;
}, z.core.$strip>;
export declare const knockoutSeedModeSchema: z.ZodEnum<{
    straight: "straight";
    cross: "cross";
    random: "random";
}>;
export declare const autoSeedKnockoutRequestSchema: z.ZodObject<{
    groupIds: z.ZodArray<z.ZodNumber>;
    topN: z.ZodNumber;
    mode: z.ZodEnum<{
        straight: "straight";
        cross: "cross";
        random: "random";
    }>;
    legs: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
    phaseTypeOverride: z.ZodOptional<z.ZodEnum<{
        readonly group_stage: "group_stage";
        readonly round_of_16: "round_of_16";
        readonly quarter_final: "quarter_final";
        readonly semi_final: "semi_final";
        readonly third_place: "third_place";
        readonly final: "final";
    }>>;
    venueIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    matchTimes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dateRangeStart: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateRangeEnd: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const generateKnockoutRequestSchema: z.ZodObject<{
    legs: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
    seeds: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        kind: z.ZodLiteral<"standing">;
        groupId: z.ZodNumber;
        rank: z.ZodNumber;
    }, z.core.$strip>, z.ZodObject<{
        kind: z.ZodLiteral<"manual">;
        teamId: z.ZodNumber;
    }, z.core.$strip>], "kind">>;
    phaseTypeOverride: z.ZodOptional<z.ZodEnum<{
        readonly group_stage: "group_stage";
        readonly round_of_16: "round_of_16";
        readonly quarter_final: "quarter_final";
        readonly semi_final: "semi_final";
        readonly third_place: "third_place";
        readonly final: "final";
    }> & z.ZodType<"round_of_16" | "quarter_final" | "semi_final" | "final", "group_stage" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final", z.core.$ZodTypeInternals<"round_of_16" | "quarter_final" | "semi_final" | "final", "group_stage" | "round_of_16" | "quarter_final" | "semi_final" | "third_place" | "final">>>;
}, z.core.$strip>;
export declare const advanceWinnerRequestSchema: z.ZodObject<{
    matchId: z.ZodNumber;
    winnerTeamId: z.ZodNumber;
    venueIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    dailyStartTime: z.ZodOptional<z.ZodString>;
    dailyEndTime: z.ZodOptional<z.ZodString>;
    bufferMinutes: z.ZodOptional<z.ZodNumber>;
    dateRangeStart: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    dateRangeEnd: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type AutoSeedKnockoutRequestDto = z.infer<typeof autoSeedKnockoutRequestSchema>;
export type KnockoutGenerateOptionsDto = z.infer<typeof knockoutGenerateOptionsSchema>;
export type GenerateKnockoutRequestDto = z.infer<typeof generateKnockoutRequestSchema>;
export type AdvanceWinnerRequestDto = z.infer<typeof advanceWinnerRequestSchema>;
export type AdvanceWinnerInputDto = z.infer<typeof advanceWinnerInputSchema>;
//# sourceMappingURL=knockout.schema.d.ts.map