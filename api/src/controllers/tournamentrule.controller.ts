import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Request, Query } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import * as tournamentRuleSchema from "../dtos/tournamentRule.schema.js";
import { createAppError } from "../common/app.error.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";

@Route("tournamentrules")
@Tags("TournamentRules")
export class TournamentRuleController extends Controller {
  constructor(private service: TournamentRuleService) {
    super();
  }

  @Get("/")
  async findAll(): Promise<tournamentRuleSchema.TournamentRuleDto[]> {
    return this.service.findAll();
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<tournamentRuleSchema.TournamentRuleDto> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @Security("jwt", ["admin", "organizing"])
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: tournamentRuleSchema.CreateTournamentRuleRequest,
    @Request() req: AuthRequest
  ): Promise<tournamentRuleSchema.TournamentRuleDto> {
    const parsed = tournamentRuleSchema.createTournamentRuleSchema.safeParse(body);
    if (!parsed.success) {
      throw createAppError("VALIDATION_ERROR", parsed.error.issues.map(i => i.message).join("; "));
    }
    this.setStatus(201);
    return this.service.create(parsed.data, req.user.user_id);
  }

  @Patch("{id}")
  @Security("jwt", ["admin", "organizing"])
  async update(
    @Path() id: number,
    @Body() body: tournamentRuleSchema.UpdateTournamentRuleRequest,
    @Query() force?: boolean,
  ): Promise<tournamentRuleSchema.TournamentRuleDto> {
    const parsed = tournamentRuleSchema.updateTournamentRuleSchema.safeParse(body);
    if (!parsed.success) {
      throw createAppError("VALIDATION_ERROR", parsed.error.issues.map(i => i.message).join("; "));
    }
    return this.service.update(id, parsed.data, force ?? false);
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
  async restore(@Path() id: number): Promise<tournamentRuleSchema.TournamentRuleDto> {
    return this.service.restore(id);
  }

  @Get("tournament/{tournamentId}")
  async listByTournament(@Path() tournamentId: number): Promise<tournamentRuleSchema.TournamentRuleDto[]> {
    return this.service.listByTournament(tournamentId);
  }
}