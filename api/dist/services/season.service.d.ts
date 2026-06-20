import { CreateSeasonDto, UpdateSeasonDto } from "../dtos/season.schema.js";
import { PrismaClient, Season, SeasonStatus } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class SeasonService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Season>>;
    findByIdOrFail(id: number): Promise<Season>;
    create(data: CreateSeasonDto, userId: number): Promise<Season>;
    update(id: number, data: UpdateSeasonDto): Promise<Season>;
    updateStatus(id: number, newStatus: SeasonStatus, meta?: {
        cancel_reason?: string;
    }): Promise<Season>;
    softDelete(id: number): Promise<void>;
    private validateDatesIfPresent;
    private validateStatusTransition;
    private validateStatusPreConditions;
    private validateStatusAllowsEdit;
}
//# sourceMappingURL=season.service.d.ts.map