import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
export class SeasonService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.season, {
            searchFields: ["name", "description"],
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
        return this.query.run(req, {
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
    }
    findById(id) {
        return this.prisma.season.findUnique({
            where: {
                id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
    }
    async findByIdOrFail(id) {
        const season = await this.prisma.season.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });
        if (!season)
            throw createAppError('UNAUTHORIZED', `season ${id} not found`);
        return season;
    }
    async create(data, userId) {
        return this.prisma.season.create({
            data: { ...data, user_id: userId }
        });
    }
    async update(id, data) {
        await this.findByIdOrFail(id);
        return this.prisma.season.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.prisma.season.update({
            where: { id },
            data: { is_active: false },
        });
    }
}
//# sourceMappingURL=season.service.js.map