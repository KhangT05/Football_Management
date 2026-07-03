import * as tsoa from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TeamService } from "../services/team.service.js";
import type { Team, TeamLeader } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { storageService } from "../services/storage.service.js";

@tsoa.Security("jwt", ["admin", "user", "organizing", "guest"])
@tsoa.Route("teams")
@tsoa.Tags("Teams")
export class TeamController extends tsoa.Controller {
  constructor(private service: TeamService) {
    super();
  }

  @tsoa.Get("/")
  async findAll(
    @tsoa.Query() page = 1,
    @tsoa.Query() per_page = 20,
    @tsoa.Query() q?: string,
    @tsoa.Query() sort?: string,
    @tsoa.Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<Team>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @tsoa.Get("{id}")
  async findById(@tsoa.Path() id: number): Promise<Team> {
    return this.service.findByIdOrFail(id);
  }

  @tsoa.Post("/")
  @tsoa.SuccessResponse(201, "Created")
  async create(
    @tsoa.FormField() name: string,
    @tsoa.Request() req: AuthRequest,
    @tsoa.FormField() coach_name?: string,
    @tsoa.FormField() description?: string,
    @tsoa.UploadedFile("logo") logo?: Express.Multer.File,
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

  @tsoa.Patch("{id}")
  async update(
    @tsoa.Path() id: number,
    @tsoa.FormField() name?: string,
    @tsoa.FormField() coach_name?: string,
    @tsoa.FormField() description?: string,
    @tsoa.UploadedFile("logo") logoFile?: Express.Multer.File
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

  @tsoa.Delete("{id}")
  @tsoa.SuccessResponse(204, "Deleted")
  async softDelete(@tsoa.Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
  // GET  /teams/{id}/captain
  @tsoa.Get("{id}/captain")
  async getCaptain(@tsoa.Path() id: number): Promise<TeamLeader | null> {
    await this.service.findByIdOrFail(id); // validate team exists
    return this.service.getCaptain(id);
  }


  @tsoa.Security("jwt", ["admin", "organizing"]) // override: guest/user không được restore
  @tsoa.Patch("{id}/restore")
  @tsoa.SuccessResponse(200, "OK")
  async restore(@tsoa.Path() id: number): Promise<Team> {
    return this.service.restore(id);
  }
}
