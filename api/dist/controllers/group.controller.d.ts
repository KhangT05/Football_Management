import { Controller } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
export declare class GroupController extends Controller {
    private service;
    constructor(service: GroupService);
    findAllBySeason(seasonId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: import("../generated/prisma/enums.js").PhaseFormat;
            status: import("../generated/prisma/enums.js").PhaseStatus;
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
            format: import("../generated/prisma/enums.js").PhaseFormat;
            status: import("../generated/prisma/enums.js").PhaseStatus;
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
    createGroup(seasonId: number, body: groupType.CreateGroupBody): Promise<{
        id: number;
        name: string;
        phase_id: number;
    }>;
    /** organizing: tạo N group cùng lúc (Bảng A, B, C...) */
    createGroupsBulk(seasonId: number, body: groupType.CreateGroupsBulkBody): Promise<{
        id: number;
        name: string;
    }[]>;
    /** organizing: random draw toàn bộ approved team vào group của season */
    drawGroups(seasonId: number, body: groupType.DrawGroupsOptions): Promise<groupType.DrawAssignment[]>;
    /** organizing: seeded draw theo pot (UEFA-style) */
    drawGroupsSeeded(seasonId: number, body: groupType.DrawGroupsOptions & {
        num_pots: number;
    }): Promise<groupType.DrawAssignment[]>;
    /** organizing: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    clearDraw(seasonId: number): Promise<void>;
    /**
     * NEW: organizing có thể chủ động gọi finalize thay vì chờ tự động chạy lúc
     * updateStatus('ongoing') — hữu ích khi muốn xem trước kết quả re-draw
     * hoặc cần chạy lại finalize nhiều lần trong lúc season vẫn còn
     * 'registration_open' (VD: đóng đăng ký sớm bằng tay dù chưa qua
     * deadline, muốn chốt group ngay mà chưa muốn đổi season status).
     * minTeamsPerGroup/maxTeamsPerGroup optional, để FE tuỳ biến theo giải.
     */
    autoFinalizeGroups(seasonId: number, body: groupType.AutoFinalizeGroupsBody): Promise<groupType.DrawAssignment[]>;
    findByIdWithTeams(id: number): Promise<groupType.GroupWithTeams>;
    /** organizing: deactivate group (soft-delete, chặn nếu đã có match) */
    deactivateGroup(groupId: number): Promise<void>;
    /** organizing: assign thủ công 1 team vào 1 group */
    assignTeamToGroup(body: groupType.AssignTeamToGroupBody): Promise<void>;
    /** organizing: swap group giữa 2 team trong cùng phase */
    swapTeams(body: groupType.SwapTeamsBody): Promise<void>;
    /** Public: preview snake-draft distribution + warning trước khi confirm tạo group */
    previewGroupSplit(seasonId: number, groupCount: number): Promise<groupType.GroupSplitPreview>;
    /** organizing: tạo N group rỗng + draw approved team ngay trong 1 bước */
    createAndDrawGroups(seasonId: number, body: groupType.CreateAndDrawGroupsBody): Promise<groupType.DrawAssignment[]>;
    /** organizing: advance top-N mỗi group của phase (đã locked) sang round_robin tiếp theo cùng season */
    advanceToNextRoundRobin(fromPhaseId: number, body: groupType.AdvanceRoundRobinBody): Promise<groupType.AdvanceRoundRobinResult>;
}
//# sourceMappingURL=group.controller.d.ts.map