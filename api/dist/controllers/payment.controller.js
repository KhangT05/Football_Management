// import {
//     Controller,
//     Path,
//     Tags,
//     Route,
//     Post,
//     Get,
//     Patch,
//     Body,
//     SuccessResponse,
//     Security,
//     Query,
//     Request,
// } from 'tsoa';
// import type { Request as ExpressRequest } from 'express';
// import { PaymentService, type RefundPaymentInput } from '../services/payment.service.js';
// import { PaymentStatus } from '../generated/prisma/client.js';
// import type { InitiatePaymentOutput, IpnResponse, PaymentRow } from '../types/payment.type.js';
// import type { InitiatePaymentDto, ManualConfirmPaymentDto, RefundPaymentDto } from '../dtos/payment.schema.js';
export {};
// // Route: /payments/*
// //
// // Auth phân tầng:
// //   POST   /payments/initiate          → leader (jwt)
// //   GET    /payments/status            → leader (jwt)
// //   GET    /payments/return            → public — VNPay redirect
// //   GET    /payments/ipn               → public — VNPay server-to-server
// //   GET    /payments                   → admin
// //   PATCH  /payments/:id/confirm       → admin
// //   GET    /payments/:id/query         → admin — đối soát qua queryDr
// //   POST   /payments/:id/refund        → admin — refund
// @Route('payments')
// @Tags('Payment')
// export class PaymentController extends Controller {
//     constructor(private readonly paymentService: PaymentService) {
//         super();
//     }
//     @Security('jwt', ['leader', 'user'])
//     @Post('initiate')
//     @SuccessResponse(201, 'Payment initiated')
//     async initiatePayment(
//         @Body() body: InitiatePaymentDto,
//         @Request() req: ExpressRequest,
//     ): Promise<InitiatePaymentOutput> {
//         this.setStatus(201);
//         const user = (req as any).user as { id: number };
//         const ip = (req.ip ?? '127.0.0.1').replace('::ffff:', '');
//         return this.paymentService.initiatePayment(user.id, {
//             season_team_id: body.season_team_id,
//             ip_addr: ip,
//             return_url: body.return_url,
//         });
//     }
//     @Security('jwt', ['leader', 'user'])
//     @Get('status')
//     async getPaymentStatus(
//         @Query() season_team_id: number,
//         @Request() req: ExpressRequest,
//     ): Promise<PaymentRow | null> {
//         const user = (req as any).user as { id: number };
//         return this.paymentService.getPaymentBySeasonTeam(season_team_id, user.id);
//     }
//     @Get('return')
//     async handleReturn(
//         @Request() req: ExpressRequest,
//     ): Promise<{
//         is_verified: boolean;
//         is_success: boolean;
//         payment_id: number | null;
//         status: PaymentStatus | null;
//     }> {
//         const query = req.query as Record<string, string>;
//         return this.paymentService.verifyReturn(query);
//     }
//     @Get('ipn')
//     async handleIpn(
//         @Request() req: ExpressRequest,
//     ): Promise<IpnResponse> {
//         const query = req.query as Record<string, string>;
//         return this.paymentService.handleIpn(query as any);
//     }
//     @Security('jwt', ['admin'])
//     @Get()
//     async listPayments(
//         @Query() season_id?: number,
//         @Query() status?: PaymentStatus,
//         @Query() page?: number,
//         @Query() limit?: number,
//     ): Promise<{ data: PaymentRow[]; total: number; page: number; limit: number }> {
//         return this.paymentService.listPayments({ season_id, status, page, limit });
//     }
//     @Security('jwt', ['admin'])
//     @Patch('{id}/confirm')
//     @SuccessResponse(204, 'Confirmed')
//     async confirmManual(
//         @Path() id: number,
//         @Body() body: ManualConfirmPaymentDto,
//         @Request() req: ExpressRequest,
//     ): Promise<void> {
//         this.setStatus(204);
//         const user = (req as any).user as { id: number };
//         return this.paymentService.confirmManual(id, user.id, body.note);
//     }
//     // ─── Admin: query transaction (đối soát) ───────────────────────────────────
//     // Trả raw object thay vì type QueryDrResponse trực tiếp — type từ SDK ngoài
//     // (Decimal-like fields, optional union phức tạp) có thể làm tsoa generate
//     // OpenAPI schema sai hoặc fail. Nếu cần strict schema, map sang DTO riêng.
//     @Security('jwt', ['admin'])
//     @Get('{id}/query')
//     async queryTransaction(@Path() id: number): Promise<Record<string, unknown>> {
//         const result = await this.paymentService.queryTransaction(id);
//         return result as unknown as Record<string, unknown>;
//     }
//     // ─── Admin: refund ────────────────────────────────────────────────────────
//     @Security('jwt', ['admin'])
//     @Post('{id}/refund')
//     async refundPayment(
//         @Path() id: number,
//         @Body() body: RefundPaymentDto,
//         @Request() req: ExpressRequest,
//     ): Promise<Record<string, unknown>> {
//         const user = (req as any).user as { id: number };
//         const result = await this.paymentService.refundPayment(id, user.id, body as RefundPaymentInput);
//         return result as unknown as Record<string, unknown>;
//     }
// }
//# sourceMappingURL=payment.controller.js.map