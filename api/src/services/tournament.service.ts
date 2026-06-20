import { createAppError } from "../common/app.error.js";
import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PrismaClient, Tournament } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";

/**
 * Upload logo → lưu url + publicId vào DB trong cùng 1 flow.
 *
 * Failure modes:
 * - Upload cloud thành công nhưng DB fail → publicId bị orphan trên Cloudinary.
 *   Fix: lưu publicId vào DB trước (pending), sau khi upload xong update status.
 *   Hoặc: idempotency — dùng deterministic publicId từ tournamentId, overwrite: true.
 *
 * Design decision ở đây: simple path — nếu DB fail, caller phải retry upload.
 * Acceptable nếu logo upload không critical. Nếu cần strong guarantee → xem comment bên dưới.
 */

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

    async findByIdOrFail(id: number): Promise<Tournament> {
        const tournament = await this.prisma.tournament.findUnique({
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
        if (!tournament) throw createAppError('NOT_FOUND', `Tournament ${id} not found`);
        return tournament;
    }

    async create(data: CreateTournamentDto, userId: number): Promise<Tournament> {
        return this.prisma.tournament.create({
            data: { ...data, user_id: userId }
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

        const activeSeasonCount = await this.prisma.season.count({
            where: {
                tournament_id: id,
                is_deleted: false,
                status: { in: ['registration_open', 'ongoing'] },
            },
        });
        if (activeSeasonCount > 0)
            throw createAppError('VALIDATION_ERROR', 'Cannot delete tournament with active seasons');

        await this.prisma.tournament.update({
            where: { id },
            data: { is_active: false, deleted_at: new Date() },
        });
    }
}