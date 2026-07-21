import { CreateTeamDto, UpdateTeamDto } from "../dtos/team.schema.js";
import { PrismaClient, Team, TeamLeader } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class TeamService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Team>>;
    findByIdOrFail(id: number): Promise<Team>;
    /** Lightweight existence check — không join, chỉ lấy fields cần thiết */
    private assertExists;
    /**
     * FIX: mới thêm. class_id trên Team giờ là FK optional — Prisma không
     * validate trước insert/update, chỉ throw P2003 raw ở DB nếu id không
     * tồn tại. Check tường minh ở đây để trả CONFLICT/BAD_REQUEST rõ ràng
     * thay vì lỗi FK constraint lộ ra ngoài. Bỏ qua nếu class_id undefined
     * (không đổi) hoặc null (bỏ gán lớp — hợp lệ).
     */
    private assertClassExists;
    /** user_id = creator, không phải captain */
    create(data: CreateTeamDto, userId: number): Promise<Team>;
    update(id: number, data: UpdateTeamDto): Promise<Team>;
    softDelete(id: number): Promise<void>;
    getCaptain(teamId: number): Promise<TeamLeader | null>;
    assignCaptain(teamId: number, newUserId: number, requesterId: number, requesterIsAdmin: boolean): Promise<TeamLeader>;
    restore(id: number): Promise<Team>;
    /**
     * Toàn bộ cầu thủ đã/đang gắn với team này, qua mọi season — merge
     * TeamPlayer (live) + TeamPlayerHistory (đã rời), sort theo joined_at desc.
     * Join qua season_team.team_id vì TeamPlayer/TeamPlayerHistory không có
     * team_id trực tiếp (giống pattern StatisticsService.getPlayerParticipationStats).
     */
    getHistoryPlayers(teamId: number): Promise<{
        team_id: number;
        total: number;
        players: Array<{
            player_id: number;
            player_name: string;
            season_id: number;
            season_name: string;
            jersey_number: number | null;
            role: string;
            joined_at: string;
            left_at: string | null;
            left_reason: string | null;
            is_current: boolean;
        }>;
    }>;
}
//# sourceMappingURL=team.service.d.ts.map