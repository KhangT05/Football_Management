import { Controller } from "tsoa";
import { MatchLineupService } from "../services/matchlineup.service.js";
import { RegisterLineupDto, UpdateLineupEntryDto } from "../dtos/matchlineup.schema.js";
import { MatchLineup } from "../generated/prisma/client.js";
export declare class MatchLineupController extends Controller {
    private readonly lineupService;
    constructor(lineupService: MatchLineupService);
    /**
     * Lấy toàn bộ lineup của trận — cả 2 team.
     */
    getLineups(matchId: number): Promise<MatchLineup[]>;
    /**
     * Lấy lineup của 1 team trong trận.
     */
    getTeamLineup(matchId: number, teamId: number): Promise<MatchLineup[]>;
    /**
     * Đăng ký lineup cho team — bulk replace, idempotent.
     * Chỉ được gọi trước giờ thi đấu ít nhất 1 giờ.
     * Admin: bất kỳ team nào.
     * Leader: chỉ team của mình (ownership check tại middleware).
     */
    registerLineup(matchId: number, body: Omit<RegisterLineupDto, "match_id">): Promise<MatchLineup[]>;
    /**
     * Sửa 1 player entry trong lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    updateLineupEntry(matchId: number, teamId: number, playerId: number, body: Omit<UpdateLineupEntryDto, "match_id" | "team_id" | "player_id">): Promise<MatchLineup>;
    /**
     * Xóa 1 player khỏi lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    removeLineupEntry(matchId: number, teamId: number, playerId: number): Promise<void>;
}
//# sourceMappingURL=matchlineup.controller.d.ts.map