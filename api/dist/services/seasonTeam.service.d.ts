import { PrismaClient, SeasonTeamStatus, SeasonStatus, Phase } from "../generated/prisma/client.js";
import { AdminAddSeasonTeamDto, AssignGroupDto, SelfRegisterSeasonTeamDto, TransferRosterInput, UpdateSeasonTeamStatusDto } from "../dtos/seasonTeam.schema.js";
import { BulkActionResult, SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";
export type SeasonRegistrationEligibility = {
    season_id: number;
    name: string;
    start_date: Date | null;
    registration_deadline: Date | null;
    season_status: SeasonStatus;
    tournament: {
        id: number;
        name: string;
        logo: string | null;
    };
    already_registered: boolean;
    conflict: {
        playerName: string;
        teamName: string;
    } | null;
    eligible: boolean;
};
export declare class SeasonTeamService {
    private readonly prisma;
    private readonly groupService;
    private readonly query;
    constructor(prisma: PrismaClient, groupService: GroupService);
    findAll(req?: QueryRequest): Promise<PaginatedResult<SeasonTeamWithRelations>>;
    findByIdOrFail(id: number): Promise<SeasonTeamWithRelations>;
    /**
     * FIX (multi-team ownership bug): xem comment gốc — verify team_id thuộc
     * đúng user, không suy đoán team đầu tiên tìm thấy.
     *
     * FIX MỚI (race condition trên createOrReactivate): findUnique-then-create
     * trong createOrReactivate KHÔNG atomic với row chưa tồn tại — FOR UPDATE
     * ở đầu hàm này chỉ lock bảng `seasons`, không lock được cặp
     * (season_id, team_id) vì record đó chưa có để lock. Nếu 2 request
     * register() cùng season_id + team_id chạy gần như đồng thời (double-
     * click, hoặc network retry), cả 2 đều đọc `existing = null`, cả 2 đều
     * gọi tx.seasonTeam.create() — request commit sau vi phạm unique
     * constraint (season_id, team_id), Prisma ném P2002 THÔ, không đi qua
     * createAppError. FE nhận lỗi không đúng shape -> hiển thị message
     * generic "Request failed" thay vì lý do thật.
     *
     * Bọc toàn bộ transaction trong try/catch, bắt riêng P2002 -> convert
     * thành AppError CONFLICT có message rõ ràng. Đây là lớp phòng thủ cuối
     * — không thay thế việc chặn double-submit ở FE (xem MyTeam.jsx /
     * SeasonRegistrationModal.jsx), vì request hợp lệ vẫn có thể trùng thời
     * điểm do mạng chậm/retry ngoài tầm kiểm soát của FE.
     */
    selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    /**
     * FIX (cùng lý do với selfRegister): adminAdd cũng đi qua
     * createOrReactivate nên có cùng race window — bọc try/catch tương tự.
     */
    adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    approve(id: number, requesterId: number): Promise<SeasonTeamWithRelations>;
    transferSeason(id: number, targetSeasonId: number, requesterId: number, rosterInput: TransferRosterInput, requesterIsAdmin?: boolean): Promise<SeasonTeamWithRelations>;
    updateStatus(id: number, data: UpdateSeasonTeamStatusDto): Promise<SeasonTeamWithRelations>;
    assignGroup(id: number, data: AssignGroupDto): Promise<SeasonTeamWithRelations>;
    softDelete(id: number): Promise<void>;
    private assertSlotAvailable;
    private assertNoPlayerConflict;
    getTeamRegistrationEligibility(teamId: number): Promise<SeasonRegistrationEligibility[]>;
    private createOrReactivate;
    listBySeasonWithTeamInfo(seasonId: number, statuses?: SeasonTeamStatus[]): Promise<{
        season: {
            id: number;
            name: string;
            status: SeasonStatus;
            tournament: {
                name: string;
                id: number;
                logo: string | null;
            };
        };
        teams: {
            season_team_id: number;
            team_id: number;
            team_name: string;
            team_logo: string | null;
            status: SeasonTeamStatus;
            group_id: number | null;
        }[];
    }>;
    getOrCreateGroupPhase(seasonId: number, stageOrder?: number): Promise<Phase>;
    bulkApprove(seasonId: number, ids: number[], requesterId: number): Promise<BulkActionResult>;
    private assertRosterWithinRule;
    bulkReject(ids: number[]): Promise<BulkActionResult>;
    private transferRosterPlayers;
    private assertSinglePlayerNoConflict;
}
//# sourceMappingURL=seasonTeam.service.d.ts.map