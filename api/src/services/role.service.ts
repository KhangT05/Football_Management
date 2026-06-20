import { createAppError } from "../common/app.error.js";
import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.schema.js";
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { Queryable } from "../libs/queryable.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";

export class RoleService {

    private readonly query: Queryable<Role>;

    constructor(
        private readonly prisma: PrismaClient
    ) {
        this.query = new Queryable<Role>(prisma.role, {
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

    findAll(req: QueryRequest = {}): Promise<PaginatedResult<Role>> {
        return this.query.run(req);
    }

    /**
 * Filter is_active: true để đồng bộ với findAll() — role đã soft-delete
 * không còn coi là "tồn tại" cho update/softDelete. Nếu cần cho phép admin
 * "undelete" qua update(), tách riêng method restore() rõ ràng.
 */
    async findByIdOrFail(id: number): Promise<Role> {
        const role = await this.prisma.role.findUnique({ where: { id } });
        if (!role || !role.is_active) throw createAppError('NOT_FOUND', `Role not found: ${id}`);
        return role;
    }

    async create(data: CreateRoleDto): Promise<Role> {
        return this.prisma.role.create({
            data: data
        });
    }

    /**
     * Dùng updateMany (where không bị giới hạn unique-constraint-only như update())
     * để gộp "check tồn tại + check active + update" — count===0 nghĩa là không
     * match (không tồn tại hoặc đã soft-delete) -> NOT_FOUND. Tổng vẫn 2 round-trip
     * (updateMany + fetch lại record để trả về), nhưng loại bỏ raw Error và đảm bảo
     * is_active consistency với findAll(). Nếu chấp nhận update() áp dụng được lên
     * record đã soft-delete (vd dùng update() để undelete), dùng prisma.role.update
     * thẳng với where:{id} thay vì updateMany.
     */
    async update(id: number, data: UpdateRoleDto): Promise<Role> {
        const result = await this.prisma.role.updateMany({
            where: { id, is_active: true },
            data,
        });
        if (result.count === 0) throw createAppError('NOT_FOUND', `Role not found: ${id}`);
        return this.prisma.role.findUniqueOrThrow({ where: { id } });
    }

    async softDelete(id: number): Promise<void> {
        const result = await this.prisma.role.updateMany({
            where: { id, is_active: true },
            data: { is_active: false },
        });
        if (result.count === 0) throw createAppError('NOT_FOUND', `Role not found: ${id}`);
    }

}