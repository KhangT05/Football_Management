import { PaymentStatus } from '../generated/prisma/client.js';

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InitiatePaymentInput {
    /** season_team_id của leader — lấy từ JWT + season context */
    season_team_id: number;
    /** IP của leader — lấy từ request */
    ip_addr: string;
    /** Return URL sau khi thanh toán xong */
    return_url: string;
}

// ─── Output ───────────────────────────────────────────────────────────────────

export interface InitiatePaymentOutput {
    payment_id: number;
    transaction_ref: string;
    amount: number;
    payment_url: string; // Redirect leader sang đây
}

// ─── IPN ─────────────────────────────────────────────────────────────────────

export interface IpnQuery {
    vnp_TxnRef: string;
    vnp_Amount: string;
    vnp_TransactionNo: string;
    vnp_ResponseCode: string;
    [key: string]: string; // các field khác VNPay gửi kèm để verify hash
}

export type IpnResponseCode = '00' | '01' | '02' | '04' | '97' | '99';

export interface IpnResponse {
    RspCode: IpnResponseCode;
    Message: string;
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
    bank_info: {
        bank_id: string;
        bank_account_no: string;
        bank_account_name: string;
    } | null; // null = ban tổ chức chưa cấu hình → frontend ẩn option chuyển khoản
}