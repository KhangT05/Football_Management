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
     * Route đổi: /phases/{phaseId}/knockout/generate -> /seasons/{seasonId}/knockout/generate.
     * phaseId KHÔNG còn là input — nó là OUTPUT (service get-or-create Phase,
     * type derive từ bracket size qua BRACKET_SIZE_TO_PHASE_TYPE).
     *
     * Idempotency: CONFLICT tự nhiên ở service (existingCount > 0 trên
     * bracket_slots của phase vừa get-or-create) nếu gọi generate 2 lần
     * cho cùng season+phaseType.
     */
    async generateKnockoutBracket(seasonId, body) {
        const parsed = knockoutSchema.knockoutGenerateOptionsSchema.parse({
            ...body,
            seasonId,
        });
        this.setStatus(201);
        return this.service.generateKnockoutBracket(parsed);
    }
    async advanceWinner(seasonId, phaseId, body) {
        const { venueIds, matchTimes, ...input } = knockoutSchema.advanceWinnerRequestSchema.parse(body);
        return this.service.advanceWinner(phaseId, seasonId, input, { venueIds, matchTimes });
    }
    async getBracket(phaseId) {
        return this.service.getBracket(phaseId);
    }
};
__decorate([
    Security('jwt', ['admin']),
    Post('seasons/{seasonId}/knockout/generate'),
    SuccessResponse(201, 'Created'),
    __param(0, Path()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
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