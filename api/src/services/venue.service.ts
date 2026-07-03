
import { createAppError } from "../common/app.error.js";
import { CreateVenueDto, UpdateVenueDto } from "../dtos/venue.schema.js";
import { PrismaClient, Venue } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";

export class VenueService {

    private readonly query: Queryable<Venue>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
        this.query = new Queryable<Venue>(prisma.venue, {
            searchFields: ["name", "address"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "id", direction: "asc" },
            filterable: ["is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ is_active: true });
            },
        });
    }

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Venue>> {
        return this.query.run(req);
    }

    findById(id: number): Promise<Venue | null> {
        return this.prisma.venue.findUnique({
            where: { id },
        });
    }

    async findByIdOrFail(id: number): Promise<Venue> {
        const venue = await this.prisma.venue.findUnique({
            where: { id },
        });
        if (!venue) throw new Error(`Venue ${id} not found`);
        return venue;
    }

    async create(data: CreateVenueDto): Promise<Venue> {
        return this.prisma.venue.create({
            data: data
        });
    }

    async update(id: number, data: UpdateVenueDto): Promise<Venue> {
        await this.findByIdOrFail(id);
        return this.prisma.venue.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.findByIdOrFail(id);
        await this.prisma.venue.update({
            where: { id },
            data: { is_active: false },
        });
    }
    async restore(id: number): Promise<Venue> {
        const result = await this.prisma.venue.updateMany({
            where: { id, deleted_at: { not: null } },
            data: {
                deleted_at: null,
            },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `Venue ${id} not found or not deleted`);
        }
        return this.findByIdOrFail(id);
    }
}