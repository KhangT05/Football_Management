import { CreateVenueDto, UpdateVenueDto } from "../dtos/venue.schema.js";
import { PrismaClient, Venue } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../libs/queryable.js";
export declare class VenueService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Venue>>;
    findById(id: number): Promise<Venue | null>;
    findByIdOrFail(id: number): Promise<Venue>;
    create(data: CreateVenueDto): Promise<Venue>;
    update(id: number, data: UpdateVenueDto): Promise<Venue>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=venue.service.d.ts.map