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
import { Controller, Get, Path, Tags, Route, Post, Body, Security, Query, } from "tsoa";
import { MatchResultService } from "../services/matchresult.service.js";
import * as matchResultType from "../types/matchResult.type.js";
import { buildMatchEventsQueryRequest } from "../helper/match.helper.js";
let MatchResultController = class MatchResultController extends Controller {
    matchResultService;
    constructor(matchResultService) {
        super();
        this.matchResultService = matchResultService;
    }
    async getMatchResult(id) {
        const result = await this.matchResultService.getMatchResult(id);
        return result;
    }
    async getMatchEvents(id, type, period, page, per_page, sort, direction, q) {
        const req = buildMatchEventsQueryRequest({
            type, period, page, per_page, sort, direction, q,
        });
        const result = await this.matchResultService.listMatchEvents(id, req);
        return result;
    }
    async getMatchPlayerStats(id) {
        const stats = await this.matchResultService.getMatchPlayerStats(id);
        return stats;
    }
    /**
     * FIX (Critical #1 — auth bypass): @Security("jwt") trước đây không role-restrict
     * — bất kỳ authenticated user (user/leader/organizing) đều gọi được endpoint này
     * để confirmResult() trực tiếp, bypass toàn bộ state machine ở MatchController
     * (finalizeMatch → grace period → confirmOfficial), vốn siết admin cho mọi
     * confirm/forfeit/resolve-appeal operation. _guardConfirm chỉ chặn status
     * finished/cancelled — match ongoing/pending_official/needs_review/abandoned/
     * bye/postponed đều pass, và nếu body.input cho set explicitWinnerTeamId, đây
     * là privilege escalation thực sự (set winner tuỳ ý cho bất kỳ match).
     *
     * Siết về admin. Khuyến nghị đánh giá lại: endpoint này có còn cần thiết không
     * — MatchController đã có confirmOfficial/forfeitMatch/adminRecordResult cho
     * đầy đủ use case; nếu không có consumer riêng (integration test, internal
     * tool), nên xoá hẳn thay vì giữ 1 entrypoint thứ 2 vào cùng service method.
     */
    async confirmResult(id, body) {
        const result = await this.matchResultService.confirmResult(id, body.input, body.scheduleOptions);
        this.setStatus(201);
        return result;
    }
};
__decorate([
    Get("{id}/result"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchResult", null);
__decorate([
    Get("{id}/events"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __param(6, Query()),
    __param(7, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Number, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchEvents", null);
__decorate([
    Get("{id}/result/stats"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "getMatchPlayerStats", null);
__decorate([
    Security("jwt", ["organizing"]),
    Post("{id}/result/confirm"),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MatchResultController.prototype, "confirmResult", null);
MatchResultController = __decorate([
    Route("matches"),
    Tags("Match Result"),
    __metadata("design:paramtypes", [MatchResultService])
], MatchResultController);
export { MatchResultController };
//# sourceMappingURL=matchResult.controller.js.map