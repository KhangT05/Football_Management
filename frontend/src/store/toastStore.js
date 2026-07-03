import { create } from 'zustand';

const MAX_TOASTS = 5; // Giới hạn toast tối đa → ngăn stack overflow khi lỗi liên tiếp
let _toastId = 0;
const _timeoutMap = new Map(); // Lưu timeout reference để cleanup khi remove sớm

const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Thêm toast mới
   * @param {{ message: string, title?: string, details?: any, type: 'success'|'error'|'info'|'warning', duration?: number }} opts
   */
  addToast: ({ message, title, details, type = 'info', duration = 3500 }) => {
    const id = ++_toastId;

    set((state) => {
      let toasts = [...state.toasts, { id, message, title, details, type, duration }];

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
  success: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return useToastStore.getState().addToast({ message, type: 'success', ...opts });
  },

  error: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return useToastStore.getState().addToast({ message, type: 'error', ...opts });
  },

  info: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return useToastStore.getState().addToast({ message, type: 'info', ...opts });
  },

  warning: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return useToastStore.getState().addToast({ message, type: 'warning', ...opts });
  },

  /**
   * Helper phân tích lỗi từ API và hiển thị toast đầy đủ thông tin
   */
  apiError: (err, defaultMsg = 'Đã có lỗi xảy ra') => {
    const res = err?.response?.data;
    if (res && res.status === false) {
      // Backend error format
      return useToastStore.getState().addToast({
        type: 'error',
        title: res.code ? `Lỗi: ${res.code}` : 'Thất bại',
        message: res.message || defaultMsg,
        details: res.data,
        duration: res.data ? 6000 : 4000 // Hiển thị lâu hơn nếu có details
      });
    }
    // Lỗi chung (network, timeout, etc.)
    return useToastStore.getState().addToast({ 
      type: 'error', 
      message: err?.message || defaultMsg,
      duration: 4000 
    });
  }
}));

export default useToastStore;
