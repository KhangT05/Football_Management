import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { SeasonService } from "../services/season.service.js";
import type { Season } from "../generated/prisma/client.js";
import * as seasonSchema from "../dtos/season.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class SeasonController extends Controller {
    private service;
    constructor(service: SeasonService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Season>>;
    findById(id: number): Promise<Season>;
    create(body: seasonSchema.CreateSeasonDto, req: AuthRequest): Promise<Season>;
    update(id: number, body: seasonSchema.UpdateSeasonDto): Promise<Season>;
    softDelete(id: number): Promise<void>;
    updateStatus(id: number, body: seasonSchema.UpdateSeasonStatusDto): Promise<Season>;
}
export {};
//# sourceMappingURL=season.controller.d.ts.map