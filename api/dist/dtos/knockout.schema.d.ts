import { z } from 'zod';
export declare const KNOCKOUT_PHASE_TYPES: readonly ["round_of_16", "quarter_final", "semi_final", "third_place", "final"];
export declare const knockoutGenerateOptionsSchema: z.ZodObject<{
    phaseId: z.ZodNumber;
    seasonId: z.ZodNumber;
    seededTeamIds: z.ZodArray<z.ZodNumber>;
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
    legs: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
}, z.core.$strip>;
export declare const advanceWinnerInputSchema: z.ZodObject<{
    matchId: z.ZodNumber;
    winnerTeamId: z.ZodNumber;
}, z.core.$strip>;
export declare const generateKnockoutRequestSchema: z.ZodObject<{
    legs: z.ZodUnion<readonly [z.ZodLiteral<1>, z.ZodLiteral<2>]>;
    venueIds: z.ZodArray<z.ZodNumber>;
    matchTimes: z.ZodArray<z.ZodString>;
    seededTeamIds: z.ZodArray<z.ZodNumber>;
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