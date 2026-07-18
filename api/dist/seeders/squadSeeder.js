import bcrypt from "bcrypt";
import { PlayerPosition, PlayerRole, PlayerStatus, ApprovalStatus, LeaveReason, } from "../generated/prisma/client.js";
import { buildSquadPositions, generatePlayerEmail, generatePlayerName, slugifyTeamName } from "./helperSeeder.js";
const BCRYPT_ROUNDS = 12;
const SQUAD_SIZE = 23;
const DEFAULT_PASSWORD = "Player@123456";
// ============================================================
// Core: seed đội hình theo season_team_id (KHÔNG phải team_id —
// jersey_number và player_id chỉ unique trong phạm vi 1 season_team,
// đúng theo @@unique([season_team_id, jersey_number]) / ([season_team_id, player_id])).
// ============================================================
/**
 * Kiểm tra player chưa đăng ký cho season_team KHÁC trong CÙNG 1 season.
 * Không có constraint DB nào chặn việc này (unique key chỉ scope theo
 * season_team_id) — 1 cầu thủ hoàn toàn có thể bị gán nhầm vào 2 đội
 * trong cùng mùa giải nếu không check ở tầng application.
 *
 * Cost: 1 query/player khi dùng existingPlayerIds. Chấp nhận được cho
 * seed script (chạy 1 lần, volume nhỏ); nếu squad lớn (hàng nghìn player)
 * nên đổi sang batch-fetch toàn bộ season_team_id đã dùng theo player_id
 * trước vòng lặp thay vì query từng cái.
 */
async function assertNoCrossTeamConflictInSeason(db, seasonTeamId, playerId) {
    const st = await db.seasonTeam.findUniqueOrThrow({ where: { id: seasonTeamId }, select: { season_id: true } });
    const conflict = await db.teamPlayer.findFirst({
        where: { player_id: playerId, season_team: { season_id: st.season_id, id: { not: seasonTeamId } } },
        select: { season_team_id: true },
    });
    if (conflict) {
        throw new Error(`[SquadSeeder] player #${playerId} đã thuộc season_team #${conflict.season_team_id} trong season #${st.season_id} — ` +
            `không thể gán thêm vào season_team #${seasonTeamId} (1 cầu thủ = 1 đội / mùa).`);
    }
}
/**
 * Sinh đội hình cho TẤT CẢ season_team trong seasonTeamIdByName.
 *
 * seasonTeamIdByName: team name -> SeasonTeam.id (KHÔNG phải Team.id).
 * Caller phải đăng ký team vào season (db.seasonTeam.create) trước, lấy id
 * đó ra build map này.
 *
 * existingPlayerIds: player_id "thật" chưa gán season_team nào trong season
 * hiện tại — ưu tiên nhét vào các đội đầu trước khi sinh player giả.
 *
 * targetSquadSize: cho phép sinh đội hình KHÔNG đủ 23 (kể cả < 11) để mô
 * phỏng team đăng ký nhưng thiếu người. Với size <= 23 dùng đúng block
 * convention 3GK/8DF/8MF/4FW (matchDetailSeeder.splitStartersSubs đọc theo
 * block này); size < 11 dùng buildProportionalPositions để tránh sinh
 * squad thiếu hẳn 1 tuyến (xem seedBoundarySquad bên dưới).
 */
