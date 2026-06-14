import { Queryable } from "../libs/queryable.js";
export class TournamentService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.tournament, {
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
        return this.query.run(req);
    }
    findById(id) {
        return this.prisma.tournament.findUnique({
            where: { id },
        });
    }
    async findByIdOrFail(id) {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id },
        });
        if (!tournament)
            throw new Error(`tournament ${id} not found`);
        return tournament;
    }
    async create(data) {
        return this.prisma.tournament.create({
            data: data
        });
    }
    async update(id, data) {
        await this.findByIdOrFail(id);
        return this.prisma.tournament.update({
            where: { id },
            data,
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.prisma.tournament.update({
            where: { id },
            data: { is_active: false },
        });
    }
}
//# sourceMappingURL=tournament.service.js.map