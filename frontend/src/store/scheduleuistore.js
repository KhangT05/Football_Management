import { create } from 'zustand';

// CHỈ giữ UI state (modal nào đang mở, đang thao tác với match/slot nào).
// KHÔNG giữ groups/roundSummaries/matches/slots ở đây nữa — những thứ đó là
// server state, đã chuyển sang TanStack Query (useScheduleQueries.js) để có
// cache/invalidate/staleTime đúng nghĩa thay vì tự quản lý bằng useState.
const useScheduleUiStore = create((set) => ({
    generateModalOpen: false,
    manualAssignTarget: null,   // { seasonId } | null — mở ManualAssignMatchModal
    rescheduleMatchId: null,    // match object đang sửa qua RescheduleModal cũ

    openGenerateModal: () => set({ generateModalOpen: true }),
    closeGenerateModal: () => set({ generateModalOpen: false }),

    openManualAssign: (seasonId) => set({ manualAssignTarget: { seasonId } }),
    closeManualAssign: () => set({ manualAssignTarget: null }),

    openReschedule: (match) => set({ rescheduleMatchId: match }),
    closeReschedule: () => set({ rescheduleMatchId: null }),
}));

export default useScheduleUiStore;