import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
import { SeasonTeam, SeasonTeamStatus } from "../generated/prisma/client.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class SeasonTeamController extends Controller {
    private service;
    constructor(service: SeasonTeamService);
    /**
     * FIX: thiếu season_id/status/team_id trong signature khiến tsoa strip
     * các query param này trước khi vào service.findAll() — Queryable đọc
     * filter qua req[field] PHẲNG (xem QueryBuilder.applySimpleFilter:
     * `const value = req[field]`), không phải nested req.filters.field.
     * Route handler trước đây chưa bao giờ forward season_id/status vào
     * QueryRequest → mọi call GET /seasonteams?season_id=X&status=approved
     * chạy KHÔNG filter gì, count/list trả về TOÀN BỘ season_teams trong DB
     * across mọi season — sai lệch số liệu "đội đã duyệt" ở FE (GroupDrawUI
     * dùng con số này để validate trước khi cho phép draw).
     *
     * is_active KHÔNG forward ở đây dù nằm trong filterable config, vì
     * SeasonTeamService.beforeBuild đã hardcode `is_active: true` — AND
     * chồng lên bất kỳ giá trị nào applySimpleFilter push vào sẽ tạo where
     * mâu thuẫn (is_active=false từ client AND is_active=true từ beforeBuild
     * -> luôn rỗng, silent, không lỗi). Field này chỉ nên control nội bộ.
     */
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc", season_id?: number, team_id?: number, status?: SeasonTeamStatus): Promise<PaginatedResult<SeasonTeam>>;
    findById(id: number): Promise<SeasonTeam>;
    /** Team leader tự đăng ký vào season */
    selfRegister(body: seasonTeamSchema.SelfRegisterSeasonTeamDto, req: AuthRequest): Promise<SeasonTeamWithRelations>;
    /** Admin add team trực tiếp */
    adminAdd(body: seasonTeamSchema.AdminAddSeasonTeamDto, req: AuthRequest): Promise<SeasonTeamWithRelations>;
    /** Duyệt team pending -> approved. Ban tổ chức hoặc admin. */
    approve(id: number, req: AuthRequest): Promise<SeasonTeamWithRelations>;
    /** Chuyển team sang season khác. Ban tổ chức hoặc admin. */
    transferSeason(id: number, body: seasonTeamSchema.TransferSeasonTeamDto, req: AuthRequest): Promise<SeasonTeamWithRelations>;
    /** Update status generic (eliminated/withdrawn). KHÔNG dùng để approve. */
    updateStatus(id: number, body: seasonTeamSchema.UpdateSeasonTeamStatusDto): Promise<SeasonTeamWithRelations>;
    /** Assign team vào group sau draw */
    assignGroup(id: number, body: seasonTeamSchema.AssignGroupDto): Promise<SeasonTeamWithRelations>;
    softDelete(id: number): Promise<void>;
    /** Admin: lấy (hoặc tạo mới nếu chưa có) phase vòng bảng round_robin của season.
   *  Mỗi season chỉ có đúng 1 phase loại này — không cần chọn, chỉ cần gọi là có. */
    getOrCreateGroupPhase(seasonId: number): Promise<{
        type: import("../generated/prisma/enums.js").PhaseType;
        name: string;
        is_active: boolean;
        id: number;
        created_at: Date;
        updated_at: Date | null;
        format: import("../generated/prisma/enums.js").PhaseFormat;
        teams_advance_per_group: number | null;
        status: import("../generated/prisma/enums.js").PhaseStatus;
        season_id: number;
        order: number;
        start_date: Date | null;
        end_date: Date | null;
        min_rest_days_per_team: number;
        legs: number;
        teams_per_group: number | null;
    }>;
}
export {};
//# sourceMappingURL=seasonteam.controller.d.ts.map