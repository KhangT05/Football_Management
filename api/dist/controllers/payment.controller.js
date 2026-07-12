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
import { Controller, Path, Tags, Route, Post, Get, Patch, Body, SuccessResponse, Security, Query, Request, } from 'tsoa';
import { PaymentService } from '../services/payment.service.js';
import { PaymentStatus } from '../generated/prisma/client.js';
// Route: /payments/*
//
// Auth phân tầng:
//   POST   /payments/initiate          → leader (jwt)
//   GET    /payments/status            → leader (jwt)
//   GET    /payments/return            → public — VNPay redirect
//   GET    /payments/ipn               → public — VNPay server-to-server
//   GET    /payments                   → admin
//   PATCH  /payments/:id/confirm       → admin
//   GET    /payments/:id/query         → admin — đối soát qua queryDr
//   POST   /payments/:id/refund        → admin — refund
let PaymentController = class PaymentController extends Controller {
    paymentService;
    constructor(paymentService) {
        super();
        this.paymentService = paymentService;
    }
    async initiatePayment(body, req) {
        this.setStatus(201);
        const user = req.user;
        const ip = (req.ip ?? '127.0.0.1').replace('::ffff:', '');
        return this.paymentService.initiatePayment(user.id, {
            season_team_id: body.season_team_id,
            ip_addr: ip,
            return_url: body.return_url,
        });
    }
    async initiateManualPayment(body, req) {
        this.setStatus(201);
        const user = req.user;
        return this.paymentService.initiateManualPayment(user.id, body.season_team_id);
    }
    async getPaymentStatus(season_team_id, req) {
        const user = req.user;
        return this.paymentService.getPaymentBySeasonTeam(season_team_id, user.id);
    }
    async handleReturn(req) {
        const query = req.query;
        return this.paymentService.verifyReturn(query);
    }
    async handleIpn(req) {
        const query = req.query;
        return this.paymentService.handleIpn(query);
    }
    async listPayments(season_id, status, page, limit) {
        return this.paymentService.listPayments({ season_id, status, page, limit });
    }
    async confirmManual(id, body, req) {
        this.setStatus(204);
        const user = req.user;
        return this.paymentService.confirmManual(id, user.id, body.note);
    }
    // ─── Admin: query transaction (đối soát) ───────────────────────────────────
    // Trả raw object thay vì type QueryDrResponse trực tiếp — type từ SDK ngoài
    // (Decimal-like fields, optional union phức tạp) có thể làm tsoa generate
    // OpenAPI schema sai hoặc fail. Nếu cần strict schema, map sang DTO riêng.
    async queryTransaction(id) {
        const result = await this.paymentService.queryTransaction(id);
        return result;
    }
    // ─── Admin: refund ────────────────────────────────────────────────────────
    async refundPayment(id, body, req) {
        const user = req.user;
        const result = await this.paymentService.refundPayment(id, user.id, body);
        return result;
    }
};
__decorate([
    Security('jwt', ['leader', 'user']),
    Post('initiate'),
    SuccessResponse(201, 'Payment initiated'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initiatePayment", null);
__decorate([
    Security('jwt', ['leader', 'user', 'admin', 'player']),
    Post('manual'),
    SuccessResponse(201, 'Manual payment initiated'),
    __param(0, Body()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "initiateManualPayment", null);
__decorate([
    Security('jwt', ['leader', 'user']),
    Get('status'),
    __param(0, Query()),
    __param(1, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getPaymentStatus", null);
__decorate([
    Get('return'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleReturn", null);
__decorate([
    Get('ipn'),
    __param(0, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handleIpn", null);
__decorate([
    Security('jwt', ['admin']),
    Get(),
    __param(0, Query()),
    __param(1, Query()),
    __param(2, Query()),
    __param(3, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "listPayments", null);
__decorate([
    Security('jwt', ['admin']),
    Patch('{id}/confirm'),
    SuccessResponse(204, 'Confirmed'),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "confirmManual", null);
__decorate([
    Security('jwt', ['admin']),
    Get('{id}/query'),
    __param(0, Path()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "queryTransaction", null);
__decorate([
    Security('jwt', ['admin']),
    Post('{id}/refund'),
    __param(0, Path()),
    __param(1, Body()),
    __param(2, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "refundPayment", null);
PaymentController = __decorate([
    Route('payments'),
    Tags('Payment'),
    __metadata("design:paramtypes", [PaymentService])
], PaymentController);
export { PaymentController };
//# sourceMappingURL=payment.controller.js.map