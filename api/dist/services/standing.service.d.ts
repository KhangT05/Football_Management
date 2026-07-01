import { SeasonListItem } from '../dtos/season.schema.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { PlayerStatisticRow, TeamStandingRow } from '../types/standing.type.js';
export declare class StandingsService {
    private readonly prisma;
    private standingQueryable;
    private playerStatQueryable;
    constructor(prisma: PrismaClient);
    /**
     * List standings của 1 group cụ thể.
     *
     * API nhận groupId trực tiếp — TeamStanding có group_id FK nên không cần join.
     * Không nhận seasonId vì:
     *   - standings thuộc group, không phải season
     *   - season có thể có nhiều group → caller phải chỉ định group nào
     *   - nếu cần cross-group view, dùng listStandingsBySeason()
     *
     * QueryRequest từ HTTP: page, sort, direction, per_page
     */
    listGroupStandings(groupId: number, req: QueryRequest, seasonId?: number): Promise<PaginatedResult<TeamStandingRow>>;
    listStandingsBySeason(seasonId: number): Promise<{
        groupId: number;
        groupName: string;
        standings: TeamStandingRow[];
    }[]>;
    /**
     * List player stats trong season, optional filter theo team.
     *
     * seasonId là context chính — PlayerStatistic có season_id FK trực tiếp.
     * team_id optional filter, inject từ req.filter.
     */
    getPlayerCareerStats(playerId: number): Promise<{
        player: {
            id: number;
            name: never;
        };
        career: {
            matches_played: number | null;
            goals_scored: number | null;
            assists: number | null;
            yellow_cards: number | null;
            red_cards: number | null;
        };
        seasons: {
            team_id: number;
            team: {
                name: string;
            };
            season_id: number;
            season: {
                name: string;
                start_date: Date | null;
            };
            matches_played: number;
            goals_scored: number;
            assists: number;
            yellow_cards: number;
            red_cards: number;
        }[];
    }>;
    listPlayerStats(seasonId: number, req: QueryRequest): Promise<PaginatedResult<PlayerStatisticRow>>;
    getSuspendedPlayers(seasonId: number): Promise<({
        player: {
            id: number;
            name: never;
        };
        team: {
            id: number;
            name: string;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date | null;
        player_id: number;
        team_id: number;
        season_id: number;
        matches_played: number;
        goals_scored: number;
        assists: number;
        yellow_cards: number;
        red_cards: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        is_suspended: boolean;
    })[]>;
    /**
     * Recompute standings của 1 group từ đầu — full scan, không incremental.
     *
     * Full scan là đúng ở scale này (group ≤ 8 teams, ≤ 28 matches/group).
     * Incremental update phức tạp hơn nhiều (phải undo kết quả cũ) và không đáng.
     *
     * Flow:
     *   1. Load TournamentRule (points config + tiebreaker order)
     *   2. Load tất cả official finished matches của group
     *   3. Accumulate stats cho từng team
     *   4. Load card stats nếu tiebreaker cần
     *   5. Build H2H map nếu tiebreaker cần
     *   6. Sort với H2H mini-league logic (UEFA standard)
     *   7. Upsert batch trong transaction
     *
     * Không gọi từ bên ngoài transaction của confirmResult —
     * standings recompute chạy sau khi match transaction commit (eventually consistent).
     * Nếu fail: standings stale nhưng match đã finalized. Acceptable cho scale này.
     */
    recomputeGroupStandings(groupId: number): Promise<void>;
    /**
     * List seasons ở trạng thái người dùng quan tâm: ongoing, finished, cancelled.
     * upcoming / registration_open bị loại — chưa có standings để xem.
     *
     * Trả kèm tournament name để client render breadcrumb/filter.
     * Không load standings ở đây — lazy load khi user chọn season.
     */
    listSeasons(params: {
        status?: 'ongoing' | 'finished' | 'cancelled' | 'registration_open' | 'upcoming';
        tournamentId?: number;
        page?: number;
        per_page?: number;
        q?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    }): Promise<PaginatedResult<SeasonListItem>>;
    /**
     * Sort standings theo UEFA H2H mini-league standard:
     *
     * 1. Points (overall)
     * 2. Criteria trước head_to_head (goal_diff, goals_scored, etc.)
     * 3. Với nhóm tied sau bước 2: H2H mini-league (points → GD → GS giữa các team tied)
     * 4. Criteria sau head_to_head cho nhóm vẫn tied
     *
     * Nếu head_to_head không có trong tiebreakerOrder: sort tuyến tính theo criteria.
     */
    private _sortStandings;
    /**
     * Build H2H record chỉ cho matches giữa các team trong `teamIds`.
     * Dùng `officialMatches` của toàn group — filter bằng idSet.
     */
    private _buildMiniH2H;
    private _compareOverall;
    private _applyTiebreakers;
}
//# sourceMappingURL=standing.service.d.ts.map