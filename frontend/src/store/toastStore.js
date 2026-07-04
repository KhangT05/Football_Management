import { create } from 'zustand';

const MAX_TOASTS = 5; // Giới hạn toast tối đa → ngăn stack overflow khi lỗi liên tiếp
let _toastId = 0;
const _timeoutMap = new Map(); // Lưu timeout reference để cleanup khi remove sớm

/**
 * Chuẩn hoá error thành { message, title?, details?, duration } từ 2 dạng response:
 *  - custom API wrapper: { status: false, code, message, data }
 *  - generic REST error: { message }
 *  - network/timeout error: không có response body → dùng err.message hoặc defaultMsg
 *
 * Đây là nguồn duy nhất xử lý format lỗi — mọi nơi cần hiển thị lỗi API
 * (store action hoặc hook) đều gọi qua đây, tránh 2 nơi parse khác nhau.
 */
export function extractApiError(error, defaultMsg = 'Đã có lỗi xảy ra') {
  const res = error?.response?.data;

  if (res && res.status === false) {
    return {
      title: res.code ? `Lỗi: ${res.code}` : 'Thất bại',
      message: res.message || defaultMsg,
      details: res.data,
      duration: res.data ? 6000 : 4000, // Hiển thị lâu hơn nếu có details
    };
  }

  if (res?.message) {
    return { message: res.message, duration: 4000 };
  }

  // Lỗi chung (network, timeout, CORS...) — không có response body
  return { message: error?.message || defaultMsg, duration: 4000 };
}

const useToastStore = create((set, get) => ({
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
        const tid = _timeoutMap.get(removed.id);
        if (tid) {
          clearTimeout(tid);
          _timeoutMap.delete(removed.id);
        }
      }

      return { toasts };
    });

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
    const tid = _timeoutMap.get(id);
    if (tid) {
      clearTimeout(tid);
      _timeoutMap.delete(id);
    }
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Shorthand helpers — dùng get() thay vì useToastStore.getState() để tránh
  // phụ thuộc vào biến ngoài scope closure của create()
  success: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return get().addToast({ message, type: 'success', ...opts });
  },

  error: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return get().addToast({ message, type: 'error', ...opts });
  },

  info: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return get().addToast({ message, type: 'info', ...opts });
  },

  warning: (message, options) => {
    const opts = typeof options === 'number' ? { duration: options } : (options || {});
    return get().addToast({ message, type: 'warning', ...opts });
  },

  /**
   * Parse lỗi từ API response (qua extractApiError) và hiển thị toast đầy đủ thông tin.
   */
  apiError: (err, defaultMsg = 'Đã có lỗi xảy ra') => {
    const parsed = extractApiError(err, defaultMsg);
    return get().addToast({ type: 'error', ...parsed });
  },
}));

/**
 * Hook dùng chung cho mọi mutation onError — 1 nguồn xử lý duy nhất thay vì
 * lặp lại logic parse error ở từng component.
 *
 * Lấy action qua getState() thay vì subscribe toàn bộ store (useToastStore()),
 * vì action là stable reference — subscribe cả store sẽ khiến component dùng
 * hook này re-render mỗi khi `toasts` array đổi ở bất kỳ đâu trong app.
 */
export function useApiErrorToast() {
  return (err, fallback) => useToastStore.getState().apiError(err, fallback);
}

export default useToastStore;