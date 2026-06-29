import { PaymentStatus, PrismaClient } from '../generated/prisma/client.js';
import { VNPay, type QueryDrResponse, type RefundResponse } from 'vnpay';
import { InitiatePaymentInput, InitiatePaymentOutput, IpnQuery, IpnResponse, PaymentRow } from '../types/payment.type.js';
export declare function createVNPayInstance(): VNPay;
export interface RefundPaymentInput {
    amount: number;
    reason: string;
    type: 'full' | 'partial';
}
export declare class PaymentService {
    private readonly prisma;
    private readonly vnpay;
    private static readonly PAYMENT_EXPIRE_MINUTES;
    constructor(prisma: PrismaClient, vnpay: VNPay);
    initiatePayment(leaderId: number, input: InitiatePaymentInput): Promise<InitiatePaymentOutput>;
    private _buildUrl;
    handleIpn(query: IpnQuery): Promise<IpnResponse>;
    verifyReturn(query: Record<string, string>): Promise<{
        is_verified: boolean;
        is_success: boolean;
        payment_id: number | null;
        status: PaymentStatus | null;
    }>;
    confirmManual(paymentId: number, adminId: number, note?: string): Promise<void>;
    queryTransaction(paymentId: number): Promise<QueryDrResponse>;
    refundPayment(paymentId: number, adminId: number, input: RefundPaymentInput): Promise<RefundResponse>;
    getPaymentBySeasonTeam(season_team_id: number, leaderId: number): Promise<PaymentRow | null>;
    listPayments(filter: {
        season_id?: number;
        status?: PaymentStatus;
        page?: number;
        limit?: number;
    }): Promise<{
        data: PaymentRow[];
        total: number;
        page: number;
        limit: number;
    }>;
}
//# sourceMappingURL=payment.service.d.ts.map