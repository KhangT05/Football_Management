import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { TeamService } from "../services/team.service.js";
import type { Team } from "../generated/prisma/client.js";
import { type CreateTeamDto, type UpdateTeamDto } from "../dtos/team.schema.js";
import { PaginatedResult } from "../libs/queryable.js";
export declare class TeamController extends Controller {
    private service;
    constructor(service: TeamService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Team>>;
    findById(id: number): Promise<Team>;
    create(body: CreateTeamDto, req: AuthRequest): Promise<Team>;
    update(id: number, body: UpdateTeamDto): Promise<Team>;
    softDelete(id: number): Promise<void>;
}
export {};
//# sourceMappingURL=team.controller.d.ts.map