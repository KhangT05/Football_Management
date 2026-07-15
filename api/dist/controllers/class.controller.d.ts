import { Controller } from "tsoa";
import { ClassService } from "../services/class.service.js";
import * as classSchema from "../dtos/class.schema.js";
export declare class ClassController extends Controller {
    private readonly service;
    constructor(service: ClassService);
    list(): Promise<classSchema.ClassDto[]>;
    findById(id: number): Promise<classSchema.ClassDto>;
    create(body: classSchema.CreateClassDto): Promise<classSchema.ClassDto>;
    update(id: number, body: classSchema.UpdateClassDto): Promise<classSchema.ClassDto>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=class.controller.d.ts.map