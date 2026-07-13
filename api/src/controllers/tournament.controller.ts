import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request, UploadedFile, FormField } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };
import { TournamentService } from "../services/tournament.service.js";
import type { Tournament } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { storageService } from "../services/storage.service.js";

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
  @Security("jwt", ["organizing"])
  @Post("/")
  @SuccessResponse(201, "Created")
  async create(
    @FormField() name: string,
    @FormField() description: string,
    @UploadedFile("logo") logo: Express.Multer.File | undefined,
    @Request() req: AuthRequest
  ): Promise<Tournament> {
    this.setStatus(201);

    let logo_url: string | undefined;
    if (logo) {
      const result = await storageService.upload({
        namespace: "tournaments",
        kind: "logo",
        file: logo,
      });
      logo_url = result.url;
    }

    return this.service.create({
      name,
      description,
      logo: logo_url,
      is_active: true,
    }, req.user.user_id);
  }

  @Security("jwt", ["organizing"])
  @Patch("{id}")
  async update(
    @Path() id: number,
    @FormField() name?: string,
    @FormField() description?: string,
    @UploadedFile("logo") logo?: Express.Multer.File,
  ): Promise<Tournament> {
    return this.service.updateWithLogo(id, { name, description }, logo);
  }

  @Security("jwt", ["organizing"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }

  @Security("jwt", ["organizing"])
  @Patch("{id}/restore")
  async restore(@Path() id: number): Promise<Tournament> {
    return this.service.restore(id);
  }
}
