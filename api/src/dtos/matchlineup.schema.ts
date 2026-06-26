import { z } from 'zod';
import { LineupType, PlayerPosition, MatchPlayerStatus } from '../generated/prisma/client.js';

const lineupEntrySchema = z.object({
    player_id: z.number().int().positive(),
    jersey_number: z.number().int().min(1).max(99),
    position: z.nativeEnum(PlayerPosition),
    lineup_type: z.nativeEnum(LineupType).default('starter'),
    is_captain: z.boolean().default(false),
    minute_in: z.number().int().min(0).max(120).optional(),
    minute_out: z.number().int().min(0).max(120).optional(),
    status: z.nativeEnum(MatchPlayerStatus).default('available'),
}).refine(
    (d) => d.minute_out === undefined || d.minute_in !== undefined,
    { message: 'minute_out requires minute_in', path: ['minute_out'] }
);

export const registerLineupSchema = z.object({
    match_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
    players: z.array(lineupEntrySchema).min(1).max(30),
}).refine(
    (d) => d.players.filter(p => p.is_captain).length <= 1,
    { message: 'Chỉ được 1 captain', path: ['players'] }
).refine(
    (d) => new Set(d.players.map(p => p.player_id)).size === d.players.length,
    { message: 'player_id trùng trong lineup', path: ['players'] }
);

export const updateLineupEntrySchema = z.object({
    match_id: z.number().int().positive(),
    team_id: z.number().int().positive(),
    player_id: z.number().int().positive(),
}).merge(lineupEntrySchema);
// updateLineupEntrySchema: patch 1 player entry

export type RegisterLineupDto = z.infer<typeof registerLineupSchema>;
export type UpdateLineupEntryDto = z.infer<typeof updateLineupEntrySchema>;