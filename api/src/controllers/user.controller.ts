import {
  Controller, Get, Path, Tags, Route, Post, Patch, Body,
  SuccessResponse, Delete, Query, Security, UploadedFile,
  Request as TsoaRequest
} from "tsoa";
import { UserService, type SafeUser } from "../services/user.service.js";
import * as userSchema from "../dtos/user.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { createAppError } from "../common/app.error.js";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };


@Route("users")
@Tags("Users")
export class UserController extends Controller {
  constructor(private service: UserService) {
    super();
  }

  @Get("/")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  async findAll(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: "asc" | "desc"
  ): Promise<PaginatedResult<SafeUser>> {
    return this.service.findAll({ page, per_page, q, sort, direction });
  }

  @Get("{id}")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  async findById(@Path() id: number): Promise<SafeUser> {
    return this.service.findByIdOrFail(id);
  }

  @Post("/")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  @SuccessResponse(201, "Created")
  async create(@Body() body: userSchema.CreateUserDto): Promise<SafeUser> {
    this.setStatus(201);
    return this.service.create(body);
  }

  @Patch("{id}")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  async update(
    @Path() id: number,
    @Body() body: userSchema.UpdateUserDto
  ): Promise<SafeUser> {
    return this.service.update(id, body);
  }

  @Delete("{id}")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
  @Patch("{id}/restore")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  async restore(@Path() id: number): Promise<SafeUser> {
    return this.service.restore(id);
  }
  @Patch("{id}/avatar")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  async updateAvatar(
    @Path() id: number,
    @UploadedFile("avatar") avatar: Express.Multer.File
  ): Promise<SafeUser> {
    if (!avatar) throw createAppError("VALIDATION_ERROR", "Thiếu file avatar");
    return this.service.updateAvatar(id, avatar);
  }

  @Patch("{id}/password")
  @Security("jwt", ["admin", "user", "organizing", "leader"])
  @SuccessResponse(204, "OK")
  async updatePassword(
    @Path() id: number,
    @Body() body: userSchema.ChangePasswordDto
  ): Promise<void> {
    this.setStatus(204);
    return this.service.updatePassword(id, body.currentPassword, body.newPassword);
  }
}
