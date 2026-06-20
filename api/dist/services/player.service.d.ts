import { AddPlayerToTeamDto, BulkDeleteDto, CreatePlayerDto, PlayerDto, TeamPlayerDto, UpdatePlayerDto, UpdateTeamPlayerDto } from "../dtos/player.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery } from "../types/player.type.js";
export declare class PlayerService {
    private readonly prisma;
    private readonly teamPlayerQuery;
    constructor(prisma: PrismaClient);
    createPlayer(dto: CreatePlayerDto): Promise<PlayerDto>;
    getPlayerById(id: number): Promise<PlayerDto | null>;
    getPlayerByIdOrFail(id: number): Promise<PlayerDto>;
    updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto>;
    softDeletePlayer(id: number): Promise<void>;
    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayerById(id: number, team_id: number): Promise<TeamPlayerDto | null>;
    addPlayerToTeam(team_id: number, dto: AddPlayerToTeamDto, user_id?: number): Promise<TeamPlayerDto>;
    updateTeamPlayer(id: number, dto: UpdateTeamPlayerDto): Promise<TeamPlayerDto>;
    approveTeamPlayer(id: number): Promise<TeamPlayerDto>;
    rejectTeamPlayer(id: number): Promise<TeamPlayerDto>;
    bulkDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    /** Hard delete — admin/cleanup only. Cascade schema xử lý seasonTeamPlayers. */
    hardDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
    }>;
    exportTeamPlayersExcel(team_id: number): Promise<Buffer>;
    exportImportTemplate(): Buffer;
    /**
     * Per-row transaction → partial success. KHÔNG dùng 1 transaction bọc
     * toàn bộ loop: file lớn (vài trăm row) sẽ giữ transaction mở quá lâu,
     * tăng lock contention trên teamPlayer/player table. Trade-off: mất
     * atomicity toàn file, đổi lại import 500 dòng không block ghi khác.
     */
    importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer): Promise<ImportResult>;
    /**
     * Không map field-by-field vì PlayerRow (Prisma payload) đã match
     * PlayerDto 1:1 nhờ PLAYER_SELECT satisfies Prisma.PlayerSelect.
     * Chỉ height/weight cần convert Decimal -> number, còn lại spread
     * thẳng. Nếu PlayerDto thêm field tính toán (vd: age từ date_of_birth)
     * thì thêm vào đây, không quay lại copy hết field như cũ.
     */
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map