import { create } from 'zustand';

const MAX_TOASTS = 5; // Giới hạn toast tối đa → ngăn stack overflow khi lỗi liên tiếp
let _toastId = 0;
const _timeoutMap = new Map(); // Lưu timeout reference để cleanup khi remove sớm

const useToastStore = create((set, get) => ({
  toasts: [],

  /**
   * Thêm toast mới
   * @param {{ message: string, type: 'success'|'error'|'info'|'warning', duration?: number }} opts
   */
  addToast: ({ message, type = 'info', duration = 3500 }) => {
    const id = ++_toastId;

    set((state) => {
      let toasts = [...state.toasts, { id, message, type, duration }];

      // Nếu vượt quá giới hạn → xóa toast cũ nhất (FIFO)
      while (toasts.length > MAX_TOASTS) {
        const removed = toasts.shift();
        // Cleanup timeout của toast bị xóa sớm
        const tid = _timeoutMap.get(removed.id);
        if (tid) {
          clearTimeout(tid);
          _timeoutMap.delete(removed.id);
        }
      }

      return { toasts };
    });

    // Tự xóa sau `duration` ms
    const timeoutId = setTimeout(() => {
      _timeoutMap.delete(id);
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);

    _timeoutMap.set(id, timeoutId);
    return id;
  },

  removeToast: (id) => {
    // Cleanup timeout khi user đóng toast thủ công
    const tid = _timeoutMap.get(id);
    if (tid) {
      clearTimeout(tid);
      _timeoutMap.delete(id);
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

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
