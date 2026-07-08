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
     *
     * FIX (bug mới, xuất hiện từ khi có RR->RR): trước đây filter chỉ có
     * is_active:true — đúng khi season CHỈ CÓ 1 round_robin phase suốt đời.
     * Từ khi advanceToNextRoundRobin() tạo phase round_robin THỨ 2 cùng
     * season (phase cũ locked vẫn giữ is_active:true để giữ lịch sử/audit),
     * findFirst({is_active:true}) không orderBy sẽ trả về BẤT KỲ phase nào
     * trong 2 phase — có thể là phase cũ đã locked. Thêm status:{not:locked}
     * + orderBy order desc để luôn lấy đúng phase "đang mở" mới nhất.
     */
    private getOrCreateRoundRobinPhase;
    /**
     * Dùng cho read/draw/clear — KHÔNG tự tạo phase. Auto-create trong 1
     * GET hoặc trong draw/clear là side-effect ẩn (gọi drawGroups trên
     * season chưa từng tạo group sẽ tạo ra 1 phase rỗng vô nghĩa trước
     * khi throw "chưa có group"). Rõ ràng hơn: null nghĩa là "chưa có gì",
     * caller tự quyết định thông báo phù hợp.
     *
     * FIX: cùng lý do như getOrCreateRoundRobinPhase — loại phase đã locked,
     * lấy phase round_robin "đang mở" mới nhất theo order.
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
     * NEW: preview thuần túy, không ghi DB — FE gọi mỗi lần user đổi số
     * group trong popup, hiển thị ngay distribution + warning trước khi
     * bấm xác nhận. VD 35 team / 2 group -> [18,17] hiện ngay, không cần
     * trial-and-error qua createGroupsBulk + drawGroups như trước.
     * Dùng lại snake-draft y hệt logic snakeDistribute() bên dưới.
     */
    previewGroupSplit(approvedTeamCount: number, desiredGroupCount: number): {
        groupCount: number;
        distribution: number[];
        warning?: string;
    };
    /**
     * NEW: gộp createGroupsBulk + drawGroups thành 1 transaction — season
     * đã có approved SeasonTeam (qua selfRegister/adminAdd) trước đó, giờ
     * chỉ cần nhập groupCount, team TỰ chia vào group theo snake-draft,
     * không cần bước "tạo group rỗng" rồi "draw" tách rời như 2 API cũ.
     * Đây là entrypoint chính cho flow: tạo season -> team đăng ký/duyệt ->
     * admin nhập số group -> bấm 1 nút -> xong.
     */
    createAndDrawGroups(seasonId: number, groupCount: number): Promise<DrawAssignment[]>;
    /**
     * NEW: advance top-N mỗi group của phase round_robin hiện tại sang
     * phase round_robin TIẾP THEO cùng season (RR -> RR). Đọc
     * phase.teams_advance_per_group (schema mới) để biết advance bao nhiêu
     * team/group — không cần bảng blueprint riêng, chỉ cần Phase cũ đã
     * locked + có cấu hình field này.
     *
     * Sau khi phase mới được tạo, getOrCreateRoundRobinPhase/findRoundRobinPhase
     * (đã fix ở trên) sẽ tự động resolve đúng phase MỚI (status != locked,
     * order lớn nhất) cho mọi thao tác draw/assign/clear tiếp theo — không
     * cần thay đổi gì thêm ở các method đó.
     */
    advanceToNextRoundRobin(fromPhaseId: number, newGroupCount: number): Promise<{
        newPhaseId: number;
        assignments: DrawAssignment[];
    }>;
    /**
     * FIX (breaking change so với bản phaseId cũ): giờ nhận seasonId, trả
     * { phase: null, groups: [] } nếu season chưa từng tạo group/phase —
     * đây là trạng thái HỢP LỆ ("chưa bắt đầu"), không phải lỗi và không
     * tự tạo phase trong 1 read endpoint. FE phân biệt trạng thái này với
     * lỗi thật (network/500) qua try/catch như bình thường, không cần
     * thêm 1 field boolean riêng.
     *
     * Lưu ý: sau khi season đã advance qua RR thứ 2, method này trả về
     * phase MỚI NHẤT đang mở (nhờ fix findRoundRobinPhase ở trên) — nếu
     * FE cần xem cả phase round_robin CŨ (đã locked) để hiện lịch sử/kết
     * quả vòng trước, dùng findAllByPhase(phaseId) với id cụ thể thay vì
     * findAllBySeason (method này chỉ trả phase "đang mở" theo season).
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
            name: string;
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
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
            name: string;
            id: number;
            status: import("../generated/prisma/enums.js").GroupStatus;
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
}
//# sourceMappingURL=group.service.d.ts.map