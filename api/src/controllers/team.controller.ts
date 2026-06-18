import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, FormField, UploadedFile } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TeamService } from "../services/team.service.js";
import type { Team } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
import { storageService } from "../services/storage.service.js";

@Security("jwt")
@Route("teams")
@Tags("Teams")
export class TeamController extends Controller {
  constructor(private service: TeamService) {
    super();
  }

  @Get("/")
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Team>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  async findById(@Path() id: number): Promise<Team> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @SuccessResponse(201, "Created")
  async create(
    @FormField() name: string,
    @Request() req: AuthRequest,
    @FormField() coach_name?: string,
    @FormField() description?: string,
    @UploadedFile("logo") logo?: Express.Multer.File,
  ): Promise<Team> {
    this.setStatus(201);
    let logo_url: string | undefined;
    if (logo) {
      const result = await storageService.upload({
        namespace: "teams",
        kind: "logo",
        file: logo,
      });
      logo_url = result.url;  // lưu URL, accept publicId leak khi update
    }
    return this.service.create({ name, coach_name, description, logo: logo_url }, req.user.user_id);
  }

  @Patch("{id}")
  async update(
    @Path() id: number,
    @FormField() name?: string,
    @FormField() coach_name?: string,
    @FormField() description?: string,
    @UploadedFile("logo") logoFile?: Express.Multer.File
  ): Promise<Team> {
    let logo: string | undefined;
    if (logoFile) {
      const result = await storageService.upload({
        namespace: "teams",
        kind: "logo",
        file: logoFile,
      });
      logo = result.url;
    }
    return this.service.update(id, {
      ...(name !== undefined && { name }),
      ...(coach_name !== undefined && { coach_name }),
      ...(description !== undefined && { description }),
      ...(logo !== undefined && { logo }),
    });
  }

  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
}
