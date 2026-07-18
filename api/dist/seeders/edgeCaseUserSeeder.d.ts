import { PrismaClient } from "../generated/prisma/client.js";
import type { RoleName } from "./roleSeeder.js";
export interface OrphanLeader {
    userId: number;
    email: string;
}
/** Tạo N user role=leader nhưng KHÔNG gán TeamLeader — mô phỏng "đăng ký làm trưởng đoàn nhưng chưa lập đội". */
export declare function seedOrphanLeaders(db: PrismaClient, roleMap: Record<RoleName, number>, count: number): Promise<OrphanLeader[]>;
/** Tạo N user role=player + Player row NHƯNG không đưa vào bất kỳ TeamPlayer nào — cầu thủ tự do. */
export declare function seedFreeAgentPlayers(db: PrismaClient, roleMap: Record<RoleName, number>, count: number): Promise<number[]>;
/**
 * Tạo 1 Team KHÔNG đăng ký vào season nào — đội tồn tại trong hệ thống (có
 * HLV) nhưng chưa từng đăng ký giải. FIX: bản trước còn seed luôn TeamPlayer
 * cho đội này bằng team_id — sai vì TeamPlayer chỉ tồn tại trong ngữ cảnh
 * season_team_id. Team chưa đăng ký season thì KHÔNG THỂ có roster hợp lệ
 * theo schema hiện tại — nên bản này chỉ tạo Team, không tạo squad.
 *
 * Nếu cần test "team đăng ký nhưng thiếu người", dùng
 * seedUnderStaffedSeasonTeam bên dưới (cần season_team_id thật, tức là team
 * ĐÃ đăng ký season, chỉ là chưa đủ người).
 */
export declare function seedUnregisteredTeam(db: PrismaClient, adminUserId: number, teamName: string, classIdByName: Record<string, number>): Promise<number>;
/**
 * Team ĐÃ đăng ký season (có season_team_id thật) nhưng số người dưới
 * min_players_per_team của TournamentRule (default 7). Chỉ là wrapper gọi
 * squadSeeder.seedBoundarySquad — không tự build lại logic vị trí ở đây,
 * tránh 2 nguồn sự thật cho cùng 1 việc "sinh roster".
 */
export declare function seedUnderStaffedSeasonTeam(db: PrismaClient, seasonTeamId: number, teamNameForEmail: string, squadSize: number): Promise<void>;
/**
 * Đánh dấu ngẫu nhiên vài TeamPlayer trong 1 season_team sang trạng thái
 * chưa hoàn thiện: approval_status pending/rejected, status injured/suspended.
 * FIX: bản trước filter theo team_id (không tồn tại) — đổi sang season_team_id.
 */
export declare function seedIncompleteApprovalStates(db: PrismaClient, seasonTeamId: number): Promise<void>;
/**
 * User giữ đồng thời 2 role (player + leader) — hệ thống cho phép 1 user
 * nhiều role (User_Role là bảng nhiều-nhiều) nhưng flow UI/business logic
 * thường viết theo giả định 1 user = 1 role chủ đạo. Case này lộ ra chỗ
 * nào code đang implicit-assume single-role (vd: dashboard redirect theo
 * role đầu tiên tìm thấy, permission check thiếu OR-logic giữa các role).
 */
export declare function seedRoleStackedUser(db: PrismaClient, roleMap: Record<RoleName, number>, label: string): Promise<number>;
/**
 * User bị khoá (is_active=false) nhưng vẫn còn TeamPlayer status=active
 * trong 1 season_team đang thi đấu. Không có FK/constraint nào tự động
 * đồng bộ User.is_active với TeamPlayer.status — nếu login bị chặn ở tầng
 * auth nhưng match-day lineup validation không check User.is_active (chỉ
 * check TeamPlayer.status/approval_status), cầu thủ này vẫn được xếp đá dù
 * tài khoản đã khoá. Dùng để test đúng lớp nào PHẢI check is_active.
 */
export declare function seedInactiveUserWithLiveRoster(db: PrismaClient, seasonTeamId: number, label: string, jerseyNumber: number): Promise<void>;
/**
 * User email chưa verify nhưng đã được đưa vào roster ở trạng thái pending —
 * mô phỏng luồng: leader thêm cầu thủ vào danh sách trước khi cầu thủ đó tự
 * verify email tài khoản. Test: approval flow có vô tình auto-approve user
 * chưa verify hay không (2 khái niệm "chưa xác thực" khác nhau: email
 * verification vs squad approval — dễ bị lẫn lộn khi review code).
 */
export declare function seedUnverifiedEmailPendingPlayer(db: PrismaClient, seasonTeamId: number, label: string, jerseyNumber: number): Promise<void>;
//# sourceMappingURL=edgeCaseUserSeeder.d.ts.map