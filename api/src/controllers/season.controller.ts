import {
  Controller,
  Get,
  Path,
  Tags,
  Route,
  Post,
  Patch,
  Body,
  SuccessResponse,
  Delete,
  Query,
  Security,
  Request,
} from "tsoa";
import type { Request as ExRequest } from "express";

import { SeasonService } from "../services/season.service.js";
import { StandingsService } from "../services/standing.service.js";
import type { Season } from "../generated/prisma/client.js";
import * as seasonSchema from "../dtos/season.schema.js";
import { buildPlayerStatsQueryRequest, buildStandingsQueryRequest } from "../helper/match.helper.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { SeasonListItem } from "../dtos/season.schema.js";

type AuthRequest = ExRequest & { user: { user_id: number } };

// ─── SeasonController ─────────────────────────────────────────────────────────
// Route: /seasons/*
//
// Auth phân tầng (method-level, không class-level):
//   GET /seasons                          → public (guest)
//   GET /seasons/{id}                     → public
//   GET /seasons/{id}/standings           → public — overview toàn season (World Cup style)
//   GET /seasons/{id}/standings/{groupId} → public — standings chi tiết 1 group
//   GET /seasons/{id}/player-stats        → public
//   GET /seasons/{id}/suspended-players   → public
//   POST / PATCH / DELETE                 → jwt [admin]
//
// Lý do merge SeasonStatsController vào đây:
//   - Cả hai đều dùng @Route("seasons") → 2 class cùng prefix gây nhầm lẫn + tsoa conflict
//   - SeasonStatsController không có Security riêng → class-level jwt của SeasonController
//     sẽ accidentally block các GET standings (public endpoints)
//   - Một prefix = một controller là convention rõ ràng hơn
@Route("seasons")
@Tags("Seasons")
export class SeasonController extends Controller {
  constructor(
    private readonly service: SeasonService,
    private readonly standingsService: StandingsService,
  ) {
    super();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — LIST SEASONS (public)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * List seasons có thể xem standings.
   * Chỉ trả ongoing / finished / cancelled — loại upcoming và registration_open.
   *
   * Query params:
   *   ?status=ongoing|finished|cancelled  (default: tất cả 3 status)
   *   ?tournamentId=1
   *   ?page=1&per_page=20
   *   ?q=keyword&sort=start_date&direction=desc
   */
  @Get()
  async listSeasons(
    @Query() page = 1,
    @Query() per_page = 20,
    @Query() q?: string,
    @Query() sort?: string,
    @Query() direction?: 'asc' | 'desc',
    @Query() status?: 'ongoing' | 'finished' | 'cancelled' | 'registration_open' | 'upcoming',
    @Query() tournamentId?: number,
  ): Promise<PaginatedResult<SeasonListItem>> {
    return this.standingsService.listSeasons({ status, tournamentId, page, per_page, q, sort, direction });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — SEASON BY ID (public)
  // ═══════════════════════════════════════════════════════════════════════════

  @Get("{id}")
  async findById(@Path() id: number): Promise<Season> {
    return this.service.findByIdOrFail(id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // POST — CREATE (admin only)
  // ═══════════════════════════════════════════════════════════════════════════

  @Security("jwt", ["admin"])
  @Post()
  @SuccessResponse(201, "Created")
  async create(
    @Body() body: seasonSchema.CreateSeasonDto,
    @Request() req: AuthRequest,
  ): Promise<Season> {
    this.setStatus(201);
    return this.service.create(body, req.user.user_id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PATCH — UPDATE (admin only)
  // ═══════════════════════════════════════════════════════════════════════════

  @Security("jwt", ["admin"])
  @Patch("{id}")
  async update(
    @Path() id: number,
    @Body() body: seasonSchema.UpdateSeasonDto,
  ): Promise<Season> {
    return this.service.update(id, body);
  }

  @Security("jwt", ["admin"])
  @Delete("{id}")
  @SuccessResponse(204, "Deleted")
  async softDelete(@Path() id: number): Promise<void> {
    this.setStatus(204);
    return this.service.softDelete(id);
  }
  /**
 * Hủy season. Chỉ hợp lệ khi status hiện tại là upcoming/registration_open/ongoing
 * (theo STATUS_TRANSITIONS). cancel_reason bắt buộc — dùng cho audit/thông báo.
 */
  @Security("jwt", ["admin"])
  @Patch("{id}/cancel")
  async cancelSeason(
    @Path() id: number,
    @Body() body: seasonSchema.CancelSeasonDto,
  ): Promise<Season> {
    return this.service.cancel(id, body);
  }

  @Security("jwt", ["admin"])
  @Patch("{id}/status")
  async updateStatus(
    @Path() id: number,
    @Body() body: seasonSchema.UpdateSeasonStatusDto,
  ): Promise<Season> {
    return this.service.updateStatus(id, body.status, { cancel_reason: body.cancel_reason });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — SEASON STANDINGS OVERVIEW (public, World Cup style)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Overview standings toàn season — tất cả groups, kiểu World Cup group stage.
   * Không paginate — group nhỏ (≤ 8 teams/group, ≤ 8 groups/season).
   * Trả về array grouped theo group, mỗi group có teams sorted by position.
   *
   * Chỉ serve season ở status: ongoing / finished / cancelled.
   */
  @Get("{id}/standings")
  async getSeasonStandings(@Path() id: number) {
    return this.standingsService.listStandingsBySeason(id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — GROUP STANDINGS (public, paginated)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Standings chi tiết của 1 group — validate group thuộc season.
   *
   * Query params:
   *   ?page=1&per_page=20
   *   ?sort=position|points|goals_for|wins&direction=asc|desc
   */
  @Get("{id}/standings/{groupId}")
  async getGroupStandings(
    @Path() id: number,
    @Path() groupId: number,
    @Query() page?: number,
    @Query() per_page?: number,
    @Query() sort?: string,
    @Query() direction?: 'asc' | 'desc',
  ) {
    const req = buildStandingsQueryRequest({ page, per_page, sort, direction });
    return this.standingsService.listGroupStandings(groupId, req, id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — PLAYER STATS (public, paginated)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Thống kê cầu thủ trong season.
   *
   * Query params:
   *   ?teamId=1
   *   ?page=1&per_page=20
   *   ?sort=goals_scored&direction=desc
   */
  @Get("players/{playerId}/career-stats")
  async getPlayerCareerStats(@Path() playerId: number) {
    return this.standingsService.getPlayerCareerStats(playerId);
  }
  @Get("{id}/player-stats")
  async getPlayerStats(
    @Path() id: number,
    @Query() teamId?: number,
    @Query() page?: number,
    @Query() per_page?: number,
    @Query() sort?: string,
    @Query() direction?: 'asc' | 'desc',
  ) {
    const req = buildPlayerStatsQueryRequest({ teamId, page, per_page, sort, direction });
    return this.standingsService.listPlayerStats(id, req);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — SUSPENDED PLAYERS (public)
  // ═══════════════════════════════════════════════════════════════════════════

  @Get("{id}/suspended-players")
  async getSuspendedPlayers(@Path() id: number) {
    return this.standingsService.getSuspendedPlayers(id);
  }
}