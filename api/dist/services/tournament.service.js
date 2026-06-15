import { Queryable } from "../libs/queryable.js";
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
        return this.prisma.tournament.findUnique({
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
                }
            }
        });
        if (!tournament)
            throw new Error(`tournament ${id} not found`);
        return tournament;
    }
    async create(data, userId) {
        return this.prisma.tournament.create({
            data: { ...data, user_id: userId }
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