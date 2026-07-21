import { AddPlayerToTeamDto, BulkDeleteDto, CreatePlayerDto, CreatePlayerForTeamDto, PlayerDetailDto, PlayerDto, PlayerPublicDto, TeamPlayerDto, UpdatePlayerDto, UpdateTeamPlayerDto } from "../dtos/player.schema.js";
import { LeaveReason, PlayerPosition, PrismaClient } from "../generated/prisma/client.js";
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
     *
     * LƯU Ý: createPlayer KHÔNG gắn player vào season_team nào cả (chỉ tạo
     * hồ sơ Player gắn với Team qua pool chung), nên KHÔNG áp
     * max_players_per_team ở đây — giới hạn đó chỉ áp khi tạo TeamPlayer
     * (đăng ký vào roster của 1 season cụ thể), xem addPlayerToTeam /
     * createPlayerForTeamWithUser / importTeamPlayersFromExcel bên dưới.
     */
    createPlayer(dto: CreatePlayerDto): Promise<PlayerDto>;
    getPlayerById(id: number): Promise<PlayerDetailDto | null>;
    private mapPlayerWithSeasons;
    getPlayerByIdOrFail(id: number): Promise<PlayerDto>;
    updatePlayer(id: number, dto: UpdatePlayerDto): Promise<PlayerDto>;
    softDeletePlayer(id: number): Promise<void>;
    private ensurePlayerRole;
    /**
     * FIX (roster cap — bug chính): trước đây tournament_rule.max_players_per_team
     * tồn tại trong schema nhưng KHÔNG được đọc ở bất kỳ đâu. Team (Chelsea)
     * có thể chứa N cầu thủ không giới hạn (đúng ý đồ), nhưng TeamPlayer
     * luôn scope theo season_team_id — đây chính là "danh sách đăng ký cho
     * 1 mùa giải cụ thể" mà max_players_per_team phải áp, KHÔNG áp lên Team
     * (pool) và KHÔNG áp lên MatchLineup (đội hình ra sân từng trận, đã có
     * enum LineupType.starter/substitute lo phần đó rồi, khác phạm vi).
     *
     * Trả về null cho maxPlayers nếu season chưa gán tournament_rule —
     * migration-safe, giống pattern teamClassId == null ở trên.
     */
    private getSeasonTeamRosterConstraints;
    /**
     * Đếm số TeamPlayer đã approved trong roster của season_team này — đây
     * là con số đối chiếu với max_players_per_team (chỉ cầu thủ approved
     * mới tính là "đã đăng ký chính thức"; pending/rejected không chiếm slot).
     * Luôn gọi trong CÙNG transaction với insert để thu hẹp race window
     * (2 request add cùng lúc gần chạm max).
     */
    private assertRosterCapacity;
    private inviteKey;
    private issueInviteToken;
    consumeInviteToken(rawToken: string): Promise<number>;
    resendInvite(userId: number): Promise<void>;
    listTeamPlayers(query: ListTeamPlayersQuery): Promise<PaginatedResult<TeamPlayerDto>>;
    getTeamPlayerById(id: number, season_team_id: number): Promise<TeamPlayerDto | null>;
    /**
     * FIX (roster cap): thêm assertRosterCapacity TRONG transaction, ngay
     * trước insert — chặn vượt max_players_per_team của tournament rule áp
     * cho season của season_team_id này. Đặt sau assertPlayerClassMatchesUser
     * và sau check trùng player/jersey (fail nhanh các lỗi rẻ trước, lỗi cần
     * transaction sau cùng).
     */
    addPlayerToTeam(season_team_id: number, dto: AddPlayerToTeamDto): Promise<TeamPlayerDto>;
    /**
     * FIX MỚI: dto giờ bắt buộc student_code. Với user MỚI tạo, ghi luôn
     * student_code vào User trong cùng tx (user mới chưa có gì để mất).
     * Với user ĐÃ tồn tại, KHÔNG ghi đè student_code có sẵn (tránh leader
     * sửa MSSV người khác qua form thêm player) — chỉ backfill nếu user
     * đó đang null. Class-match check luôn chạy sau bước này, trong cùng
     * tx, trước khi tạo TeamPlayer.
     *
     * FIX (roster cap): assertRosterCapacity chạy trong cùng tx, ngay trước
     * insert TeamPlayer — cùng vị trí như addPlayerToTeam.
     *
     * LƯU Ý CÒN HỞ: user mới tạo có class_id = null (chưa gán lớp), nên
     * assertPlayerClassMatchesUser sẽ pass cho user mới bất kể team thuộc
     * lớp nào (điều kiện `teamClassId != null && user.class_id !== ...`
     * chỉ fail khi cả 2 khác nhau VÀ đều có giá trị). Nếu cần chặn cứng
     * "user phải có lớp trước khi vào team", phải thêm field class_id vào
     * CreatePlayerForTeamDto và set ngay lúc tạo user — hỏi lại UX trước
     * khi đổi, vì hiện tại đang cho phép admin gán lớp sau.
     */
    createPlayerForTeamWithUser(season_team_id: number, dto: CreatePlayerForTeamDto): Promise<TeamPlayerDto>;
    updateTeamPlayer(id: number, season_team_id: number, dto: UpdateTeamPlayerDto): Promise<TeamPlayerDto>;
    approveTeamPlayer(id: number, season_team_id: number): Promise<TeamPlayerDto>;
    rejectTeamPlayer(id: number, season_team_id: number): Promise<TeamPlayerDto>;
    bulkDeleteTeamPlayers(season_team_id: number, dto: BulkDeleteDto): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    hardDeleteTeamPlayers(season_team_id: number, dto: BulkDeleteDto, reason?: LeaveReason): Promise<{
        deleted: number;
        notFound: number[];
    }>;
    getPlayerTeamHistory(player_id: number): Promise<{
        history_id: number;
        team_id: number;
        team_name: string;
        season_id: number;
        season_name: string;
        tournament_id: number;
        tournament_name: string;
        jersey_number: number;
        position: PlayerPosition;
        role: import("../generated/prisma/enums.js").PlayerRole;
        joined_at: Date;
        left_at: Date;
        left_reason: LeaveReason | null;
    }[]>;
    exportTeamPlayersExcel(season_team_id: number): Promise<Buffer>;
    exportImportTemplate(minRows?: number): Promise<Buffer>;
    /**
     * FIX MỚI: student_code bắt buộc trong schema (validate ở
     * importPlayerRowSchema), ghi vào User khi tạo mới hoặc backfill khi
     * user có sẵn nhưng chưa có. assertPlayerClassMatchesUser chạy trong
     * tx per-row, TRƯỚC khi tạo TeamPlayer — lỗi rơi vào catch hiện có,
     * tự động log vào result.errors[].reason theo đúng hành vi cũ (1 dòng
     * lỗi không ảnh hưởng dòng khác).
     *
     * FIX (roster cap): maxPlayers resolve 1 lần cho toàn batch (cố định
     * theo season_team_id, giống teamClassId). approvedCount khởi tạo từ
     * số TeamPlayer approved hiện có, tăng dần in-memory sau mỗi dòng
     * thành công — tránh query count lại DB mỗi dòng (N round-trip thừa),
     * cùng pattern với usedJerseyNumbers/teamPlayerSet đã có sẵn. Dòng nào
     * vượt max bị fail với lý do rõ ràng, KHÔNG chặn các dòng còn lại.
     */
    importTeamPlayersFromExcel(season_team_id: number, fileBuffer: Buffer | Uint8Array | ArrayBuffer): Promise<ImportResult>;
    /**
     * Copy roster từ 1 season_team NGUỒN sang season_team ĐÍCH — dùng khi đội
     * đăng ký mùa giải mới và muốn kế thừa danh sách cầu thủ cũ thay vì
     * add/import lại từ đầu. Chỉ copy TeamPlayer đang approved (không copy
     * pending/rejected). approval_status luôn reset về 'approved' vì đây là
     * đăng ký MỚI cho mùa MỚI, không kế thừa lịch sử duyệt của mùa cũ.
     *
     * Roster cap của season ĐÍCH vẫn được enforce (assertRosterCapacity) —
     * nếu roster nguồn > max_players_per_team của season đích, dừng lại và
     * báo lỗi rõ ràng thay vì copy tràn giới hạn.
     */
    copyRosterToSeasonTeam(fromSeasonTeamId: number, toSeasonTeamId: number): Promise<{
        copied: number;
        skipped: number;
        errors: {
            player_id: number;
            reason: string;
        }[];
    }>;
    private mapPlayer;
    private mapTeamPlayer;
}
//# sourceMappingURL=player.service.d.ts.map