import { PhaseFormat, PrismaClient } from "../generated/prisma/client.js";
import { DrawAssignment, DrawGroupsOptions } from "../types/group.type.js";
export declare class GroupService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    /**
     * Lock: schema dùng MySQL — pg_advisory_xact_lock KHÔNG TỒN TẠI, đổi sang
     * SELECT ... FOR UPDATE trên row Phase (InnoDB row lock, transaction-scoped,
     * tự release khi commit/rollback).
     *
     * Cross-phase guard: chặn draw nếu approved team đang giữ group_id thuộc
     * MỘT PHASE KHÁC (xem note ở SeasonTeamService.assignGroup) — bắt buộc
     * clear draw phase đó trước.
     */
    drawGroups(phaseId: number, opts: DrawGroupsOptions): Promise<DrawAssignment[]>;
    clearDraw(phaseId: number): Promise<void>;
    private assertNoForeignGroupAssignment;
    findByIdWithTeams(id: number): Promise<{
        phase: {
            name: string;
            is_active: boolean;
            id: number;
            format: PhaseFormat;
            season_id: number;
        };
        seasonTeams: never;
    } & {
        name: string;
        is_active: boolean;
        id: number;
        created_at: Date;
        updated_at: Date | null;
        status: import("../generated/prisma/enums.js").GroupStatus;
        phase_id: number;
        scheduleGeneratedAt: Date | null;
    }>;
}
//# sourceMappingURL=group.service.d.ts.map