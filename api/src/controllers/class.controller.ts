import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, Tags } from "tsoa";
import { ClassService } from "../services/class.service.js";
import * as classSchema from "../dtos/class.schema.js";

@Route("classes")
@Tags("Classes")
export class ClassController extends Controller {
    constructor(private readonly service: ClassService) {
        super();
    }

    @Get("/")
    list(): Promise<classSchema.ClassDto[]> {
        return this.service.list();
    }

    @Get("{id}")
    findById(@Path() id: number): Promise<classSchema.ClassDto> {
        return this.service.getByIdOrFail(id);
    }

    @Security("jwt", ["admin"])
    @Post("/")
    create(@Body() body: classSchema.CreateClassDto): Promise<classSchema.ClassDto> {
        this.setStatus(201);
        return this.service.create(body);
    }

    @Security("jwt", ["admin"])
    @Patch("{id}")
    update(@Path() id: number, @Body() body: classSchema.UpdateClassDto): Promise<classSchema.ClassDto> {
        return this.service.update(id, body);
    }

    @Security("jwt", ["admin"])
    @Delete("{id}")
    async softDelete(@Path() id: number): Promise<void> {
        this.setStatus(204);
        await this.service.softDelete(id);
    }
}