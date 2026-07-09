import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { TournamentRuleDto, type CreateTournamentRuleDto, type UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";
export declare class TournamentRuleController extends Controller {
    private service;
    constructor(service: TournamentRuleService);
    findAll(): Promise<TournamentRuleDto[]>;
    findById(id: number): Promise<TournamentRuleDto>;
    create(body: CreateTournamentRuleDto, req: AuthRequest): Promise<TournamentRuleDto>;
    update(id: number, body: UpdateTournamentRuleDto, force?: boolean): Promise<TournamentRuleDto>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<TournamentRuleDto>;
    listByTournament(tournamentId: number): Promise<TournamentRuleDto[]>;
}
export {};
//# sourceMappingURL=tournamentrule.controller.d.ts.map