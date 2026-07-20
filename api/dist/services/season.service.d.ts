import { CancelSeasonDto, CreateSeasonDto, UpdateSeasonDto } from "../dtos/season.schema.js";
import { PrismaClient, Season, SeasonStatus } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
import { GroupService } from "./group.service.js";
export declare class SeasonService {
    private readonly prisma;
    private readonly groupService;
    private readonly query;
    constructor(prisma: PrismaClient, groupService: GroupService);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Season>>;
    findByIdOrFail(id: number): Promise<Season>;
    /**
     * FIX (stage 3 → stage 4 wizard): CreateSeasonDto.group_count (nếu có,
     * dùng cho flow round_robin nhập số group TRƯỚC khi season tồn tại) kích
     * hoạt GroupService.createEmptyRoundRobinGroups trong CÙNG transaction
     * với season insert — tạo Phase round_robin + N group RỖNG ngay. Team
     * approve sau tự fill dần (SeasonTeamService.approve/adminAdd gọi
     * GroupService.autoAssignApprovedTeamToGroup). group_count optional —
     * không truyền vẫn dùng được flow cũ (createGroupsBulk/drawGroups thủ
     * công sau khi có team).
     *
     * is_registration_open set tường minh false — season luôn khởi tạo
     * 'upcoming', field is_registration_open tách riêng khỏi status enum
     * (xem updateStatus/cancel) nên phải đồng bộ ngay từ create(), không để
     * default cột tự lo.
     */
    create(data: CreateSeasonDto, userId: number): Promise<Season>;
    /**
     * FIX (field-level authorization hole): trước đây validateStatusAllowsEdit
     * là no-op — update() nhận và ghi mọi field trong UpdateSeasonDto ở BẤT KỲ
     * status nào, kể cả 'finished'/'cancelled'. FE chỉ ẩn nút Edit (cosmetic),
     * gọi thẳng API vẫn sửa được toàn bộ. Giờ dùng filterUpdatableFields để
     * chặn ở tầng service — 'ongoing' chỉ cho sửa 3 field bank (fix sai sót
     * nhập liệu, KHÔNG cho đổi thể lệ/ngày tháng giữa giải đang chạy);
     * 'finished'/'cancelled' không match policy nào → reject toàn bộ.
     *
     * Nếu payload gửi lên toàn field KHÔNG được phép ở status hiện tại (VD FE
     * cũ vẫn gửi full payload cho season 'ongoing'), throw ngay thay vì âm
     * thầm no-op 200 — tránh admin tưởng đã lưu nhưng thực ra bị silently
     * ignore (đây là kiểu lỗi UX y hệt bankAllOrNothing đang tránh ở schema).
     */
    update(id: number, data: UpdateSeasonDto): Promise<Season>;
    cancel(id: number, data: CancelSeasonDto): Promise<Season>;
    /**
     * FIX (is_registration_open dead field): schema có is_registration_open
     * TÁCH RIÊNG khỏi status enum, nhưng trước đây chỉ status được update —
     * is_registration_open giữ nguyên default (false) vĩnh viễn, kể cả khi
     * status đã chuyển sang 'registration_open'. Bất kỳ query/filter nào
     * dùng is_registration_open thay vì status (rất dễ xảy ra vì tên field
     * gợi ý đúng mục đích đó) sẽ luôn ra sai — season đang mở đăng ký vẫn bị
     * lọc ra ngoài. Set field này bám sát theo status transition ngay tại
     * đây, không để 2 nguồn sự thật (status vs is_registration_open) lệch nhau.
     *
     * FIX (roster tối thiểu — bug mới phát hiện): tournament_rule.min_players_per_team
     * tồn tại trong schema nhưng trước đây KHÔNG được đọc ở đâu cả. Season
     * có thể chuyển 'ongoing' với 1 team chỉ có 2 cầu thủ đã approved —
     * assertRosterMinimums() chặn NGAY TRƯỚC autoFinalizeGroups, liệt kê rõ
     * team nào thiếu quân số thay vì để lộ ra muộn khi tạo match/lineup.
     * Đặt trước autoFinalizeGroups vì đây là check rẻ (đếm), nên fail sớm
     * trước khi tốn công re-draw group.
     *
     * FIX (auto-finalize groups khi đóng đăng ký): trước đây chuyển sang
     * 'ongoing' không đụng gì tới group cả — nếu season được tạo sẵn N group
     * rỗng (flow group_count lúc create) mà số team approved thực tế THẤP
     * HƠN NHIỀU so với dự kiến ban đầu (VD dự kiến 22 team/2 group nhưng chỉ
     * có 3 team đăng ký), season vẫn chuyển 'ongoing' bình thường và để lại
     * group với 1-2 team — vô nghĩa với thể thức round_robin, không ai được
     * cảnh báo. Gọi groupService.autoFinalizeGroups NGAY TRƯỚC khi update
     * status — tính lại số group cho khớp team thực tế và re-draw, hoặc
     * throw CONFLICT nếu team quá ít để tổ chức (chặn hẳn việc chuyển
     * 'ongoing' trong trường hợp đó thay vì âm thầm để lại group hỏng).
     *
     * Lưu ý: đây là NHIỀU thao tác riêng (assertRosterMinimums đọc thuần,
     * autoFinalizeGroups tự mở transaction, season.update là 1 statement
     * rời) — không atomic tuyệt đối, nhưng chấp nhận được vì đây là thao
     * tác admin tần suất thấp; nếu 1 bước throw, các bước sau không chạy
     * nên không có state nửa vời (status vẫn giữ nguyên registration_open).
     */
    /**
     * Manual — admin bấm tay ở bất kỳ transition hợp lệ nào trong
     * STATUS_TRANSITIONS, kể cả ongoing/finished. Route/controller validate
     * qua UpdateSeasonStatusSchema (loại 'cancelled' — đi qua cancel() riêng
     * với cancel_reason bắt buộc).
     *
     * Idempotent với cron: nếu cron đã tự chuyển season sang 'ongoing' rồi,
     * admin bấm lại 'ongoing' sẽ fail ở validateStatusTransition (vì
     * STATUS_TRANSITIONS['ongoing'] không chứa 'ongoing') — không có race
     * gây double-processing (autoFinalizeGroups chạy đúng 1 lần).
     */
    updateStatus(id: number, newStatus: SeasonStatus): Promise<Season>;
    /**
     * FIX (chung logic ongoing-transition giữa updateStatus manual và cron):
     * trước đây updateStatus() và runAutoTransitions() mỗi bên tự viết lại
     * chuỗi "check roster -> finalize groups -> update status", dẫn tới rủi
     * ro 1 bên được vá (VD thêm assertRosterMinimums) còn bên kia bị bỏ
     * quên. Gộp về 1 hàm duy nhất — cả 2 entrypoint đều gọi qua đây, đảm
     * bảo luôn nhất quán.
     */
    private activateSeason;
    /**
     * FIX (roster tối thiểu): so sánh số TeamPlayer approved của mỗi
     * season_team (status approved/active — xem ROSTER_CHECK_SEASON_TEAM_STATUSES)
     * với tournament_rule.min_players_per_team. Season chưa gán rule
     * (tournament_rule_id null) -> bỏ qua, không phải lỗi (dù trong thực tế
     * create() luôn bắt buộc rule, giữ nhánh này cho an toàn/migration-safe).
     *
     * Throw liệt kê TÊN team thiếu quân số — admin cần biết ngay đội nào,
     * không chỉ biết "có lỗi", để xử lý (bổ sung cầu thủ hoặc rút team đó).
     */
    private assertRosterMinimums;
    /**
     * Cron entry point — bổ sung SONG SONG với updateStatus() manual ở trên,
     * không thay thế. Wire vào scheduler (node-cron, BullMQ repeatable job,
     * hoặc pg_cron) chạy mỗi vài phút:
     *
     *   cron.schedule('*\/5 * * * *', () => seasonService.runAutoTransitions());
     *
     * Mục đích: bấm HỘ nếu tới ngày mà chưa admin nào bấm tay. Nếu admin đã
     * bấm tay trước đó rồi thì season không còn match điều kiện WHERE
     * (status đã đổi) → cron bỏ qua, không double-process. Idempotent theo
     * cách chạy trễ/lặp không gây lệch state.
     *
     * FIX: registration_open -> ongoing giờ đi qua activateSeason() dùng
     * chung với updateStatus() — bao gồm cả assertRosterMinimums(). Trước
     * đây cron gọi thẳng autoFinalizeGroups + season.update, bỏ qua hoàn
     * toàn check roster tối thiểu (season có thể tự động mở dù có team
     * thiếu quân số, chỉ path admin bấm tay mới được bảo vệ — bug do 2 nơi
     * viết code trùng lặp, giờ không còn nữa).
     */
    runAutoTransitions(): Promise<{
        toOngoing: number;
        toFinished: number;
        failed: number[];
    }>;
    softDelete(id: number): Promise<void>;
    /**
     * Trả về subset của `data` mà status hiện tại được phép ghi. Đây là
     * single source of truth cho field-level permission — FE chỉ dùng để
     * render UI, còn enforcement thật nằm ở đây.
     */
    private filterUpdatableFields;
    private validateDateRelationships;
    private validateFutureIfProvided;
    private validateStatusTransition;
    private validateStatusPreConditions;
    private validateStatusAllowsDelete;
    restore(id: number): Promise<Season>;
}
//# sourceMappingURL=season.service.d.ts.map