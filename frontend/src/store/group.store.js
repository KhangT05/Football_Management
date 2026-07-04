import { create } from 'zustand';

/**
 * CHỈ giữ draft form state (phase đang chọn, params bốc thăm) — KHÔNG cache
 * server data ở đây (phases/standings/teams đi qua TanStack Query, có
 * staleTime + invalidation riêng, không trộn với store này).
 *
 * reset() được gọi từ component mỗi khi seasonId đổi — tránh giữ phaseId
 * của season trước khi user chuyển tab (đây chính là root cause của bug
 * "gọi nhầm phase_id=1": input không có khái niệm "thuộc season nào" nên
 * giá trị cũ/mặc định không tự invalidate khi đổi context).
 */
export const useGroupDrawFormStore = create((set) => ({
    phaseId: null,
    teamsPerGroup: 4,
    numPots: 4,
    setPhaseId: (id) => set({ phaseId: id }),
    setTeamsPerGroup: (n) => set({ teamsPerGroup: n }),
    setNumPots: (n) => set({ numPots: n }),
    reset: () => set({ phaseId: null, teamsPerGroup: 4, numPots: 4 }),
}));