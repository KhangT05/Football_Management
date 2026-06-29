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
 */

import axiosClient from './axiosClient';

export const paymentApi = {

  /**
   * Tạo URL thanh toán VNPay
   * POST /payments/vnpay/create-url
   *
   * @param {{ season_team_id: number, amount: number, order_info?: string }} data
   * @returns {{ paymentUrl: string, orderId: string }}
   *
   * TODO: Kết nối khi Backend endpoint sẵn sàng.
   */
  createPaymentUrl: (data) => {
    return axiosClient.post('/payments/vnpay/create-url', data);
  },

  /**
   * Xác minh giao dịch sau khi VNPay callback về Frontend
   * GET /payments/vnpay/verify?vnp_ResponseCode=...&vnp_TxnRef=...&...
   *
   * @param {URLSearchParams | object} params — Query params từ VNPay callback URL
   * @returns {{ success: boolean, message: string, transaction: object }}
   *
   * TODO: Kết nối khi Backend endpoint sẵn sàng.
   */
  verifyPayment: (params) => {
    return axiosClient.get('/payments/vnpay/verify', { params });
  },

  /**
   * Lấy lịch sử giao dịch của team
   * GET /payments/history?season_team_id={id}
   *
   * @param {number} seasonTeamId
   * @returns {{ data: PaymentRecord[] }}
   *
   * TODO: Kết nối khi Backend endpoint sẵn sàng.
   */
  getHistory: (seasonTeamId) => {
    return axiosClient.get('/payments/history', { params: { season_team_id: seasonTeamId } });
  },
};
