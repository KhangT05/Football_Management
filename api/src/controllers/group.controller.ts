import { Controller, Get, Path, Tags, Route, Post, Delete, Body, Security, Put, Query } from "tsoa";
import { GroupService } from "../services/group.service.js";
import * as groupType from "../types/group.type.js";

@Route("groups")
@Tags("Groups")
export class GroupController extends Controller {
    constructor(private service: GroupService) {
        super();
    }

    @Get("season/{seasonId}")
    async findAllBySeason(@Path() seasonId: number) {
        return this.service.findAllBySeason(seasonId);
    }

    @Get("phase/{phaseId}")
    async findAllByPhase(@Path() phaseId: number) {
        return this.service.findAllByPhase(phaseId);
    }

    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}")
    async createGroup(
        @Path() seasonId: number,
        @Body() body: groupType.CreateGroupBody
    ): Promise<{ id: number; name: string; phase_id: number }> {
        this.setStatus(201);
        return this.service.createGroup(seasonId, body.name);
    }

    /** organizing: tạo N group cùng lúc (Bảng A, B, C...) */
    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}/bulk")
    async createGroupsBulk(
        @Path() seasonId: number,
        @Body() body: groupType.CreateGroupsBulkBody
    ): Promise<{ id: number; name: string }[]> {
        this.setStatus(201);
        return this.service.createGroupsBulk(seasonId, body.count);
    }

    /** organizing: random draw toàn bộ approved team vào group của season */
    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}/draw")
    async drawGroups(
        @Path() seasonId: number,
        @Body() body: groupType.DrawGroupsOptions
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroups(seasonId, body);
    }

    /** organizing: seeded draw theo pot (UEFA-style) */
    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}/draw/seeded")
    async drawGroupsSeeded(
        @Path() seasonId: number,
        @Body() body: groupType.DrawGroupsOptions & { num_pots: number }
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroupsSeeded(seasonId, body);
    }

    /** organizing: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    @Security("jwt", ["organizing"])
    @Delete("season/{seasonId}/draw")
    async clearDraw(@Path() seasonId: number): Promise<void> {
        this.setStatus(204);
        return this.service.clearDraw(seasonId);
    }

    /**
     * NEW: organizing có thể chủ động gọi finalize thay vì chờ tự động chạy lúc
     * updateStatus('ongoing') — hữu ích khi muốn xem trước kết quả re-draw
     * hoặc cần chạy lại finalize nhiều lần trong lúc season vẫn còn
     * 'registration_open' (VD: đóng đăng ký sớm bằng tay dù chưa qua
     * deadline, muốn chốt group ngay mà chưa muốn đổi season status).
     * minTeamsPerGroup/maxTeamsPerGroup optional, để FE tuỳ biến theo giải.
     */
    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}/finalize")
    async autoFinalizeGroups(
        @Path() seasonId: number,
        @Body() body: groupType.AutoFinalizeGroupsBody
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.autoFinalizeGroups(seasonId, {
            minTeamsPerGroup: body?.min_teams_per_group,
            maxTeamsPerGroup: body?.max_teams_per_group,
        });
    }

    @Get("{id}")
    async findByIdWithTeams(@Path() id: number): Promise<groupType.GroupWithTeams> {
        return this.service.findByIdWithTeams(id) as Promise<groupType.GroupWithTeams>;
    }

    /** organizing: deactivate group (soft-delete, chặn nếu đã có match) */
    @Security("jwt", ["organizing"])
    @Delete("{groupId}")
    async deactivateGroup(@Path() groupId: number): Promise<void> {
        this.setStatus(204);
        return this.service.deactivateGroup(groupId);
    }

    /** organizing: assign thủ công 1 team vào 1 group */
    @Security("jwt", ["organizing"])
    @Put("assign")
    async assignTeamToGroup(@Body() body: groupType.AssignTeamToGroupBody): Promise<void> {
        this.setStatus(204);
        return this.service.assignTeamToGroup(body.season_team_id, body.group_id);
    }

    /** organizing: swap group giữa 2 team trong cùng phase */
    @Security("jwt", ["organizing"])
    @Put("swap")
    async swapTeams(@Body() body: groupType.SwapTeamsBody): Promise<void> {
        this.setStatus(204);
        return this.service.swapTeams(body.season_team_id_a, body.season_team_id_b);
    }

    /** Public: preview snake-draft distribution + warning trước khi confirm tạo group */
    @Get("season/{seasonId}/preview")
    async previewGroupSplit(
        @Path() seasonId: number,
        @Query() groupCount: number
    ): Promise<groupType.GroupSplitPreview> {
        return this.service.previewGroupSplitBySeason(seasonId, groupCount);
    }

    /** organizing: tạo N group rỗng + draw approved team ngay trong 1 bước */
    @Security("jwt", ["organizing"])
    @Post("season/{seasonId}/create-and-draw")
    async createAndDrawGroups(
        @Path() seasonId: number,
        @Body() body: groupType.CreateAndDrawGroupsBody
    ): Promise<groupType.DrawAssignment[]> {
        this.setStatus(201);
        return this.service.createAndDrawGroups(seasonId, body.group_count);
    }

    /** organizing: advance top-N mỗi group của phase (đã locked) sang round_robin tiếp theo cùng season */
    @Security("jwt", ["organizing"])
    @Post("phase/{fromPhaseId}/advance")
    async advanceToNextRoundRobin(
        @Path() fromPhaseId: number,
        @Body() body: groupType.AdvanceRoundRobinBody
    ): Promise<groupType.AdvanceRoundRobinResult> {
        this.setStatus(201);
        return this.service.advanceToNextRoundRobin(fromPhaseId, body.new_group_count);
    }
}