import axiosClient from './axiosClient';

export const knockoutApi = {
  /**
   * Tạo bracket vòng loại trực tiếp — phaseId không còn là input,
   * BE get-or-create phase và trả về trong response.
   * POST /seasons/{seasonId}/knockout/generate
   */
  generateBracket: (seasonId, data) =>
    axiosClient.post(`/seasons/${seasonId}/knockout/generate`, data),

  /**
   * Cập nhật đội thắng tiến vào vòng sau — vẫn cần phaseId (phase đã tồn tại)
   * POST /seasons/{seasonId}/phases/{phaseId}/knockout/advance
   */
  advanceWinner: (seasonId, phaseId, data) =>
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/advance`, data),

  /**
   * Lấy sơ đồ bracket
   * GET /phases/{phaseId}/knockout/bracket
   */
  getBracket: (phaseId) =>
    axiosClient.get(`/phases/${phaseId}/knockout/bracket`),
};