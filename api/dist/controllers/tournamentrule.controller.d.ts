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
    create(body: CreateTournamentRuleDto, req: AuthRequest): Promise<CreateTournamentRuleDto>;
    update(id: number, body: UpdateTournamentRuleDto): Promise<UpdateTournamentRuleDto>;
    softDelete(id: number): Promise<void>;
}
export {};
//# sourceMappingURL=tournamentrule.controller.d.ts.map