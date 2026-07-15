import { Prisma, PhaseFormat, PrismaClient, SeasonTeamStatus, PhaseStatus } from "../generated/prisma/client.js";
import { DrawAssignment, DrawGroupsOptions } from "../types/group.type.js";
export declare class GroupService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private assertSeasonAcceptsGroupOps;
    /**
     * NEW: gộp check "phase còn sửa được không" ở 1 chỗ duy nhất.
     * - locked: phase đã đá xong / đã advance — không bao giờ sửa lại được.
     * - in_progress: phase đã được admin "xác nhận" (confirmGroups) — cấu trúc
     *   group coi như chốt, muốn sửa cấu trúc (tạo/xoá/draw/clear group) phải
     *   unconfirmGroups() về draft trước. assignTeamToGroup/swapTeams KHÔNG
     *   đi qua check này — đó là thao tác "sửa nhẹ" (đổi chỗ 1-1, không đổi
     *   sĩ số/cấu trúc) nên vẫn cho phép ngay cả khi đã confirm.
     */
    private assertPhaseIsDraft;
    /**
     * FIX (RR -> RR pool lệch): trước đây mọi nơi cần "danh sách approved
     * team để draw/clear/auto-finalize" đều query season-wide
     * (season_id + status=approved), không loại các đội đã BỊ LOẠI ở vòng
     * bảng trước. Khi advanceToNextRoundRobin() tạo phase RR thứ 2, các đội
     * bị loại vẫn giữ status=approved và vẫn giữ group_id trỏ về group của
     * phase RR1 (đã locked). assertNoForeignGroupAssignment() thấy group_id
     * đó thuộc phase khác -> ném CONFLICT ngay lập tức, chặn MỌI thao tác
     * draw/clear/auto-finalize trên phase RR2 dù thao tác đó không hề đụng
     * tới các đội đã bị loại.
     *
     * Fix tận gốc: pool "eligible" cho 1 phase chỉ gồm approved team nào
     * đang KHÔNG thuộc group nào (group_id null — chưa từng được xếp ở bất
     * kỳ phase nào, hoặc vừa clearDraw) HOẶC đang thuộc đúng group của
     * CHÍNH phase này (để re-draw/swap trong cùng phase vẫn thấy đúng đội
     * đang có). Đội đã bị "khoá" trong group của phase khác (RR1 locked)
     * không bao giờ lọt vào pool của RR2 nữa.
     */
    private getEligibleApprovedTeams;
    private countEligibleApprovedTeams;
    private getOrCreateRoundRobinPhase;
    private findRoundRobinPhase;
    createGroup(seasonId: number, name: string): Promise<{
        id: number;
        name: string;
        phase_id: number;
    }>;
    createGroupsBulk(seasonId: number, count: number): Promise<{
        id: number;
        name: string;
    }[]>;
    previewGroupSplitBySeason(seasonId: number, desiredGroupCount: number): Promise<{
        groupCount: number;
        distribution: number[];
        warning?: string;
    }>;
    previewGroupSplit(approvedTeamCount: number, desiredGroupCount: number): {
        groupCount: number;
        distribution: number[];
        warning?: string;
    };
    createAndDrawGroups(seasonId: number, groupCount: number): Promise<DrawAssignment[]>;
    autoFinalizeGroups(seasonId: number, opts?: {
        minTeamsPerGroup?: number;
        maxTeamsPerGroup?: number;
    }): Promise<DrawAssignment[]>;
    advanceToNextRoundRobin(fromPhaseId: number, newGroupCount: number, rankRange?: {
        from: number;
        to: number;
    }): Promise<{
        newPhaseId: number;
        assignments: DrawAssignment[];
    }>;
    findAllBySeason(seasonId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: PhaseFormat;
            status: PhaseStatus;
            order: number;
            teams_per_group: number | null;
            season_id: number;
        };
        groups: {
            name: string;
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
            season_teams: {
                id: number;
                team_id: number;
            }[];
        }[];
        eligibleTeamCount: number;
    } | {
        phase: null;
        groups: never[];
        eligibleTeamCount: null;
    }>;
    findAllByPhase(phaseId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: PhaseFormat;
            status: PhaseStatus;
            order: number;
            teams_per_group: number | null;
            season_id: number;
        };
        groups: {
            name: string;
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
            season_teams: {
                id: number;
                team_id: number;
            }[];
        }[];
        eligibleTeamCount: number;
    } | {
        phase: null;
        groups: never[];
        eligibleTeamCount: null;
    }>;
    private buildGroupsPayload;
    deactivateGroup(groupId: number): Promise<void>;
    drawGroups(seasonId: number, opts: DrawGroupsOptions): Promise<DrawAssignment[]>;
    clearDraw(seasonId: number): Promise<void>;
    /**
     * NEW: chốt cấu trúc group của phase hiện tại — draft -> in_progress.
     * Yêu cầu mọi group active phải có >= 2 team approved (đồng nhất điều
     * kiện tối thiểu của drawGroups). Sau khi confirm, mọi thao tác cấu
     * trúc (tạo/xoá group, draw, clear) bị chặn qua assertPhaseIsDraft —
     * chỉ còn assignTeamToGroup/swapTeams (đổi chỗ 1-1, không đổi cấu trúc)
     * là còn dùng được, phục vụ đúng nhu cầu "confirm rồi chỉ còn swap".
     */
    confirmGroups(seasonId: number): Promise<void>;
    /**
     * NEW: hủy xác nhận — in_progress -> draft, để admin mở lại draw/clear/
     * xoá group. Chặn nếu đã có match (giống mọi thao tác cấu trúc khác) vì
     * lúc đó việc "mở khoá" chỉ tạo ảo giác sửa được trong khi lịch đã chốt.
     */
    unconfirmGroups(seasonId: number): Promise<void>;
    assignTeamToGroup(seasonTeamId: number, groupId: number): Promise<void>;
    swapTeams(seasonTeamIdA: number, seasonTeamIdB: number): Promise<void>;
    drawGroupsSeeded(seasonId: number, opts: DrawGroupsOptions & {
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
        season_teams: {
            id: number;
            team: {
                name: string;
                id: number;
                logo: string | null;
            };
            status: SeasonTeamStatus;
        }[];
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
    private snakeDistribute;
    private splitIntoPots;
    private applyAssignments;
    private assertNoForeignGroupAssignment;
    createEmptyRoundRobinGroups(tx: Prisma.TransactionClient, seasonId: number, groupCount: number): Promise<{
        phaseId: number;
        groups: {
            id: number;
            name: string;
        }[];
    }>;
    autoAssignApprovedTeamToGroup(tx: Prisma.TransactionClient, seasonId: number, seasonTeamId: number): Promise<{
        groupId: number;
        groupName: string;
    } | null>;
}
//# sourceMappingURL=group.service.d.ts.map