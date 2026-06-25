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
    /**
     * Assign đơn lẻ: 1 team vào 1 group.
     *
     * Lock: FOR UPDATE trên cả season_teams và groups để chặn concurrent assign
     * vào cùng group — tránh race condition vượt quá teams_per_group.
     *
     * clearDraw trước assign: nếu team đang giữ group_id khác trong cùng phase,
     * unset trước khi assign mới — tránh team xuất hiện ở 2 group cùng lúc.
     *
     * Cross-phase guard: group phải thuộc cùng season với seasonTeam; nếu team
     * đang giữ group thuộc phase khác → reject, caller phải clear draw phase đó trước.
     */
    assignTeamToGroup(seasonTeamId: number, groupId: number): Promise<void>;
    /**
     * Swap group_id của 2 SeasonTeam trong 1 transaction.
     *
     * Lock: theo id ascending để tránh deadlock khi 2 concurrent request
     * swap A↔B và B↔A đồng thời.
     *
     * Cross-phase guard: 2 group phải thuộc cùng phase — swap cross-phase
     * không có nghĩa business và có thể corrupt draw của phase kia.
     *
     * Status check: cả 2 team phải approved — pending/rejected không được
     * tham gia draw.
     */
    swapTeams(seasonTeamIdA: number, seasonTeamIdB: number): Promise<void>;
    /**
     * Seeded draw: chia team vào group theo pot dựa trên field `seed`.
     *
     * Pot tính runtime (không persist): pot = ceil(seed / potSize).
     * Unseeded team (seed = null) được shuffle vào pot cuối.
     *
     * Constraint (UEFA-style): num_pots === teams_per_group — mỗi pot assign
     * đúng 1 team/group. Ví dụ: 4 groups x 3 teams/group → num_pots = 3,
     * potSize = 4 (= groups.length).
     *   Pot 1: top 4 seeds → shuffle → 1 team/group
     *   Pot 2: seed 5-8   → shuffle → 1 team/group
     *   Pot 3: seed 9-12  → shuffle → 1 team/group
     *
     * Nếu muốn relaxed constraint (pot cuối ít hơn groups.length), bỏ
     * validation potSize và handle partial fill riêng.
     */
    drawGroupsSeeded(phaseId: number, opts: DrawGroupsOptions & {
        num_pots: number;
    }): Promise<DrawAssignment[]>;
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
    private assertNoForeignGroupAssignment;
}
//# sourceMappingURL=group.service.d.ts.map