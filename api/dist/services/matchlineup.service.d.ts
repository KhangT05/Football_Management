import { PrismaClient, MatchLineup, PitchType } from '../generated/prisma/client.js';
import { RegisterLineupDto, UpdateLineupEntryDto } from '../dtos/matchlineup.schema.js';
export declare class MatchLineupService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private getMatchContextOrFail;
    private assertTeamInMatch;
    private assertMatchMutable;
    private assertCanRegister;
    private assertCanUpdate;
    private assertSingleCaptain;
    private assertNoDuplicatePlayerId;
    private assertRule;
    private assertSquadSize;
    private assertStartersFormation;
    getByMatch(matchId: number): Promise<MatchLineup[]>;
    getByTeam(matchId: number, teamId: number): Promise<MatchLineup[]>;
    getFormationForMatch(matchId: number): Promise<{
        pitchType: PitchType;
        totalStarters: number;
    }>;
    register(dto: RegisterLineupDto): Promise<MatchLineup[]>;
    updateEntry(dto: UpdateLineupEntryDto): Promise<MatchLineup>;
    removeEntry(matchId: number, teamId: number, playerId: number): Promise<void>;
}
//# sourceMappingURL=matchlineup.service.d.ts.map