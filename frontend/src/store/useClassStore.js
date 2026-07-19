import { create } from 'zustand';

/**
 * Store này CHỈ giữ UI state (modal nào đang mở, đang edit/xóa item nào).
 * Server state (danh sách class, loading, mutation...) do TanStack Query quản lý,
 * không đưa vào đây để tránh 2 nguồn sự thật (source of truth) cho cùng 1 data.
 */
export const useClassModalStore = create((set) => ({
    modal: null,     // null | 'add' | 'edit'
    editing: null,   // class đang edit
    deleting: null,  // class đang chờ xóa

    openAdd: () => set({ modal: 'add', editing: null }),
    openEdit: (item) => set({ modal: 'edit', editing: item }),
    closeModal: () => set({ modal: null, editing: null }),

    setDeleting: (item) => set({ deleting: item }),
    clearDeleting: () => set({ deleting: null }),
}));