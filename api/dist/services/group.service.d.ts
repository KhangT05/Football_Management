import { PhaseFormat, PrismaClient, SeasonTeamStatus } from "../generated/prisma/client.js";
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
     *
     * FIX: persist opts.teams_per_group vào phase.teams_per_group sau khi draw
     * thành công — trước đây giá trị này chỉ tồn tại tạm thời trong request,
     * khiến assignTeamToGroup() (thêm 1 team lẻ sau draw) không có cách nào
     * biết group đã đầy chưa (field phase.teams_per_group không tồn tại trong
     * schema gốc, đã thêm ở schema.diff.prisma).
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
     *
     * FIX: phase.teams_per_group giờ tồn tại thật trong schema (xem
     * schema.diff.prisma). Vẫn giữ fallback nếu null (phase chưa từng qua
     * drawGroups, vd group được tạo + team gán thủ công từ đầu) — dùng
     * Infinity nghĩa là "không giới hạn", an toàn hơn throw cứng vì caller
     * (admin) có thể đang cố tình build group thủ công không qua draw flow.
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
     * FIX: persist teams_per_group lên Phase, đồng nhất với drawGroups().
     */
    drawGroupsSeeded(phaseId: number, opts: DrawGroupsOptions & {
        num_pots: number;
    }): Promise<DrawAssignment[]>;
    findByIdWithTeams(id: number): Promise<{
        phase: {
            format: PhaseFormat;
            id: number;
            is_active: boolean;
            name: string;
            season_id: number;
        };
        season_teams: {
            id: number;
            status: SeasonTeamStatus;
            team: {
                id: number;
                name: string;
                logo: string | null;
            };
        }[];
    } & {
        id: number;
        phase_id: number;
        status: import("../generated/prisma/enums.js").GroupStatus;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        name: string;
        scheduleGeneratedAt: Date | null;
    }>;
    private assertNoForeignGroupAssignment;
}
//# sourceMappingURL=group.service.d.ts.map