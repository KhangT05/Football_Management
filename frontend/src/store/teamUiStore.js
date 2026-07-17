import { create } from 'zustand';

const useTeamUiStore = create((set) => ({
    activeTeamId: null,
    activeTab: 'roster',
    setActiveTeamId: (id) => set({ activeTeamId: id }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    resetFiltersOnSwitch: () => set({ activeTab: 'roster' }),
}));

export default useTeamUiStore;