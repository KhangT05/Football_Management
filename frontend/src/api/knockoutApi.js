import axiosClient from './axiosClient';

export const knockoutApi = {
  /**
   * Tạo bracket vòng loại trực tiếp
   * POST /seasons/{seasonId}/phases/{phaseId}/knockout/generate
   */
  generateBracket: (seasonId, phaseId, data) => 
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/generate`, data),

  /**
   * Cập nhật đội thắng tiến vào vòng sau
   * POST /seasons/{seasonId}/phases/{phaseId}/knockout/advance
   */
  advanceWinner: (seasonId, phaseId, data) => 
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/advance`, data),
};
