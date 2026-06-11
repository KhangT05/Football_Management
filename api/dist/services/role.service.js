import { createQueryable } from "../libs/queryable.js";
export class RoleService {
    db;
    query;
    constructor(db) {
        this.db = db;
        this.query = createQueryable(this.db.role, {
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
    findAll() {
        return this.db.role.findMany({
            where: { is_active: true },
        });
    }
    findById(id) {
        return this.db.role.findUnique({
            where: { id },
        });
    }
    async findByIdOrFail(id) {
        const role = await this.db.role.findUnique({
            where: { id },
        });
        if (!role)
            throw new Error(`Role ${id} not found`);
        return role;
    }
    async create(data) {
        return this.db.role.create({
            data: {
                ...data,
            },
        });
    }
    async update(id, data) {
        await this.findByIdOrFail(id);
        return this.db.role.update({
            where: { id },
            data: { ...data },
        });
    }
    async softDelete(id) {
        await this.findByIdOrFail(id);
        await this.db.role.update({
            where: { id },
            data: { is_active: false },
        });
    }
}
//# sourceMappingURL=role.service.js.map