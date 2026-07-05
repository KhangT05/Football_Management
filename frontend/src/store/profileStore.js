import { create } from 'zustand';

/**
 * useProfileStore
 * Quản lý trạng thái UI của trang Profile (isEditing, form data, v.v.)
 * Giúp giữ trạng thái không bị mất khi điều hướng qua lại giữa các tab.
 */
const useProfileStore = create((set, get) => ({
  // --- UI States ---
  isEditing: false,
  isFetching: false,
  isSaving: false,
  saveSuccess: false,

  // --- Form Data ---
  formData: {
    name: '',
    phone: '',
  },
  savedData: {
    name: '',
    phone: '',
  },

  // --- Actions ---
  setEditing: (editing) => set({ isEditing: editing }),
  setFetching: (fetching) => set({ isFetching: fetching }),
  setSaving: (saving) => set({ isSaving: saving }),
  setSaveSuccess: (success) => set({ saveSuccess: success }),

  updateField: (field, value) => 
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    })),

  // Sync dữ liệu khởi tạo từ user (lúc load lần đầu hoặc sau khi fetch/update thành công)
  syncFromUser: (user) => {
    if (!user) return;
    const initial = {
      name: user.name || '',
      phone: user.phone || '',
    };
    set({
      formData: initial,
      savedData: initial
    });
  },

  // Hủy chỉnh sửa, khôi phục lại dữ liệu đã lưu
  handleCancel: () => {
    const { savedData } = get();
    set({
      formData: savedData,
      isEditing: false
    });
  },
  
  // Cập nhật lại form data và save data sau khi lưu thành công
  updateAfterSave: (updatedData) => {
    set({
      formData: updatedData,
      savedData: updatedData,
      isEditing: false,
      saveSuccess: true
    });
  }
}));

export default useProfileStore;