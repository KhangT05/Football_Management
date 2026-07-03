import { Controller } from 'tsoa';
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { TeamService } from "../services/team.service.js";
import type { Team, TeamLeader } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class TeamController extends Controller {
    private service;
    constructor(service: TeamService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Team>>;
    findById(id: number): Promise<Team>;
    create(name: string, req: AuthRequest, coach_name?: string, description?: string, logo?: Express.Multer.File): Promise<Team>;
    update(id: number, name?: string, coach_name?: string, description?: string, logoFile?: Express.Multer.File): Promise<Team>;
    softDelete(id: number): Promise<void>;
    getCaptain(id: number): Promise<TeamLeader | null>;
    restore(id: number): Promise<Team>;
}
export {};
//# sourceMappingURL=team.controller.d.ts.map