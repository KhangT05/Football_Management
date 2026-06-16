import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TournamentRuleDto, type CreateTournamentRuleDto, type UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";

@Security("jwt")
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
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: CreateTournamentRuleDto,
    @Request() req: AuthRequest
  ): Promise<CreateTournamentRuleDto> {
    this.setStatus(201);
    return this.service.create(body, req.user.user_id);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateTournamentRuleDto
  ): Promise<UpdateTournamentRuleDto> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
