import { Prisma, PrismaClient, Class } from "../generated/prisma/client.js";
import { CreateClassDto, UpdateClassDto } from "../dtos/class.schema.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
export declare class ClassService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    /** Danh sách active, không phân trang — dùng cho dropdown/select. */
    listActive(): Promise<Class[]>;
    /** Danh sách có phân trang/tìm kiếm/sort — dùng cho trang quản trị. */
    findAll(req?: QueryRequest): Promise<PaginatedResult<Class>>;
    findById(id: number): Promise<Class | null>;
    getByIdOrFail(id: number): Promise<Class>;
    create(dto: CreateClassDto): Promise<Class>;
    update(id: number, dto: UpdateClassDto): Promise<Class>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<Class>;
    findDeleted(): Promise<Class[]>;
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
    private mapWriteError;
}
//# sourceMappingURL=class.service.d.ts.map