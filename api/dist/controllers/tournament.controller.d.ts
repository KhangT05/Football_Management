import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { TournamentService } from "../services/tournament.service.js";
import type { Tournament } from "../generated/prisma/client.js";
import { type UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class TournamentController extends Controller {
    private service;
    constructor(service: TournamentService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Tournament>>;
    findById(id: number): Promise<Tournament>;
    create(name: string, description: string, logo: Express.Multer.File | undefined, req: AuthRequest): Promise<Tournament>;
    update(id: number, body: UpdateTournamentDto): Promise<Tournament>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<Tournament>;
}
export {};
//# sourceMappingURL=tournament.controller.d.ts.map