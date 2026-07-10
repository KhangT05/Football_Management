import { z } from 'zod';
import { LineupType, PlayerPosition, MatchPlayerStatus } from '../generated/prisma/client.js';
export declare const registerLineupSchema: z.ZodObject<{
    match_id: z.ZodNumber;
    team_id: z.ZodNumber;
    players: z.ZodArray<z.ZodObject<{
        player_id: z.ZodNumber;
        jersey_number: z.ZodNumber;
        position: z.ZodEnum<{
            readonly goalkeeper: "goalkeeper";
            readonly defender: "defender";
            readonly midfielder: "midfielder";
            readonly forward: "forward";
        }>;
        lineup_type: z.ZodDefault<z.ZodEnum<{
            readonly starter: "starter";
            readonly substitute: "substitute";
        }>>;
        is_captain: z.ZodDefault<z.ZodBoolean>;
        minute_in: z.ZodOptional<z.ZodNumber>;
        minute_out: z.ZodOptional<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<{
            readonly available: "available";
            readonly injured: "injured";
            readonly suspended: "suspended";
            readonly absent: "absent";
        }>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateLineupEntrySchema: z.ZodObject<{
    match_id: z.ZodNumber;
    team_id: z.ZodNumber;
    player_id: z.ZodNumber;
    jersey_number: z.ZodNumber;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    lineup_type: z.ZodDefault<z.ZodEnum<{
        readonly starter: "starter";
        readonly substitute: "substitute";
    }>>;
    is_captain: z.ZodDefault<z.ZodBoolean>;
    minute_in: z.ZodOptional<z.ZodNumber>;
    minute_out: z.ZodOptional<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<{
        readonly available: "available";
        readonly injured: "injured";
        readonly suspended: "suspended";
        readonly absent: "absent";
    }>>;
}, z.core.$strip>;
export interface LineupEntryBody {
    player_id: number;
    jersey_number: number;
    position: PlayerPosition;
    lineup_type?: LineupType;
    is_captain?: boolean;
    minute_in?: number;
    minute_out?: number;
    status?: MatchPlayerStatus;
}
export interface RegisterLineupBody {
    team_id: number;
    players: LineupEntryBody[];
}
export type RegisterLineupDto = z.infer<typeof registerLineupSchema>;
export type UpdateLineupEntryDto = z.infer<typeof updateLineupEntrySchema>;
//# sourceMappingURL=matchlineup.schema.d.ts.map