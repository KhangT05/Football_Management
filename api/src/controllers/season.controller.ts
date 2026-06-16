import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { SeasonService } from "../services/season.service.js";
import type { Season } from "../generated/prisma/client.js";
import * as seasonSchema from "../dtos/season.schema.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";

@Security("jwt")
@Route("seasons")
@Tags("Seasons")
export class SeasonController extends Controller {
  constructor(private service: SeasonService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Season>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Season> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: seasonSchema.CreateSeasonDto,
    @Request() req: AuthRequest
  ): Promise<Season> {
    this.setStatus(201);
    return this.service.create(body, req.user.user_id);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: seasonSchema.UpdateSeasonDto
  ): Promise<Season> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
  @Patch("{id}/status")
  async updateStatus(
    @Path() id: number,
    @Body() body: seasonSchema.UpdateSeasonStatusDto
  ): Promise<Season> {
    return this.service.updateStatus(id, body.status, { cancel_reason: body.cancel_reason });
  }
}
