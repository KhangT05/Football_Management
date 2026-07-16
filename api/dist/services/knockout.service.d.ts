import { PrismaClient, PhaseType } from '../generated/prisma/client.js';
import { AdvanceWinnerInput, BracketSlotNode, KnockoutGenerateOptions, KnockoutGenerateResult, AutoSeedKnockoutOptions, SwapSeedsInput } from '../types/knockout.type.js';
import { OptionalScheduleOptions } from '../types/schedule.type.js';
import { ScheduleEngine } from '../libs/schedule.engine.js';
import { StandingsService } from './standing.service.js';
export declare class KnockoutService extends ScheduleEngine {
    private readonly standingsService;
    constructor(prisma: PrismaClient, standingsService: StandingsService);
    private getOrCreateKnockoutPhase;
    private phaseNameFor;
    private ensureSeasonOngoing;
    /**
     * Guard dùng chung cho cả resolveSeeds (manual seed theo rank) và
     * generateKnockoutFromStandings (auto-seed theo topN): group phải hết
     * match pending, và standings phải được recompute mới nhất trước khi
     * đọc position.
     */
    private _ensureGroupsReadyAndRecompute;
    private resolveSeeds;
    generateKnockoutBracket(options: KnockoutGenerateOptions): Promise<KnockoutGenerateResult>;
    /**
     * Tự chọn top-N mỗi group theo TeamStanding.position rồi ghép cặp round 1
     * theo `mode`, không cần nhập tay từng SeedSource:
     * - 'straight': top-k group[i] đấu top-k group[i+1] (ghép cặp group liên
     *   tiếp trong mảng groupIds) — vd top1 A vs top1 B, top2 A vs top2 B.
     * - 'cross': top-k group[i] đấu top-(N+1-k) group[i+1] — vd top1 A vs
     *   top2 B, top2 A vs top1 B.
     * - 'random': random toàn bộ pool top-N của mọi group, đảm bảo không có
     *   cặp nào cùng group (round-robin interleave, không cần retry/backtrack).
     *
     * Tổng số đội (groupIds.length × topN) BẮT BUỘC là lũy thừa của 2 — đây
     * là ràng buộc cấu trúc bracket single-elimination, không né được.
     */
    generateKnockoutFromStandings(options: AutoSeedKnockoutOptions): Promise<KnockoutGenerateResult>;
    private _buildStraightPairs;
    private _buildCrossPairs;
    /**
     * Random nhưng không trùng group bằng round-robin interleave thay vì
     * shuffle-rồi-thử-lại: xáo trong từng group trước, rồi trải đều theo
     * chu kỳ group1,group2,...,groupG lặp topN lần. Với mọi group có ĐÚNG
     * topN phần tử, 2 phần tử liên tiếp trong chuỗi trải đều luôn khác group
     * (groupIds.length >= 2 đã được validate ở entrypoint). Ghép cặp
     * (index 2k, 2k+1) của chuỗi đã trải đều.
     */
    private _buildRandomPairs;
    private _finalizeWithSchedule;
    /**
     * Refactor chung từ generateKnockoutBracket cũ: mọi logic tạo
     * phase/slot/link/round1-match/bye-propagation/stranded-match giờ nhận
     * thẳng `round1Pairings` đã build sẵn — dùng chung cho cả manual-seed
     * (buildRound1Pairings từ SeedSource, có thể có bye) và auto-seed từ
     * standings (luôn đủ cặp, byeCount = 0). is_bye tự suy ra từ pairing
     * có null hay không, không cần tham số byeCount riêng.
     */
    private _buildBracketInPhase;
    advanceWinner(phaseId: number, seasonId: number, input: AdvanceWinnerInput, scheduleOptions: OptionalScheduleOptions): Promise<{
        matchCreated: boolean;
        newMatchId?: number;
        scheduleWarning?: string;
    }>;
    private _computeAggregateWinner;
    scheduleBracket(phaseId: number, seasonId: number, scheduleOptions: OptionalScheduleOptions): Promise<{
        scheduledCount: number;
        failedMatchIds: number[];
        scheduleWarning?: string;
    }>;
    getBracket(phaseId: number): Promise<BracketSlotNode[]>;
    /**
     * Đổi chỗ 2 đội đang seed ở round 1 — dùng khi admin muốn tránh cùng
     * bảng gặp lại nhau sớm, cân bằng nhánh mạnh/yếu, v.v.
     *
     * KHÔNG cho phép:
     * - Swap khi phase đã "xác nhận" (PhaseStatus.locked — xem confirmBracket
     *   bên dưới, tái dùng status có sẵn, không thêm cột mới).
     * - Swap khi 1 trong 2 slot có match liên quan đã kết thúc/forfeit — coi
     *   như bracket đã "tự chốt" một khi trận đầu tiên diễn ra.
     * - Swap slot rỗng (chưa có đội / bye) — không có gì để đổi.
     *
     * Nếu slot đã có match (Match đã được tạo sẵn nhưng CHƯA đá), đồng bộ
     * luôn home/away_team_id của match đó (và leg 2 nếu có) theo đội mới —
     * an toàn vì chưa có MatchResult nào tham chiếu.
     *
     * Nếu slot là BYE và đã propagate winner lên slot round 2, đồng bộ luôn
     * seeded_home/away của slot round 2 đó — nếu không, nhánh trên vẫn hiển
     * thị đội cũ dù vòng 1 đã đổi.
     */
    swapSeeds(phaseId: number, input: SwapSeedsInput): Promise<void>;
    /**
     * Cập nhật home/away_team_id của match (leg 1 + leg 2 nếu có) sau khi
     * swap seed — match CHƯA có MatchResult (đảm bảo ở tầng gọi bằng
     * TERMINAL_MATCH_STATUSES check) nên ghi đè trực tiếp là an toàn.
     */
    private _syncMatchTeamAfterSwap;
    /**
     * Nếu slot vừa swap là BYE, winner của nó đã được propagate 1 lần lên
     * slot round 2 lúc generate (xem parentUpdates trong _buildBracketInPhase)
     * — swap xong phải sửa luôn slot round 2 đó, và match của slot round 2
     * đó nếu đã được tạo (double-bye stranded match).
     */
    private _syncByeParentAfterSwap;
    /**
     * "Xác nhận" sơ đồ = chuyển phase sang PhaseStatus.locked — TÁI DÙNG
     * status đã có sẵn trong schema (không thêm cột/migration mới).
     * `_buildBracketInPhase` đã dùng `locked` để chặn generate lại bracket
     * cho phase này, nên tái dùng cùng ngữ nghĩa "phase đã chốt cấu trúc,
     * không sửa nữa" là nhất quán, không xung đột với chỗ khác.
     *
     * Chặn xác nhận nếu đã có trận vòng 1 kết thúc — không phải lỗi, chỉ vì
     * lúc đó không còn gì để "xác nhận" nữa (coi như đã tự chốt khi trận
     * đầu tiên diễn ra).
     */
    confirmBracket(phaseId: number): Promise<void>;
    private propagateWinner;
    private createRound1Matches;
    private scheduleMatchBatch;
    private buildAllSlotCreateData;
    private bulkLinkSlots;
    /**
 * Guard dùng NGAY TRONG transaction tạo bracket — chặn tạo phase 'final'/
 * 'third_place'/'semi_final'/'quarter_final' khi phase liền trước chưa tồn
 * tại hoặc còn match chưa kết thúc (finished/forfeited).
 */
    private _assertPreviousStageComplete;
    /**
     * NEW: đọc-only version cho FE — gọi TRƯỚC khi bấm "Tạo Sơ Đồ Bracket" để
     * disable nút + hiện lý do, thay vì để user ăn lỗi 409 sau khi submit. Cần
     * thêm route (chưa có sẵn controller trong context này):
     *   GET /knockout/seasons/:seasonId/stage-readiness?phaseType=final
     */
    getStageReadiness(seasonId: number, targetPhaseType: PhaseType): Promise<{
        ready: boolean;
        priorPhaseType: PhaseType | null;
        priorPhaseExists: boolean;
        unfinishedCount: number;
    }>;
}
//# sourceMappingURL=knockout.service.d.ts.map