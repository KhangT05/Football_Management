import {
  Controller,
  Post,
  Get,
  Route,
  Tags,
  Security,
  Request,
  SuccessResponse,
  Query,
  FormField,
  UploadedFile,
  Path,
  Patch,
  Delete
} from 'tsoa';
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TeamService } from "../services/team.service.js";
import type { Team, TeamLeader } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { storageService } from "../services/storage.service.js";

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

  @Security("jwt", ["admin", "organizing"])
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

  @Security("jwt", ["admin", "organizing"])
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

  @Security("jwt", ["admin", "organizing"])
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


  @Security("jwt", ["admin", "organizing"]) // override: guest/user không được restore
  @Patch("{id}/restore")
  @SuccessResponse(200, "OK")
  async restore(@Path() id: number): Promise<Team> {
    return this.service.restore(id);
  }
}
