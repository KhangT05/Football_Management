import { Controller } from "tsoa";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
import { SeasonTeam } from "../generated/prisma/client.js";
import { SeasonTeamWithRelations } from "../types/seasonTeam.type.js";
import { PaginatedResult } from "../types/queryable.type.js";
export declare class SeasonTeamController extends Controller {
    private service;
    constructor(service: SeasonTeamService);
    findAll(page?: number, per_page?: number, q?: string, sort?: string, direction?: "asc" | "desc"): Promise<PaginatedResult<SeasonTeam>>;
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
        format: import("../generated/prisma/enums.js").PhaseFormat;
        legs: number;
        id: number;
        status: import("../generated/prisma/enums.js").PhaseStatus;
        is_active: boolean;
        created_at: Date;
        updated_at: Date | null;
        name: string;
        season_id: number;
        order: number;
        start_date: Date | null;
        end_date: Date | null;
        min_rest_days_per_team: number;
        teams_per_group: number | null;
    }>;
}
export {};
//# sourceMappingURL=seasonteam.controller.d.ts.map