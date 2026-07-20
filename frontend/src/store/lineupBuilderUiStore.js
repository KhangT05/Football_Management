import { create } from 'zustand';

export const useLineupBuilderUiStore = create((set) => ({
    activeTeamSide: 'home',
    jerseyColor: { home: '#2563eb', away: '#dc2626' },
    setActiveTeamSide: (side) => set({ activeTeamSide: side }),
    setJerseyColor: (side, color) =>
        set(state => ({ jerseyColor: { ...state.jerseyColor, [side]: color } })),
}));