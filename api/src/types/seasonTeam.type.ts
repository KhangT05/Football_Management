// seasonTeam.type.ts

import { Prisma, SeasonTeamStatus, SeasonStatus } from "../generated/prisma/client.js";

// Dùng nội bộ trong service (không expose qua TSOA route return type)
export const withRelations = {
    include: {
        // FIX: season trước đây chỉ select { id, name } — FE (ManageSeasonTeams)
        // cần season.tournament để hiển thị cột Tournament khi list gộp nhiều
        // season cùng lúc (branch không filter season_id trong findAll()).
        // Thiếu field này khiến FE luôn fallback về placeholder "chưa rõ mùa"
        // bất kể request có filter hay không, vì đây là include DUY NHẤT
        // được dùng bởi cả findAll/findByIdOrFail/approve/... — không có
        // select riêng nào khác cho case list-all.
        season: {
            select: {
                id: true,
                name: true,
                status: true,
                tournament: { select: { id: true, name: true, logo: true } },
            },
        },
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
    seed: number | null;
    season: {
        id: number;
        name: string;
        status: SeasonStatus;
        tournament: { id: number; name: string; logo: string | null };
    };
    team: { id: number; name: string; logo: string | null };
    user: { id: number; name: string; email: string } | null;
    group: { id: number; name: string } | null;
}