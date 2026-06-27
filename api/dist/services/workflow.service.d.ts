import { MatchResultType, PrismaClient } from '../generated/prisma/client.js';
import { KnockoutService } from './knockout.service.js';
import { MatchLifecycleService } from './match.service.js';
import { MatchResultService } from './matchresult.service.js';
import { StandingsService } from './standing.service.js';
export interface WorkflowConfig {
    /**
     * Phải là số chẵn >= 4 (2 groups, mỗi group ít nhất 2 team).
     * Chia đều: một nửa vào group A, một nửa vào group B.
     * Top 1 mỗi group advance vào Final.
     *
     * Lineup: pick từ TeamPlayer hiện có trong DB cho từng team.
     * Nếu team thiếu player → match vẫn chạy, lineup partial (không throw).
     */
    teamIds: number[];
    venueId: number;
    seed?: number;
}
export interface MatchReport {
    id: number;
    home: string;
    away: string;
    score: string;
    resultType: MatchResultType;
}
export interface WorkflowReport {
    tournamentId: number;
    seasonId: number;
    phases: {
        groupAPhaseId: number;
        groupBPhaseId: number;
        knockoutPhaseId: number;
    };
    groupA: {
        groupId: number;
        matches: MatchReport[];
        standings: StandingRow[];
    };
    groupB: {
        groupId: number;
        matches: MatchReport[];
        standings: StandingRow[];
    };
    final: {
        match: MatchReport | null;
        winner: string | null;
    };
    log: string[];
}
interface StandingRow {
    teamId: number;
    team: string;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    gf: number;
    ga: number;
    points: number;
}
export declare class WorkflowService {
    private readonly prisma;
    private readonly knockoutService;
    private readonly matchLifecycleService;
    private readonly matchResultService;
    private readonly standingsService;
    private rng;
    private log;
    constructor(prisma: PrismaClient, knockoutService: KnockoutService, matchLifecycleService: MatchLifecycleService, matchResultService: MatchResultService, standingsService: StandingsService);
    run(config: WorkflowConfig): Promise<WorkflowReport>;
    private _finalizeSeasonState;
    private _setupTournament;
    private _registerSeasonTeams;
    private _createGroupPhase;
    private _createRoundRobinMatches;
    private _executeMatches;
    private _playMatch;
    /**
     * Tạo lineup cho 2 teams từ TeamPlayer records có sẵn trong DB.
     * Tối đa 11 starters + 3 substitutes per team.
     * Nếu team không đủ player → lineup partial, không throw.
     */
    private _createLineup;
    private _createTeamLineup;
    /**
     * Lấy player_id có trong lineup của 1 team trong 1 match.
     * Dùng để gán scorer khi ghi event goal.
     */
    private _getMatchPlayers;
    private _recordGoals;
    private _getStandings;
    /**
     * Final: tạo phase knockout + 1 match trực tiếp (không dùng generateKnockoutBracket
     * vì bracket engine cần PhaseType ∈ KNOCKOUT_PHASE_TYPE_SET và seeding phức tạp hơn).
     *
     * Với 2 teams → 1 trận Final duy nhất.
     * Nếu hòa: tung đồng xu để quyết định (penalty mock).
     */
    private _createAndRunFinal;
    /**
     * Final không được hòa → nếu hòa thì mock penalty.
     */
    private _playFinalMatch;
    private _resolveWinnerName;
    private _seedRng;
    private _log;
}
export {};
//# sourceMappingURL=workflow.service.d.ts.map