export async function seedSquads(db, seasonTeamIdByName, existingPlayerIds = [], targetSquadSize = SQUAD_SIZE) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const teamEntries = Object.entries(seasonTeamIdByName);
    const realPlayerQueue = [...existingPlayerIds];
    let globalSeedIndex = 1;
    for (const [teamName, seasonTeamId] of teamEntries) {
        const positions = buildSquadPositions();
        const slug = slugifyTeamName(teamName);
        const alreadyCount = await db.teamPlayer.count({ where: { season_team_id: seasonTeamId } });
        if (alreadyCount >= targetSquadSize)
            continue;
        let jersey = alreadyCount + 1;
        const slotsToFill = targetSquadSize - alreadyCount;
        for (let i = 0; i < slotsToFill; i++) {
            const idx = (jersey - 1) % positions.length;
            const position = positions[idx];
            if (!position) {
                throw new Error(`squadSeeder: positions rỗng hoặc index out of range (idx=${idx})`);
            }
            const role = jersey === 1 ? PlayerRole.captain : jersey === 2 ? PlayerRole.vice_captain : PlayerRole.player;
            let playerId;
            const realPlayerId = realPlayerQueue.shift();
            if (realPlayerId) {
                await assertNoCrossTeamConflictInSeason(db, seasonTeamId, realPlayerId);
                playerId = realPlayerId;
                // NOTE: ghi đè Player.position (career position) theo vị trí được
                // xếp ở đội này. Đây là data smell có sẵn từ code gốc — Player.position
                // và TeamPlayer.position lẽ ra nên tách biệt (career vs in-squad),
                // giữ nguyên hành vi để không đổi semantics ngoài phạm vi fix schema.
                await db.player.update({ where: { id: playerId }, data: { position } });
            }
            else {
                const email = generatePlayerEmail(slug, globalSeedIndex);
                const name = generatePlayerName(globalSeedIndex);
                globalSeedIndex++;
                const user = await db.user.upsert({
                    where: { email },
                    update: {},
                    create: { name, email, password: passwordHash, email_verified: true, email_verified_at: new Date() },
                });
                const player = await db.player.upsert({
                    where: { user_id: user.id },
                    update: {},
                    create: { user_id: user.id, date_of_birth: new Date(2000, 0, 1), position, nationality: teamName },
                });
                playerId = player.id;
            }
            await db.teamPlayer.upsert({
                where: { season_team_id_jersey_number: { season_team_id: seasonTeamId, jersey_number: jersey } },
                update: {},
                create: {
                    season_team_id: seasonTeamId,
                    player_id: playerId,
                    jersey_number: jersey,
                    position,
                    role,
                    status: PlayerStatus.active,
                    approval_status: ApprovalStatus.approved,
                },
            });
            jersey++;
        }
        console.log(`[SquadSeeder] ${teamName} (season_team #${seasonTeamId}): đủ ${Math.min(alreadyCount + slotsToFill, targetSquadSize)}/${SQUAD_SIZE} cầu thủ (target=${targetSquadSize})`);
    }
}
// ============================================================
// EDGE CASES MỚI
// ============================================================
/**
 * Composition tỉ lệ (không dùng modulo 23) — dùng cho squad nhỏ (< 11) để
 * đảm bảo đủ các tuyến thay vì lệ thuộc thứ tự block cố định của
 * buildSquadPositions(). Modulo trên mảng 23 phần tử với size < 11 sẽ luôn
 * lấy đúng phần đầu mảng (3 GK + N-3 DF) — không có MF/FW, không phản ánh
 * đúng 1 đội bóng thật thiếu người nhưng vẫn cần đá được.
 */
function buildProportionalPositions(size) {
    const gk = Math.max(1, Math.round((size * 3) / 23));
    const remaining = size - gk;
    const df = Math.round((remaining * 8) / 15);
    const mf = Math.round((remaining * 8) / 15);
    const fw = remaining - df - mf;
    const result = [
        ...Array(gk).fill(PlayerPosition.goalkeeper),
        ...Array(Math.max(0, df)).fill(PlayerPosition.defender),
        ...Array(Math.max(0, mf)).fill(PlayerPosition.midfielder),
        ...Array(Math.max(0, fw)).fill(PlayerPosition.forward),
    ];
    // làm tròn có thể lệch 1-2 slot — cắt/bù bằng defender cho khớp size
    while (result.length < size)
        result.push(PlayerPosition.defender);
    return result.slice(0, size);
}
/**
 * Edge case 1: squad đúng biên min_players_per_team / max_players_per_team
 * của TournamentRule (default 7 / 11) — dùng để test validation "đủ người
 * đá" ở đúng ranh giới thay vì test với 23 (full) hoặc số ngẫu nhiên.
 */
export async function seedBoundarySquad(db, seasonTeamId, teamNameForEmail, size // truyền đúng min_players_per_team hoặc max_players_per_team từ TournamentRule
) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const positions = buildProportionalPositions(size);
    const slug = slugifyTeamName(teamNameForEmail);
    const already = await db.teamPlayer.count({ where: { season_team_id: seasonTeamId } });
    for (let jersey = already + 1; jersey <= size; jersey++) {
        const email = `${slug}.boundary.p${jersey}@fifa-seed.local`;
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: { name: `CT biên #${jersey}`, email, password: passwordHash, email_verified: true, email_verified_at: new Date() },
        });
        const position = positions[jersey - already - 1];
        const player = await db.player.upsert({
            where: { user_id: user.id },
            update: {},
            create: { user_id: user.id, date_of_birth: new Date(2001, 0, 1), position, nationality: teamNameForEmail },
        });
        await db.teamPlayer.upsert({
            where: { season_team_id_jersey_number: { season_team_id: seasonTeamId, jersey_number: jersey } },
            update: {},
            create: {
                season_team_id: seasonTeamId,
                player_id: player.id,
                jersey_number: jersey,
                position,
                role: jersey === already + 1 ? PlayerRole.captain : PlayerRole.player,
                status: PlayerStatus.active,
                approval_status: ApprovalStatus.approved,
            },
        });
    }
    console.log(`[SquadSeeder] boundary squad "${teamNameForEmail}" (season_team #${seasonTeamId}): ${size} cầu thủ.`);
}
/**
 * Edge case 2: squad KHÔNG có goalkeeper nào (lỗi đăng ký / GK duy nhất bị
 * loại trước giải). matchDetailSeeder.splitStartersSubs lấy
 * squad.filter(jersey<=3).slice(0,1) làm GK — nếu rỗng, đội ra sân thiếu
 * thủ môn. Dùng case này để test guard ở tầng lineup/schedule validation
 * (nên chặn match diễn ra nếu 0 GK, không nên để lineup seeder âm thầm bỏ qua).
 */
