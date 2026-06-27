import { z } from "zod";
import { ApprovalStatus, PlayerPosition, PlayerRole, PlayerStatus } from "../generated/prisma/client.js";
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
    } | null;
    user_id: number;
}
export interface TeamPlayerDto {
    id: number;
    team_id: number;
    player_id: number;
    jersey_number: number;
    position: PlayerPosition;
    role: PlayerRole;
    status: PlayerStatus;
    approval_status: ApprovalStatus;
    is_active: boolean;
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
    position: z.ZodOptional<z.ZodEnum<{
        readonly goalkeeper: "goalkeeper";
        readonly defender: "defender";
        readonly midfielder: "midfielder";
        readonly forward: "forward";
    }>>;
    date_of_birth: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    height: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    weight: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodNumber>>>;
    nationality: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    avatar: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
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
    is_active: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const bulkDeleteSchema: z.ZodObject<{
    ids: z.ZodArray<z.ZodNumber>;
}, z.core.$strip>;
export declare const importPlayerRowSchema: z.ZodObject<{
    user_email: z.ZodString;
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
export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
export type AddPlayerToTeamDto = z.infer<typeof addPlayerToTeamSchema>;
export type UpdateTeamPlayerDto = z.infer<typeof updateTeamPlayerSchema>;
export type BulkDeleteDto = z.infer<typeof bulkDeleteSchema>;
export type ImportPlayerRowDto = z.infer<typeof importPlayerRowSchema>;
//# sourceMappingURL=player.schema.d.ts.map