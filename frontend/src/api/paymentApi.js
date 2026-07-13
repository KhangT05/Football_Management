/**
 * paymentApi.js — API layer cho tích hợp VNPay
 * ─────────────────────────────────────────────
 * Thiết kế để dễ dàng kết nối khi Backend có API sẵn sàng.
 *
 * Flow thanh toán VNPay:
 *   1. Frontend gọi createPaymentUrl() → Backend tạo URL VNPay và trả về
 *   2. Frontend redirect user sang URL VNPay
 *   3. User thanh toán trên VNPay
 *   4. VNPay redirect về return_url của Backend
 *   5. Backend xác nhận giao dịch và redirect về Frontend /thanh-toan/ket-qua?...
 *   6. Frontend gọi verifyPayment() để lấy kết quả chính thức từ Backend
 *
 * LƯU Ý: rejectPayment đã bị BỎ khỏi API layer này — backend PaymentService
 * không có method/route reject tương ứng (chỉ có confirm/query/refund).
 * PaymentStatus enum thực tế: pending | confirmed | refund_pending | refunded.
 */

import axiosClient from './axiosClient';

export const paymentApi = {
  /**
   * Khởi tạo thanh toán VNPay
   * POST /payments/initiate
   *
   * @param {{ season_team_id: number, return_url: string }} data
   * @returns {{ payment_id: number, transaction_ref: string, amount: number, payment_url: string }}
   */
  initiatePayment: (data) => {
    return axiosClient.post('/payments/initiate', data);
  },

  /**
   * Xác minh giao dịch sau khi VNPay callback về Frontend
   * GET /payments/return?vnp_ResponseCode=...&vnp_TxnRef=...&...
   *
   * @param {URLSearchParams | object} params
   * @returns {{ is_verified: boolean, is_success: boolean, payment_id: number | null, status: string | null }}
   */
  verifyReturn: (params) => {
    return axiosClient.get('/payments/return', { params });
  },

  /**
   * Lấy trạng thái thanh toán của team (dành cho user/leader)
   * GET /payments/status?season_team_id={id}
   *
   * @param {number} seasonTeamId
   */
  getPaymentStatus: (seasonTeamId) => {
    return axiosClient.get('/payments/status', { params: { season_team_id: seasonTeamId } });
  },

  /** Alias cho getPaymentStatus */
  getStatus: (seasonTeamId) => {
    return axiosClient.get('/payments/status', { params: { season_team_id: seasonTeamId } });
  },

  /**
   * Admin: Lấy danh sách thanh toán
   * GET /payments
   */
  getPayments: (params) => {
    return axiosClient.get('/payments', { params });
  },

  /**
   * Admin: Xác nhận thanh toán thủ công
   * PATCH /payments/{id}/confirm
   */
  confirmManual: (id, data) => {
    return axiosClient.patch(`/payments/${id}/confirm`, data);
  },

  /**
   * Admin: Hoàn tiền
   * POST /payments/{id}/refund
   */
  refundPayment: (id, data) => {
    return axiosClient.post(`/payments/${id}/refund`, data);
  },

  /**
   * Admin: Truy vấn trạng thái giao dịch
   * GET /payments/{id}/query
   */
  queryTransaction: (id) => {
    return axiosClient.get(`/payments/${id}/query`);
  },

  /**
   * Leader: Khởi tạo thanh toán thủ công
   * POST /payments/manual
   */
  initiateManualPayment: (data) => {
    return axiosClient.post('/payments/manual', data);
  },
};