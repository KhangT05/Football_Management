import { AddPlayerToTeamDto, BulkDeleteDto, CreatePlayerDto, CreatePlayerForTeamDto, PlayerDetailDto, PlayerDto, PlayerPublicDto, TeamPlayerDto, UpdatePlayerDto, UpdateTeamPlayerDto } from "../dtos/player.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { ImportResult, ListTeamPlayersQuery, PlayerPublicRow } from "../types/player.type.js";
export declare class PlayerService {
    private readonly prisma;
    private readonly teamPlayerQuery;
    private readonly playerQuery;
    constructor(prisma: PrismaClient);
    toPlayerPublicDto(row: PlayerPublicRow): PlayerPublicDto;
    listPlayers(query: Record<string, unknown>): Promise<PaginatedResult<PlayerPublicDto>>;
    /**
     * FIX: trước đây không validate user_id tồn tại (→ P2003 FK raw 500 nếu
     * user_id sai), không dedupe theo user_id (→ CONFLICT rõ ràng thay vì raw
     * P2002), và QUAN TRỌNG NHẤT — không gán role "player" cho user sau khi
     * tạo Player. Khác với createPlayerForTeamWithUser/addPlayerToTeam/import
     * (đều có ensurePlayerRole), path admin-gõ-tay này bị bỏ sót, khiến user
     * có Player record nhưng không có Role -> mất quyền truy cập tính năng
     * player-only ở phía FE/authorization middleware.
     *
     * Giờ wrap trong $transaction: create Player + upsert User_Role cùng lúc,
     * đảm bảo không có trạng thái "có Player, thiếu Role" nếu 1 trong 2 fail.
     * Dùng khi admin đã biết user_id có sẵn. Không dùng cho case "thêm player +
     * chưa chắc user tồn tại" — xem createPlayerForTeamWithUser.
     */
    createPlayer(dto: CreatePlayerDto): Promise<PlayerDto>;
    getPlayerById(id: number): Promise<PlayerDetailDto | null>;
    private mapPlayerWithSeasons;
    getPlayerByIdOrFail(id: number): Promise<PlayerDto>;
    updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto>;
    softDeletePlayer(id: number): Promise<void>;
    /**
     * FIX: trước đây role không tồn tại thì chỉ logger.warn rồi return ->
     * fail silent, Player/TeamPlayer được tạo thành công nhưng KHÔNG có role,
     * không có tín hiệu nào lộ ra response hay đủ nghiêm trọng để bị chú ý
     * trong log prod. Đổi thành throw để lỗi cấu hình (role "player" thiếu
     * hoặc tên sai trong bảng roles) bị phát hiện ngay, không âm thầm tích
     * tụ user thiếu role.
     *
     * Verify tên role thật trong DB trước khi deploy: SELECT name FROM roles;
     * PLAYER_ROLE_NAME phải khớp CHÍNH XÁC (case-sensitive).
     */
    private ensurePlayerRole;
    private inviteKey;
    /**
     * Sinh invite token cho 1 user mới tạo (chưa có mật khẩu — Player.user
     * password nullable theo schema.prisma: `password String?`), lưu bản HASH
     * (sha256) vào Redis với TTL 24h — không bao giờ lưu plaintext, không cần
     * cột DB (invite_token_hash/invite_token_expires_at), Redis tự hết hạn.
     * Trả về rawToken để gửi qua email (không log ra ngoài).
     *
     * QUAN TRỌNG: hàm này KHÔNG được gọi bên trong prisma.$transaction — Redis
     * không tham gia rollback của Prisma. Nếu gọi trong tx mà tx rollback sau
     * đó, token sẽ trỏ tới 1 userId "mồ côi" hoặc tệ hơn là bị tái sử dụng
     * nhầm cho user khác nếu id được cấp lại. Luôn gọi SAU khi transaction
     * tạo user/player/teamPlayer đã commit thành công.
     */
    private issueInviteToken;
    /**
     * Xác thực raw token (dùng cho endpoint POST /auth/accept-invite — chưa
     * có trong file này). Trả về userId nếu hợp lệ. Token là one-time-use:
     * xoá ngay khỏi Redis sau khi đọc thành công để không dùng lại được lần 2.
     * Hết hạn (quá 24h) hoặc sai token đều rơi vào nhánh BAD_REQUEST như nhau
     * — không tiết lộ token đã từng tồn tại hay chưa.
     */
    consumeInviteToken(rawToken: string): Promise<number>;
    /**
     * Cho admin/leader bấm "gửi lại lời mời" khi token cũ đã hết hạn (24h).
     * Phát hành token MỚI (token cũ nếu còn trong Redis vẫn còn hiệu lực tới
     * khi hết TTL của chính nó — không revoke, chấp nhận có thể có 2 token
     * sống song song trong thời gian ngắn, không phải vấn đề bảo mật vì cả
     * hai đều one-time-use).
     */
    resendInvite(userId: number): Promise<void>;
    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayerById(id: number, team_id: number): Promise<TeamPlayerDto | null>;
    addPlayerToTeam(team_id: number, dto: AddPlayerToTeamDto): Promise<TeamPlayerDto>;
    /**
     * Thêm cầu thủ vào team, tự find-or-create User theo email nếu chưa
     * tồn tại. Player KHÔNG có cột name/email (schema.prisma) — 2 field này
     * thuộc về User, Player chỉ giữ user_id (@unique, 1-1). Khác
     * createPlayer()+addPlayerToTeam() cũ (bắt buộc user có sẵn) — đây là
     * entrypoint cho flow "leader nhập tên+email, hệ thống tự lo phần tài
     * khoản".
     *
     * User mới tạo có password = null (cột nullable theo schema.prisma:
     * `password String?`), is_active = false, kèm invite token (hash lưu
     * Redis TTL 24h, raw token gửi qua email). Cần endpoint
     * POST /auth/accept-invite (chưa có trong file này) để user set mật
     * khẩu thật bằng token này rồi kích hoạt account, trong vòng 24h kể từ
     * lúc tạo — quá hạn phải dùng resendInvite() để admin gửi lại.
     *
     * issueInviteToken() được gọi SAU khi transaction Prisma đã commit,
     * không nằm trong tx — vì Redis không rollback theo transaction DB. Nếu
     * để trong tx và transaction rollback (vd. do lỗi jersey trùng ở bước
     * sau), sẽ có token "mồ côi" trỏ tới user không tồn tại (hoặc trỏ nhầm
     * user nếu id được tái sử dụng).
     *
     * Gửi email NGOÀI transaction: network call không nên giữ DB
     * connection, và nếu email fail thì không nên rollback việc tạo
     * player — leader vẫn thấy player trong đội, admin có thể gọi
     * resendInvite() thủ công sau.
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
     *
     * FIX #2: trước đây update không re-check role player -> nếu role bị
     * thiếu từ lúc tạo (bug tên delegate/tên role cũ), sửa/approve/reject sau
     * đó cũng không có cơ hội tự heal. Giờ mọi update đều ensurePlayerRole
     * lại trong cùng transaction — idempotent (upsert), không tốn thêm gì
     * đáng kể so với 1 query lookup + upsert.
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
    exportImportTemplate(minRows?: number): Promise<Buffer>;
    /**
     * Hỗ trợ file Excel thuần tiếng Việt (header + giá trị "Vị trí" dạng
     * GK/DEF/MID/FW hoặc "Thủ môn"/"Hậu vệ"...) lẫn file tiếng Anh cũ, thông
     * qua normalizeImportRow() ở module-level phía trên. Nếu email chưa có
     * tài khoản → tự tạo User (password=null, is_active=false) + phát invite
     * token + gửi mail, đồng bộ hành vi với createPlayerForTeamWithUser().
     * Mỗi dòng là 1 transaction riêng — 1 dòng lỗi không ảnh hưởng dòng khác.
     */
    importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer | Uint8Array | ArrayBuffer): Promise<ImportResult>;
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map