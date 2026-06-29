import { PaymentStatus } from '../generated/prisma/client.js';
export interface InitiatePaymentInput {
    /** season_team_id của leader — lấy từ JWT + season context */
    season_team_id: number;
    /** IP của leader — lấy từ request */
    ip_addr: string;
    /** Return URL sau khi thanh toán xong */
    return_url: string;
}
export interface InitiatePaymentOutput {
    payment_id: number;
    transaction_ref: string;
    amount: number;
    payment_url: string;
}
export interface PaymentRow {
    id: number;
    season_team_id: number;
    amount: number;
    status: PaymentStatus;
    transaction_ref: string | null;
    paid_at: Date | null;
    confirmed_at: Date | null;
    confirmed_by: number | null;
    created_at: Date;
    team_name: string;
    season_name: string;
    registration_fee: number;
}
export interface IpnQuery {
    vnp_TxnRef: string;
    vnp_Amount: string;
    vnp_TransactionNo: string;
    vnp_ResponseCode: string;
    [key: string]: string;
}
export type IpnResponseCode = '00' | '01' | '02' | '04' | '97' | '99';
export interface IpnResponse {
    RspCode: IpnResponseCode;
    Message: string;
}
//# sourceMappingURL=payment.type.d.ts.map