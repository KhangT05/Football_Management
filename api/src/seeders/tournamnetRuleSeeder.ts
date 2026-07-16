import type { DbClient } from "./dbTypes.js";

/**
 * FIX (P0 — DEPRECATED, giữ lại chỉ để không phá import cũ):
 *
 * Bản trước hàm này (a) tự tạo 1 TournamentRule "Default Rule" với mọi giá
 * trị HARDCODE cứng (3-1-0, yellow_cards_suspension=3, ...) nếu không tìm
 * thấy rule `is_active: true` cho tournament, rồi (b) LUÔN ghi đè
 * `season.tournament_rule_id` sang rule đó.
 *
 * Vấn đề: `seedSeasonConfigurable` (seasonSeeder.ts) đã nhận `tournamentRuleId`
 * làm tham số và set thẳng vào season NGAY KHI TẠO — season không bao giờ
 * thiếu tournament_rule_id trong pipeline hiện tại (đây vốn là lý do hàm này
 * ra đời — "Season tạo ra trước đó không có tournament_rule_id" — nhưng
 * seasonSeeder đã tự khắc phục việc đó ở nguồn). Nếu hàm này vẫn được gọi
 * sau seedSeasonConfigurable, nó sẽ:
 *   1. Tìm rule active theo tournament — nếu `tournamentSeeder.seedTournament`
 *      đã set `is_active: true` (đã fix), sẽ tìm thấy ĐÚNG rule theo từng
 *      giải (vd amateur 2-1-0).
 *   2. Nhưng nếu vì lý do nào đó (data cũ, race condition, gọi seedTournament
 *      phiên bản trước fix) rule active không tồn tại, hàm sẽ tạo 1 rule
 *      GENERIC 3-1-0 và ghi đè season sang rule sai — vô hiệu hoá hoàn toàn
 *      ruleOverrides theo giải.
 *
 * Fix: hàm này giờ CHỈ là no-op phòng vệ. Không tạo rule mới, không ghi đè
 * season đã có tournament_rule_id. Chỉ throw nếu season KHÔNG có rule nào —
 * đây là bug thật cần biết sớm (season được tạo sai luồng, bỏ qua
 * seedSeasonConfigurable), không phải trường hợp nên tự "vá" bằng rule generic.
 *
 * KHÔNG gọi hàm này trong index.ts của pipeline hiện tại — seedTournament +
 * seedSeasonConfigurable đã đủ để gán đúng rule cho season. Giữ lại file này
 * chỉ để không phá bất kỳ import cũ nào còn trỏ tới nó.
 */
export async function seedTournamentRule(
    db: DbClient,
    tournamentId: number,
    seasonId: number
): Promise<{ ruleId: number }> {
    const season = await db.season.findUniqueOrThrow({
        where: { id: seasonId },
        select: { tournament_rule_id: true, tournament_id: true },
    });

    if (season.tournament_id !== tournamentId) {
        throw new Error(
            `seedTournamentRule: season #${seasonId} thuộc tournament #${season.tournament_id}, ` +
            `không phải tournament #${tournamentId} truyền vào — kiểm tra lại thứ tự gọi seeder.`
        );
    }

    if (season.tournament_rule_id != null) {
        console.log(
            `[TournamentRuleSeeder] Season #${seasonId} đã có tournament_rule_id=${season.tournament_rule_id} ` +
            `(gán từ seedSeasonConfigurable) — bỏ qua, KHÔNG tạo rule generic hay ghi đè.`
        );
        return { ruleId: season.tournament_rule_id };
    }

    throw new Error(
        `seedTournamentRule: season #${seasonId} không có tournament_rule_id. ` +
        `Season phải được tạo qua seedSeasonConfigurable với tournamentRuleId đã biết trước ` +
        `(từ seedTournament) — không tự tạo rule generic ở bước này nữa để tránh ghi đè ` +
        `ruleOverrides riêng của từng giải. Kiểm tra lại thứ tự gọi trong index.ts.`
    );
}