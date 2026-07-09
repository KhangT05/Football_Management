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
import { Controller, Get, Path, Tags, Route, Post, Patch, Body, SuccessResponse, Delete, Query, Security, Res, UploadedFile, Consumes } from "tsoa";
import { PlayerService } from "../services/player.service.js";
const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
const XLSX_CONTENT_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
let PlayerController = class PlayerController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    // ────────────────────────────────────────────────────────────────
    // QUAN TRỌNG VỀ THỨ TỰ ROUTE:
    // tsoa generate routes.ts theo ĐÚNG thứ tự khai báo method trong
    // class này. Express match route theo thứ tự đăng ký, nên bất kỳ
    // route "tĩnh" nào (vd. "import-template", "export") mà đứng SAU
    // một route "động" cùng cấp (vd. "{id}") sẽ bị route động nuốt mất
    // — request khớp nhầm vào "{id}" với id = chuỗi tĩnh đó, gây lỗi
    // "invalid float number" khi tsoa cố ép kiểu sang number.
    //
    // => Mọi route tĩnh PHẢI khai báo TRƯỚC route động cùng cấp
    // (cùng số lượng segment, cùng HTTP method).
    // ────────────────────────────────────────────────────────────────
    // Không có PII, chỉ template rỗng — giữ public để leader tải mà không cần login trước.
    // Đứng TRƯỚC findById("{id}") vì cùng là GET, cùng cấp "players/...".
    //
    // FIX (file tải về không mở được): trước đây method này tự gọi
    // request.res.send(buffer) rồi để tsoa tiếp tục xử lý response như
    // bình thường (vì return type là Promise<void>) — tsoa generate code
    // vẫn cố ghi thêm 1 lần response nữa sau khi handler resolve, ghi đè/
    // nối byte vào sau khi socket đã kết thúc => file .xlsx (vốn là 1 file
    // zip) bị hỏng cấu trúc, Excel không mở được.
    //
    // Cách đúng theo tsoa: dùng @Res() + TsoaResponse — tsoa nhận diện
    // đây là "custom response", tự gọi hàm callback để gửi response DUY
    // NHẤT, không tự động ghi thêm lần 2 nữa.
    async downloadImportTemplate(minRows = 7, successResponse) {
        const buffer = await this.service.exportImportTemplate(minRows);
        successResponse(200, buffer, {
            "Content-Type": XLSX_CONTENT_TYPE,
            "Content-Disposition": 'attachment; filename="import-template.xlsx"',
        });
    }
    async findById(id) {
        return this.service.getPlayerByIdOrFail(id);
    }
    async create(body) {
        this.setStatus(201);
        return this.service.createPlayer(body);
    }
    async update(id, body) {
        return this.service.updatePlayer(id, body);
    }
    async softDelete(id) {
        this.setStatus(204);
        return this.service.softDeletePlayer(id);
    }
    // ─── Team Players ─────────────────────────────────────────────────────────
    async listTeamPlayers(team_id, page = 1, per_page = 20, sort, direction, position, status, approval_status) {
        return this.service.listTeamPlayers({
            team_id,
            page,
            per_page,
            sort,
            direction,
            ...(position && { position }),
            ...(status && { status }),
            ...(approval_status && { approval_status }),
        });
    }
    // FIX: cùng nhóm bug route-ordering như import-template — route tĩnh
    // "export" phải đứng TRƯỚC route động "{id}" (cùng là GET, cùng cấp
    // "{team_id}/team-players/..."). Trước đây getTeamPlayer("{id}") khai
    // báo trước nên GET /players/5/team-players/export bị match nhầm,
    // gán id="export" → lỗi "invalid float number" y hệt bug import-template.
    //
    // FIX (file không mở được): đổi sang @Res()/TsoaResponse, lý do giống
    // hệt downloadImportTemplate ở trên — tránh tsoa ghi response 2 lần.
    async exportTeamPlayers(team_id, successResponse) {
        const buffer = await this.service.exportTeamPlayersExcel(team_id);
        successResponse(200, buffer, {
            "Content-Type": XLSX_CONTENT_TYPE,
            "Content-Disposition": `attachment; filename="team-${team_id}-players.xlsx"`,
        });
    }
    async getTeamPlayer(team_id, id) {
        const tp = await this.service.getTeamPlayerById(id, team_id);
        if (!tp) {
            this.setStatus(404);
            throw Object.assign(new Error(`TeamPlayer ${id} not found`), { status: 404 });
        }
        return tp;
    }
    // FIX: bỏ user_id — chưa từng được dùng trong body, AuthRequest param là dead
    // param. Nếu cần audit "ai thêm player này", thêm cột created_by ở service,
    // không giữ param không dùng ở controller.
    async addPlayerToTeam(team_id, body) {
        this.setStatus(201);
        return this.service.addPlayerToTeam(team_id, body);
    }
    // Thêm cầu thủ mới + tự tạo tài khoản (find-or-create theo email) — dùng
    // cho flow "leader nhập tên + email" ở MyTeam.jsx / RegisterTeam.jsx.
    // Khác addPlayerToTeam (yêu cầu player_id có sẵn). Path có 3 segment tĩnh
    // ("create-with-user") nên không đụng độ thứ tự với addPlayerToTeam
    // ("{team_id}/team-players", 2 segment) hay bất kỳ route POST nào khác.
    async createPlayerForTeamWithUser(team_id, body) {
        this.setStatus(201);
        return this.service.createPlayerForTeamWithUser(team_id, body);
    }
    // FIX: bỏ pre-check getTeamPlayerById ở controller — TOCTOU + fragile
    // (an toàn phụ thuộc discipline của caller, không phải data layer).
    // service.updateTeamPlayer giờ tự scope theo team_id và tự 404.
    async updateTeamPlayer(team_id, id, body) {
        return this.service.updateTeamPlayer(id, team_id, body);
    }
    async approveTeamPlayer(team_id, id) {
        return this.service.approveTeamPlayer(id, team_id);
    }
    async rejectTeamPlayer(team_id, id) {
        return this.service.rejectTeamPlayer(id, team_id);
    }
    async bulkDeleteTeamPlayers(team_id, body) {
        return this.service.bulkDeleteTeamPlayers(team_id, body);
    }
    // FIX: thiếu @Security hoàn toàn — bất kỳ ai cũng bulk-tạo Player/TeamPlayer
    // + gán role vào bất kỳ team_id nào không cần auth. Đây là lỗ hổng nghiêm
    // trọng nhất trong file, không phải cosmetic.
    async importTeamPlayers(team_id, file) {
        if (!file || file.size === 0) {
            this.setStatus(400);
            throw Object.assign(new Error("File is required"), { status: 400 });
        }
        if (file.size > MAX_IMPORT_FILE_BYTES) {
            this.setStatus(413);
            throw Object.assign(new Error(`File too large (max ${MAX_IMPORT_FILE_BYTES / 1024 / 1024}MB)`), { status: 413 });
        }
        return this.service.importTeamPlayersFromExcel(team_id, file.buffer);
    }
};
__decorate([
    Get("import-template"),
    __param(0, Query()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Function]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "downloadImportTemplate", null);
__decorate([
    Get("{id}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "findById", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Post("/"),
    SuccessResponse(201, "Created"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "create", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Patch("{id}"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "update", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Delete("{id}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "softDelete", null);
__decorate([
    Get("{team_id}/team-players"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "listTeamPlayers", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "player", "leader"]),
    Get("{team_id}/team-players/export"),
    __param(0, Path()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Function]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "exportTeamPlayers", null);
__decorate([
    Get("{team_id}/team-players/{id}"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "getTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "player", "leader"]),
    Post("{team_id}/team-players"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "addPlayerToTeam", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "player", "leader"]),
    Post("{team_id}/team-players/create-with-user"),
    SuccessResponse(201, "Created"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "createPlayerForTeamWithUser", null);
__decorate([
    Security("jwt", ["organizing", "leader"]),
    Patch("{team_id}/team-players/{id}"),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "updateTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing", "user", "player", "leader"]),
    Post("{team_id}/team-players/{id}/approve"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "approveTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Post("{team_id}/team-players/{id}/reject"),
    __param(0, Path()),
    __param(1, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "rejectTeamPlayer", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Delete("{team_id}/team-players"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "bulkDeleteTeamPlayers", null);
__decorate([
    Security("jwt", ["admin", "organizing", "leader"]),
    Post("{team_id}/team-players/import"),
    Consumes("multipart/form-data"),
    __param(0, Path()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PlayerController.prototype, "importTeamPlayers", null);
PlayerController = __decorate([
    Route("players"),
    Tags("Players"),
    __metadata("design:paramtypes", [PlayerService])
], PlayerController);
export { PlayerController };
//# sourceMappingURL=player.controller.js.map