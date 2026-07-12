import { Controller } from 'tsoa';
import type { Request as ExpressRequest } from 'express';
import { PaymentService } from '../services/payment.service.js';
import { PaymentStatus } from '../generated/prisma/client.js';
import type { InitiatePaymentOutput, IpnResponse, PaymentRow } from '../types/payment.type.js';
import type { InitiatePaymentDto, ManualConfirmPaymentDto, RefundPaymentDto } from '../dtos/payment.schema.js';
export declare class PaymentController extends Controller {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    initiatePayment(body: InitiatePaymentDto, req: ExpressRequest): Promise<InitiatePaymentOutput>;
    initiateManualPayment(body: {
        season_team_id: number;
    }, req: ExpressRequest): Promise<{
        payment_id: number;
        amount: number;
        status: PaymentStatus;
    }>;
    getPaymentStatus(season_team_id: number, req: ExpressRequest): Promise<PaymentRow | null>;
    handleReturn(req: ExpressRequest): Promise<{
        is_verified: boolean;
        is_success: boolean;
        payment_id: number | null;
        status: PaymentStatus | null;
    }>;
    handleIpn(req: ExpressRequest): Promise<IpnResponse>;
    listPayments(season_id?: number, status?: PaymentStatus, page?: number, limit?: number): Promise<{
        data: PaymentRow[];
        total: number;
        page: number;
        limit: number;
    }>;
    confirmManual(id: number, body: ManualConfirmPaymentDto, req: ExpressRequest): Promise<void>;
    queryTransaction(id: number): Promise<Record<string, unknown>>;
    refundPayment(id: number, body: RefundPaymentDto, req: ExpressRequest): Promise<Record<string, unknown>>;
}
//# sourceMappingURL=payment.controller.d.ts.map