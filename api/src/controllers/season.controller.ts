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
//
// Status lifecycle (xem SeasonService để biết chi tiết):
//   upcoming → registration_open → ongoing → finished
//                    ↘                ↘
//                  cancelled        cancelled
//   - registration_open, ongoing, finished: có thể set MANUAL qua
//     PATCH {id}/status (admin bấm sớm/bấm bù), ĐỒNG THỜI cũng tự động qua
//     cron SeasonService.runAutoTransitions() theo start_date/end_date — 2
//     lối đi song song, không loại trừ nhau, đều idempotent.
//   - cancelled: luôn đi qua route riêng PATCH {id}/cancel (cancel_reason
//     bắt buộc), không nằm trong UpdateSeasonStatusDto.
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
   * (theo CANCELLABLE_FROM trong service). cancel_reason bắt buộc — dùng cho
   * audit/thông báo. Route riêng, tách khỏi PATCH {id}/status — không có
   * đường tắt nào set 'cancelled' mà thiếu cancel_reason.
   */
  @Security("jwt", ["admin"])
  @Patch("{id}/cancel")
  async cancelSeason(
    @Path() id: number,
    @Body() body: seasonSchema.CancelSeasonDto,
  ): Promise<Season> {
    return this.service.cancel(id, body);
  }

  /**
   * FIX: service.updateStatus() không còn nhận `meta`/cancel_reason —
   * cancelled đã tách hẳn sang cancelSeason() ở trên, và
   * UpdateSeasonStatusSchema loại 'cancelled' khỏi enum hợp lệ nên
   * body.cancel_reason không còn tồn tại trong UpdateSeasonStatusDto (gọi
   * `body.cancel_reason` cũ sẽ là lỗi biên dịch TS). Chỉ còn truyền
   * (id, status) — dùng cho registration_open/ongoing/finished, admin bấm
   * tay song song với cron SeasonService.runAutoTransitions().
   */
  @Security("jwt", ["admin"])
  @Patch("{id}/status")
  async updateStatus(
    @Path() id: number,
    @Body() body: seasonSchema.UpdateSeasonStatusDto,
  ): Promise<Season> {
    return this.service.updateStatus(id, body.status);
  }

  /**
   * Trigger thủ công cron auto-transition (registration_open→ongoing khi
   * start_date đã tới, ongoing→finished khi end_date đã tới). Dùng để:
   *   - Debug/verify logic trước khi wire scheduler thật (node-cron/BullMQ).
   *   - Chạy bù thủ công nếu scheduler bị down một khoảng thời gian.
   * KHÔNG thay thế scheduler — production vẫn cần cron gọi định kỳ
   * `seasonService.runAutoTransitions()`, endpoint này chỉ là escape hatch
   * cho admin/ops, không phải cách vận hành chính.
   */
  @Security("jwt", ["admin"])
  @Post("auto-transition")
  async runAutoTransitions(): Promise<{ toOngoing: number; toFinished: number; failed: number[] }> {
    return this.service.runAutoTransitions();
  }

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
  // ═══════════════════════════════════════════════════════════════════════════
  // GET — STANDINGS OVERVIEW (public) — phase round_robin đang mở
  // ═══════════════════════════════════════════════════════════════════════════
  @Get("{id}/standings")
  async getActiveStandings(@Path() id: number) {
    return this.standingsService.listActiveGroupStandings(id);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GET — STANDINGS HISTORY (public) — toàn bộ phase RR, kể cả đã locked
  // ═══════════════════════════════════════════════════════════════════════════
  @Get("{id}/standings/history")
  async getStandingsHistory(@Path() id: number) {
    return this.standingsService.listGroupStandingsHistory(id);
  }
}