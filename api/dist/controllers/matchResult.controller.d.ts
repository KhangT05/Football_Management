import { Controller } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import { StandingsService } from "../services/standing.service.js";
import * as matchResultType from "../types/matchResult.type.js";
export declare class MatchResultController extends Controller {
    private readonly matchResultService;
    constructor(matchResultService: MatchResultService);
    getMatchResult(id: number): Promise<{
        winner_team: {
            name: string;
            id: number;
        } | null;
    } & {
        is_active: boolean;
        id: number;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        match_id: number;
        winner_team_id: number | null;
        home_extra_time_score: number | null;
        away_extra_time_score: number | null;
        home_penalty_score: number | null;
        away_penalty_score: number | null;
        home_final_score: number;
        away_final_score: number;
        result_type: import("../generated/prisma/enums.js").MatchResultType;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    /**
     * List events của 1 trận.
     *
     * Query params:
     *   Simple filters: ?type=goal&period=first_half
     *   Pagination: ?page=1&per_page=30
     *   Sort: ?sort=minute&direction=asc
     *   Search: ?q=keyword (if searchFields enabled)
     */
    getMatchEvents(id: number, type?: string, period?: string, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc', q?: string): Promise<import("../types/queryable.type.js").PaginatedResult<{
        type: import("../generated/prisma/enums.js").MatchEventType;
        id: number;
        created_at: Date;
        team_id: number | null;
        player_id: number | null;
        match_id: number;
        period: import("../generated/prisma/enums.js").MatchPeriod | null;
        minute: number | null;
        added_minute: number | null;
    }>>;
    getMatchPlayerStats(id: number): Promise<(import("../generated/prisma/internal/prismaNamespace.js").PickEnumerable<import("../generated/prisma/models.js").MatchEventGroupByOutputType, ("type" | "team_id" | "player_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    confirmResult(id: number, body: matchResultType.ConfirmOfficialBody): Promise<matchResultType.ConfirmResultOutput>;
}
export declare class SeasonStatsController extends Controller {
    private readonly standingsService;
    constructor(standingsService: StandingsService);
    /**
     * Bảng xếp hạng của season.
     *
     * Query params:
     *   ?groupId=1 (filter by group)
     *   ?page=1&per_page=20 (pagination)
     *   ?sort=position&direction=asc (sort)
     */
    getStandings(seasonId: number, groupId?: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<import("../types/queryable.type.js").PaginatedResult<{
        id: number;
        team_id: number;
        group_id: number;
        position: number;
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number;
        goals_against: number;
        points: number;
    }>>;
    /**
     * Thống kê cầu thủ trong season.
     *
     * Query params:
     *   ?teamId=1 (filter by team)
     *   ?page=1&per_page=20
     *   ?sort=goals_scored&direction=desc
     */
    getPlayerStats(seasonId: number, teamId?: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<import("../types/queryable.type.js").PaginatedResult<{
        id: number;
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        team_id: number;
        season_id: number;
        player_id: number;
        matches_played: number;
        accumulated_yellow_cards: number;
        is_suspended: boolean;
    }>>;
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
}
//# sourceMappingURL=matchResult.controller.d.ts.map