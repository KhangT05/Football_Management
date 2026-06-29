// ─── DTOs cho tsoa ────────────────────────────────────────────────────────────

/** Leader gọi để bắt đầu thanh toán lệ phí */
export interface InitiatePaymentDto {
    /** season_team_id của team mình trong mùa giải */
    season_team_id: number;
    /**
     * URL redirect sau khi VNPay xử lý xong.
     * Frontend truyền vào để linh hoạt (web vs mobile deep link).
     * Ví dụ: https://app.example.com/payment/result
     */
    return_url: string;
}

/** Admin confirm tay khi IPN bị miss */
export interface ManualConfirmPaymentDto {
    note?: string;
}
export interface RefundPaymentDto {
    amount: number;
    reason: string;
    type: 'full' | 'partial';
}