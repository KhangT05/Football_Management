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
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
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
export declare const advanceWinnerInputSchema: z.ZodObject<{
    matchId: z.ZodNumber;
    winnerTeamId: z.ZodNumber;
}, z.core.$strip>;
export declare const generateKnockoutRequestSchema: z.ZodObject<{
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
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
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type KnockoutGenerateOptionsDto = z.infer<typeof knockoutGenerateOptionsSchema>;
export type GenerateKnockoutRequestDto = z.infer<typeof generateKnockoutRequestSchema>;
export type AdvanceWinnerRequestDto = z.infer<typeof advanceWinnerRequestSchema>;
export type AdvanceWinnerInputDto = z.infer<typeof advanceWinnerInputSchema>;
//# sourceMappingURL=knockout.schema.d.ts.map