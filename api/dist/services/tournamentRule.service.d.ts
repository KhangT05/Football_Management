import { CreateTournamentRuleDto, TournamentRuleDto, UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
export declare class TournamentRuleService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private mapToDto;
    findAll(): Promise<TournamentRuleDto[]>;
    findByIdOrFail(id: number): Promise<TournamentRuleDto>;
    /**
     * FIX (Medium #5): update() gọi JSON.stringify(tiebreaker_order) trước khi ghi
     * (cột lưu string, mapToDto parse lại qua parseJsonField). create() trước đây
     * ghi thẳng ...data (array) vào cùng cột — inconsistent. Nếu cột là String,
     * create() ghi sai type; nếu cột là Json, update() đang double-encode. Đồng bộ
     * theo hướng update() (stringify thủ công) vì mapToDto parse như đọc string.
     * Return type sửa từ CreateTournamentRuleDto → TournamentRuleDto cho khớp giá
     * trị thực trả về (mapToDto trả full object + relations).
     */
    create(data: CreateTournamentRuleDto, userId: number): Promise<TournamentRuleDto>;
    update(id: number, data: UpdateTournamentRuleDto, force?: boolean): Promise<TournamentRuleDto>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<TournamentRuleDto>;
    listByTournament(tournamentId: number): Promise<TournamentRuleDto[]>;
}
//# sourceMappingURL=tournamentRule.service.d.ts.map