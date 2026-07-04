import { PrismaClient, Phase } from "../generated/prisma/client.js";
import { AdminAddSeasonTeamDto, AssignGroupDto, SelfRegisterSeasonTeamDto, UpdateSeasonTeamStatusDto } from "../dtos/seasonTeam.schema.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class SeasonTeamService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<SeasonTeamWithRelations>>;
    findByIdOrFail(id: number): Promise<SeasonTeamWithRelations>;
    selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    /**
     * Duyệt team (ban tổ chức / admin). Tách khỏi updateStatus vì có
     * capacity check + season-state check riêng, không phải generic write.
     */
    approve(id: number, requesterId: number): Promise<SeasonTeamWithRelations>;
    /**
     * Chuyển season_team sang season khác (ban tổ chức / admin).
     * - Chỉ cho phép từ pending|approved — active/eliminated đã có match/group
     *   phụ thuộc (group_id, playerStatistics, matchLineups...), transfer sẽ
     *   orphan reference. Nếu sau này audit thấy FK an toàn, có thể nới.
     * - Deactivate record cũ (soft-delete) rồi createOrReactivate ở season đích,
     *   dùng lại đúng logic revive khi unique(season_id, team_id) đã tồn tại
     *   (case: team từng ở season đích rồi withdraw).
     * - Reset về pending ở season đích — buộc duyệt lại vì capacity/eligibility
     *   season mới có thể khác.
     */
    transferSeason(id: number, targetSeasonId: number, requesterId: number): Promise<SeasonTeamWithRelations>;
    /**
     * Generic status update (eliminated/withdrawn...). KHÔNG dùng cho approve —
     * dùng approve() riêng vì có capacity check. Có transition guard tối thiểu,
     * chưa lock — các transition ở đây không cạnh tranh capacity nên rủi ro
     * race thấp hơn approve, nhưng nếu thêm transition ảnh hưởng slot count
     * (vd revert approved -> pending) phải bọc transaction + lock như approve.
     */
    updateStatus(id: number, data: UpdateSeasonTeamStatusDto): Promise<SeasonTeamWithRelations>;
    /**
     * group_id trên SeasonTeam season-scoped, Group phase-scoped — season có
     * >1 phase round_robin sẽ overwrite lẫn nhau, không có FK nào chặn việc này.
     * Mitigate (không fix triệt để) bằng cách chỉ cho gán khi: team đã approved,
     * group/phase còn active, phase đúng format round_robin, group thuộc đúng
     * season của team.
     */
    assignGroup(id: number, data: AssignGroupDto): Promise<SeasonTeamWithRelations>;
    softDelete(id: number): Promise<void>;
    private assertSlotAvailable;
    /**
     * @@unique([season_id, team_id]) không exclude deleted_at (MySQL không có
     * partial unique index). Team withdraw rồi đăng ký lại (hoặc được transfer
     * đến) phải reactivate row cũ, không create mới — create thẳng sẽ đụng
     * unique constraint.
     *
     * FIX: nhánh tạo mới (create) giờ set `is_active: true` TƯỜNG MINH thay
     * vì phụ thuộc default của cột trong Prisma schema. Đây chính là nguyên
     * nhân của bug "team đã approved nhưng không hiện trong danh sách" —
     * endpoint GET /seasonteams luôn ép where { is_active: true } (xem
     * constructor Queryable ở trên), nên bất kỳ record nào insert mà cột
     * is_active không đúng true (default sai, hoặc insert tay qua
     * phpMyAdmin bỏ trống cột) sẽ bị ẩn hoàn toàn khỏi mọi danh sách dù
     * status = approved. Set tường minh ở đây đảm bảo record tạo qua API
     * luôn đúng, không còn phụ thuộc vào default của DB.
     */
    private createOrReactivate;
    getOrCreateGroupPhase(seasonId: number): Promise<Phase>;
}
//# sourceMappingURL=seasonTeam.service.d.ts.map