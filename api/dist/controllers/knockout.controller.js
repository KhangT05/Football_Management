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
import { Controller, Route, Tags, Post, Get, Path, Body, Security, SuccessResponse, } from 'tsoa';
import { KnockoutService } from '../services/knockout.service.js';
import * as knockoutSchema from '../dtos/knockout.schema.js';
let KnockoutController = class KnockoutController extends Controller {
    service;
    constructor(service) {
        super();
        this.service = service;
    }
    /**
     * phaseId/seasonId lấy từ path, KHÔNG bắt client gửi lại trong body —
     * tránh conflict (path=5, body=7 thì theo cái nào?). Merge vào object
     * rồi validate lại bằng full schema gốc (knockoutGenerateOptionsSchema)
     * làm invariant check cuối, body schema con chỉ là contract cho OpenAPI.
     */
    async generateKnockoutBracket(seasonId, phaseId, body) {
        const parsed = knockoutSchema.knockoutGenerateOptionsSchema.parse({
            ...body,
            seasonId,
            phaseId,
        });
        this.setStatus(201);
        return this.service.generateKnockoutBracket(parsed);
    }
    /**
     * Action-style mutation (không idempotent, không phải partial update của
     * resource) → POST giống autoSchedule, không dùng PATCH như rescheduleMatch.
     * venueIds/matchTimes trong body là ScheduleOptions cho match round sau
     * vừa được tạo ra (nếu advance làm xong 1 cặp slot).
     *
     * Service return newMatchId (singular) — leg 1 match ID của round tiếp theo.
     * Leg 2 match được tạo cùng lúc nhưng không expose vì client chỉ cần
     * anchor ID để poll/redirect; leg 2 visible qua GET bracket.
     */
    async advanceWinner(seasonId, phaseId, body) {
        const { venueIds, matchTimes, ...input } = knockoutSchema.advanceWinnerRequestSchema.parse(body);
        return this.service.advanceWinner(phaseId, seasonId, input, { venueIds, matchTimes });
    }
    /**
     * Read-only — không @Security, theo đúng pattern getSchedule/getTeamSchedule.
     * Trả toàn bộ slot tree; client tự build visual bracket từ
     * sourceASlotId/sourceBSlotId links.
     */
    async getBracket(phaseId) {
        return this.service.getBracket(phaseId);
    }
};
__decorate([
    Security('jwt', ['admin']),
    Post('seasons/{seasonId}/phases/{phaseId}/knockout/generate'),
    SuccessResponse(201, 'Created'),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], KnockoutController.prototype, "generateKnockoutBracket", null);
__decorate([
    Security('jwt', ['admin']),
    Post('seasons/{seasonId}/phases/{phaseId}/knockout/advance'),
    SuccessResponse(200, 'OK'),
    __param(0, Path()),
    __param(1, Path()),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], KnockoutController.prototype, "advanceWinner", null);
__decorate([
    Get('phases/{phaseId}/knockout/bracket'),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], KnockoutController.prototype, "getBracket", null);
KnockoutController = __decorate([
    Route(''),
    Tags('Knockout'),
    __metadata("design:paramtypes", [KnockoutService])
], KnockoutController);
export { KnockoutController };
//# sourceMappingURL=knockout.controller.js.map