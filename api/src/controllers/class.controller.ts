import { Body, Controller, Delete, Get, Patch, Path, Post, Query, Route, Security, SuccessResponse, Tags } from "tsoa";
import { ClassService } from "../services/class.service.js";
import type { Class } from "../generated/prisma/client.js";
import * as classSchema from "../dtos/class.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";

@Route("classes")
@Tags("Classes")
export class ClassController extends Controller {
    constructor(private readonly service: ClassService) {
        super();
    }

    /** Danh sách active, không phân trang — dùng cho dropdown/select. */
    @Get("active")
    listActive(): Promise<Class[]> {
        return this.service.listActive();
    }

    @Get("deleted")
    @Security("jwt", ["admin"])
    findDeleted(): Promise<Class[]> {
        return this.service.findDeleted();
    }

    @Get("/")
    async findAll(
        @Query() page = 1,
        @Query() per_page = 20,
        @Query() q?: string,
        @Query() sort?: string,
        @Query() direction?: "asc" | "desc"
    ): Promise<PaginatedResult<Class>> {
        return this.service.findAll({ page, per_page, q, sort, direction });
    }

    @Get("{id}")
    findById(@Path() id: number): Promise<Class> {
        return this.service.getByIdOrFail(id);
    }

    @Security("jwt", ["admin"])
    @Post("/")
    @SuccessResponse(201, "Created")
    create(@Body() body: classSchema.CreateClassDto): Promise<Class> {
        this.setStatus(201);
        return this.service.create(body);
    }

    @Security("jwt", ["admin"])
    @Patch("{id}")
    update(@Path() id: number, @Body() body: classSchema.UpdateClassDto): Promise<Class> {
        return this.service.update(id, body);
    }

    @Security("jwt", ["admin"])
    @Delete("{id}")
    @SuccessResponse(204, "Deleted")
    async softDelete(@Path() id: number): Promise<void> {
        this.setStatus(204);
        await this.service.softDelete(id);
    }

    @Security("jwt", ["admin"])
    @Patch("{id}/restore")
    restore(@Path() id: number): Promise<Class> {
        return this.service.restore(id);
    }
}