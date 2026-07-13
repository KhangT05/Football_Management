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
import { Controller, Get, Path, Tags, Route, Put, Body, SuccessResponse, Delete, Security, Request, Query, } from "tsoa";
import { JerseyService } from "../services/jersey.service.js";
import * as jerseySchema from "../dtos/jersey.schema.js";
let JerseyController = class JerseyController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    // ─── SeasonTeamJersey ──────────────────────────────────────────────────────
    /** GET /jerseys/season-teams/:seasonTeamId */
    async getSeasonTeamJerseys(seasonTeamId) {
        return this.service.getSeasonTeamJerseys(seasonTeamId);
    }
    async upsertSeasonTeamJersey(seasonTeamId, body, req) {
        return this.service.upsertSeasonTeamJersey(seasonTeamId, body, req.user);
    }
    async deleteSeasonTeamJersey(seasonTeamId, type, req) {
        this.setStatus(204);
        return this.service.deleteSeasonTeamJersey(seasonTeamId, type, req.user);
    }
};
__decorate([
    Get("season-teams/{seasonTeamId}"),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], JerseyController.prototype, "getSeasonTeamJerseys", null);
__decorate([
    Security("jwt", ["leader", "organizing"])
    /** PUT /jerseys/season-teams/:seasonTeamId — upsert by type */
    ,
    Put("season-teams/{seasonTeamId}"),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], JerseyController.prototype, "upsertSeasonTeamJersey", null);
__decorate([
    Security("jwt", ["leader", "organizing"])
    /** DELETE /jerseys/season-teams/:seasonTeamId?type=home */
    ,
    Delete("season-teams/{seasonTeamId}"),
    SuccessResponse(204, "Deleted"),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", Promise)
], JerseyController.prototype, "deleteSeasonTeamJersey", null);
JerseyController = __decorate([
    Route("jerseys"),
    Tags("Jerseys"),
    __metadata("design:paramtypes", [JerseyService])
], JerseyController);
export { JerseyController };
//# sourceMappingURL=jersey.controller.js.map