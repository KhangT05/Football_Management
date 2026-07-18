import { MatchResultStatus } from "../generated/prisma/client.js";
import type { DbClient } from "./dbTypes.js";
export declare function seedMatchDetails(db: DbClient, params: {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
    homeSeasonTeamId: number;
    awaySeasonTeamId: number;
}): Promise<void>;
/**
 * Forfeit: 1 đội không ra sân (thiếu người hợp lệ, vi phạm kỷ luật...).
 * Đội forfeit KHÔNG có lineup (không đá thật). Điểm số theo
 * TournamentRule.forfeit_score (default 3) — truyền vào từ caller vì
 * seeder này không tự query TournamentRule (giữ hàm thuần, không side-query
 * ngoài phạm vi match).
 *
 * Lưu ý: MatchResult.home_final_score/away_final_score dùng để hiển thị kết
 * quả cuối; winner nhận forfeitScore-0, không phải tỉ số thật.
 */
export declare function seedForfeitMatchDetails(db: DbClient, params: {
    matchId: number;
    forfeitingTeamId: number;
    winningTeamId: number;
    winningSeasonTeamId: number;
    forfeitScore: number;
    isHomeForfeiting: boolean;
}): Promise<void>;
/**
 * Abandoned: trận đang đá thì bị dừng giữa chừng (mưa bão, sự cố an ninh,
 * chấn thương nặng...). Cả 2 đội có lineup đầy đủ (trận đã bắt đầu), nhưng
 * events chỉ phát sinh trong khoảng [0, abandonedMinute] — không tạo
 * MatchResult vì kết quả CHƯA được phân định (cần review thủ công, đúng
 * với field pending_official_at / MatchResultStatus.under_review sẵn có
 * trong schema).
 */
export declare function seedAbandonedMatchDetails(db: DbClient, params: {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeSeasonTeamId: number;
    awaySeasonTeamId: number;
    abandonedMinute: number;
    abandonedReason: string;
    homeScoreAtAbandonment: number;
    awayScoreAtAbandonment: number;
}): Promise<void>;
/**
 * Disputed result: mutate 1 MatchResult ĐÃ tồn tại (tạo bởi seedMatchDetails
 * / flow bình thường) sang trạng thái tranh chấp — protested (đang khiếu
 * nại), overturned (đã lật kèo sau khiếu nại), hoặc under_review. Không tự
 * tạo MatchResult mới vì dispute luôn xảy ra SAU khi đã có kết quả chính
 * thức.
 */
export declare function seedDisputedResultDetails(db: DbClient, params: {
    matchId: number;
    newStatus: typeof MatchResultStatus.protested | typeof MatchResultStatus.overturned | typeof MatchResultStatus.under_review;
    appealReason: string;
    appealNote?: string;
}): Promise<void>;
//# sourceMappingURL=matchDetailSeeder.d.ts.map