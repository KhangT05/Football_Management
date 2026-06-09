import bcrypt from "bcrypt";
export class UserService {
    db;
    constructor(db) {
        this.db = db;
    }
    findAll() {
        return this.db.user.findMany({
            where: { is_active: true },
            omit: { password: true },
        });
    }
    findById(id) {
        return this.db.user.findUnique({
            where: { id },
            omit: { password: true },
        });
    }
    async findByIdOrFail(id) {
        const user = await this.db.user.findUnique({
            where: { id },
            omit: { password: true },
        });
        if (!user)
            throw new Error(`User ${id} not found`);
        return user;
    }
    findByEmail(email) {
        return this.db.user.findUnique({ where: { email } });
    }
    async create(data) {
        const existing = await this.findByEmail(data.email);
        if (existing)
            throw new Error("Email đã tồn tại.");
        const hashed = await bcrypt.hash(data.password, 10);
        return this.db.user.create({
            data: {
                ...data,
                password: hashed,
            },
            omit: { password: true },
        });
    }
    update(id, data) {
        const clean = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
        return this.db.user.update({
            where: { id },
            data: clean,
            omit: { password: true },
        });
    }
    async softDelete(id) {
        await this.db.user.update({
            where: { id },
            data: { is_active: false },
        });
    }
}
//# sourceMappingURL=user.service.js.map