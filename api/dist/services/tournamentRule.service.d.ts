import { CreateTournamentRuleDto, TournamentRuleDto, UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
export declare class TournamentRuleService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private mapToDto;
    /**
     * DUY NHẤT nơi chứa business rule: format <-> round_robin_stages.
     * Nhận full resolved state (không phải partial) — caller chịu trách nhiệm
     * merge payload với DB hiện tại trước khi gọi (xem update()).
     */
    private validateFormatConsistency;
    /**
     * Lock hàng Tournament (SELECT ... FOR UPDATE) để serialize mọi transaction
     * đang cố set is_active=true cho rule của CÙNG tournament_id. Đây là cách
     * giả lập "unique constraint có điều kiện" mà không cần đổi schema/DDL —
     * đánh đổi: chỉ đúng khi MỌI code path set is_active=true đều đi qua hàm
     * này trong cùng transaction. Không có DB-level backstop nếu sau này có
     * chỗ khác (script, raw query, migration data) set is_active=true mà quên
     * gọi qua đây.
     *
     * Phải gọi bên trong transaction đang chạy create/update, và PHẢI gọi
     * TRƯỚC khi đọc/ghi tournamentRule để đảm bảo thứ tự lock nhất quán,
     * tránh deadlock với các transaction khác cũng lock theo tournament_id.
     */
    private lockTournamentForActiveRuleWrite;
    findAll(): Promise<TournamentRuleDto[]>;
    findByIdOrFail(id: number): Promise<TournamentRuleDto>;
    create(data: CreateTournamentRuleDto, userId: number): Promise<TournamentRuleDto>;
    update(id: number, data: UpdateTournamentRuleDto, force?: boolean): Promise<TournamentRuleDto>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<TournamentRuleDto>;
    listByTournament(tournamentId: number): Promise<TournamentRuleDto[]>;
}
//# sourceMappingURL=tournamentRule.service.d.ts.map