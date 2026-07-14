import { SeasonListItem } from '../dtos/season.schema.js';
import { Prisma, PrismaClient, PhaseStatus } from '../generated/prisma/client.js';
import { PaginatedResult, QueryRequest } from '../types/queryable.type.js';
import { PlayerStatisticRow, TeamStandingRow } from '../types/standing.type.js';
type PhaseStandingsBlock = {
    phaseId: number;
    phaseName: string;
    phaseOrder: number;
    phaseStatus: PhaseStatus;
    groups: {
        groupId: number;
        groupName: string;
        standings: TeamStandingRow[];
    }[];
};
export declare class StandingsService {
    private readonly prisma;
    private standingQueryable;
    private playerStatQueryable;
    constructor(prisma: PrismaClient);
    /**
     * List standings của 1 group cụ thể.
     *
     * API nhận groupId trực tiếp — TeamStanding có group_id FK nên không cần join.
     * Không nhận seasonId nếu chỉ cần xem 1 bảng; nếu có seasonId (từ route
     * /seasons/:seasonId/standings/:groupId) thì validate group thuộc đúng
     * season — tránh user gọi nhầm group thuộc season khác.
     *
     * QueryRequest từ HTTP: page, sort, direction, per_page
     */
    listGroupStandings(groupId: number, req: QueryRequest, seasonId?: number): Promise<PaginatedResult<TeamStandingRow>>;
    /**
     * Trả standings của phase round_robin ĐANG MỞ (status != locked, order lớn
     * nhất) trong season, group theo group_id. Mirror GroupService.findAllBySeason
     * — FE KHÔNG cần biết phaseId, chỉ cần seasonId.
     *
     * FIX (root cause "RR2 hiện lẫn standings RR1 đã locked"): bản cũ
     * (listStandingsBySeason) query `group: { phase: { season_id } }` KHÔNG
     * filter phase — khi season đã advance RR1 -> RR2 (advanceToNextRoundRobin
     * bên GroupService), TeamStanding của CẢ 2 phase cùng season_id đều lẫn
     * vào 1 danh sách group phẳng. Vì group_id là unique giữa các phase
     * (không trùng), rows không lỗi logic tính toán, nhưng FE nhận về danh
     * sách "Bảng A, Bảng B" gộp chung của RR1 (đã xong, hạng cũ) lẫn RR2
     * (đang đá) mà không có cách nào phân biệt — hiển thị sai ngữ cảnh
     * ("giờ đang ở vòng nào").
     *
     * Trả về null nếu season chưa có round_robin phase nào — trạng thái hợp
     * lệ ("chưa bắt đầu"), không phải lỗi (giống findAllBySeason).
     */
    listActiveGroupStandings(seasonId: number): Promise<PhaseStandingsBlock | null>;
    /**
     * Trả TOÀN BỘ lịch sử standings round_robin của season — mọi phase RR
     * (kể cả đã locked), order tăng dần: RR1 (locked) -> RR2 (đang mở) -> ...
     * Dùng cho FE render tab lịch sử ("Vòng bảng 1", "Vòng bảng 2") trong
     * flow RR->RR->KO, tách biệt hẳn khỏi listActiveGroupStandings (chỉ trả
     * phase hiện tại) để 2 use-case (xem hiện tại vs xem lại lịch sử) không
     * lẫn payload vào nhau.
     */
    listGroupStandingsHistory(seasonId: number): Promise<PhaseStandingsBlock[]>;
    private _assertSeasonViewable;
    private _buildPhaseStandingsBlock;
    listPlayerStats(seasonId: number, req: QueryRequest): Promise<PaginatedResult<PlayerStatisticRow>>;
    getSuspendedPlayers(seasonId: number): Promise<({
        team: {
            name: string;
            id: number;
        };
        player: {
            id: number;
            user: {
                name: string;
            };
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date | null;
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        season_id: number;
        team_id: number;
        assists: number;
        matches_played: number;
        player_id: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        yellow_cards_since_reset: number;
        suspension_matches_remaining: number;
        is_suspended: boolean;
        total_fine_owed: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    /**
     * Recompute standings của 1 group từ đầu — full scan, không incremental.
     *
     * Full scan là đúng ở scale này (group ≤ 8 teams, ≤ 28 matches/group).
     * Incremental update phức tạp hơn nhiều (phải undo kết quả cũ) và không đáng.
     *
     * FIX (race condition — lost update): bản cũ, khi gọi standalone (không
     * có `tx` truyền vào), chạy TOÀN BỘ flow (load rule -> load match ->
     * accumulate -> sort -> upsert) bằng `this.prisma` KHÔNG transaction —
     * chỉ đoạn upsert cuối được bọc `$transaction`. 2 request confirmResult
     * của 2 match KHÁC NHAU cùng group gần như đồng thời (hoàn toàn có thể —
     * trọng tài nhập nhiều kết quả liền nhau) sẽ cùng đọc snapshot match cũ,
     * tính 2 bộ standings khác nhau, rồi ghi đè lên nhau — request nào ghi
     * sau "thắng", bộ standings của request đọc trước bị mất (lost update),
     * standings cuối cùng sai dù cả 2 request đều chạy thành công không lỗi.
     *
     * Fix bằng row lock trên group (SELECT ... FOR UPDATE), theo đúng pattern
     * đã dùng ở GroupService.deactivateGroup — serialize các lần recompute
     * CÙNG 1 group, không đụng group khác (khác lockSeason bên GroupService,
     * vốn serialize toàn bộ write-path group của season — recompute không
     * cần rộng vậy). Nếu gọi standalone (không có tx), tự mở 1 transaction
     * bao trọn toàn bộ flow để lock giữ được xuyên suốt lúc đọc + tính + ghi.
     */
    recomputeGroupStandings(groupId: number, tx?: Prisma.TransactionClient): Promise<void>;
    private _recomputeGroupStandingsLocked;
    /**
     * List seasons ở trạng thái người dùng quan tâm: ongoing, finished, cancelled.
     * upcoming / registration_open bị loại — chưa có standings để xem.
     *
     * Trả kèm tournament name để client render breadcrumb/filter.
     * Không load standings ở đây — lazy load khi user chọn season.
     *
     * FIX: `allowedStatuses` cũ liệt kê đủ cả 5 status (kể cả upcoming/
     * registration_open) — trái với đúng comment ngay phía trên, khiến
     * `statusFilter` mặc định (không truyền `status`) trả về CẢ 5 status
     * thay vì chỉ 3. Dùng chung `VIEWABLE_SEASON_STATUSES` — nếu FE truyền
     * status không nằm trong danh sách xem được (vd 'upcoming'), fallback
     * về mặc định 3 status thay vì lọt qua.
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
export {};
//# sourceMappingURL=standing.service.d.ts.map