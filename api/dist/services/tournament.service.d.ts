import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PrismaClient, Tournament } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
export declare class TournamentService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Tournament>>;
    findById(id: number): Promise<Tournament | null>;
    findByIdOrFail(id: number): Promise<Tournament>;
    create(data: CreateTournamentDto): Promise<Tournament>;
    update(id: number, data: UpdateTournamentDto): Promise<Tournament>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=tournament.service.d.ts.map