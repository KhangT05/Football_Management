import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Request, Query } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TournamentRuleDto, type CreateTournamentRuleDto, type UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";

@Route("tournamentrules")
@Tags("TournamentRules")
export class TournamentRuleController extends Controller {
  constructor(private service: TournamentRuleService) {
    super();
  }

  @Get("/")
  async findAll(): Promise<TournamentRuleDto[]> {
    return this.service.findAll();
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<TournamentRuleDto> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @Security("jwt", ["admin", "organizing"])
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: CreateTournamentRuleDto,
    @Request() req: AuthRequest
  ): Promise<TournamentRuleDto> {
    this.setStatus(201);
    return this.service.create(body, req.user.user_id);
  }

  @Patch("{id}")
  @Security("jwt", ["admin", "organizing"])
  async update(
    @Path() id: number,
    @Body() body: UpdateTournamentRuleDto,
    @Query() force?: boolean,
  ): Promise<TournamentRuleDto> {
    return this.service.update(id, body, force ?? false);
  }

  @Delete("{id}")
  @Security("jwt", ["admin", "organizing"])
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }

  @Patch("{id}/restore")
  @Security("jwt", ["admin", "organizing"])
  async restore(@Path() id: number): Promise<TournamentRuleDto> {
    return this.service.restore(id);
  }

  @Get("tournament/{tournamentId}")
  async listByTournament(@Path() tournamentId: number): Promise<TournamentRuleDto[]> {
    return this.service.listByTournament(tournamentId);
  }
}