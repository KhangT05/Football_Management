import { PrismaClient, LeaveReason } from "../generated/prisma/client.js";
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
export declare function seedSquads(db: PrismaClient, seasonTeamIdByName: Record<string, number>, existingPlayerIds?: number[], targetSquadSize?: number): Promise<void>;
/**
 * Edge case 1: squad đúng biên min_players_per_team / max_players_per_team
 * của TournamentRule (default 7 / 11) — dùng để test validation "đủ người
 * đá" ở đúng ranh giới thay vì test với 23 (full) hoặc số ngẫu nhiên.
 */
export declare function seedBoundarySquad(db: PrismaClient, seasonTeamId: number, teamNameForEmail: string, size: number): Promise<void>;
/**
 * Edge case 2: squad KHÔNG có goalkeeper nào (lỗi đăng ký / GK duy nhất bị
 * loại trước giải). matchDetailSeeder.splitStartersSubs lấy
 * squad.filter(jersey<=3).slice(0,1) làm GK — nếu rỗng, đội ra sân thiếu
 * thủ môn. Dùng case này để test guard ở tầng lineup/schedule validation
 * (nên chặn match diễn ra nếu 0 GK, không nên để lineup seeder âm thầm bỏ qua).
 */
export declare function seedGoalkeeperlessSquad(db: PrismaClient, seasonTeamId: number, teamNameForEmail: string, size?: number): Promise<void>;
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
export declare function seedMidSeasonTransfer(db: PrismaClient, fromSeasonTeamId: number, toSeasonTeamId: number, playerId: number, newJerseyNumber: number, reason?: LeaveReason): Promise<void>;
//# sourceMappingURL=squadSeeder.d.ts.map