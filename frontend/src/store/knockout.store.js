import { create } from 'zustand';

const getDefaults = () => ({
    phaseId: null,
    seededTeamIds: '',
    venueIds: '1',
    matchTimes: new Date().toISOString(),
    legs: 1,
});

export const useKnockoutFormStore = create((set) => ({
    ...getDefaults(),
    setPhaseId: (id) => set({ phaseId: id }),
    setSeededTeamIds: (v) => set({ seededTeamIds: v }),
    setVenueIds: (v) => set({ venueIds: v }),
    setMatchTimes: (v) => set({ matchTimes: v }),
    setLegs: (v) => set({ legs: v }),
    reset: () => set(getDefaults()),
}));