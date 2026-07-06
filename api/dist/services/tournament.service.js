import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
import { storageService } from "./storage.service.js";
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
                },
                seasons: true
            }
        });
        if (!tournament)
            throw createAppError('NOT_FOUND', `Tournament ${id} not found`);
        return tournament;
    }
    async create(data, userId) {
        return this.prisma.tournament.create({
            data: { ...data, user_id: userId }
        });
    }
    // tournament.service.ts
    async updateWithLogo(id, data, logoFile) {
        const existing = logoFile ? await this.findByIdOrFail(id) : null;
        let logo;
        if (logoFile) {
            const result = await storageService.upload({ namespace: "tournaments", kind: "logo", file: logoFile });
            logo = result.url;
        }
        const updated = await this.prisma.tournament.update({
            where: { id },
            data: { ...data, ...(logo !== undefined && { logo }) },
        });
        return updated;
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        const activeSeasonCount = await this.prisma.season.count({
            where: {
                tournament_id: id,
                is_active: true, // FIX: đang là false, guard bị vô hiệu hóa
                status: { in: ['registration_open', 'ongoing'] },
            },
        });
        if (activeSeasonCount > 0)
            throw createAppError('VALIDATION_ERROR', 'Cannot delete tournament with active seasons');
        await this.prisma.tournament.update({
            where: { id },
            data: { is_active: false },
        });
    }
    async restore(id) {
        const tournament = await this.findByIdOrFail(id); // không filter is_active nên tìm được record đã soft-delete
        if (tournament.is_active)
            throw createAppError('VALIDATION_ERROR', `Tournament ${id} is not deleted`);
        return this.prisma.tournament.update({
            where: { id },
            data: { is_active: true },
        });
    }
}
//# sourceMappingURL=tournament.service.js.map