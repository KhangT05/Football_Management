import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
import { SeasonService } from "../services/season.service.js";
import { StandingsService } from "../services/standing.service.js";
import type { Season } from "../generated/prisma/client.js";
import * as seasonSchema from "../dtos/season.schema.js";
import { PaginatedResult } from "../types/queryable.type.js";
import { SeasonListItem } from "../dtos/season.schema.js";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
export declare class SeasonController extends Controller {
    private readonly service;
    private readonly standingsService;
    constructor(service: SeasonService, standingsService: StandingsService);
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
    listSeasons(page?: number, per_page?: number, q?: string, sort?: string, direction?: 'asc' | 'desc', status?: 'ongoing' | 'finished' | 'cancelled' | 'registration_open' | 'upcoming', tournamentId?: number): Promise<PaginatedResult<SeasonListItem>>;
    findById(id: number): Promise<Season>;
    create(body: seasonSchema.CreateSeasonDto, req: AuthRequest): Promise<Season>;
    update(id: number, body: seasonSchema.UpdateSeasonDto): Promise<Season>;
    softDelete(id: number): Promise<void>;
    /**
     * Hủy season. Chỉ hợp lệ khi status hiện tại là upcoming/registration_open/ongoing
     * (theo CANCELLABLE_FROM trong service). cancel_reason bắt buộc — dùng cho
     * audit/thông báo. Route riêng, tách khỏi PATCH {id}/status — không có
     * đường tắt nào set 'cancelled' mà thiếu cancel_reason.
     */
    cancelSeason(id: number, body: seasonSchema.CancelSeasonDto): Promise<Season>;
    /**
     * FIX: service.updateStatus() không còn nhận `meta`/cancel_reason —
     * cancelled đã tách hẳn sang cancelSeason() ở trên, và
     * UpdateSeasonStatusSchema loại 'cancelled' khỏi enum hợp lệ nên
     * body.cancel_reason không còn tồn tại trong UpdateSeasonStatusDto (gọi
     * `body.cancel_reason` cũ sẽ là lỗi biên dịch TS). Chỉ còn truyền
     * (id, status) — dùng cho registration_open/ongoing/finished, organizing bấm
     * tay song song với cron SeasonService.runAutoTransitions().
     */
    updateStatus(id: number, body: seasonSchema.UpdateSeasonStatusDto): Promise<Season>;
    /**
     * Trigger thủ công cron auto-transition (registration_open→ongoing khi
     * start_date đã tới, ongoing→finished khi end_date đã tới). Dùng để:
     *   - Debug/verify logic trước khi wire scheduler thật (node-cron/BullMQ).
     *   - Chạy bù thủ công nếu scheduler bị down một khoảng thời gian.
     * KHÔNG thay thế scheduler — production vẫn cần cron gọi định kỳ
     * `seasonService.runAutoTransitions()`, endpoint này chỉ là escape hatch
     * cho organizing/ops, không phải cách vận hành chính.
     */
    runAutoTransitions(): Promise<{
        toOngoing: number;
        toFinished: number;
        failed: number[];
    }>;
    getGroupStandings(id: number, groupId: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<import("../types/standing.type.js").TeamStandingRow>>;
    getPlayerStats(id: number, teamId?: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<import("../types/standing.type.js").PlayerStatisticRow>>;
    getSuspendedPlayers(id: number): Promise<({
        team: {
            name: string;
            id: number;
        };
        player: {
            name: never;
            id: number;
        };
    } & {
        id: number;
        created_at: Date;
        updated_at: Date | null;
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        season_id: number;
        team_id: number;
        assists: number;
        matches_played: number;
        player_id: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        yellow_cards_since_reset: number;
        suspension_matches_remaining: number;
        is_suspended: boolean;
        total_fine_owed: import("@prisma/client-runtime-utils").Decimal;
    })[]>;
    getActiveStandings(id: number): Promise<{
        phaseId: number;
        phaseName: string;
        phaseOrder: number;
        phaseStatus: import("../generated/prisma/enums.js").PhaseStatus;
        groups: {
            groupId: number;
            groupName: string;
            standings: import("../types/standing.type.js").TeamStandingRow[];
        }[];
    } | null>;
    getStandingsHistory(id: number): Promise<{
        phaseId: number;
        phaseName: string;
        phaseOrder: number;
        phaseStatus: import("../generated/prisma/enums.js").PhaseStatus;
        groups: {
            groupId: number;
            groupName: string;
            standings: import("../types/standing.type.js").TeamStandingRow[];
        }[];
    }[]>;
}
export {};
//# sourceMappingURL=season.controller.d.ts.map