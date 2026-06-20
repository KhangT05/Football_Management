import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security } from "tsoa";
import { RoleService } from "../services/role.service.js";
import type { Role } from "../generated/prisma/client.js";
import { type CreateRoleDto, type UpdateRoleDto } from "../dtos/role.schema.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";


@Security("jwt", ['admin'])
@Route("roles")
@Tags("Roles")
export class RoleController extends Controller {
  constructor(private service: RoleService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Role>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Role> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(@Body() body: CreateRoleDto): Promise<Role> {
    this.setStatus(201);
    return this.service.create(body);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: UpdateRoleDto
  ): Promise<Role> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
