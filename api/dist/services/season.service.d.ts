import { CreateSeasonDto, UpdateSeasonDto } from "../dtos/season.schema.js";
import { PrismaClient, Season } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
export declare class SeasonService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Season>>;
    findById(id: number): Promise<Season | null>;
    findByIdOrFail(id: number): Promise<Season>;
    create(data: CreateSeasonDto, userId: number): Promise<Season>;
    update(id: number, data: UpdateSeasonDto): Promise<Season>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=season.service.d.ts.map