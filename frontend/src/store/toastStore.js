import { create } from 'zustand';

let _toastId = 0;

const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Thêm toast mới
   * @param {{ message: string, type: 'success'|'error'|'info'|'warning', duration?: number }} opts
   */
  addToast: ({ message, type = 'info', duration = 3500 }) => {
    const id = ++_toastId;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    // Tự xóa sau `duration` ms
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Shorthand helpers
  success: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'success', duration }),

  error: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'error', duration }),

  info: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'info', duration }),

  warning: (message, duration) =>
    useToastStore.getState().addToast({ message, type: 'warning', duration }),
}));

export default useToastStore;
