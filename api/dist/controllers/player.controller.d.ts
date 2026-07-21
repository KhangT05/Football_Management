import { Controller } from "tsoa";
import type { TsoaResponse } from "tsoa";
import { PlayerService } from "../services/player.service.js";
import * as playerSchema from "../dtos/player.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult } from "../types/player.type.js";
export declare class PlayerController extends Controller {
    private readonly service;
    constructor(service: PlayerService);
    list(page?: number, per_page?: number, sort?: string, direction?: "asc" | "desc", position?: string, nationality?: string): Promise<PaginatedResult<playerSchema.PlayerPublicDto>>;
    downloadImportTemplate(minRows: number | undefined, successResponse: TsoaResponse<200, Buffer>): Promise<void>;
    findById(id: number): Promise<playerSchema.PlayerDto>;
    create(body: playerSchema.CreatePlayerDto): Promise<playerSchema.PlayerDto>;
    update(id: number, body: playerSchema.UpdatePlayerDto): Promise<playerSchema.PlayerDto>;
    softDelete(id: number): Promise<void>;
    listTeamPlayers(team_id: number, page?: number, per_page?: number, sort?: string, direction?: "asc" | "desc", position?: string, status?: string, approval_status?: string): Promise<PaginatedResult<playerSchema.TeamPlayerDto>>;
    exportTeamPlayers(team_id: number, successResponse: TsoaResponse<200, Buffer>): Promise<void>;
    getTeamPlayer(team_id: number, id: number): Promise<playerSchema.TeamPlayerDto>;
    addPlayerToTeam(team_id: number, body: playerSchema.AddPlayerToTeamDto): Promise<playerSchema.TeamPlayerDto>;
    createPlayerForTeamWithUser(team_id: number, body: playerSchema.CreatePlayerForTeamDto): Promise<playerSchema.TeamPlayerDto>;
    updateTeamPlayer(team_id: number, id: number, body: playerSchema.UpdateTeamPlayerDto): Promise<playerSchema.TeamPlayerDto>;
    approveTeamPlayer(team_id: number, id: number): Promise<playerSchema.TeamPlayerDto>;
    rejectTeamPlayer(team_id: number, id: number): Promise<playerSchema.TeamPlayerDto>;
    bulkDeleteTeamPlayers(team_id: number, body: playerSchema.BulkDeleteDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    importTeamPlayers(team_id: number, file: Express.Multer.File): Promise<ImportResult>;
    copyRosterFromSeason(team_id: number, body: playerSchema.CopyRosterDto): Promise<{
        copied: number;
        skipped: number;
        errors: {
            player_id: number;
            reason: string;
        }[];
    }>;
}
//# sourceMappingURL=player.controller.d.ts.map