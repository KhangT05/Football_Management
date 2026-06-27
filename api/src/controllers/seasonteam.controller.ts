import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
import { SeasonTeam } from "../generated/prisma/client.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult } from "../types/queryable.type.js";

@Security("jwt", ["admin", "user", "organizing", "guest"])
@Route("seasonteams")
@Tags("SeasonTeams")
export class SeasonTeamController extends Controller {
  constructor(private service: SeasonTeamService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<SeasonTeam>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<SeasonTeam> {
    return this.service.findByIdOrFail(id);
  }

  /** Team leader tự đăng ký vào season */
  @Security("jwt", ["leader"])
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
  @Security("jwt", ["admin"])
  @Post("/")
  @SuccessResponse(201, "Created")
  async adminAdd(
    @Body() body: seasonTeamSchema.AdminAddSeasonTeamDto,
    @Request() req: AuthRequest
  ): Promise<SeasonTeamWithRelations> {
    this.setStatus(201);
    return this.service.adminAdd(body, req.user.user_id);
  }

  @Security("jwt", ["admin"])
  @Patch("{id}/status")
  async updateStatus(
    @Path() id: number,
    @Body() body: seasonTeamSchema.UpdateSeasonTeamStatusDto
  ): Promise<SeasonTeamWithRelations> {
    return this.service.updateStatus(id, body);
  }


  /** Assign team vào group sau draw */
  @Security("jwt", ["admin"])
  @Patch("{id}/group")
  async assignGroup(
    @Path() id: number,
    @Body() body: seasonTeamSchema.AssignGroupDto
  ): Promise<SeasonTeamWithRelations> {
    return this.service.assignGroup(id, body);
  }

  @Security("jwt", ["admin"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
