import { z } from 'zod';

export const matchSchema = z.object({
    id: z.number(),
    home_team_id: z.number(),
    away_team_id: z.number(),
    status: z.string(),
    scheduled_at: z.string().nullable(),
    venue: z.object({ name: z.string() }).nullable().optional(),
    home_team: z.any().nullable().optional(),
    away_team: z.any().nullable().optional(),
});

export const matchResultSchema = z.object({
    home_final_score: z.number().nullable(),
    away_final_score: z.number().nullable(),
    home_penalty_score: z.number().nullable().optional(),
    away_penalty_score: z.number().nullable().optional(),
    winner_team_id: z.number().nullable().optional(),
}).nullable(); // null = chưa có kết quả (403/404 tolerated)

export const matchEventSchema = z.object({
    id: z.number(),
    team_id: z.number(),
    type: z.string(),
    minute: z.number().nullable(),
    added_minute: z.number().nullable().optional(),
    player_id: z.number().nullable().optional(),
    clockTime: z.string().nullable().optional(),
    clockConfidence: z.string().nullable().optional(),
});

export const lineupEntrySchema = z.object({
    id: z.number(),
    team_id: z.number(),
    player_id: z.number(),
    lineup_type: z.enum(['starter', 'substitute']),
    position: z.string().nullable(),
    jersey_number: z.number().nullable(),
    is_captain: z.boolean().optional(),
});

export const rosterPlayerSchema = z.object({
    player_id: z.number(),
    name: z.string().nullable(),
});