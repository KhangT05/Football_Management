import { MatchResultType, Prisma, PrismaClient } from '../generated/prisma/client.js';
import { ConfirmResultInput, ConfirmResultOutput } from '../types/matchResult.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { KnockoutService } from './knockout.service.js';
import { StandingsService } from './standing.service.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { MatchEventRow } from '../helper/match.helper.js';
import { EditScoreInput } from '../types/match.type.js';
export declare class MatchResultService {
    private readonly prisma;
    private readonly knockoutService;
    private readonly standingsService;
    private matchEventQueryable;
    constructor(prisma: PrismaClient, knockoutService: KnockoutService, standingsService: StandingsService);
    getMatchResult(matchId: number): Promise<{
        winner_team: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        match_id: number;
        status: import("../generated/prisma/enums.js").MatchResultStatus;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        deleted_at: Date | null;
        winner_team_id: number | null;
        home_extra_time_score: number | null;
        away_extra_time_score: number | null;
        home_penalty_score: number | null;
        away_penalty_score: number | null;
        home_final_score: number;
        away_final_score: number;
        result_type: MatchResultType;
        duration: number | null;
        notes: string | null;
        appeal_reason: string | null;
        appeal_note: string | null;
    }>;
    /**
     * List events của 1 trận, hỗ trợ pagination, sort, filter theo type/period.
     * match_id inject vào filter — không thể sort/filter trực tiếp trên FK.
     */
    listMatchEvents(matchId: number, req: QueryRequest): Promise<PaginatedResult<MatchEventRow>>;
    getMatchPlayerStats(matchId: number): Promise<(Prisma.PickEnumerable<Prisma.MatchEventGroupByOutputType, ("type" | "player_id" | "team_id")[]> & {
        _count: {
            type: number;
        };
    })[]>;
    /**
     * Finalize 1 trận: tạo MatchResult, update Match status, update player stats.
     *
     * Flow:
     *   1. Load match + guard (status, existing result, knockout draw check)
     *   2. Transaction: create MatchResult + update Match + update PlayerStatistics
     *   3. Recompute group standings (nếu group phase) — ngoài transaction
     *   4. Advance knockout (nếu knockout phase) — ngoài transaction
     *
     * Bước 3 và 4 ngoài transaction là chủ ý:
     *   - Nếu standings/knockout fail, match vẫn finalized
     *   - Eventually consistent — acceptable cho scale này
     *   - Tránh transaction timeout do standings recompute scan nhiều rows
     */
    confirmResult(matchId: number, input: ConfirmResultInput, scheduleOptions: OptionalScheduleOptions): Promise<ConfirmResultOutput>;
    /**
     * Admin sửa score sau khi match đã finalized.
     *
     * Override chỉ sửa scores (final, extra time, penalty, half-time) và winner.
     * KHÔNG sửa MatchEvents — nếu cần sửa events, dùng editEvent/deleteEvent riêng.
     *
     * Sau khi sửa score:
     *   - Standings recompute (group phase)
     *   - Player stats recompute từ đầu (vì goals_scored derive từ events, không phải score)
     *     → Thực ra goals không đổi khi chỉ sửa score. Nhưng nếu override được gọi cùng
     *     với event correction, stats cần consistent. Recompute để safe.
     *
     * NOTE: Knockout bracket KHÔNG tự cập nhật khi override —
     * nếu winner thay đổi, admin phải handle bracket manually.
     * Lý do: bracket advancement có thể đã tạo match mới → side effect phức tạp.
     */
    overrideResult(matchId: number, input: EditScoreInput, scheduleOptions: OptionalScheduleOptions): Promise<void>;
    /**
     * Recompute player stats của 1 match từ events hiện tại.
     *
     * Dùng khi:
     *   - Admin edit/delete event sau khi match finalized
     *   - Admin override score (gọi từ overrideResult)
     *
     * Logic accumulated_yellow_cards:
     *   - `accumulated_yellow_cards` = tổng thẻ vàng từ đầu season, có thể reset sau khi
     *     bị treo giò (theo quy định giải). Field này KHÔNG tự reset ở đây.
     *   - Recompute tính lại từ toàn bộ events của season cho player đó.
     *   - Reset logic (khi nào reset sau suspension) phải implement riêng nếu giải có quy định.
     *   - Hiện tại: accumulated = tổng yellow_cards của season (không reset).
     */
    recomputePlayerStats(matchId: number): Promise<void>;
    recomputeStandingsFor(groupId: number): Promise<void>;
    private _guardConfirm;
    private _resolveWinner;
    /**
     * Update player statistics trong transaction — chạy cùng với match finalization.
     *
     * Logic accumulated_yellow_cards:
     *   - Load accumulated hiện tại của player trong season
     *   - Cộng thêm yellow cards từ trận này
     *   - Nếu accumulated >= yellowSuspension hoặc có red_card → is_suspended = true
     *
     * NOTE: Không có reset logic ở đây.
     *   accumulated_yellow_cards chỉ tăng, không reset.
     *   Nếu giải có quy định reset sau khi lĩnh án treo giò (common trong FIFA/UEFA),
     *   cần implement reset endpoint riêng (admin action).
     *   Lý do không auto-reset: quy định reset khác nhau giữa các giải,
     *   và cần audit trail rõ ràng khi admin reset.
     */
    private _updatePlayerStatistics;
    /**
     * Full recompute player stats từ tất cả events của season cho các players chỉ định.
     *
     * Dùng cho admin correction (sau editEvent, deleteEvent, overrideResult).
     * Scan toàn bộ events của season cho players đó — không incremental.
     * Acceptable vì: số players per team nhỏ (≤ 25), số matches per season nhỏ (≤ 50).
     *
     * accumulated_yellow_cards trong recompute = tổng yellow_cards của season (không reset).
     * Nếu cần reset logic, implement riêng (xem note trong _updatePlayerStatistics).
     */
    private _recomputeStatsForPlayers;
    private _tryRecomputeStandings;
}
//# sourceMappingURL=matchresult.service.d.ts.map