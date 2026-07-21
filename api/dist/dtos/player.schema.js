import { z } from "zod";
import { ApprovalStatus, LeaveReason, PlayerPosition, PlayerRole, PlayerStatus } from "../generated/prisma/client.js";
export const PlayerPositionEnum = z.nativeEnum(PlayerPosition);
export const PlayerRoleEnum = z.nativeEnum(PlayerRole);
export const PlayerStatusEnum = z.nativeEnum(PlayerStatus);
export const ApprovalStatusEnum = z.nativeEnum(ApprovalStatus);
export const createPlayerSchema = z.object({
    user_id: z.number().int().positive(),
    date_of_birth: z.coerce.date(),
    position: PlayerPositionEnum,
    height: z.number().positive().max(999.99).nullable().optional(),
    weight: z.number().positive().max(999.99).nullable().optional(),
    nationality: z.string().trim().max(100).nullable().optional(),
    avatar: z.string().nullable().optional(),
});
export const updatePlayerSchema = createPlayerSchema.omit({ user_id: true }).partial();
export const addPlayerToTeamSchema = z.object({
    player_id: z.number().int().positive(),
    jersey_number: z.number().int().min(1).max(99),
    position: PlayerPositionEnum,
    role: PlayerRoleEnum.default(PlayerRole.player),
});
export const updateTeamPlayerSchema = z.object({
    jersey_number: z.number().int().min(1).max(99).optional(),
    position: PlayerPositionEnum.optional(),
    role: PlayerRoleEnum.optional(),
    status: PlayerStatusEnum.optional(),
    approval_status: ApprovalStatusEnum.optional(),
});
export const bulkDeleteSchema = z.object({
    ids: z.array(z.number().int().positive()).min(1).max(100),
    reason: z.nativeEnum(LeaveReason).optional().default(LeaveReason.dropped),
});
// FIX: .trim().toLowerCase() — Excel do leader nhập tay dễ dính khoảng trắng/case
// khác DB, gây false negative "User not found" ở Phase 2 matching trong service.
// FIX #2: thêm "name" — bắt buộc, dùng để tạo tài khoản mới khi email import
// chưa tồn tại trong hệ thống (trước đây import KHÔNG tự tạo user được vì
// thiếu field này, chỉ fail với "User not found").
export const importPlayerRowSchema = z.object({
    name: z.string().trim().min(1, "Họ tên không được để trống").max(150),
    user_email: z.string().trim().toLowerCase().email(),
    student_code: z.string().trim().max(30).optional(),
    date_of_birth: z.coerce.date(),
    position: PlayerPositionEnum,
    height: z.number().positive().max(999.99).nullable().optional(),
    weight: z.number().positive().max(999.99).nullable().optional(),
    nationality: z.string().trim().max(100).nullable().optional(),
    jersey_number: z.number().int().min(1).max(99).optional(), // required logic ở service (team assignment)
});
export const createPlayerForTeamSchema = z.object({
    name: z.string().trim().min(1).max(150),
    user_email: z.string().trim().toLowerCase().email(),
    student_code: z.string().trim().max(30).optional(),
    date_of_birth: z.coerce.date(),
    position: PlayerPositionEnum,
    jersey_number: z.number().int().min(1).max(99),
});
// NEW — DTO cho tính năng copy roster giữa 2 season_team CÙNG 1 team (vd:
// đội đăng ký mùa mới, muốn kế thừa danh sách cầu thủ đã duyệt của mùa cũ
// thay vì add/import lại từ đầu). to_season_team_id lấy từ @Path() ở
// controller (season_team đích đang thao tác), chỉ from_season_team_id
// cần trong body. Validate cùng-team, không trùng nguồn/đích, đều nằm ở
// service (copyRosterToSeasonTeam) — schema chỉ giữ đúng hình dạng input.
export const copyRosterSchema = z.object({
    from_season_team_id: z.number().int().positive(),
});
//# sourceMappingURL=player.schema.js.map