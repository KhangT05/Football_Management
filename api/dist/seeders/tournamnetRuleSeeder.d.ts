import type { DbClient } from "./dbTypes.js";
/**
 * Seed TournamentRule mặc định cho tournament + gán tournament_rule_id vào season.
 * PHẢI chạy TRƯỚC seedGroupStage/seedGroupMatchesAndStandings — các bước đó
 * (hoặc StandingsService ở read-path) join qua season.tournamentRule để lấy
 * points_per_win/draw/loss. Season tạo ra thiếu tournament_rule_id sẽ khiến
 * mọi API/FE tính standings từ rule bị null-reference hoặc fallback 0 — đây
 * là nguyên nhân PTS luôn hiện 0 dù TeamStanding.points đã lưu đúng giá trị
 * (position vẫn đúng vì cột đó không phụ thuộc rule).
 */
export declare function seedTournamentRule(db: DbClient, tournamentId: number, seasonId: number): Promise<{
    ruleId: number;
}>;
//# sourceMappingURL=tournamnetRuleSeeder.d.ts.map