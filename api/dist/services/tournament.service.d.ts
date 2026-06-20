import { CreateTournamentDto, UpdateTournamentDto } from "../dtos/tournament.schema.js";
import { PrismaClient, Tournament } from "../generated/prisma/client.js";
import { PaginatedResult, QueryRequest } from "../types/queryable.type.js";
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
export declare class TournamentService {
    private readonly prisma;
    private readonly query;
    constructor(prisma: PrismaClient);
    findAll(req?: QueryRequest): Promise<PaginatedResult<Tournament>>;
    findByIdOrFail(id: number): Promise<Tournament>;
    create(data: CreateTournamentDto, userId: number): Promise<Tournament>;
    update(id: number, data: UpdateTournamentDto): Promise<Tournament>;
    softDelete(id: number): Promise<void>;
}
//# sourceMappingURL=tournament.service.d.ts.map