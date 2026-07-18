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
import { Controller, Route, Tags, Post, Patch, Get, Path, Body, Query, Security, SuccessResponse, } from 'tsoa';
import { ScheduleService } from '../services/schedule.service.js';
import * as scheduleSchema from '../dtos/schedule.schema.js';
import { rescheduleMatchSchema } from '../dtos/schedule.schema.js';
let ScheduleController = class ScheduleController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    async generateSchedule(seasonId, body) {
        const parsed = scheduleSchema.generateScheduleSchema.parse(body);
        this.setStatus(201);
        return this.service.generateGroupsAndSchedule(seasonId, parsed);
    }
    // NEW: round-selector cho GenerateScheduleModal — cho biết mỗi round
    // group_stage còn bao nhiêu match chưa xếp lịch. groupIds query param
    // (CSV) optional — nếu admin đã chọn subset bảng đấu trước khi mở
    // round selector, chỉ tính round trong phạm vi đó.
    async getRoundsSummary(seasonId, groupIds) {
        const parsedGroupIds = groupIds
            ? groupIds.split(',').map(Number).filter(n => !Number.isNaN(n))
            : undefined;
        return this.service.getGroupStageRoundsSummary(seasonId, parsedGroupIds);
    }
    /**
     * NEW: Sinh lịch thi đấu cho season ĐÃ có bảng đấu + đã bốc thăm qua
     * GroupService (POST /groups/bulk, POST /groups/{seasonId}/draw hoặc
     * /draw-seeded). KHÔNG tạo lại bảng, KHÔNG tự chia đội — chỉ sinh match
     * round-robin cho các group hiện có rồi xếp giờ/sân.
     *
     * Dùng endpoint này thay vì /generate khi season.phases.length > 0
     * (endpoint /generate sẽ throw CONFLICT trong trường hợp đó).
     */
    async generateFromGroups(seasonId, body) {
        const parsed = scheduleSchema.generateFromGroupsSchema.parse(body);
        this.setStatus(201);
        return this.service.generateMatchesFromDrawnGroups(seasonId, parsed);
    }
    async autoSchedule(seasonId, body) {
        const parsed = scheduleSchema.autoScheduleSchema.parse(body);
        return this.service.autoScheduleMatches(seasonId, parsed);
    }
    async rescheduleMatch(matchId, body) {
        const parsed = rescheduleMatchSchema.parse(body);
        await this.service.rescheduleMatch(matchId, parsed);
        this.setStatus(204);
    }
    // schedule.controller.ts
    async getSchedule(seasonId, page = 1, per_page = 20, sort, direction) {
        return this.service.findMatchesBySeason(seasonId, { page, per_page, sort, direction });
    }
    async getTeamSchedule(seasonId, teamId, page = 1, per_page = 20, sort, direction) {
        const req = { page, per_page, sort, direction };
        return this.service.findMatchesByTeam(seasonId, teamId, req);
    }
    async getUnscheduledMatchesInRound(seasonId, groupId, round) {
        return this.service.findUnscheduledMatchesInRound(seasonId, groupId, round);
    }
    async getAvailableSlotsForMatch(seasonId, matchId, body) {
        const parsed = scheduleSchema.getAvailableSlotsSchema.parse(body);
        return this.service.getAvailableSlotsForMatch(seasonId, matchId, parsed);
    }
    async getScheduleDefaults(seasonId) {
        return this.service.getScheduleDefaults(seasonId);
    }
    async saveScheduleDefaults(seasonId, body) {
        const parsed = scheduleSchema.seasonScheduleDefaultsSchema.parse(body);
        await this.service.saveScheduleDefaults(seasonId, parsed);
        this.setStatus(204);
    }
};
__decorate([
    Security('jwt', ['organizing']),
    Post('seasons/{seasonId}/generate'),
    SuccessResponse(201, 'Created'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "generateSchedule", null);
__decorate([
    Security('jwt', ['organizing']),
    Get('seasons/{seasonId}/rounds-summary'),
    __param(0, Path()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getRoundsSummary", null);
__decorate([
    Security('jwt', ['organizing']),
    Post('seasons/{seasonId}/generate-from-groups'),
    SuccessResponse(201, 'Created'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "generateFromGroups", null);
__decorate([
    Security('jwt', ['organizing']),
    Post('seasons/{seasonId}/schedule'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "autoSchedule", null);
__decorate([
    Security('jwt', ['organizing']),
    Patch('matches/{matchId}/reschedule'),
    SuccessResponse(204, 'No Content'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "rescheduleMatch", null);
__decorate([
    Get('seasons/{seasonId}/schedule'),
    __param(0, Path()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getSchedule", null);
__decorate([
    Get('seasons/{seasonId}/teams/{teamId}/schedule'),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Query()),
    __param(3, Query()),
    __param(4, Query()),
    __param(5, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getTeamSchedule", null);
__decorate([
    Security('jwt', ['organizing']),
    Get('seasons/{seasonId}/groups/{groupId}/rounds/{round}/unscheduled-matches'),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getUnscheduledMatchesInRound", null);
__decorate([
    Security('jwt', ['organizing']),
    Post('seasons/{seasonId}/matches/{matchId}/available-slots'),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getAvailableSlotsForMatch", null);
__decorate([
    Security('jwt', ['organizing']),
    Get('seasons/{seasonId}/defaults'),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "getScheduleDefaults", null);
__decorate([
    Security('jwt', ['organizing']),
    Patch('seasons/{seasonId}/defaults'),
    SuccessResponse(204, 'No Content'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], ScheduleController.prototype, "saveScheduleDefaults", null);
ScheduleController = __decorate([
    Route('schedules'),
    Tags('Schedules'),
    __metadata("design:paramtypes", [ScheduleService])
], ScheduleController);
export { ScheduleController };
//# sourceMappingURL=schedule.controller.js.map