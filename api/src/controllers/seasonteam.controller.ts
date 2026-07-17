import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
import { SeasonTeam, SeasonTeamStatus } from "../generated/prisma/client.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult } from "../types/queryable.type.js";
@Route("seasonteams")
@Tags("SeasonTeams")
export class SeasonTeamController extends Controller {
  constructor(private service: SeasonTeamService) {
    super();
  }
  /**
   * FIX: thiếu season_id/status/team_id trong signature khiến tsoa strip
   * các query param này trước khi vào service.findAll() — Queryable đọc
   * filter qua req[field] PHẲNG (xem QueryBuilder.applySimpleFilter:
   * `const value = req[field]`), không phải nested req.filters.field.
   * Route handler trước đây chưa bao giờ forward season_id/status vào
   * QueryRequest → mọi call GET /seasonteams?season_id=X&status=approved
   * chạy KHÔNG filter gì, count/list trả về TOÀN BỘ season_teams trong DB
   * across mọi season — sai lệch số liệu "đội đã duyệt" ở FE (GroupDrawUI
   * dùng con số này để validate trước khi cho phép draw).
   *
   * is_active KHÔNG forward ở đây dù nằm trong filterable config, vì
   * SeasonTeamService.beforeBuild đã hardcode `is_active: true` — AND
   * chồng lên bất kỳ giá trị nào applySimpleFilter push vào sẽ tạo where
   * mâu thuẫn (is_active=false từ client AND is_active=true từ beforeBuild
   * -> luôn rỗng, silent, không lỗi). Field này chỉ nên control nội bộ.
   */
  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc",
    @Query() season_id?: number,
    @Query() team_id?: number,
    @Query() status?: SeasonTeamStatus
  ): Promise<PaginatedResult<SeasonTeam>> {
    return this.service.findAll({
      page, per_page, q, sort, direction,
      season_id, team_id, status,
    });
  }
  @Get("{id}")
  async findById(@Path() id: number): Promise<SeasonTeam> {
    return this.service.findByIdOrFail(id);
  }
  /** Team leader tự đăng ký vào season */
  @Security("jwt", ["leader", "user", "player"])
  @Post("/register")
  @SuccessResponse(201, "Created")
  async selfRegister(
    @Body() body: seasonTeamSchema.SelfRegisterSeasonTeamDto,
    @Request() req: AuthRequest
  ): Promise<SeasonTeamWithRelations> {
    this.setStatus(201);
    return this.service.selfRegister(body, req.user.user_id);
  }
  /** Admin add team trực tiếp */
  @Security("jwt", ["organizing"])
  @Post("/")
  @SuccessResponse(201, "Created")
  async adminAdd(
    @Body() body: seasonTeamSchema.AdminAddSeasonTeamDto,
    @Request() req: AuthRequest
  ): Promise<SeasonTeamWithRelations> {
    this.setStatus(201);
    return this.service.adminAdd(body, req.user.user_id);
  }
  /** Duyệt team pending -> approved. Ban tổ chức hoặc admin. */
  @Security("jwt", ["organizing"])
  @Patch("{id}/approve")
  async approve(@Path() id: number, @Request() req: AuthRequest): Promise<SeasonTeamWithRelations> {
    return this.service.approve(id, req.user.user_id);
  }
  /** Chuyển team sang season khác. Ban tổ chức hoặc admin. */
  @Security("jwt", ["organizing"])
  @Patch("{id}/transfer")
  async transferSeason(
    @Path() id: number,
    @Body() body: seasonTeamSchema.TransferSeasonTeamDto,
    @Request() req: AuthRequest
  ): Promise<SeasonTeamWithRelations> {
    return this.service.transferSeason(id, body.season_id, req.user.user_id);
  }
  /** Update status generic (eliminated/withdrawn). KHÔNG dùng để approve. */
  @Security("jwt", ["organizing"])
  @Patch("{id}/status")
  async updateStatus(
    @Path() id: number,
    @Body() body: seasonTeamSchema.UpdateSeasonTeamStatusDto
  ): Promise<SeasonTeamWithRelations> {
    return this.service.updateStatus(id, body);
  }
  /** Assign team vào group sau draw */
  @Security("jwt", ["organizing"])
  @Patch("{id}/group")
  async assignGroup(
    @Path() id: number,
    @Body() body: seasonTeamSchema.AssignGroupDto
  ): Promise<SeasonTeamWithRelations> {
    return this.service.assignGroup(id, body);
  }
  @Security("jwt", ["organizing"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
  /** Admin: lấy (hoặc tạo mới nếu chưa có) phase vòng bảng round_robin của season.
 *  Mỗi season chỉ có đúng 1 phase loại này — không cần chọn, chỉ cần gọi là có. */
  @Security("jwt", ["organizing"])
  @Post("season/{seasonId}/group-phase")
  async getOrCreateGroupPhase(@Path() seasonId: number) {
    return this.service.getOrCreateGroupPhase(seasonId);
  }
  /**
 * List teams đã đăng ký của 1 season kèm team info (name/logo) + group_id.
 * Dùng cho FE GroupDrawUI hiển thị danh sách trước khi draw, và bất kỳ màn
 * hình public nào cần xem "season X có những team nào, đã vào group chưa".
 *
 * Public — không cần auth, giống các GET season/standings khác.
 * default statuses = ['approved'] nếu không truyền (khớp default của service).
 */
  @Get("season/{seasonId}/teams")
  async listBySeasonWithTeamInfo(
    @Path() seasonId: number,
    @Query() status?: SeasonTeamStatus[],
  ) {
    return this.service.listBySeasonWithTeamInfo(seasonId, status);
  }
  @Get("/season-teams/registration-eligibility")
  async getTeamRegistrationEligibility(
    @Query("team_id") teamId: number,
  ) {
    return this.service.getTeamRegistrationEligibility(teamId);
  }
}