export async function seedGoalkeeperlessSquad(db, seasonTeamId, teamNameForEmail, size = 11) {
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, BCRYPT_ROUNDS);
    const slug = slugifyTeamName(teamNameForEmail);
    const outfield = [PlayerPosition.defender, PlayerPosition.midfielder, PlayerPosition.forward];
    const already = await db.teamPlayer.count({ where: { season_team_id: seasonTeamId } });
    for (let jersey = already + 1; jersey <= size; jersey++) {
        const email = `${slug}.no-gk.p${jersey}@fifa-seed.local`;
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: { name: `CT không GK #${jersey}`, email, password: passwordHash, email_verified: true, email_verified_at: new Date() },
        });
        const position = outfield[(jersey - 1) % outfield.length];
        const player = await db.player.upsert({
            where: { user_id: user.id },
            update: {},
            create: { user_id: user.id, date_of_birth: new Date(2001, 0, 1), position, nationality: teamNameForEmail },
        });
        await db.teamPlayer.upsert({
            where: { season_team_id_jersey_number: { season_team_id: seasonTeamId, jersey_number: jersey } },
            update: {},
            create: {
                season_team_id: seasonTeamId,
                player_id: player.id,
                jersey_number: jersey,
                position,
                role: jersey === already + 1 ? PlayerRole.captain : PlayerRole.player,
                status: PlayerStatus.active,
                approval_status: ApprovalStatus.approved,
            },
        });
    }
    console.log(`[SquadSeeder] goalkeeper-less squad "${teamNameForEmail}" (season_team #${seasonTeamId}): ${size} cầu thủ, 0 GK.`);
}
/**
 * Edge case 3: chuyển nhượng giữa mùa — player rời season_team A (ghi
 * TeamPlayerHistory với left_at/left_reason) rồi được đăng ký lại ở
 * season_team B. TeamPlayerHistory tồn tại trong schema nhưng KHÔNG có
 * seeder nào tạo dữ liệu cho nó trước giờ — nếu có report/UI đọc lịch sử
 * chuyển nhượng thì trước đây luôn rỗng, không phát hiện được bug ở tầng đó.
 *
 * fromSeasonTeamId và toSeasonTeamId PHẢI cùng season_id nếu muốn mô phỏng
 * "chuyển đội giữa mùa" thật; khác season_id thì đây chỉ đơn giản là đăng
 * ký lại ở mùa mới — không cần history (transfer window logic không áp dụng
 * xuyên season theo thiết kế hiện tại, chỉ có 1 TeamPlayer record sống tại
 * 1 thời điểm do unique([season_team_id, player_id])).
 */
export async function seedMidSeasonTransfer(db, fromSeasonTeamId, toSeasonTeamId, playerId, newJerseyNumber, reason = LeaveReason.transferred) {
    const existing = await db.teamPlayer.findUnique({
        where: { season_team_id_player_id: { season_team_id: fromSeasonTeamId, player_id: playerId } },
    });
    if (!existing) {
        throw new Error(`[SquadSeeder] player #${playerId} không thuộc season_team #${fromSeasonTeamId} — không có gì để transfer.`);
    }
    await db.$transaction(async (tx) => {
        await tx.teamPlayerHistory.create({
            data: {
                season_team_id: fromSeasonTeamId,
                player_id: playerId,
                jersey_number: existing.jersey_number,
                position: existing.position,
                role: existing.role,
                joined_at: existing.joined_at,
                left_at: new Date(),
                left_reason: reason,
            },
        });
        await tx.teamPlayer.delete({ where: { id: existing.id } });
        await tx.teamPlayer.create({
            data: {
                season_team_id: toSeasonTeamId,
                player_id: playerId,
                jersey_number: newJerseyNumber,
                position: existing.position,
                role: PlayerRole.player, // reset role — captain/vice-captain không tự động mang theo sang đội mới
                status: PlayerStatus.active,
                approval_status: ApprovalStatus.pending, // đội mới nhận cần duyệt lại
            },
        });
    });
    console.log(`[SquadSeeder] transfer: player #${playerId} ${fromSeasonTeamId} -> ${toSeasonTeamId} (reason=${reason}), jersey mới #${newJerseyNumber}.`);
}
//# sourceMappingURL=squadSeeder.js.map