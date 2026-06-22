import { z } from 'zod';
import { PhaseType } from '../generated/prisma/client.js';
import {
    venueIdsField,
    matchTimesField
} from '../dtos/fields.schema.js';

export const KNOCKOUT_PHASE_TYPES = [
    PhaseType.round_of_16,
    PhaseType.quarter_final,
    PhaseType.semi_final,
    PhaseType.third_place,
    PhaseType.final,
] as const;

const legsSchema = z.union([z.literal(1), z.literal(2)]); // Phase.legs là Int, domain chỉ cho 1|2

export const knockoutGenerateOptionsSchema = z.object({
    phaseId: z.number().int().positive(),
    seasonId: z.number().int().positive(),
    seededTeamIds: z.array(z.number().int().positive())
        .min(2, 'Cần ít nhất 2 team cho knockout')
        .refine(ids => new Set(ids).size === ids.length, 'seededTeamIds không được trùng team'),
    venueIds: venueIdsField,
    matchTimes: matchTimesField,
    legs: legsSchema,
});

// Root fix cho bug ở mục 1 — bỏ null tại nguồn, không có gì để narrow nữa
export const advanceWinnerInputSchema = z.object({
    matchId: z.number().int().positive(),
    winnerTeamId: z.number().int().positive(),
});

export const generateKnockoutRequestSchema = knockoutGenerateOptionsSchema.omit({
    phaseId: true,
    seasonId: true,
});

export const advanceWinnerRequestSchema = advanceWinnerInputSchema.extend({
    venueIds: venueIdsField,
    matchTimes: matchTimesField,
});

export type KnockoutGenerateOptionsDto = z.infer<typeof knockoutGenerateOptionsSchema>;
export type GenerateKnockoutRequestDto = z.infer<typeof generateKnockoutRequestSchema>;
export type AdvanceWinnerRequestDto = z.infer<typeof advanceWinnerRequestSchema>;
export type AdvanceWinnerInputDto = z.infer<typeof advanceWinnerInputSchema>;