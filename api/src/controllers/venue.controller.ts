import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security } from "tsoa";
import { VenueService } from "../services/venue.service.js";
import type { Venue } from "../generated/prisma/client.js";
import { type CreateVenueDto, type UpdateVenueDto } from "../dtos/venue.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";


@Security("jwt", ['user', 'admin'])
@Route("venues")
@Tags("Venues")
export class VenueController extends Controller {
  constructor(private service: VenueService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Venue>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Venue> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreateVenueDto): Promise<Venue> {
    this.setStatus(201);
    return this.service.create(body);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateVenueDto
  ): Promise<Venue> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
