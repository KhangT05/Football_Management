import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
export class TeamService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.team, {
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
    async findByIdOrFail(id) {
        const team = await this.prisma.team.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true
                    }
                },
                seasons: true
            }
        });
        if (!team)
            throw createAppError('NOT_FOUND', `Team ${id} not found`);
        return team;
    }
    async create(data, userId) {
        return this.prisma.team.create({
            data: { ...data, user_id: userId }
        });
    }
    async update(id, data) {
        await this.findByIdOrFail(id);
        return this.prisma.team.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        const activeSeasonCount = await this.prisma.season.count({
            where: {
                team_id: id,
                is_deleted: false,
                status: { in: ['registration_open', 'ongoing'] },
            },
        });
        if (activeSeasonCount > 0)
            throw createAppError('VALIDATION_ERROR', 'Cannot delete team with active seasons');
        await this.prisma.team.update({
            where: { id },
            data: {
                is_active: false,
                deleted_at: new Date()
            },
        });
    }
}
//# sourceMappingURL=team.service.js.map