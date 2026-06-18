import { createAppError } from "../common/app.error.js";
import { CreateTeamDto, UpdateTeamDto } from "../dtos/team.schema.js";
import { PrismaClient, Team } from "../generated/prisma/client.js";
import { PaginatedResult, Queryable, QueryRequest } from "../libs/queryable.js";

export class TeamService {

    private readonly query: Queryable<Team>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
        this.query = new Queryable<Team>(prisma.team, {
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Team>> {
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

    async findByIdOrFail(id: number): Promise<Team> {
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
        if (!team) throw createAppError('NOT_FOUND', `Team ${id} not found`);
        return team;
    }

    async create(data: CreateTeamDto, userId: number): Promise<Team> {
        return this.prisma.team.create({
            data: { ...data, user_id: userId }
        });
    }

    async update(id: number, data: UpdateTeamDto): Promise<Team> {
        await this.findByIdOrFail(id);
        return this.prisma.team.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: number): Promise<void> {
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