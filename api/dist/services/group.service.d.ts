import { PhaseFormat, PrismaClient, SeasonTeamStatus, PhaseStatus } from "../generated/prisma/client.js";
import { DrawAssignment, DrawGroupsOptions } from "../types/group.type.js";
export declare class GroupService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    /**
     * Lock ở mức season, không phải phase — vì phase có thể CHƯA TỒN TẠI
     * (get-or-create). Lock 1 row phase không có tác dụng chống race khi
     * row đó chưa được tạo; 2 request createGroupsBulk đồng thời cho cùng
     * season đều sẽ pass check "findFirst -> null" rồi cùng insert phase
     * mới nếu không serialize qua season trước.
     *
     * Hệ quả: mọi write-path (create/draw/clear) trên group của 1 season
     * giờ serialize qua season lock — chấp nhận được vì đây vốn là các
     * thao tác admin tần suất thấp, không phải hot path.
     */
    private lockSeason;
    /** Chỉ dùng ở các entrypoint TẠO dữ liệu (createGroup, createGroupsBulk). */
    private getOrCreateRoundRobinPhase;
    /**
     * Dùng cho read/draw/clear — KHÔNG tự tạo phase. Auto-create trong 1
     * GET hoặc trong draw/clear là side-effect ẩn (gọi drawGroups trên
     * season chưa từng tạo group sẽ tạo ra 1 phase rỗng vô nghĩa trước
     * khi throw "chưa có group"). Rõ ràng hơn: null nghĩa là "chưa có gì",
     * caller tự quyết định thông báo phù hợp.
     */
    private findRoundRobinPhase;
    /**
     * FIX (root cause "bốc thăm không được dù đã tạo bảng"): insert giờ
     * set `is_active: true` TƯỜNG MINH thay vì phụ thuộc default cột
     * trong Prisma schema. Mọi read-path (buildGroupsPayload, drawGroups,
     * drawGroupsSeeded, clearDraw) đều filter cứng `is_active: true` —
     * nếu default schema/generated client không đảm bảo true, group vừa
     * tạo bị ẩn hoàn toàn khỏi list -> FE luôn thấy groups.length === 0
     * -> nút bốc thăm bị disable, và drawGroups() cũng tự throw "Phase
     * chưa có group nào" dù DB đã có row. Đây cùng bug class với fix đã
     * áp ở SeasonTeamService.createOrReactivate — không tự động lan sang
     * đây vì là 2 service riêng.
     */
    createGroup(seasonId: number, name: string): Promise<{
        id: number;
        name: string;
        phase_id: number;
    }>;
    createGroupsBulk(seasonId: number, count: number): Promise<{
        id: number;
        name: string;
    }[]>;
    /**
     * FIX (breaking change so với bản phaseId cũ): giờ nhận seasonId, trả
     * { phase: null, groups: [] } nếu season chưa từng tạo group/phase —
     * đây là trạng thái HỢP LỆ ("chưa bắt đầu"), không phải lỗi và không
     * tự tạo phase trong 1 read endpoint. FE phân biệt trạng thái này với
     * lỗi thật (network/500) qua try/catch như bình thường, không cần
     * thêm 1 field boolean riêng.
     */
    findAllBySeason(seasonId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: PhaseFormat;
            status: PhaseStatus;
            teams_per_group: number | null;
            season_id: number;
        };
        groups: {
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
            name: string;
            season_teams: {
                id: number;
                team_id: number;
            }[];
        }[];
    } | {
        phase: null;
        groups: never[];
    }>;
    /**
     * NEW: list group theo phase_id trực tiếp — dùng khi FE đã biết
     * phaseId cụ thể (route GET /groups/phase/{phaseId}). Tách biệt khỏi
     * findAllBySeason vì khác semantic: cái này KHÔNG filter theo
     * season_id/format, chỉ cần đúng phase tồn tại và active. Cần thiết
     * cho trường hợp 1 season có nhiều phase (vd multi-stage: nhiều
     * round_robin phase, hoặc phase group_stage không phải round_robin)
     * — trước đây route này gọi nhầm findAllBySeason(phaseId), coi
     * phaseId như seasonId, sẽ trả sai/rỗng data khi 2 giá trị lệch nhau.
     */
    findAllByPhase(phaseId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: PhaseFormat;
            status: PhaseStatus;
            teams_per_group: number | null;
            season_id: number;
        };
        groups: {
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
            name: string;
            season_teams: {
                id: number;
                team_id: number;
            }[];
        }[];
    } | {
        phase: null;
        groups: never[];
    }>;
    private buildGroupsPayload;
    deactivateGroup(groupId: number): Promise<void>;
    drawGroups(seasonId: number, opts: DrawGroupsOptions): Promise<DrawAssignment[]>;
    clearDraw(seasonId: number): Promise<void>;
    assignTeamToGroup(seasonTeamId: number, groupId: number): Promise<void>;
    swapTeams(seasonTeamIdA: number, seasonTeamIdB: number): Promise<void>;
    drawGroupsSeeded(seasonId: number, opts: DrawGroupsOptions & {
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
    private snakeDistribute;
    private splitIntoPots;
    private applyAssignments;
    private assertNoForeignGroupAssignment;
}
//# sourceMappingURL=group.service.d.ts.map