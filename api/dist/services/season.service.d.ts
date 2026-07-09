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
     * Lưu ý: đây là 2 transaction riêng (autoFinalizeGroups tự mở
     * transaction, season.update là 1 statement rời) — không atomic tuyệt
     * đối, nhưng chấp nhận được vì đây là thao tác admin tần suất thấp;
     * nếu autoFinalizeGroups throw, season.update không chạy nên không có
     * state nửa vời (status vẫn giữ nguyên registration_open).
     */
    updateStatus(id: number, newStatus: SeasonStatus, meta?: {
        cancel_reason?: string;
    }): Promise<Season>;
    softDelete(id: number): Promise<void>;
    private validateDateRelationships;
    private validateFutureIfProvided;
    private validateStatusTransition;
    private validateStatusPreConditions;
    private validateStatusAllowsEdit;
}
//# sourceMappingURL=season.service.d.ts.map