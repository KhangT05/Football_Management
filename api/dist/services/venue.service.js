// venue.service.ts
import { Prisma } from "../generated/prisma/client.js";
import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
export class VenueService {
    prisma;
    query;
    queryDeleted;
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
                where.push({ deleted_at: null });
            },
        });
        this.queryDeleted = new Queryable(prisma.venue, {
            searchFields: ["name", "address"],
            sortable: ["id", "name", "deleted_at"],
            defaultSort: { column: "deleted_at", direction: "desc" },
            defaultPerPage: 20,
            maxPerPage: 100,
            beforeBuild: (where) => {
                where.push({ deleted_at: { not: null } });
            },
        });
    }
    findAll(req = {}) {
        return this.query.run(req);
    }
    findDeleted(req = {}) {
        return this.queryDeleted.run(req);
    }
    findById(id) {
        return this.prisma.venue.findFirst({
            where: { id, deleted_at: null },
        });
    }
    async findByIdOrFail(id) {
        const venue = await this.prisma.venue.findFirst({
            where: { id, deleted_at: null },
        });
        if (!venue)
            throw createAppError("NOT_FOUND", `Venue ${id} not found`);
        return venue;
    }
    async create(data) {
        try {
            return await this.prisma.venue.create({ data });
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw createAppError("CONFLICT", `Venue name already exists`);
            }
            throw e;
        }
    }
    // bỏ findByIdOrFail đầu — update trực tiếp với where { id, deleted_at: null },
    // dùng updateMany để phân biệt "not found" vs "found nhưng đã soft-delete" trong 1 round-trip
    async update(id, data) {
        try {
            const result = await this.prisma.venue.updateMany({
                where: { id, deleted_at: null },
                data,
            });
            if (result.count === 0) {
                throw createAppError("NOT_FOUND", `Venue ${id} not found`);
            }
            // updateMany không trả record, cần fetch lại — không tránh được round-trip thứ 2
            // nhưng đã bỏ round-trip check-tồn-tại ban đầu (giảm từ 2 read + 1 write xuống 1 write + 1 read)
            return await this.prisma.venue.findFirstOrThrow({ where: { id } });
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw createAppError("CONFLICT", `Venue name already exists`);
            }
            throw e;
        }
    }
    async softDelete(id) {
        const result = await this.prisma.venue.updateMany({
            where: { id, deleted_at: null },
            data: { deleted_at: new Date() },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `Venue ${id} not found or already deleted`);
        }
    }
    async restore(id) {
        const result = await this.prisma.venue.updateMany({
            where: { id, deleted_at: { not: null } },
            data: { deleted_at: null },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `Venue ${id} not found or not deleted`);
        }
        return this.prisma.venue.findFirstOrThrow({ where: { id } });
    }
}
//# sourceMappingURL=venue.service.js.map