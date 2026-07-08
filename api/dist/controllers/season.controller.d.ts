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
   * (theo STATUS_TRANSITIONS). cancel_reason bắt buộc — dùng cho audit/thông báo.
   */
    cancelSeason(id: number, body: seasonSchema.CancelSeasonDto): Promise<Season>;
    updateStatus(id: number, body: seasonSchema.UpdateSeasonStatusDto): Promise<Season>;
    getGroupStandings(id: number, groupId: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<{
        id: number;
        group_id: number;
        team_id: number;
        matches_played: number;
        position: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number;
        goals_against: number;
        points: number;
    }>>;
    getPlayerStats(id: number, teamId?: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<{
        id: number;
        team: {
            name: string;
            id: number;
            logo: string | null;
        };
        player: {
            id: number;
            user: {
                name: string;
            };
            avatar: string | null;
        };
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        season_id: number;
        team_id: number;
        assists: number;
        matches_played: number;
        player_id: number;
        accumulated_yellow_cards: number;
        is_suspended: boolean;
    }>>;
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
}
export {};
//# sourceMappingURL=season.controller.d.ts.map