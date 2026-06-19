import { Controller, Get, Path, Tags, Route, Post, Delete, Body, Security } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
import type { Group } from "../generated/prisma/client.js";

type GroupWithTeams = Group & {
    phase: { id: number; name: string; season_id: number; format: string; is_active: boolean };
    seasonTeams: {
        id: number;
        status: string;
        team: { id: number; name: string; logo: string | null };
    }[];
};

@Security("jwt", ["admin"])
@Route("groups")
@Tags("Groups")
export class GroupController extends Controller {
    constructor(private service: GroupService) {
        super();
    }

    /** Xem group + list team approved đang thuộc group (kèm phase info) */
    @Get("{id}")
    async findByIdWithTeams(@Path() id: number): Promise<GroupWithTeams> {
        return this.service.findByIdWithTeams(id) as Promise<GroupWithTeams>;
    }

    @Post("{phaseId}/draw")
    async drawGroups(
        @Path() phaseId: number,
        @Body() body: groupType.DrawGroupsOptions
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroups(phaseId, body);
    }

    @Delete("{phaseId}/draw")
    async clearDraw(@Path() phaseId: number): Promise<void> {
        this.setStatus(204);
        return this.service.clearDraw(phaseId);
    }
}