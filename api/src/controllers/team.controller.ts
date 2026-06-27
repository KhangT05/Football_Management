import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, FormField, UploadedFile } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TeamService } from "../services/team.service.js";
import type { Team, TeamLeader } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { storageService } from "../services/storage.service.js";

@Security("jwt", ["admin", "user", "organizing", "guest"])
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
  // GET  /teams/{id}/captain
  @Get("{id}/captain")
  async getCaptain(@Path() id: number): Promise<TeamLeader | null> {
    await this.service.findByIdOrFail(id); // validate team exists
    return this.service.getCaptain(id);
  }

  // POST /teams/{id}/captain
  @Post("{id}/captain")
  @SuccessResponse(200, "OK")
  async assignCaptain(
    @Path() id: number,
    @Body() body: { user_id: number },
    @Request() req: AuthRequest
  ): Promise<TeamLeader> {
    const requester = req.user;
    // cần biết requester có phải admin không — lấy từ JWT claim hoặc DB lookup
    const requesterIsAdmin = (req.user as any).is_admin ?? false;
    return this.service.assignCaptain(id, body.user_id, requester.user_id, requesterIsAdmin);
  }
}
