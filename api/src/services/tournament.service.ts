import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PrismaClient, Tournament } from "../generated/prisma/client.js";
import { PaginatedResult, Queryable, QueryRequest } from "../libs/queryable.js";

export class TournamentService {

    private readonly query: Queryable<Tournament>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
        this.query = new Queryable<Tournament>(prisma.tournament, {
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Tournament>> {
        return this.query.run(req);
    }

    findById(id: number): Promise<Tournament | null> {
        return this.prisma.tournament.findUnique({
            where: { id },
        });
    }

    async findByIdOrFail(id: number): Promise<Tournament> {
        const tournament = await this.prisma.tournament.findUnique({
            where: { id },
        });
        if (!tournament) throw new Error(`tournament ${id} not found`);
        return tournament;
    }

    async create(data: CreateTournamentDto): Promise<Tournament> {
        return this.prisma.tournament.create({
            data: data
        });
    }

    async update(id: number, data: UpdateTournamentDto): Promise<Tournament> {
        await this.findByIdOrFail(id);
        return this.prisma.tournament.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.findByIdOrFail(id);
        await this.prisma.tournament.update({
            where: { id },
            data: { is_active: false },
        });
    }
}