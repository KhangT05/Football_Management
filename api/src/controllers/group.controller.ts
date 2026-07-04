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

    // ---- literal-prefixed routes trước, tránh nhầm lẫn với {id} single-segment ----

    /** Public: list group của season — service tự resolve phase round_robin active, không tự tạo */
    @Get("season/{seasonId}")
    async findAllBySeason(@Path() seasonId: number) {
        return this.service.findAllBySeason(seasonId);
    }

    /**
     * Public: list group theo phase cụ thể — dùng khi FE đã biết phaseId
     * (VD sau khi tạo phase mới, hoặc UI quản lý nhiều phase cùng season).
     * FIX: trước đây gọi nhầm findAllBySeason(phaseId) — sai semantic,
     * vì findAllBySeason filter theo season_id + format + is_active,
     * không phải theo phase_id trực tiếp. Nếu 1 season có >1 active
     * round_robin phase (multi-phase-with-groups), route này sẽ trả sai
     * data. Tách hẳn method riêng trong service.
     */
    @Get("phase/{phaseId}")
    async findAllByPhase(@Path() phaseId: number) {
        return this.service.findAllByPhase(phaseId);
    }

    // ---- admin creation/draw ops: scope theo seasonId, service tự get-or-create phase ----

    /** Admin: tạo 1 group — service tự get-or-create phase round_robin của season */
    @Security("jwt", ["admin"])
    @Post("season/{seasonId}")
    async createGroup(
        @Path() seasonId: number,
        @Body() body: groupType.CreateGroupBody
    ): Promise<{ id: number; name: string; phase_id: number }> {
        this.setStatus(201);
        return this.service.createGroup(seasonId, body.name);
    }

    /** Admin: tạo N group cùng lúc (Bảng A, B, C...) */
    @Security("jwt", ["admin"])
    @Post("season/{seasonId}/bulk")
    async createGroupsBulk(
        @Path() seasonId: number,
        @Body() body: groupType.CreateGroupsBulkBody
    ): Promise<{ id: number; name: string }[]> {
        this.setStatus(201);
        return this.service.createGroupsBulk(seasonId, body.count);
    }

    /** Admin: random draw toàn bộ approved team vào group của season */
    @Security("jwt", ["admin"])
    @Post("season/{seasonId}/draw")
    async drawGroups(
        @Path() seasonId: number,
        @Body() body: groupType.DrawGroupsOptions
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroups(seasonId, body);
    }

    /** Admin: seeded draw theo pot (UEFA-style) */
    @Security("jwt", ["admin"])
    @Post("season/{seasonId}/draw/seeded")
    async drawGroupsSeeded(
        @Path() seasonId: number,
        @Body() body: groupType.DrawGroupsOptions & { num_pots: number }
    ): Promise<groupType.DrawAssignment[]> {
        return this.service.drawGroupsSeeded(seasonId, body);
    }

    /** Admin: xoá toàn bộ kết quả draw của season (reset group_id về null) */
    @Security("jwt", ["admin"])
    @Delete("season/{seasonId}/draw")
    async clearDraw(@Path() seasonId: number): Promise<void> {
        this.setStatus(204);
        return this.service.clearDraw(seasonId);
    }

    // ---- group/team-scoped (single-segment {id} — luôn khai báo SAU các route literal-prefixed ở trên) ----

    /** Public: xem group + list team approved đang thuộc group (kèm phase info) */
    @Get("{id}")
    async findByIdWithTeams(@Path() id: number): Promise<GroupWithTeams> {
        return this.service.findByIdWithTeams(id) as Promise<GroupWithTeams>;
    }

    /** Admin: deactivate group (soft-delete, chặn nếu đã có match) */
    @Security("jwt", ["admin"])
    @Delete("{groupId}")
    async deactivateGroup(@Path() groupId: number): Promise<void> {
        this.setStatus(204);
        return this.service.deactivateGroup(groupId);
    }

    /** Admin: assign thủ công 1 team vào 1 group */
    @Security("jwt", ["admin"])
    @Put("assign")
    async assignTeamToGroup(@Body() body: groupType.AssignTeamToGroupBody): Promise<void> {
        this.setStatus(204);
        return this.service.assignTeamToGroup(body.season_team_id, body.group_id);
    }

    /** Admin: swap group giữa 2 team trong cùng phase */
    @Security("jwt", ["admin"])
    @Put("swap")
    async swapTeams(@Body() body: groupType.SwapTeamsBody): Promise<void> {
        this.setStatus(204);
        return this.service.swapTeams(body.season_team_id_a, body.season_team_id_b);
    }
}