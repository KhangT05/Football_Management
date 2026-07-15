import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { CreateClassDto, UpdateClassDto, ClassDto } from "../dtos/class.schema.js";
export declare class ClassService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    list(): Promise<ClassDto[]>;
    getByIdOrFail(id: number): Promise<ClassDto>;
    create(dto: CreateClassDto): Promise<ClassDto>;
    update(id: number, dto: UpdateClassDto): Promise<ClassDto>;
    softDelete(id: number): Promise<void>;
    /**
     * Enforce Season.max_teams_per_class. PHẢI gọi bằng `tx` đang mở của
     * caller (SeasonTeamService.registerTeam) — không tự mở transaction ở
     * đây, vì FOR UPDATE cần cùng connection với insert SeasonTeam để khoá
     * đúng row set và tránh race giữa 2 request đăng ký cùng lớp.
     *
     * Raw SQL vì Prisma query builder không support FOR UPDATE trên
     * aggregate/join thông thường.
     */
    assertClassTeamQuota(tx: Prisma.TransactionClient, seasonId: number, classId: number): Promise<void>;
}
//# sourceMappingURL=class.service.d.ts.map