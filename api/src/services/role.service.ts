import { CreateRoleDto, UpdateRoleDto } from "../dtos/role.schema.js";
import { PrismaClient, Role } from "../generated/prisma/client.js";
import prisma from "../libs/prisma.js";
import { PaginatedResult, Queryable, QueryRequest } from "../libs/queryable.js";

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

    findById(id: number): Promise<Role | null> {
        return prisma.role.findUnique({
            where: { id },
        });
    }

    async findByIdOrFail(id: number): Promise<Role> {
        const role = await prisma.role.findUnique({
            where: { id },
        });
        if (!role) throw new Error(`Role ${id} not found`);
        return role;
    }

    async create(data: CreateRoleDto): Promise<Role> {
        return prisma.role.create({
            data: data
        });
    }

    async update(id: number, data: UpdateRoleDto): Promise<Role> {
        await this.findByIdOrFail(id);
        return prisma.role.update({
            where: { id },
            data,
        });
    }

    async softDelete(id: number): Promise<void> {
        await this.findByIdOrFail(id);
        await prisma.role.update({
            where: { id },
            data: { is_active: false },
        });
    }
}