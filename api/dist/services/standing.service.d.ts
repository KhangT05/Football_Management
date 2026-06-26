import { PrismaClient } from '../generated/prisma/client.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { PlayerStatisticRow, TeamStandingRow } from '../types/standing.type.js';
export declare class StandingsService {
    private readonly prisma;
    private standingQueryable;
    private playerStatQueryable;
    constructor(prisma: PrismaClient);
    /**
     * List standings của season.
     *
     * Pattern:
     *   - seasonId dùng để filter qua group.phase.season_id
     *   - groupId optional (filter thêm group)
     *   - QueryRequest build từ HTTP query params (page, sort, etc)
     */
    listStandings(seasonId: number, req: QueryRequest): Promise<PaginatedResult<TeamStandingRow>>;
    private _listStandingsManual;
    /**
     * List player stats trong season.
     *
     * Pattern: seasonId context + QueryRequest from HTTP
     */
    listPlayerStats(seasonId: number, req: QueryRequest): Promise<PaginatedResult<PlayerStatisticRow>>;
    getSuspendedPlayers(seasonId: number): Promise<({
        team: {
            name: string;
            id: number;
        };
        player: {
            name: never;
            id: number;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date | null;
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        team_id: number;
        season_id: number;
        player_id: number;
        matches_played: number;
        assists: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        is_suspended: boolean;
    })[]>;
    /**
     * Recompute standings của 1 group từ đầu.
     * Full scan: không incremental (group size ≤ 8).
     */
    recomputeGroupStandings(groupId: number): Promise<void>;
    private _sortStandings;
    private _buildMiniH2H;
    private _compareOverall;
    private _applyTiebreakers;
}
//# sourceMappingURL=standing.service.d.ts.map