import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import * as tournamentRuleSchema from "../dtos/tournamentRule.schema.js";
import { TournamentRuleService } from "../services/tournamentRule.service.js";
export declare class TournamentRuleController extends Controller {
    private service;
    constructor(service: TournamentRuleService);
    findAll(): Promise<tournamentRuleSchema.TournamentRuleDto[]>;
    findById(id: number): Promise<tournamentRuleSchema.TournamentRuleDto>;
    create(body: tournamentRuleSchema.CreateTournamentRuleRequest, req: AuthRequest): Promise<tournamentRuleSchema.TournamentRuleDto>;
    update(id: number, body: tournamentRuleSchema.UpdateTournamentRuleRequest, force?: boolean): Promise<tournamentRuleSchema.TournamentRuleDto>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<tournamentRuleSchema.TournamentRuleDto>;
    listByTournament(tournamentId: number): Promise<tournamentRuleSchema.TournamentRuleDto[]>;
}
export {};
//# sourceMappingURL=tournamentrule.controller.d.ts.map