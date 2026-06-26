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
    listSeasons(page?: number, per_page?: number, q?: string, sort?: string, direction?: 'asc' | 'desc', status?: 'ongoing' | 'finished' | 'cancelled', tournamentId?: number): Promise<PaginatedResult<SeasonListItem>>;
    findById(id: number): Promise<Season>;
    create(body: seasonSchema.CreateSeasonDto, req: AuthRequest): Promise<Season>;
    update(id: number, body: seasonSchema.UpdateSeasonDto): Promise<Season>;
    softDelete(id: number): Promise<void>;
    updateStatus(id: number, body: seasonSchema.UpdateSeasonStatusDto): Promise<Season>;
    /**
     * Overview standings toàn season — tất cả groups, kiểu World Cup group stage.
     * Không paginate — group nhỏ (≤ 8 teams/group, ≤ 8 groups/season).
     * Trả về array grouped theo group, mỗi group có teams sorted by position.
     *
     * Chỉ serve season ở status: ongoing / finished / cancelled.
     */
    getSeasonStandings(id: number): Promise<{
        groupId: number;
        groupName: string;
        standings: import("../types/standing.type.js").TeamStandingRow[];
    }[]>;
    /**
     * Standings chi tiết của 1 group — validate group thuộc season.
     *
     * Query params:
     *   ?page=1&per_page=20
     *   ?sort=position|points|goals_for|wins&direction=asc|desc
     */
    getGroupStandings(id: number, groupId: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<{
        id: number;
        team_id: number;
        group_id: number;
        position: number;
        matches_played: number;
        wins: number;
        draws: number;
        losses: number;
        goals_for: number;
        goals_against: number;
        points: number;
    }>>;
    /**
     * Thống kê cầu thủ trong season.
     *
     * Query params:
     *   ?teamId=1
     *   ?page=1&per_page=20
     *   ?sort=goals_scored&direction=desc
     */
    getPlayerStats(id: number, teamId?: number, page?: number, per_page?: number, sort?: string, direction?: 'asc' | 'desc'): Promise<PaginatedResult<{
        id: number;
        goals_scored: number;
        yellow_cards: number;
        red_cards: number;
        team_id: number;
        season_id: number;
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
        team_id: number;
        season_id: number;
        matches_played: number;
        player_id: number;
        assists: number;
        minutes_played: number;
        accumulated_yellow_cards: number;
        is_suspended: boolean;
    })[]>;
}
export {};
//# sourceMappingURL=season.controller.d.ts.map