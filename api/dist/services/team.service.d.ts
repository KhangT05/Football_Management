import { CreateTeamDto, UpdateTeamDto } from "../dtos/team.schema.js";
import { PrismaClient, Team } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
export declare class TeamService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Team>>;
    findByIdOrFail(id: number): Promise<Team>;
    create(data: CreateTeamDto, userId: number): Promise<Team>;
    update(id: number, data: UpdateTeamDto): Promise<Team>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=team.service.d.ts.map