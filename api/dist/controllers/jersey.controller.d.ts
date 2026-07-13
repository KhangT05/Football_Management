import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
import { JerseyService } from "../services/jersey.service.js";
import type { SeasonTeamJersey, JerseyType } from "../generated/prisma/client.js";
import * as jerseySchema from "../dtos/jersey.schema.js";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
        is_admin: boolean;
    };
};
export declare class JerseyController extends Controller {
    private service;
    constructor(service: JerseyService);
    /** GET /jerseys/season-teams/:seasonTeamId */
    getSeasonTeamJerseys(seasonTeamId: number): Promise<SeasonTeamJersey[]>;
    upsertSeasonTeamJersey(seasonTeamId: number, body: jerseySchema.UpsertSeasonTeamJerseyDto, req: AuthRequest): Promise<SeasonTeamJersey>;
    deleteSeasonTeamJersey(seasonTeamId: number, type: JerseyType, req: AuthRequest): Promise<void>;
}
export {};
//# sourceMappingURL=jersey.controller.d.ts.map