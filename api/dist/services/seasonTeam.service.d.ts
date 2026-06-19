import { PrismaClient } from "../generated/prisma/client.js";
import { AdminAddSeasonTeamDto, AssignGroupDto, SelfRegisterSeasonTeamDto, UpdateSeasonTeamStatusDto } from "../dtos/seasonTeam.schema.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
export declare class SeasonTeamService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<SeasonTeamWithRelations>>;
    findByIdOrFail(id: number): Promise<SeasonTeamWithRelations>;
    selfRegister(data: SelfRegisterSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
    adminAdd(data: AdminAddSeasonTeamDto, userId: number): Promise<SeasonTeamWithRelations>;
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
     * partial unique index). Team withdraw rồi đăng ký lại phải reactivate row
     * cũ, không create mới — create thẳng sẽ đụng unique constraint.
     */
    private createOrReactivate;
}
//# sourceMappingURL=seasonTeam.service.d.ts.map