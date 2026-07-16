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

  /**
   * MISSING TRƯỚC ĐÂY — KnockoutUI.jsx (ScheduleBracketModal) gọi hàm này
   * nhưng chưa từng được định nghĩa, gây TypeError runtime khi bấm "Xếp
   * lịch" cho knockout. Payload: { venueIds, dailyStartTime, dailyEndTime,
   * bufferMinutes?, dateRangeStart?, dateRangeEnd? } — khớp
   * OptionalScheduleOptions phía BE.
   * ⚠️ XÁC NHẬN LẠI PATH THẬT — đoán theo pattern advanceWinner ở trên,
   * cần khớp với KnockoutController thực tế (chưa có trong context).
   */
  scheduleBracket: (seasonId, phaseId, data) =>
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/schedule`, data),

  /**
   * MISSING TRƯỚC ĐÂY — dùng cho kéo-thả đổi nhánh trong BracketView.
   * Payload khớp swapSeedsRequestSchema: { slotIdA, sideA, slotIdB, sideB }.
   * ⚠️ XÁC NHẬN LẠI PATH THẬT.
   */
  swapSeeds: (seasonId, phaseId, data) =>
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/swap-seeds`, data),

  /**
   * MISSING TRƯỚC ĐÂY — xác nhận bracket (khoá phase.status = 'locked').
   * Không cần body.
   * ⚠️ XÁC NHẬN LẠI PATH THẬT.
   */
  confirmBracket: (seasonId, phaseId) =>
    axiosClient.post(`/seasons/${seasonId}/phases/${phaseId}/knockout/confirm`),
};