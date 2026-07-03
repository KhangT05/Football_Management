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
    hardDeleteTeamPlayers(team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
    }>;
    exportTeamPlayersExcel(team_id: number): Promise<Buffer>;
    /**
     * Template có sẵn `minRows` dòng trống (mặc định 7 — số cầu thủ tối thiểu/đội)
     * + sheet "Instructions" tách riêng enum hint khỏi vùng data, tránh leader
     * hiểu nhầm "goalkeeper|defender|..." là 1 giá trị hợp lệ để nguyên.
     * Enum lấy trực tiếp từ Prisma generated client — không hardcode string,
     * tránh drift khi schema.prisma đổi.
     */
    exportImportTemplate(minRows?: number): Buffer;
    /**
     * Per-row transaction → partial success.
     *
     * playerByUserId / teamPlayerSet / usedJerseyNumbers chỉ được cập nhật SAU KHI
     * transaction commit thành công (ngoài closure). Set state trong tx callback
     * trước throw ở bước sau sẽ khiến rollback không đồng bộ với local cache, làm
     * row kế tiếp tưởng player đã tồn tại → insert teamPlayer trỏ player_id không
     * có thật trong DB.
     *
     * OPTION A (đã chốt): TeamPlayer.position là nguồn sự thật cho context team này,
     * ĐỘC LẬP với Player.position. Khi player đã tồn tại (existingPlayerId có sẵn),
     * KHÔNG update Player.position dù dto.position khác — đây là intent, không phải bug.
     * Lý do: 1 player có thể đăng ký nhiều đội với vị trí thi đấu khác nhau, hồ sơ gốc
     * (Player.position) chỉ set 1 lần lúc tạo mới, không bị leader import ghi đè.
     */
    importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer): Promise<ImportResult>;
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map