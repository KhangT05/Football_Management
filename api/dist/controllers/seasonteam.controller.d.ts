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
}
export {};
//# sourceMappingURL=seasonteam.controller.d.ts.map