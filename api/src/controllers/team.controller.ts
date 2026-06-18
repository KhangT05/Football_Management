import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TeamService } from "../services/team.service.js";
import type { Team } from "../generated/prisma/client.js";
import { type CreateTeamDto, type UpdateTeamDto } from "../dtos/team.schema.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";

@Security("jwt")
@Route("teams")
@Tags("Teams")
export class TeamController extends Controller {
  constructor(private service: TeamService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Team>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Team> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: CreateTeamDto,
    @Request() req: AuthRequest
  ): Promise<Team> {
    this.setStatus(201);
    return this.service.create(body, req.user.user_id);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateTeamDto
  ): Promise<Team> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
