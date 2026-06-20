import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.schema.js";
import { PrismaClient, Role } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class RoleService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Role>>;
    /**
 * Filter is_active: true để đồng bộ với findAll() — role đã soft-delete
 * không còn coi là "tồn tại" cho update/softDelete. Nếu cần cho phép admin
 * "undelete" qua update(), tách riêng method restore() rõ ràng.
 */
    findByIdOrFail(id: number): Promise<Role>;
    create(data: CreateRoleDto): Promise<Role>;
    /**
     * Dùng updateMany (where không bị giới hạn unique-constraint-only như update())
     * để gộp "check tồn tại + check active + update" — count===0 nghĩa là không
     * match (không tồn tại hoặc đã soft-delete) -> NOT_FOUND. Tổng vẫn 2 round-trip
     * (updateMany + fetch lại record để trả về), nhưng loại bỏ raw Error và đảm bảo
     * is_active consistency với findAll(). Nếu chấp nhận update() áp dụng được lên
     * record đã soft-delete (vd dùng update() để undelete), dùng prisma.role.update
     * thẳng với where:{id} thay vì updateMany.
     */
    update(id: number, data: UpdateRoleDto): Promise<Role>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=role.service.d.ts.map