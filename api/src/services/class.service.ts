import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { createAppError } from "../common/app.error.js";
import { CreateClassDto, UpdateClassDto, ClassDto } from "../dtos/class.schema.js";

export class ClassService {
    constructor(private readonly prisma: PrismaClient) { }

    list(): Promise<ClassDto[]> {
        return this.prisma.class.findMany({ where: { is_active: true }, orderBy: { name: "asc" } });
    }

    async getByIdOrFail(id: number): Promise<ClassDto> {
        const cls = await this.prisma.class.findUnique({ where: { id } });
        if (!cls) throw createAppError("NOT_FOUND", `Class ${id} not found`);
        return cls;
    }

    create(dto: CreateClassDto): Promise<ClassDto> {
        return this.prisma.class.create({ data: dto });
    }

    async update(id: number, dto: UpdateClassDto): Promise<ClassDto> {
        await this.getByIdOrFail(id);
        return this.prisma.class.update({ where: { id }, data: dto });
    }

    async softDelete(id: number): Promise<void> {
        await this.getByIdOrFail(id);
        await this.prisma.class.update({ where: { id }, data: { is_active: false } });
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
    async assertClassTeamQuota(tx: Prisma.TransactionClient, seasonId: number, classId: number): Promise<void> {
        const season = await tx.season.findUnique({
            where: { id: seasonId },
            select: { max_teams_per_class: true },
        });
        if (!season?.max_teams_per_class) return; // null = không giới hạn

        const rows: { id: number }[] = await tx.$queryRaw`
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
}