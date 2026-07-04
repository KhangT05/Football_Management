import { Controller } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
import { GroupWithTeams } from "../types/group.type.js";
export declare class GroupController extends Controller {
    private service;
    constructor(service: GroupService);
    /** Public: list group của season — service tự resolve phase round_robin active, không tự tạo */
    findAllBySeason(seasonId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: import("../generated/prisma/enums.js").PhaseFormat;
            status: import("../generated/prisma/enums.js").PhaseStatus;
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
     * Public: list group theo phase cụ thể — dùng khi FE đã biết phaseId
     * (VD sau khi tạo phase mới, hoặc UI quản lý nhiều phase cùng season).
     * FIX: trước đây gọi nhầm findAllBySeason(phaseId) — sai semantic,
     * vì findAllBySeason filter theo season_id + format + is_active,
     * không phải theo phase_id trực tiếp. Nếu 1 season có >1 active
     * round_robin phase (multi-phase-with-groups), route này sẽ trả sai
     * data. Tách hẳn method riêng trong service.
     */
    findAllByPhase(phaseId: number): Promise<{
        phase: {
            id: number;
            name: string;
            format: import("../generated/prisma/enums.js").PhaseFormat;
            status: import("../generated/prisma/enums.js").PhaseStatus;
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
    /** Admin: tạo 1 group — service tự get-or-create phase round_robin của season */
    createGroup(seasonId: number, body: groupType.CreateGroupBody): Promise<{
        id: number;
        name: string;
        phase_id: number;
    }>;
    /** Admin: tạo N group cùng lúc (Bảng A, B, C...) */
    createGroupsBulk(seasonId: number, body: groupType.CreateGroupsBulkBody): Promise<{
        id: number;
        name: string;
    }[]>;
    /** Admin: random draw toàn bộ approved team vào group của season */
    drawGroups(seasonId: number, body: groupType.DrawGroupsOptions): Promise<groupType.DrawAssignment[]>;
    /** Admin: seeded draw theo pot (UEFA-style) */
    drawGroupsSeeded(seasonId: number, body: groupType.DrawGroupsOptions & {
        num_pots: number;
    }): Promise<groupType.DrawAssignment[]>;
    /** Admin: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    clearDraw(seasonId: number): Promise<void>;
    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    findByIdWithTeams(id: number): Promise<GroupWithTeams>;
    /** Admin: deactivate group (soft-delete, chặn nếu đã có match) */
    deactivateGroup(groupId: number): Promise<void>;
    /** Admin: assign thủ công 1 team vào 1 group */
    assignTeamToGroup(body: groupType.AssignTeamToGroupBody): Promise<void>;
    /** Admin: swap group giữa 2 team trong cùng phase */
    swapTeams(body: groupType.SwapTeamsBody): Promise<void>;
}
//# sourceMappingURL=group.controller.d.ts.map