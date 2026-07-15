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
     * FIX (giữ nguyên fix cũ) + FIX MỚI: bắt buộc user.student_code tồn tại
     * trước khi tạo Player — "sinh viên đang học" là điều kiện tiên quyết
     * theo yêu cầu đồ án. Check ở đây (path admin tạo trực tiếp bằng
     * user_id có sẵn) vì đây là entrypoint duy nhất không đi qua
     * createPlayerForTeamWithUser/import (2 path kia tự nhận student_code
     * qua DTO và ghi vào User trước).
     */
    createPlayer(dto: CreatePlayerDto): Promise<PlayerDto>;
    getPlayerById(id: number): Promise<PlayerDetailDto | null>;
    private mapPlayerWithSeasons;
    getPlayerByIdOrFail(id: number): Promise<PlayerDto>;
    updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto>;
    softDeletePlayer(id: number): Promise<void>;
    private ensurePlayerRole;
    /**
     * FIX MỚI: class-match giữa User của player và Team đang gán vào.
     * Không FK-enforce được (derived qua User.class_id vs Team.class_id,
     * 2 hop khác bảng) nên validate ở service layer. Gọi TRƯỚC mọi thao
     * tác tạo TeamPlayer, dùng cùng `tx` của caller khi có transaction mở
     * để tránh 1 round-trip riêng ngoài transaction (race giữa check và
     * write nếu class_id của user/team đổi giữa chừng — chấp nhận được ở
     * scale đồ án, nhưng cùng tx vẫn rẻ hơn tách riêng).
     *
     * team.class_id == null (chưa gán lớp / data cũ) -> bỏ qua check để
     * không phá migration path. Enforce cứng sau khi backfill xong bằng
     * cách đổi Team.class_id thành NOT NULL ở schema.
     */
    /**
 * FIX: đọc team.category TRƯỚC — nếu amateur, return ngay, không query User
 * (tránh round-trip thừa). Chỉ team.category === "student" mới enforce
 * student_code + class match.
 */
    private assertPlayerClassMatchesTeam;
    private inviteKey;
    private issueInviteToken;
    consumeInviteToken(rawToken: string): Promise<number>;
    resendInvite(userId: number): Promise<void>;
    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayerById(id: number, team_id: number): Promise<TeamPlayerDto | null>;
    /**
     * FIX MỚI: thêm assertPlayerClassMatchesTeam TRƯỚC dupPlayer/dupJersey
     * check — fail nhanh vì đây là lỗi nghiệp vụ nghiêm trọng hơn (cầu thủ
     * sai lớp) so với trùng số áo.
     */
    addPlayerToTeam(team_id: number, dto: AddPlayerToTeamDto): Promise<TeamPlayerDto>;
    /**
     * FIX MỚI: dto giờ bắt buộc student_code. Với user MỚI tạo, ghi luôn
     * student_code vào User trong cùng tx (user mới chưa có gì để mất).
     * Với user ĐÃ tồn tại, KHÔNG ghi đè student_code có sẵn (tránh leader
     * sửa MSSV người khác qua form thêm player) — chỉ backfill nếu user
     * đó đang null. Class-match check luôn chạy sau bước này, trong cùng
     * tx, trước khi tạo TeamPlayer.
     *
     * LƯU Ý CÒN HỞ: user mới tạo có class_id = null (chưa gán lớp), nên
     * assertPlayerClassMatchesTeam sẽ pass cho user mới bất kể team thuộc
     * lớp nào (điều kiện `team.class_id != null && user.class_id !== ...`
     * chỉ fail khi cả 2 khác nhau VÀ đều có giá trị). Nếu cần chặn cứng
     * "user phải có lớp trước khi vào team", phải thêm field class_id vào
     * CreatePlayerForTeamDto và set ngay lúc tạo user — hỏi lại UX trước
     * khi đổi, vì hiện tại đang cho phép admin gán lớp sau.
     */
    createPlayerForTeamWithUser(team_id: number, dto: CreatePlayerForTeamDto): Promise<TeamPlayerDto>;
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
     * FIX MỚI: student_code bắt buộc trong schema (validate ở
     * importPlayerRowSchema), ghi vào User khi tạo mới hoặc backfill khi
     * user có sẵn nhưng chưa có. assertPlayerClassMatchesTeam chạy trong
     * tx per-row, TRƯỚC khi tạo TeamPlayer — lỗi rơi vào catch hiện có,
     * tự động log vào result.errors[].reason theo đúng hành vi cũ (1 dòng
     * lỗi không ảnh hưởng dòng khác).
     */
    importTeamPlayersFromExcel(team_id: number, fileBuffer: Buffer | Uint8Array | ArrayBuffer): Promise<ImportResult>;
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map