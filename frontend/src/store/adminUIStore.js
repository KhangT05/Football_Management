import { create } from 'zustand';

/**
 * ============================================================
 * adminUIStore — Quản lý trạng thái giao diện cho Admin Dashboard
 * ============================================================
 * Lưu trữ trạng thái bộ lọc (filters), modals, sidebar, v.v.
 * Giúp giảm tải local state cho các màn hình quản lý phức tạp và 
 * giữ lại filter khi user chuyển trang (UX tốt hơn).
 */
const useAdminUIStore = create((set) => ({
  // --- Quản lý Trận đấu (ManageMatches) ---
  matchFilters: {
    status: '',
    round: '',
    page: 1,
    limit: 10,
  },
  setMatchFilters: (filters) => set((state) => ({ 
    matchFilters: { ...state.matchFilters, ...filters, page: filters.page || 1 } 
  })),
  clearMatchFilters: () => set({ matchFilters: { status: '', round: '', page: 1, limit: 10 } }),

  // --- Quản lý Đội bóng (ManageTeams) ---
  teamFilters: {
    status: '',
    search: '',
    page: 1,
    limit: 10,
  },
  setTeamFilters: (filters) => set((state) => ({
    teamFilters: { ...state.teamFilters, ...filters, page: filters.page || 1 }
  })),
  clearTeamFilters: () => set({ teamFilters: { status: '', search: '', page: 1, limit: 10 } }),

  // --- Trạng thái Sidebar (AdminLayout) ---
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));

export default useAdminUIStore;
