import { CreateTournamentRuleDto, TournamentRuleDto, UpdateTournamentRuleDto } from "../dtos/tournamentRule.schema.js";
import { PrismaClient } from "../generated/prisma/client.js";
export declare class TournamentRuleService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private mapToDto;
    private validateFormatConsistency;
    findAll(): Promise<TournamentRuleDto[]>;
    findByIdOrFail(id: number): Promise<TournamentRuleDto>;
    create(data: CreateTournamentRuleDto, userId: number): Promise<TournamentRuleDto>;
    update(id: number, data: UpdateTournamentRuleDto, force?: boolean): Promise<TournamentRuleDto>;
    softDelete(id: number): Promise<void>;
    restore(id: number): Promise<TournamentRuleDto>;
    listByTournament(tournamentId: number): Promise<TournamentRuleDto[]>;
}
//# sourceMappingURL=tournamentRule.service.d.ts.map