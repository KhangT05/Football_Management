import { AddPlayerToTeamDto, BulkDeleteDto, CreatePlayerDto, CreatePlayerForTeamDto, PlayerDetailDto, PlayerDto, TeamPlayerDto, UpdatePlayerDto, UpdateTeamPlayerDto } from "../dtos/player.schema.js";
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
     * Dùng khi admin đã biết user_id có sẵn. Không dùng cho case "thêm player +
     * chưa chắc user tồn tại" — xem createPlayerForTeamWithUser.
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
     * Thêm cầu thủ vào team, tự find-or-create User theo email nếu chưa
     * tồn tại. Khác createPlayer()+addPlayerToTeam() cũ (bắt buộc user có
     * sẵn) — đây là entrypoint cho flow "leader nhập tên+email, hệ thống
     * tự lo phần tài khoản".
     *
     * OPERATIONAL GAP: user mới tạo có password random không ai biết,
     * is_active=false. Nếu hệ thống chưa có flow reset-password/invite-accept
     * để user claim account, user này không bao giờ login được — cần xử lý
     * trước khi ship (gửi invite email kèm token, hoặc đổi UX sang "mời user
     * trước, gán player sau khi user đã có account thật").
     *
     * Pre-check jersey ngoài transaction để fail sớm (UX), P2002 trong
     * catch là nguồn chân lý chống race — giả định đã có unique constraint
     * (team_id, jersey_number) filter deleted_at null. Nếu chưa có, request
     * đồng thời có thể pass cả 2 pre-check → cần thêm constraint DB.
     */
    createPlayerForTeamWithUser(team_id: number, dto: CreatePlayerForTeamDto): Promise<TeamPlayerDto>;
    /**
     * FIX: trước đây thiếu team_id trong where clause của check + update →
     * IDOR — team A có thể sửa TeamPlayer của team B nếu biết đúng id
     * (sequential integer, dễ enumerate). Giờ team_id là bắt buộc, service
     * là nơi enforce invariant này — không phụ thuộc controller nhớ pre-check.
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