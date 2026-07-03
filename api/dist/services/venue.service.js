import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
export class VenueService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.venue, {
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
    findAll(req = {}) {
        return this.query.run(req);
    }
    findById(id) {
        return this.prisma.venue.findUnique({
            where: { id },
        });
    }
    async findByIdOrFail(id) {
        const venue = await this.prisma.venue.findUnique({
            where: { id },
        });
        if (!venue)
            throw new Error(`Venue ${id} not found`);
        return venue;
    }
    async create(data) {
        return this.prisma.venue.create({
            data: data
        });
    }
    async update(id, data) {
        await this.findByIdOrFail(id);
        return this.prisma.venue.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.prisma.venue.update({
            where: { id },
            data: { is_active: false },
        });
    }
    async restore(id) {
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
//# sourceMappingURL=venue.service.js.map