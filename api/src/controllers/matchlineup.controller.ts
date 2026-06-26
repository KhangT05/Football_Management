// controllers/match-lineup.controller.ts
import {
    Controller,
    Path,
    Tags,
    Route,
    Post,
    Patch,
    Delete,
    Body,
    SuccessResponse,
    Security,
    Get,
} from "tsoa";
import { MatchLineupService } from "../services/matchlineup.service.js";
import { RegisterLineupDto, UpdateLineupEntryDto } from "../dtos/matchlineup.schema.js";
import { MatchLineup } from "../generated/prisma/client.js";

// ─── Controller ───────────────────────────────────────────────────────────────
// Route: /matches/:id/lineups
//
// Auth:
//   GET                  → public (guest)
//   POST (register)      → jwt [admin, leader]  — đăng ký lineup cho team, trước 1h
//   PATCH (update entry) → jwt [admin]           — sửa từng entry, trước 10p
//   DELETE (remove)      → jwt [admin]           — xóa entry, trước 10p
//
// Time guards enforce tại service layer.
// team_id ownership (leader chỉ được register cho team mình) → middleware/guard ngoài controller.

@Route("matches")
@Tags("Match Lineup")
export class MatchLineupController extends Controller {
    constructor(private readonly lineupService: MatchLineupService) {
        super();
    }

    // ─── Read ─────────────────────────────────────────────────────────────────

    /**
     * Lấy toàn bộ lineup của trận — cả 2 team.
     */
    @Get("{matchId}/lineups")
    async getLineups(@Path() matchId: number): Promise<MatchLineup[]> {
        return this.lineupService.getByMatch(matchId);
    }

    /**
     * Lấy lineup của 1 team trong trận.
     */
    @Get("{matchId}/lineups/teams/{teamId}")
    async getTeamLineup(
        @Path() matchId: number,
        @Path() teamId: number,
    ): Promise<MatchLineup[]> {
        return this.lineupService.getByTeam(matchId, teamId);
    }

    // ─── Register ─────────────────────────────────────────────────────────────

    /**
     * Đăng ký lineup cho team — bulk replace, idempotent.
     * Chỉ được gọi trước giờ thi đấu ít nhất 1 giờ.
     * Admin: bất kỳ team nào.
     * Leader: chỉ team của mình (ownership check tại middleware).
     */
    @Security("jwt", ["admin", "leader"])
    @Post("{matchId}/lineups")
    async registerLineup(
        @Path() matchId: number,
        @Body() body: Omit<RegisterLineupDto, "match_id">,
    ): Promise<MatchLineup[]> {
        return this.lineupService.register({ ...body, match_id: matchId });
    }

    // ─── Update ───────────────────────────────────────────────────────────────

    /**
     * Sửa 1 player entry trong lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    @Security("jwt", ["admin"])
    @Patch("{matchId}/lineups/teams/{teamId}/players/{playerId}")
    async updateLineupEntry(
        @Path() matchId: number,
        @Path() teamId: number,
        @Path() playerId: number,
        @Body() body: Omit<UpdateLineupEntryDto, "match_id" | "team_id" | "player_id">,
    ): Promise<MatchLineup> {
        return this.lineupService.updateEntry({
            ...body,
            match_id: matchId,
            team_id: teamId,
            player_id: playerId,
        });
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    /**
     * Xóa 1 player khỏi lineup.
     * Chỉ được gọi trước giờ thi đấu ít nhất 10 phút.
     * Admin only.
     */
    @Security("jwt", ["admin"])
    @Delete("{matchId}/lineups/teams/{teamId}/players/{playerId}")
    @SuccessResponse(204, "Removed")
    async removeLineupEntry(
        @Path() matchId: number,
        @Path() teamId: number,
        @Path() playerId: number,
    ): Promise<void> {
        this.setStatus(204);
        return this.lineupService.removeEntry(matchId, teamId, playerId);
    }
}