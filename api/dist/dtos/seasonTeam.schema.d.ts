import { z } from "zod";
export declare const selfRegisterSeasonTeamSchema: z.ZodObject<{
    season_id: z.ZodNumber;
    team_id: z.ZodNumber;
}, z.core.$strip>;
export declare const adminAddSeasonTeamSchema: z.ZodObject<{
    season_id: z.ZodNumber;
    team_id: z.ZodNumber;
    status: z.ZodOptional<z.ZodEnum<{
        readonly approved: "approved";
        readonly pending: "pending";
        readonly active: "active";
        readonly eliminated: "eliminated";
        readonly withdrawn: "withdrawn";
    }>>;
}, z.core.$strip>;
export declare const updateSeasonTeamStatusSchema: z.ZodObject<{
    status: z.ZodEnum<{
        readonly approved: "approved";
        readonly pending: "pending";
        readonly active: "active";
        readonly eliminated: "eliminated";
        readonly withdrawn: "withdrawn";
    }>;
}, z.core.$strip>;
export declare const assignGroupSchema: z.ZodObject<{
    group_id: z.ZodNumber;
}, z.core.$strip>;
export declare const TransferSeasonTeamSchema: z.ZodObject<{
    season_id: z.ZodNumber;
}, z.core.$strip>;
export declare const transferRosterPlayerAddSchema: z.ZodObject<{
    player_id: z.ZodNumber;
    jersey_number: z.ZodNumber;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    role: z.ZodOptional<z.ZodEnum<{
        readonly player: "player";
        readonly captain: "captain";
        readonly vice_captain: "vice_captain";
    }>>;
}, z.core.$strip>;
export declare const transferSeasonRosterSchema: z.ZodObject<{
    carry_player_ids: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    add_players: z.ZodDefault<z.ZodArray<z.ZodObject<{
        player_id: z.ZodNumber;
        jersey_number: z.ZodNumber;
        position: z.ZodEnum<{
            readonly goalkeeper: "goalkeeper";
            readonly defender: "defender";
            readonly midfielder: "midfielder";
            readonly forward: "forward";
        }>;
        role: z.ZodOptional<z.ZodEnum<{
            readonly player: "player";
            readonly captain: "captain";
            readonly vice_captain: "vice_captain";
        }>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const TransferSeasonTeamBodySchema: z.ZodObject<{
    season_id: z.ZodNumber;
    carry_player_ids: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    add_players: z.ZodDefault<z.ZodArray<z.ZodObject<{
        player_id: z.ZodNumber;
        jersey_number: z.ZodNumber;
        position: z.ZodEnum<{
            readonly goalkeeper: "goalkeeper";
            readonly defender: "defender";
            readonly midfielder: "midfielder";
            readonly forward: "forward";
        }>;
        role: z.ZodOptional<z.ZodEnum<{
            readonly player: "player";
            readonly captain: "captain";
            readonly vice_captain: "vice_captain";
        }>>;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export type TransferRosterInput = z.infer<typeof transferSeasonRosterSchema>;
export type TransferSeasonTeamDto = z.infer<typeof TransferSeasonTeamBodySchema>;
export type SelfRegisterSeasonTeamDto = z.infer<typeof selfRegisterSeasonTeamSchema>;
export type AdminAddSeasonTeamDto = z.infer<typeof adminAddSeasonTeamSchema>;
export type UpdateSeasonTeamStatusDto = z.infer<typeof updateSeasonTeamStatusSchema>;
export type AssignGroupDto = z.infer<typeof assignGroupSchema>;
//# sourceMappingURL=seasonTeam.schema.d.ts.map