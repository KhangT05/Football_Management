import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TournamentService } from "../services/tournament.service.js";
import type { Tournament } from "../generated/prisma/client.js";
import { type CreateTournamentDto, type UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PaginatedResult } from "../libs/queryable.js";

@Security("jwt")
@Route("tournaments")
@Tags("Tournaments")
export class TournamentController extends Controller {
  constructor(private service: TournamentService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Tournament>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Tournament> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: CreateTournamentDto,
    @Request() req: AuthRequest
  ): Promise<Tournament> {
    this.setStatus(201);
    console.log(req.user.user_id);
    return this.service.create(body, req.user.user_id);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateTournamentDto
  ): Promise<Tournament> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
