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
  ): Promise<CreateTournamentRuleDto> {
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
    // FIX: return type UpdateTournamentRuleDto → TournamentRuleDto (service.update
    // trả full object + relations, sai response schema cũ gây lệch OpenAPI codegen).
    // Expose `force` — service đã có escape hatch bypass retroactive-guard nhưng
    // controller không truyền được, endpoint luôn throw CONFLICT không path nào
    // recover. Cân nhắc siết force=true riêng về ["admin"] nếu không muốn
    // organizing tự bypass integrity guard cho field retroactive.
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
}