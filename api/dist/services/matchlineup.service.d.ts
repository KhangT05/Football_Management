import { PrismaClient, MatchLineup } from '../generated/prisma/client.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';
export declare class MatchLineupService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private getScheduledAtOrFail;
    private assertCanRegister;
    private assertCanUpdate;
    getByMatch(matchId: number): Promise<MatchLineup[]>;
    getByTeam(matchId: number, teamId: number): Promise<MatchLineup[]>;
    register(dto: RegisterLineupDto): Promise<MatchLineup[]>;
    updateEntry(dto: UpdateLineupEntryDto): Promise<MatchLineup>;
    removeEntry(matchId: number, teamId: number, playerId: number): Promise<void>;
}
//# sourceMappingURL=matchlineup.service.d.ts.map