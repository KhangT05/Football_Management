import { Controller } from "tsoa";
import { VenueService } from "../services/venue.service.js";
import type { Venue } from "../generated/prisma/client.js";
import { type CreateVenueDto, type UpdateVenueDto } from "../dtos/venue.schema.js";
import { PaginatedResult } from "../libs/queryable.js";
export declare class VenueController extends Controller {
    private service;
    constructor(service: VenueService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<Venue>>;
    findById(id: number): Promise<Venue>;
    create(body: CreateVenueDto): Promise<Venue>;
    update(id: number, body: UpdateVenueDto): Promise<Venue>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=venue.controller.d.ts.map