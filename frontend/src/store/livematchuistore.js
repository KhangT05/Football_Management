import { create } from 'zustand';

/**
 * State ở đây KHÔNG thuộc RHF form vì:
 * - activeModal / et-penalty flow là điều hướng UI đa bước, không map vào
 *   1 field cụ thể nào của match event form.
 * - Cần đọc/ghi từ nhiều component con (ExtraTimeModal, PenaltyModal, action
 *   bar) mà không muốn prop-drill qua RHF context.
 *
 * Reset toàn bộ mỗi khi đổi match (gọi resetKnockoutFlow() trong
 * handleMatchSelect) — tránh leak state của trận trước sang trận sau.
 */
export const useLiveMatchUiStore = create((set) => ({
    // 'forfeit' | 'abandon' | 'appeal' | 'protest' | 'resolve' | null
    activeModal: null,
    setActiveModal: (modal) => set({ activeModal: modal }),

    matchStatus: '',
    setMatchStatus: (status) => set({ matchStatus: status }),

    currentPeriod: 'first_half',
    setCurrentPeriod: (period) => set({ currentPeriod: period }),

    // ── Knockout draw -> ET -> penalty flow ──
    etModalOpen: false,
    penaltyModalOpen: false,
    penaltyBaseScore: { home: 0, away: 0 },
    etWasPlayed: false,

    openExtraTimeModal: () => set({ etModalOpen: true }),
    closeExtraTimeModal: () => set({ etModalOpen: false }),

    goToPenaltyAfterExtraTime: (homeAfterEt, awayAfterEt) =>
        set({
            etModalOpen: false,
            penaltyModalOpen: true,
            penaltyBaseScore: { home: homeAfterEt, away: awayAfterEt },
            etWasPlayed: true,
        }),

    skipExtraTimeToPenalty: (home90, away90) =>
        set({
            etModalOpen: false,
            penaltyModalOpen: true,
            penaltyBaseScore: { home: home90, away: away90 },
            etWasPlayed: false,
        }),

    closePenaltyModal: () => set({ penaltyModalOpen: false }),

    resetKnockoutFlow: () =>
        set({
            etModalOpen: false,
            penaltyModalOpen: false,
            penaltyBaseScore: { home: 0, away: 0 },
            etWasPlayed: false,
        }),

    resetForNewMatch: () =>
        set({
            activeModal: null,
            matchStatus: '',
            currentPeriod: 'first_half',
            etModalOpen: false,
            penaltyModalOpen: false,
            penaltyBaseScore: { home: 0, away: 0 },
            etWasPlayed: false,
        }),
}));