import { Prisma } from "../generated/prisma/client.js";
import { createAppError } from "../common/app.error.js";
import { Queryable } from "../libs/queryable.js";
export class ClassService {
    prisma;
    query;
    constructor(prisma) {
        this.prisma = prisma;
        this.query = new Queryable(prisma.class, {
            searchFields: ["name"],
            sortable: ["id", "name", "created_at"],
            defaultSort: { column: "name", direction: "asc" },
            filterable: ["is_active"],
            defaultPerPage: 20,
            maxPerPage: 100,
        });
    }
    /** Danh sách active, không phân trang — dùng cho dropdown/select. */
    listActive() {
        return this.prisma.class.findMany({ where: { is_active: true }, orderBy: { name: "asc" } });
    }
    /** Danh sách có phân trang/tìm kiếm/sort — dùng cho trang quản trị. */
    findAll(req = {}) {
        return this.query.run(req);
    }
    findById(id) {
        return this.prisma.class.findUnique({ where: { id } });
    }
    async getByIdOrFail(id) {
        const cls = await this.findById(id);
        if (!cls)
            throw createAppError("NOT_FOUND", `Class ${id} not found`);
        return cls;
    }
    async create(dto) {
        try {
            return await this.prisma.class.create({ data: dto });
        }
        catch (err) {
            throw this.mapWriteError(err, dto.name);
        }
    }
    async update(id, dto) {
        await this.getByIdOrFail(id);
        try {
            return await this.prisma.class.update({ where: { id }, data: dto });
        }
        catch (err) {
            throw this.mapWriteError(err, dto.name);
        }
    }
    async softDelete(id) {
        await this.getByIdOrFail(id);
        await this.prisma.class.update({ where: { id }, data: { is_active: false } });
    }
    async restore(id) {
        const result = await this.prisma.class.updateMany({
            where: { id, is_active: false },
            data: { is_active: true },
        });
        if (result.count === 0) {
            throw createAppError("NOT_FOUND", `Class ${id} not found or not inactive`);
        }
        return this.getByIdOrFail(id);
    }
    findDeleted() {
        return this.prisma.class.findMany({
            where: { is_active: false },
            orderBy: { name: "asc" },
        });
    }
    /**
     * Enforce Season.max_teams_per_class. PHẢI gọi bằng `tx` đang mở của
     * caller (SeasonTeamService.registerTeam) — không tự mở transaction ở
     * đây, vì FOR UPDATE cần cùng connection với insert SeasonTeam để khoá
     * đúng row set và tránh race giữa 2 request đăng ký cùng lớp.
     *
     * Raw SQL vì Prisma query builder không support FOR UPDATE trên
     * aggregate/join thông thường.
     */
    async assertClassTeamQuota(tx, seasonId, classId) {
        const season = await tx.season.findUnique({
            where: { id: seasonId },
            select: { max_teams_per_class: true },
        });
        if (!season?.max_teams_per_class)
            return; // null = không giới hạn
        const rows = await tx.$queryRaw `
            SELECT st.id FROM season_teams st
            JOIN teams t ON t.id = st.team_id
            WHERE st.season_id = ${seasonId}
              AND t.class_id = ${classId}
              AND st.status != 'withdrawn'
              AND st.deleted_at IS NULL
            FOR UPDATE
        `;
        if (rows.length >= season.max_teams_per_class) {
            throw createAppError("CONFLICT", `Lớp đã đạt giới hạn ${season.max_teams_per_class} đội trong mùa giải`);
        }
    }
    mapWriteError(err, name) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            return createAppError("CONFLICT", `Class name "${name}" already exists`);
        }
        return err;
    }
}
//# sourceMappingURL=class.service.js.map