import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
interface MatchSummary {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}
/**
 * FIX (P0): bản trước gọi thẳng `db.phase.create` cho phase knockout VÀ phase
 * tranh hạng 3 mà không hề `findFirst` trước — không giống `seedGroupStage`
 * (groupPhaseSeeder.ts) vốn đã làm đúng pattern này. Hệ quả: chạy lại seed
 * script (hoặc retry sau crash giữa vòng propagate bracket) sẽ tạo PHASE
 * TRÙNG cho cùng season, kéo theo toàn bộ bracket slot + match + match result
 * bị nhân đôi/nhiều lần. Fix bằng cách coi (season_id, type) là khoá tự
 * nhiên của phase, y hệt cách groupPhaseSeeder đã làm — và nếu phase đã tồn
 * tại kèm bracket slot đầy đủ, coi như đã seed xong, bỏ qua toàn bộ việc mô
 * phỏng trận đấu (không có cách rẻ nào để "resume" giữa chừng 1 bracket
 * knockout vì kết quả round sau phụ thuộc round trước — coi phase đã có slot
 * là seed xong, y hệt cách groupMatchSeeder coi season đã seed đủ 6 trận là
 * xong 1 bảng).
 */
export declare function seedKnockoutBracket(db: DbClient, seasonId: number, topTwoByGroup: Record<GroupLetter, [number, number]>, venueIds: number[], roundOf16Template: [GroupLetter, GroupLetter][]): Promise<{
    championTeamId: number;
    allMatches: MatchSummary[];
}>;
export {};
//# sourceMappingURL=knockoutSeeder.d.ts.map