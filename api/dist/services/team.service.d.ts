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
    /** user_id = creator, không phải captain */
    create(data: CreateTeamDto, userId: number): Promise<Team>;
    update(id: number, data: UpdateTeamDto): Promise<Team>;
    softDelete(id: number): Promise<void>;
    getCaptain(teamId: number): Promise<TeamLeader | null>;
    assignCaptain(teamId: number, newUserId: number, requesterId: number, requesterIsAdmin: boolean): Promise<TeamLeader>;
    restore(id: number): Promise<Team>;
}
//# sourceMappingURL=team.service.d.ts.map