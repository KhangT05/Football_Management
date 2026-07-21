import { z } from "zod";
import { ApprovalStatus, PlayerPosition, PlayerRole, PlayerStatus } from "../generated/prisma/client.js";
import { PlayerSeasonInfo } from "../types/player.type.js";
export declare const PlayerPositionEnum: z.ZodEnum<{
    readonly goalkeeper: "goalkeeper";
    readonly defender: "defender";
    readonly midfielder: "midfielder";
    readonly forward: "forward";
}>;
export declare const PlayerRoleEnum: z.ZodEnum<{
    readonly player: "player";
    readonly captain: "captain";
    readonly vice_captain: "vice_captain";
}>;
export declare const PlayerStatusEnum: z.ZodEnum<{
    readonly active: "active";
    readonly injured: "injured";
    readonly suspended: "suspended";
}>;
export declare const ApprovalStatusEnum: z.ZodEnum<{
    readonly pending: "pending";
    readonly approved: "approved";
    readonly rejected: "rejected";
}>;
export interface PlayerDto {
    id: number;
    date_of_birth: Date;
    position: PlayerPosition;
    height: number | null;
    weight: number | null;
    nationality: string | null;
    avatar: string | null;
    is_active: boolean;
    created_at: Date;
    updated_at: Date | null;
    user?: {
        id: number;
        name: string;
        email: string;
        phone: string | null;
        student_code: string | null;
    } | null;
    user_id: number;
}
export interface PlayerPublicDto {
    id: number;
    date_of_birth: string | null;
    position: string | null;
    height: number | null;
    weight: number | null;
    nationality: string | null;
    avatar: string | null;
    user: {
        id: number;
        name: string;
    };
}
export interface PlayerDetailDto extends PlayerDto {
    seasons: PlayerSeasonInfo[];
}
export interface TeamPlayerDto {
    id: number;
    season_team_id: number;
    player_id: number;
    jersey_number: number;
    position: PlayerPosition;
    role: PlayerRole;
    status: PlayerStatus;
    approval_status: ApprovalStatus;
    joined_at: Date;
    created_at: Date;
    updated_at: Date | null;
    player?: PlayerDto | null;
}
export declare const createPlayerSchema: z.ZodObject<{
    user_id: z.ZodNumber;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weight: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    nationality: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    avatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const updatePlayerSchema: z.ZodObject<{
    height: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    avatar: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    position: z.ZodOptional<z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    weight: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    nationality: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
}, z.core.$strip>;
export declare const addPlayerToTeamSchema: z.ZodObject<{
    player_id: z.ZodNumber;
    jersey_number: z.ZodNumber;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    role: z.ZodDefault<z.ZodEnum<{
        readonly player: "player";
        readonly captain: "captain";
        readonly vice_captain: "vice_captain";
    }>>;
}, z.core.$strip>;
export declare const updateTeamPlayerSchema: z.ZodObject<{
    jersey_number: z.ZodOptional<z.ZodNumber>;
    position: z.ZodOptional<z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>>;
    role: z.ZodOptional<z.ZodEnum<{
        readonly player: "player";
        readonly captain: "captain";
        readonly vice_captain: "vice_captain";
    }>>;
    status: z.ZodOptional<z.ZodEnum<{
        readonly active: "active";
        readonly injured: "injured";
        readonly suspended: "suspended";
    }>>;
    approval_status: z.ZodOptional<z.ZodEnum<{
        readonly pending: "pending";
        readonly approved: "approved";
        readonly rejected: "rejected";
    }>>;
}, z.core.$strip>;
export declare const bulkDeleteSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
    reason: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        readonly transferred: "transferred";
        readonly dropped: "dropped";
        readonly disqualified: "disqualified";
        readonly season_ended: "season_ended";
        readonly injured: "injured";
    }>>>;
}, z.core.$strip>;
export declare const importPlayerRowSchema: z.ZodObject<{
    name: z.ZodString;
    user_email: z.ZodString;
    student_code: z.ZodOptional<z.ZodString>;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    height: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    weight: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    nationality: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    jersey_number: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export declare const createPlayerForTeamSchema: z.ZodObject<{
    name: z.ZodString;
    user_email: z.ZodString;
    student_code: z.ZodOptional<z.ZodString>;
    date_of_birth: z.ZodCoercedDate<unknown>;
    position: z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>;
    jersey_number: z.ZodNumber;
}, z.core.$strip>;
export declare const copyRosterSchema: z.ZodObject<{
    from_season_team_id: z.ZodNumber;
}, z.core.$strip>;
export type CopyRosterDto = z.infer<typeof copyRosterSchema>;
export type CreatePlayerForTeamDto = z.infer<typeof createPlayerForTeamSchema>;
export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
export type AddPlayerToTeamDto = z.infer<typeof addPlayerToTeamSchema>;
export type UpdateTeamPlayerDto = z.infer<typeof updateTeamPlayerSchema>;
export type BulkDeleteDto = z.infer<typeof bulkDeleteSchema>;
export type ImportPlayerRowDto = z.infer<typeof importPlayerRowSchema>;
//# sourceMappingURL=player.schema.d.ts.map