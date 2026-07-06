import { Controller } from "tsoa";
import { PlayerService } from "../services/player.service.js";
import { type CreatePlayerDto, type UpdatePlayerDto, type PlayerDto, type TeamPlayerDto, type AddPlayerToTeamDto, type UpdateTeamPlayerDto, type BulkDeleteDto } from "../dtos/player.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult } from "../types/player.type.js";
export declare class PlayerController extends Controller {
    private readonly service;
    constructor(service: PlayerService);
    exportTeamPlayers(team_id: number): Promise<void>;
    downloadImportTemplate(minRows?: number): Promise<void>;
    listTeamPlayers(team_id: number, page?: number, per_page?: number, sort?: string, direction?: "asc" | "desc", position?: string, status?: string, approval_status?: string): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayer(team_id: number, id: number): Promise<TeamPlayerDto>;
    findById(id: number): Promise<PlayerDto>;
    create(body: CreatePlayerDto): Promise<PlayerDto>;
    update(id: number, body: UpdatePlayerDto): Promise<PlayerDto>;
    softDelete(id: number): Promise<void>;
    addPlayerToTeam(team_id: number, body: AddPlayerToTeamDto): Promise<TeamPlayerDto>;
    updateTeamPlayer(team_id: number, id: number, body: UpdateTeamPlayerDto): Promise<TeamPlayerDto>;
    approveTeamPlayer(team_id: number, id: number): Promise<TeamPlayerDto>;
    rejectTeamPlayer(team_id: number, id: number): Promise<TeamPlayerDto>;
    bulkDeleteTeamPlayers(team_id: number, body: BulkDeleteDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    importTeamPlayers(team_id: number, file: Express.Multer.File): Promise<ImportResult>;
}
//# sourceMappingURL=player.controller.d.ts.map