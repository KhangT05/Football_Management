// prisma/seed/registrationSeeder.ts
//
// NEW FILE — dành cho các mùa giải CHƯA có Phase/Group (upcoming,
// registration_open, cancelled). Khác seasonSeeder.seedSeasonConfigurable
// (đăng ký TOÀN BỘ đội cùng lúc với status "active"), file này mô phỏng quá
// trình đăng ký THẬT: từng đội nộp đơn ở thời điểm khác nhau, được duyệt/từ
// chối/rút lui độc lập — đúng với SeasonTeamStatus (approved/pending/active/
// eliminated/withdrawn) và ApprovalStatus mà bản seed gốc chưa từng dùng hết.
import { JerseyType, SeasonTeamStatus } from "../generated/prisma/client.js";
import { randInt } from "./helperSeeder.js";
/**
 * Đăng ký MỘT PHẦN các đội vào season theo kế hoạch (status + số lượng),
 * KHÔNG gán group_id (vì group/phase chưa tồn tại ở các archetype này).
 * Chỉ đội có status approved/active mới được xem là "đã chốt tham dự" nên
 * mới có đủ jersey (đội pending/withdrawn thường chưa hoàn tất bước chọn
 * màu áo — đúng luồng đăng ký thật: chọn áo là bước sau khi được duyệt).
 */
export async function seedPartialRegistrations(db, seasonId, availableTeamIds, plan) {
    const seasonTeamIdByTeamId = {};
    const registeredTeamIds = [];
    let cursor = 0;
    for (const entry of plan) {
        for (let i = 0; i < entry.count; i++) {
            const teamId = availableTeamIds[cursor];
            cursor++;
            if (teamId === undefined) {
                console.warn(`[RegistrationSeeder] hết đội khả dụng (cần thêm ${entry.count - i} đội status=${entry.status}) — dừng sớm.`);
                break;
            }
            const st = await db.seasonTeam.upsert({
                where: { season_id_team_id: { season_id: seasonId, team_id: teamId } },
                update: {},
                create: {
                    season_id: seasonId,
                    team_id: teamId,
                    status: entry.status,
                    seed: null,
                },
            });
            seasonTeamIdByTeamId[teamId] = st.id;
            registeredTeamIds.push(teamId);
            const hasCommittedJersey = entry.status === SeasonTeamStatus.approved || entry.status === SeasonTeamStatus.active;
            if (hasCommittedJersey) {
                await db.seasonTeamJersey.upsert({
                    where: { season_team_id_type: { season_team_id: st.id, type: JerseyType.home } },
                    update: {},
                    create: {
                        season_team_id: st.id,
                        type: JerseyType.home,
                        primary_color: pickHex(),
                        secondary_color: pickHex(),
                    },
                });
            }
        }
    }
    console.log(`[RegistrationSeeder] Season #${seasonId}: đăng ký ${registeredTeamIds.length}/${availableTeamIds.length} đội khả dụng ` +
        `(${plan.map((p) => `${p.status}=${p.count}`).join(", ")})`);
    return { seasonTeamIdByTeamId, registeredTeamIds };
}
function pickHex() {
    const palette = ["#FFFFFF", "#111111", "#D32F2F", "#1976D2", "#FBC02D", "#388E3C", "#7B1FA2"];
    return palette[randInt(0, palette.length - 1)] ?? "#FFFFFF";
}
//# sourceMappingURL=registrationSeeder.js.map