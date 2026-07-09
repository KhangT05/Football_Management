import { PrismaClient, SeasonTeamStatus, SeasonStatus, Phase } from "../generated/prisma/client.js";
import { AdminAddSeasonTeamDto, AssignGroupDto, SelfRegisterSeasonTeamDto, UpdateSeasonTeamStatusDto } from "../dtos/seasonTeam.schema.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";
export declare class SeasonTeamService {
    private readonly prisma;
    private readonly groupService;
    private readonly query;
    constructor(prisma: PrismaClient, groupService: GroupService);
    findAll(req?: QueryRequest): Promise<PaginatedResult<SeasonTeamWithRelations>>;
    findByIdOrFail(id: number): Promise<SeasonTeamWithRelations>;
    selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    /**
     * FIX (auto-assign hook): adminAdd() có thể tạo thẳng status='approved'
     * (bỏ qua approve()) — nếu season đang dùng flow group_count (group đã
     * pre-tạo rỗng lúc Season.create), team tạo qua đây cũng phải tự fill
     * vào group ngay, không chỉ team đi qua approve() mới được xử lý.
     */
    adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    /**
     * FIX (race condition — capacity check thiếu season lock): trước đây
     * chỉ lock `season_teams WHERE id=${id}`, KHÔNG lock season. 2 request
     * approve() đồng thời cho 2 SeasonTeam KHÁC NHAU cùng season đều đọc
     * snapshot `count approved < maxTeams`, cùng pass check, cùng update —
     * approved count có thể vượt max_teams (giống lost-update pattern đã
     * fix ở StandingsService.recomputeGroupStandings). selfRegister/adminAdd
     * đã lock season đúng; approve() thiếu — bổ sung ngay đầu transaction.
     *
     * FIX (auto-assign hook): sau khi set approved, gọi
     * GroupService.autoAssignApprovedTeamToGroup — no-op (trả null) nếu
     * season không dùng flow group_count, group_id giữ nguyên null chờ
     * drawGroups thủ công như trước.
     */
    approve(id: number, requesterId: number): Promise<SeasonTeamWithRelations>;
    transferSeason(id: number, targetSeasonId: number, requesterId: number): Promise<SeasonTeamWithRelations>;
    updateStatus(id: number, data: UpdateSeasonTeamStatusDto): Promise<SeasonTeamWithRelations>;
    /**
     * FIX (capacity check thiếu — inconsistent với GroupService.assignTeamToGroup):
     * trước đây method này set group_id trực tiếp KHÔNG check teams_per_group,
     * trong khi GroupService.assignTeamToGroup (route khác, cùng field
     * group_id) có FOR UPDATE + capacity check đầy đủ. 2 đường ghi cùng dữ
     * liệu nhưng validate khác nhau — group có thể vượt capacity nếu FE gọi
     * qua route seasonTeam.assignGroup. Thêm lock group + capacity check
     * đồng nhất với GroupService.
     */
    assignGroup(id: number, data: AssignGroupDto): Promise<SeasonTeamWithRelations>;
    softDelete(id: number): Promise<void>;
    private assertSlotAvailable;
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
}
//# sourceMappingURL=seasonTeam.service.d.ts.map