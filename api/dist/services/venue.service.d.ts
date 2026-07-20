import { PrismaClient, Venue } from "../generated/prisma/client.js";
import { CreateVenueDto, UpdateVenueDto } from "../dtos/venue.schema.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class VenueService {
    private readonly prisma;
    private readonly query;
    private readonly queryDeleted;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Venue>>;
    findDeleted(req?: QueryRequest): Promise<PaginatedResult<Venue>>;
    findById(id: number): Promise<Venue | null>;
    findByIdOrFail(id: number): Promise<Venue>;
    create(data: CreateVenueDto): Promise<Venue>;
    update(id: number, data: UpdateVenueDto): Promise<Venue>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<Venue>;
}
//# sourceMappingURL=venue.service.d.ts.map