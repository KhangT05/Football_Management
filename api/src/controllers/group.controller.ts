import { Controller, Get, Path, Tags, Route, Post, Delete, Body, Security, Put } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";
import { GroupWithTeams } from "../types/group.type.js";

@Route("groups")
@Tags("Groups")
export class GroupController extends Controller {
    constructor(private service: GroupService) {
        super();
    }

    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    @Get("{id}")
    async findByIdWithTeams(@Path() id: number): Promise<GroupWithTeams> {
        return this.service.findByIdWithTeams(id) as Promise<GroupWithTeams>;
    }

    /** Admin: random draw toàn bộ approved team vào các group của phase */
    @Security("jwt", ["admin"])
    @Post("{phaseId}/draw")
    async drawGroups(
        @Path() phaseId: number,
        @Body() body: groupType.DrawGroupsOptions
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroups(phaseId, body);
    }

    /** Admin: seeded draw theo pot (UEFA-style) */
    @Security("jwt", ["admin"])
    @Post("{phaseId}/draw/seeded")
    async drawGroupsSeeded(
        @Path() phaseId: number,
        @Body() body: groupType.DrawGroupsOptions & { num_pots: number }
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroupsSeeded(phaseId, body);
    }

    /** Admin: xoá toàn bộ kết quả draw của phase (reset group_id về null) */
    @Security("jwt", ["admin"])
    @Delete("{phaseId}/draw")
    async clearDraw(@Path() phaseId: number): Promise<void> {
        this.setStatus(204);
        return this.service.clearDraw(phaseId);
    }

    /** Admin: assign thủ công 1 team vào 1 group */
    @Security("jwt", ["admin"])
    @Put("assign")
    async assignTeamToGroup(
        @Body() body: groupType.AssignTeamToGroupBody
    ): Promise<void> {
        this.setStatus(204);
        return this.service.assignTeamToGroup(body.season_team_id, body.group_id);
    }

    /** Admin: swap group giữa 2 team trong cùng phase */
    @Security("jwt", ["admin"])
    @Put("swap")
    async swapTeams(
        @Body() body: groupType.SwapTeamsBody
    ): Promise<void> {
        this.setStatus(204);
        return this.service.swapTeams(body.season_team_id_a, body.season_team_id_b);
    }
}