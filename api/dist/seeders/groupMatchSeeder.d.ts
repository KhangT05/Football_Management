import type { DbClient } from "./dbTypes.js";
import type { GroupLetter } from "./teamGenerator.js";
export interface GroupStandingsResult {
    topTwoByGroup: Record<GroupLetter, [number, number]>;
    createdMatches: CreatedMatchInfo[];
}
export interface CreatedMatchInfo {
    matchId: number;
    homeTeamId: number;
    awayTeamId: number;
    homeScore: number;
    awayScore: number;
}
/**
 * FIX (P1): bản trước quyết định "đã seed xong bảng này chưa" dựa vào
 * `existingCount >= 6` (aggregate count trên toàn group), rồi hoặc replay
 * TOÀN BỘ 6 cặp bằng match mới (nếu count < 6), hoặc đọc lại TOÀN BỘ 6 cặp
 * cũ (nếu count >= 6) — không có branch nào xử lý đúng case "crash giữa
 * chừng" (vd 3/6 match đã tạo). Nếu crash ở match thứ 4, lần seed lại sẽ có
 * `existingCount=3 < 6` -> chạy lại từ pair đầu tiên -> TẠO TRÙNG 3 match đã
 * có (vì `Match.leg` nullable nên unique constraint không chặn được — đúng
 * cảnh báo trong dbTypes.ts). Kết quả: 9 match thay vì 6, tally cộng dồn sai,
 * standings sai lặng lẽ.
 *
 * Fix: check tồn tại theo ĐÚNG cặp (home, away) trước khi tạo, y hệt pattern
 * đã áp dụng đúng ở messySeasonSeeder.ts (sau fix). Không còn phụ thuộc vào
 * aggregate count nữa — mỗi cặp tự quyết định resume hay tạo mới, độc lập
 * với các cặp khác trong cùng group.
 */
export declare function seedGroupMatchesAndStandings(db: DbClient, groupStagePhaseId: number, groupIdByLetter: Record<GroupLetter, number>, teamIdByName: Record<string, number>, seasonId: number, venueIds: number[], groups: Record<GroupLetter, string[]>, rulePoints: {
    win: number;
    draw: number;
    loss: number;
}): Promise<GroupStandingsResult>;
//# sourceMappingURL=groupMatchSeeder.d.ts.map