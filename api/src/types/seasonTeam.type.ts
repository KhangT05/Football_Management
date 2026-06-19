// seasonTeam.type.ts

import { Prisma, SeasonTeamStatus } from "../generated/prisma/client.js";

// Dùng nội bộ trong service (không expose qua TSOA route return type)
export const withRelations = {
    include: {
        season: { select: { id: true, name: true } },
        team: { select: { id: true, name: true, logo: true } },
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
    },
} satisfies Prisma.SeasonTeamFindManyArgs;

// Type để dùng trong service internals (không dùng trong @Route handler return)
export type SeasonTeamWithRelationsInternal = Prisma.SeasonTeamGetPayload<typeof withRelations>;

// Explicit type — TSOA đọc được
export interface SeasonTeamWithRelations {
    id: number;
    season_id: number;
    team_id: number;
    user_id: number | null;
    status: SeasonTeamStatus;
    group_id: number | null;
    created_at: Date;
    updated_at: Date | null;
    deleted_at: Date | null;
    is_active: boolean;
    season: { id: number; name: string };
    team: { id: number; name: string; logo: string | null };
    user: { id: number; name: string; email: string } | null;
    group: { id: number; name: string } | null;
}