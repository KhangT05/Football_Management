var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Request } from "tsoa";
import { SeasonTeamService } from "../services/seasonTeam.service.js";
import * as seasonTeamSchema from "../dtos/seasonTeam.schema.js";
import { SeasonTeamStatus } from "../generated/prisma/client.js";
let SeasonTeamController = class SeasonTeamController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
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
    async findAll(page = 1, per_page = 20, q, sort, direction, season_id, team_id, status) {
        return this.service.findAll({
            page, per_page, q, sort, direction,
            season_id, team_id, status,
        });
    }
    async findById(id) {
        return this.service.findByIdOrFail(id);
    }
    /** Team leader tự đăng ký vào season */
    async selfRegister(body, req) {
        this.setStatus(201);
        return this.service.selfRegister(body, req.user.user_id);
    }
    /** Admin add team trực tiếp */
    async adminAdd(body, req) {
        this.setStatus(201);
        return this.service.adminAdd(body, req.user.user_id);
    }
    /** Duyệt team pending -> approved. Ban tổ chức hoặc admin. */
    async approve(id, req) {
        return this.service.approve(id, req.user.user_id);
    }
    /** Chuyển team sang season khác. Ban tổ chức hoặc admin. */
    async transferSeason(id, body, req) {
        return this.service.transferSeason(id, body.season_id, req.user.user_id);
    }
    /** Update status generic (eliminated/withdrawn). KHÔNG dùng để approve. */
    async updateStatus(id, body) {
        return this.service.updateStatus(id, body);
    }
    /** Assign team vào group sau draw */
    async assignGroup(id, body) {
        return this.service.assignGroup(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDelete(id);
    }
    /** Admin: lấy (hoặc tạo mới nếu chưa có) phase vòng bảng round_robin của season.
   *  Mỗi season chỉ có đúng 1 phase loại này — không cần chọn, chỉ cần gọi là có. */
    async getOrCreateGroupPhase(seasonId) {
        return this.service.getOrCreateGroupPhase(seasonId);
    }
    /**
   * List teams đã đăng ký của 1 season kèm team info (name/logo) + group_id.
   * Dùng cho FE GroupDrawUI hiển thị danh sách trước khi draw, và bất kỳ màn
   * hình public nào cần xem "season X có những team nào, đã vào group chưa".
   *
   * Public — không cần auth, giống các GET season/standings khác.
   * default statuses = ['approved'] nếu không truyền (khớp default của service).
   */
    async listBySeasonWithTeamInfo(seasonId, status) {
        return this.service.listBySeasonWithTeamInfo(seasonId, status);
    }
};
__decorate([
    Get("/"),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, Number, Number, String]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "findAll", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "findById", null);
__decorate([
    Security("jwt", ["leader"]),
    Post("/register"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "selfRegister", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "adminAdd", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}/approve"),
    __param(0, Path()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "approve", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}/transfer"),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "transferSeason", null);
__decorate([
    Security("jwt", ["admin", "organizing"]),
    Patch("{id}/status"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "updateStatus", null);
__decorate([
    Security("jwt", ["admin"]),
    Patch("{id}/group"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "assignGroup", null);
__decorate([
    Security("jwt", ["admin"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "softDelete", null);
__decorate([
    Security("jwt", ["admin"]),
    Post("season/{seasonId}/group-phase"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "getOrCreateGroupPhase", null);
__decorate([
    Get("season/{seasonId}/teams"),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Array]),
    __metadata("design:returntype", Promise)
], SeasonTeamController.prototype, "listBySeasonWithTeamInfo", null);
SeasonTeamController = __decorate([
    Route("seasonteams"),
    Tags("SeasonTeams"),
    __metadata("design:paramtypes", [SeasonTeamService])
], SeasonTeamController);
export { SeasonTeamController };
//# sourceMappingURL=seasonteam.controller.js.map