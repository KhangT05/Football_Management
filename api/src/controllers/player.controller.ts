import {
  Controller, Get, Path, Tags, Route, Post, Patch, Body,
  SuccessResponse, Delete, Query, Security, Request
} from "tsoa";
import type { Request as ExRequest } from "express";

type AuthRequest = ExRequest & { user: { user_id: number } };

import { PlayerService } from "../services/player.service.js";
import {
  type CreatePlayerDto,
  type UpdatePlayerDto,
  type PlayerDto,
  type TeamPlayerDto,
  type AddPlayerToTeamDto,
  type UpdateTeamPlayerDto,
  type BulkDeleteDto,
} from "../dtos/player.schema.js";
import { PaginatedResult } from "../libs/queryable.js";
import type { ImportResult, ListTeamPlayersQuery } from "../services/player.service.js";

@Security("jwt", ["admin", "user", "organizing", "guest"])
@Route("players")
@Tags("Players")
export class PlayerController extends Controller {
  constructor(private readonly service: PlayerService) {
    super();
  }

  // ─── Player CRUD ──────────────────────────────────────────────────────────

  @Get("{id}")
  async findById(@Path() id: number): Promise<PlayerDto> {
    return this.service.getPlayerByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreatePlayerDto): Promise<PlayerDto> {
    this.setStatus(201);
    return this.service.createPlayer(body);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdatePlayerDto
  ): Promise<PlayerDto> {
    return this.service.updatePlayer(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDeletePlayer(id);
  }

  // ─── Team Players ─────────────────────────────────────────────────────────

  @Get("{team_id}/team-players")
  async listTeamPlayers(
    @Path() team_id: number,
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc",
    @Query() position?: string,
    @Query() status?: string,
    @Query() approval_status?: string
  ): Promise<PaginatedResult<TeamPlayerDto>> {
    return this.service.listTeamPlayers({
      team_id,
      page,
      per_page,
      sort,
      direction,
      ...(position && { position }),
      ...(status && { status }),
      ...(approval_status && { approval_status }),
    } as ListTeamPlayersQuery);
  }

  @Get("{team_id}/team-players/{id}")
  async getTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    const tp = await this.service.getTeamPlayerById(id, team_id);
    if (!tp) {
      this.setStatus(404);
      throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
    }
    return tp;
  }

  @Post("{team_id}/team-players")
  @SuccessResponse(201, "Created")
  async addPlayerToTeam(
    @Path() team_id: number,
    @Body() body: AddPlayerToTeamDto,
    @Request() req: AuthRequest
  ): Promise<TeamPlayerDto> {
    this.setStatus(201);
    return this.service.addPlayerToTeam(team_id, body, req.user.user_id);
  }

  @Patch("{team_id}/team-players/{id}")
  async updateTeamPlayer(
    @Path() team_id: number,
    @Path() id: number,
    @Body() body: UpdateTeamPlayerDto
  ): Promise<TeamPlayerDto> {
    // team_id validate qua getTeamPlayerById trước để tránh update nhầm team
    const exists = await this.service.getTeamPlayerById(id, team_id);
    if (!exists) {
      this.setStatus(404);
      throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
    }
    return this.service.updateTeamPlayer(id, body);
  }

  @Post("{team_id}/team-players/{id}/approve")
  async approveTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    const exists = await this.service.getTeamPlayerById(id, team_id);
    if (!exists) {
      this.setStatus(404);
      throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
    }
    return this.service.approveTeamPlayer(id);
  }

  @Post("{team_id}/team-players/{id}/reject")
  async rejectTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    const exists = await this.service.getTeamPlayerById(id, team_id);
    if (!exists) {
      this.setStatus(404);
      throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
    }
    return this.service.rejectTeamPlayer(id);
  }

  @Delete("{team_id}/team-players")
  async bulkDeleteTeamPlayers(
    @Path() team_id: number,
    @Body() body: BulkDeleteDto
  ): Promise<{ deleted: number; notFound: number[] }> {
    return this.service.bulkDeleteTeamPlayers(team_id, body);
  }

  // ─── Excel ────────────────────────────────────────────────────────────────

  @Get("{team_id}/team-players/export")
  async exportTeamPlayers(@Path() team_id: number): Promise<void> {
    const buffer = await this.service.exportTeamPlayersExcel(team_id);
    const res = (this as any).res as ExRequest["res"];
    res!.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res!.setHeader("Content-Disposition", `attachment; filename="team-${team_id}-players.xlsx"`);
    res!.send(buffer);
  }

  @Get("import-template")
  async downloadImportTemplate(): Promise<void> {
    const buffer = this.service.exportImportTemplate();
    const res = (this as any).res as ExRequest["res"];
    res!.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res!.setHeader("Content-Disposition", 'attachment; filename="import-template.xlsx"');
    res!.send(buffer);
  }
}