import {
  Controller, Get, Path, Tags, Route, Post, Patch, Body,
  SuccessResponse, Delete, Query, Security, Request,
  UploadedFile, Consumes
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
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery } from "../types/player.type.js";

const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;

@Route("players")
@Tags("Players")
export class PlayerController extends Controller {
  constructor(private readonly service: PlayerService) {
    super();
  }

  // FIX: thiếu @Security hoàn toàn — leak PII (email) không cần auth.
  @Security("jwt", ["admin", "organizing"])
  @Get("{team_id}/team-players/export")
  async exportTeamPlayers(@Path() team_id: number): Promise<void> {
    const buffer = await this.service.exportTeamPlayersExcel(team_id);
    const res = (this as any).res as ExRequest["res"];
    res!.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res!.setHeader("Content-Disposition", `attachment; filename="team-${team_id}-players.xlsx"`);
    res!.send(buffer);
  }

  // Không có PII, chỉ template rỗng — giữ public để leader tải mà không cần login trước.
  @Get("import-template")
  async downloadImportTemplate(@Query() minRows = 7): Promise<void> {
    const buffer = await this.service.exportImportTemplate(minRows); // FIX: thiếu await
    const res = (this as any).res as ExRequest["res"];
    res!.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res!.setHeader("Content-Disposition", 'attachment; filename="import-template.xlsx"');
    res!.send(buffer);
  }

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

  @Get("{id}")
  async findById(@Path() id: number): Promise<PlayerDto> {
    return this.service.getPlayerByIdOrFail(id);
  }

  @Security("jwt", ["admin", "organizing"])
  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreatePlayerDto): Promise<PlayerDto> {
    this.setStatus(201);
    return this.service.createPlayer(body);
  }

  @Security("jwt", ["admin", "organizing"])
  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdatePlayerDto
  ): Promise<PlayerDto> {
    return this.service.updatePlayer(id, body);
  }

  @Security("jwt", ["admin", "organizing"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDeletePlayer(id);
  }

  // FIX: bỏ user_id — chưa từng được dùng trong body, AuthRequest param là dead
  // param. Nếu cần audit "ai thêm player này", thêm cột created_by ở service,
  // không giữ param không dùng ở controller.
  @Security("jwt", ["admin", "organizing"])
  @Post("{team_id}/team-players")
  @SuccessResponse(201, "Created")
  async addPlayerToTeam(
    @Path() team_id: number,
    @Body() body: AddPlayerToTeamDto
  ): Promise<TeamPlayerDto> {
    this.setStatus(201);
    return this.service.addPlayerToTeam(team_id, body);
  }

  // FIX: bỏ pre-check getTeamPlayerById ở controller — TOCTOU + fragile
  // (an toàn phụ thuộc discipline của caller, không phải data layer).
  // service.updateTeamPlayer giờ tự scope theo team_id và tự 404.
  @Security("jwt", ["organizing"])
  @Patch("{team_id}/team-players/{id}")
  async updateTeamPlayer(
    @Path() team_id: number,
    @Path() id: number,
    @Body() body: UpdateTeamPlayerDto
  ): Promise<TeamPlayerDto> {
    return this.service.updateTeamPlayer(id, team_id, body);
  }

  @Security("jwt", ["admin", "organizing"])
  @Post("{team_id}/team-players/{id}/approve")
  async approveTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    return this.service.approveTeamPlayer(id, team_id);
  }

  @Security("jwt", ["organizing"])
  @Post("{team_id}/team-players/{id}/reject")
  async rejectTeamPlayer(
    @Path() team_id: number,
    @Path() id: number
  ): Promise<TeamPlayerDto> {
    return this.service.rejectTeamPlayer(id, team_id);
  }

  @Security("jwt", ["admin", "organizing"])
  @Delete("{team_id}/team-players")
  async bulkDeleteTeamPlayers(
    @Path() team_id: number,
    @Body() body: BulkDeleteDto
  ): Promise<{ deleted: number; notFound: number[] }> {
    return this.service.bulkDeleteTeamPlayers(team_id, body);
  }

  // FIX: thiếu @Security hoàn toàn — bất kỳ ai cũng bulk-tạo Player/TeamPlayer
  // + gán role vào bất kỳ team_id nào không cần auth. Đây là lỗ hổng nghiêm
  // trọng nhất trong file, không phải cosmetic.
  @Security("jwt", ["admin", "organizing"])
  @Post("{team_id}/team-players/import")
  @Consumes("multipart/form-data")
  async importTeamPlayers(
    @Path() team_id: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImportResult> {
    if (!file || file.size === 0) {
      this.setStatus(400);
      throw Object.assign(new Error("File is required"), { status: 400 });
    }
    if (file.size > MAX_IMPORT_FILE_BYTES) {
      this.setStatus(413);
      throw Object.assign(new Error(`File too large (max ${MAX_IMPORT_FILE_BYTES / 1024 / 1024}MB)`), { status: 413 });
    }
    return this.service.importTeamPlayersFromExcel(team_id, file.buffer);
  }
}