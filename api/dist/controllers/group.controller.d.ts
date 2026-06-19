import { Controller } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
import type { Group } from "../generated/prisma/client.js";
type GroupWithTeams = Group & {
    phase: {
        id: number;
        name: string;
        season_id: number;
        format: string;
        is_active: boolean;
    };
    seasonTeams: {
        id: number;
        status: string;
        team: {
            id: number;
            name: string;
            logo: string | null;
        };
    }[];
};
export declare class GroupController extends Controller {
    private service;
    constructor(service: GroupService);
    /** Xem group + list team approved đang thuộc group (kèm phase info) */
    findByIdWithTeams(id: number): Promise<GroupWithTeams>;
    drawGroups(phaseId: number, body: groupType.DrawGroupsOptions): Promise<groupType.DrawAssignment[]>;
    clearDraw(phaseId: number): Promise<void>;
}
export {};
//# sourceMappingURL=group.controller.d.ts.map