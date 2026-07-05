import { AddPlayerToTeamDto, BulkDeleteDto, CreatePlayerDto, PlayerDetailDto, PlayerDto, TeamPlayerDto, UpdatePlayerDto, UpdateTeamPlayerDto } from "../dtos/player.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery } from "../types/player.type.js";
export declare class PlayerService {
    private readonly prisma;
    private readonly teamPlayerQuery;
    constructor(prisma: PrismaClient);
    /**
     * FIX: trước đây không validate user_id tồn tại (→ P2003 FK raw 500 nếu
     * user_id sai) và không dedupe theo user_id (→ 2 Player row cho cùng 1
     * user nếu Player.user_id không có @@unique DB — chưa confirm schema.prisma).
     * Trả CONFLICT rõ ràng thay vì raw Prisma error hoặc silent duplicate.
     * Không auto-reuse existing player ở đây (khác semantics với import Excel,
     * nơi reuse là intent — xem docstring importTeamPlayersFromExcel) vì
     * single-add qua FE nên biết rõ user đã có player profile để chuyển
     * sang gọi addPlayerToTeam(player_id) trực tiếp, tránh 2 code path
     * cùng verb "create" nhưng semantics khác nhau.
     */
    createPlayer(dto: CreatePlayerDto): Promise<PlayerDto>;
    getPlayerById(id: number): Promise<PlayerDetailDto | null>;
    private mapPlayerWithSeasons;
    getPlayerByIdOrFail(id: number): Promise<PlayerDto>;
    updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto>;
    softDeletePlayer(id: number): Promise<void>;
    private ensurePlayerRole;
    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayerById(id: number, team_id: number): Promise<TeamPlayerDto | null>;
    addPlayerToTeam(team_id: number, dto: AddPlayerToTeamDto): Promise<TeamPlayerDto>;
    /**
     * FIX: trước đây thiếu team_id trong where clause của check + update →
     * IDOR — team A có thể sửa TeamPlayer của team B nếu biết đúng id
     * (sequential integer, dễ enumerate). Giờ team_id là bắt buộc, service
     * là nơi enforce invariant này — không phụ thuộc controller nhớ pre-check
     * (pattern cũ: controller tự getTeamPlayerById(id, team_id) trước rồi
     * gọi service không kèm team_id — TOCTOU + fragile, dễ vỡ nếu route khác
     * gọi thẳng service sau này mà quên pre-check).
     */
    updateTeamPlayer(id: number, team_id: number, dto: UpdateTeamPlayerDto): Promise<TeamPlayerDto>;
    approveTeamPlayer(id: number, team_id: number): Promise<TeamPlayerDto>;
    rejectTeamPlayer(id: number, team_id: number): Promise<TeamPlayerDto>;
    bulkDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    hardDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
    }>;
    exportTeamPlayersExcel(team_id: number): Promise<Buffer>;
    exportImportTemplate(minRows?: number): Buffer;
    importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer): Promise<ImportResult>;
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map