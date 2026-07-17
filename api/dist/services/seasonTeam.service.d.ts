import { PrismaClient, SeasonTeamStatus, SeasonStatus, Phase } from "../generated/prisma/client.js";
import { AdminAddSeasonTeamDto, AssignGroupDto, SelfRegisterSeasonTeamDto, UpdateSeasonTeamStatusDto } from "../dtos/seasonTeam.schema.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";
export type SeasonRegistrationEligibility = {
    season_id: number;
    name: string;
    start_date: Date | null;
    registration_deadline: Date | null;
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
     * FIX (multi-team ownership bug): trước đây resolve team qua
     * `findFirst({ where: { user_id: userId } })` — không có orderBy, không
     * scope theo team_id nào cả. Với user sở hữu NHIỀU team, request đăng ký
     * season cho team B thực tế bị ghi nhầm vào team đầu tiên user tạo
     * (team A), vì Prisma trả về bản ghi bất kỳ khớp user_id đầu tiên.
     * Bug này SILENT — không throw lỗi, dữ liệu sai lặng lẽ.
     *
     * Fix: bắt buộc `data.team_id` trong request (FE phải gửi kèm, xem
     * SelfRegisterSeasonTeamDto), verify đúng team đó thuộc về user hiện
     * tại thay vì suy đoán "1 team bất kỳ của user".
     */
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
     *
     * NOTE (player conflict): KHÔNG re-check player conflict ở approve().
     * Lý do: selfRegister/adminAdd đã chặn conflict ngay lúc tạo pending,
     * nên tại thời điểm approve(), record đã tồn tại hợp lệ. Trường hợp
     * duy nhất phát sinh conflict MỚI giữa lúc pending -> approve là admin
     * chủ động thêm player trùng vào team khác sau khi team A đã pending —
     * đây là thao tác riêng ở TeamPlayer, nên chặn ở chỗ thêm player vào
     * team (ngoài scope service này), không chặn ở approve().
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
    /**
     * FIX (player conflict): chặn trường hợp 1 player đang active/approved
     * ở `teamId` (team đang đăng ký/transfer) mà player đó ĐỒNG THỜI cũng
     * đang active/approved ở 1 team KHÁC, và team khác đó đã có season_team
     * (pending/approved/active, chưa xoá) trong CÙNG season này.
     *
     * Không chặn: player thuộc nhiều team nhưng các team đó không đụng
     * nhau ở season này (khác season, hoặc team kia đã withdrawn/eliminated).
     *
     * LIMITATION (race condition): check này đọc snapshot tại thời điểm
     * gọi, không có row nào đại diện cho cặp (player, season) để FOR UPDATE
     * trực tiếp. Nếu 2 request đăng ký của 2 team share player chạy TRÙNG
     * thời điểm (cùng mili-giây), lý thuyết cả 2 vẫn có thể pass check
     * trước khi bên kia commit. Case này hiếm (đăng ký giải không phải
     * high-frequency operation) — nếu cần chặn tuyệt đối, cân nhắc thêm
     * `pg_advisory_xact_lock(hashtext('player:' || player_id))` cho từng
     * player_id của team trước khi query, hoặc nâng isolation level lên
     * Serializable cho transaction này.
     */
    private assertNoPlayerConflict;
    /**
     * NEW — trả về eligibility đăng ký cho MỌI season đang mở đăng ký, tính
     * sẵn `already_registered` + `conflict` (player trùng với team khác đã
     * ở season đó) cho team truyền vào.
     *
     * Lý do cần endpoint riêng thay vì chỉ dựa vào lỗi từ selfRegister():
     * trước đây FE tự suy already_registered bằng cách diff 2 danh sách
     * (season mở + season_team đã có) và hoàn toàn không biết gì về
     * player-conflict — conflict chỉ lộ ra SAU khi user bấm "Đăng ký" và
     * request fail. Endpoint này cho phép disable nút + hiển thị lý do
     * NGAY trong modal, trước khi user thao tác.
     *
     * PERF: gom toàn bộ season mở vào 1-2 query (không loop per season) —
     * tránh N+1 khi season mở đăng ký cùng lúc nhiều giải.
     *
     * LIMITATION: đây là snapshot đọc, cùng race-condition window đã ghi ở
     * assertNoPlayerConflict (2 request đăng ký chạy trùng thời điểm vẫn có
     * thể lách qua bước hiển thị này). assertNoPlayerConflict trong
     * selfRegister() transaction vẫn là nguồn sự thật cuối cùng — endpoint
     * này CHỈ phục vụ UX, không thay thế check đó.
     */
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
}
//# sourceMappingURL=seasonTeam.service.d.ts.map