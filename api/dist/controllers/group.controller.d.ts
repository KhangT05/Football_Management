import { Controller } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
import { GroupWithTeams } from "../types/group.type.js";
export declare class GroupController extends Controller {
    private service;
    constructor(service: GroupService);
    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    findByIdWithTeams(id: number): Promise<GroupWithTeams>;
    /** Admin: random draw toàn bộ approved team vào các group của phase */
    drawGroups(phaseId: number, body: groupType.DrawGroupsOptions): Promise<groupType.DrawAssignment[]>;
    /** Admin: seeded draw theo pot (UEFA-style) */
    drawGroupsSeeded(phaseId: number, body: groupType.DrawGroupsOptions & {
        num_pots: number;
    }): Promise<groupType.DrawAssignment[]>;
    /** Admin: xoá toàn bộ kết quả draw của phase (reset group_id về null) */
    clearDraw(phaseId: number): Promise<void>;
    /** Admin: assign thủ công 1 team vào 1 group */
    assignTeamToGroup(body: groupType.AssignTeamToGroupBody): Promise<void>;
    /** Admin: swap group giữa 2 team trong cùng phase */
    swapTeams(body: groupType.SwapTeamsBody): Promise<void>;
}
//# sourceMappingURL=group.controller.d.ts.map