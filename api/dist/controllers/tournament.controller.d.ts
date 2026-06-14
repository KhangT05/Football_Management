import { Controller } from "tsoa";
import { TournamentService } from "../services/tournament.service.js";
import type { Tournament } from "../generated/prisma/client.js";
import { type CreateTournamentDto, type UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PaginatedResult } from "../libs/queryable.js";
export declare class TournamentController extends Controller {
    private service;
    constructor(service: TournamentService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Tournament>>;
    findById(id: number): Promise<Tournament>;
    create(body: CreateTournamentDto): Promise<Tournament>;
    update(id: number, body: UpdateTournamentDto): Promise<Tournament>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=tournament.controller.d.ts.map