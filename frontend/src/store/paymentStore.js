import { create } from 'zustand';
import { paymentApi } from '../api';
import useToastStore from './toastStore';
import { getFriendlyErrorMessage } from '../utils/errorHelper';

const CACHE_TTL_MS = 60_000;

function parseListPaymentsResponse(res) {
  const candidates = [res, res?.data, res?.data?.data];

  for (const c of candidates) {
    if (c && Array.isArray(c.data) && typeof c.total === 'number') {
      return { data: c.data, total: c.total };
    }
  }
  for (const c of candidates) {
    if (c && Array.isArray(c.data)) {
      return { data: c.data, total: c.data.length };
    }
  }
  for (const c of candidates) {
    if (Array.isArray(c)) {
      return { data: c, total: c.length };
    }
  }
  return { data: [], total: 0 };
}

const usePaymentStore = create((set, get) => ({
  payments: [],
  totalCount: 0,
  page: 1,
  limit: 25,
  isLoading: false,
  error: null,
  fetchedAt: null,
  isProcessing: null,

  // Nội bộ: dùng để (1) chống race condition giữa các request chồng chéo,
  // (2) đưa filters vào cache-key thay vì chỉ page/limit.
  _requestId: 0,
  _lastFilterKey: null,

  // FIX #1 (nghiêm trọng nhất — silent stale overwrite):
  // Bản cũ có `if (state.isLoading) return;` chạy VÔ ĐIỀU KIỆN, kể cả khi
  // force=true. Kịch bản lỗi: user bấm tab "pending" -> request A bay đi
  // (status=pending). Trước khi A resolve, user bấm sang tab "history" ->
  // effect gọi fetchPayments({force:true, filters:{status:'confirmed'}})
  // nhưng bị DROP vì isLoading vẫn true (không có force check, không có
  // queue/cancel). Khi A resolve sau đó, nó ghi đè state bằng data của
  // status=pending, trong khi UI đang hiển thị tab "history" -> danh sách
  // sai trạng thái, không có lỗi nào được ném ra, rất khó repro qua test tay
  // (chỉ lộ khi latency đủ lớn / thao tác nhanh) -> support ticket "data sai"
  // khó debug trong production.
  //
  // Fix: bỏ hard-drop theo isLoading. Thay vào đó mỗi lần gọi tăng
  // _requestId, chỉ commit response nếu request đó vẫn là request mới nhất
  // tại thời điểm resolve (out-of-order response bị bỏ qua thay vì đè state).
  //
  // FIX #2 (cache theo filters, không chỉ page/limit):
  // Bản cũ so sánh cache chỉ theo page/limit, không có status trong key ->
  // nếu có chỗ nào gọi fetchPayments không kèm force=true mà đổi status,
  // sẽ trả nhầm cache của status cũ. Giờ filterKey (JSON của filters) nằm
  // trong điều kiện cache-hit.
  fetchPayments: async ({ force = false, page, limit, filters = {} } = {}) => {
    const state = get();
    const targetPage = page ?? state.page;
    const targetLimit = limit ?? state.limit;
    const filterKey = JSON.stringify(filters);

    const isCacheHit = !force
      && state.fetchedAt
      && Date.now() - state.fetchedAt < CACHE_TTL_MS
      && targetPage === state.page
      && targetLimit === state.limit
      && filterKey === state._lastFilterKey;

    if (isCacheHit) return;

    const requestId = state._requestId + 1;
    set({ isLoading: true, error: null, _requestId: requestId });

    try {
      const res = await paymentApi.getPayments({ ...filters, page: targetPage, limit: targetLimit });
      const { data, total } = parseListPaymentsResponse(res);

      // Bỏ qua nếu đã có request mới hơn bay ra sau lần gọi này (out-of-order
      // response) — tránh ghi đè state bằng data đã cũ so với intent hiện tại.
      if (get()._requestId !== requestId) return;

      set({
        payments: data,
        totalCount: total,
        page: targetPage,
        limit: targetLimit,
        isLoading: false,
        fetchedAt: Date.now(),
        _lastFilterKey: filterKey,
      });
    } catch (err) {
      if (get()._requestId !== requestId) return; // response cũ bị supersede, không set error nhầm lên request mới

      console.error('Lỗi khi tải danh sách thanh toán:', err);
      const message = getFriendlyErrorMessage(err, 'Không thể tải danh sách thanh toán');
      set({ error: message, isLoading: false });
      useToastStore.getState().error(message);
    }
  },

  // FIX #3: setPage/setLimit bản cũ gọi fetchPayments({force:true, page})
  // KHÔNG kèm filters -> default về {} -> mất filter status đang active,
  // fetch toàn bộ payments thay vì giữ đúng tab/status hiện tại. Component
  // ManagePayments.jsx hiện không gọi 2 action này (dùng useEffect riêng
  // theo paymentFilters của adminUIStore) nên bug đang "ngủ" — nhưng vẫn là
  // time-bomb nếu chỗ khác trong codebase gọi tới. Giờ parse lại filters từ
  // _lastFilterKey để giữ nguyên ngữ cảnh filter đang xem.
  setPage: (page) => {
    const filters = get()._lastFilterKey ? JSON.parse(get()._lastFilterKey) : {};
    return get().fetchPayments({ force: true, page, filters });
  },
  setLimit: (limit) => {
    const filters = get()._lastFilterKey ? JSON.parse(get()._lastFilterKey) : {};
    return get().fetchPayments({ force: true, page: 1, limit, filters });
  },

  // FIX #4: bỏ toast success/error trong confirmManual — component
  // (ManagePayments.jsx) đã tự gọi toast.success/error dựa trên return
  // value, nên giữ cả 2 nơi sẽ hiện DUP toast (đôi khi nội dung khác nhau:
  // 1 generic từ component, 1 message cụ thể từ AppError ở đây). Store chỉ
  // còn nhiệm vụ update state + return true/false, UI feedback là trách
  // nhiệm của caller — đúng với comment gốc ở đầu file component
  // (getFriendlyErrorMessage được xử lý ở tầng gọi).
  confirmManual: async (id, note) => {
    set({ isProcessing: id });
    try {
      await paymentApi.confirmManual(id, note ? { note } : {});
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p),
        isProcessing: null,
      }));
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      // Ném lại lỗi để caller lấy đúng message cụ thể (CONFLICT message từ BE)
      // thay vì chỉ nhận boolean rồi hiện generic message như trước.
      throw err;
    }
  },

  refundPayment: async (id, overrides = {}) => {
    const payment = get().payments.find(p => p.id === id);
    const amount = overrides.amount ?? payment?.amount;
    const type = overrides.type ?? 'full';
    const reason = overrides.reason ?? '';

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      throw new Error('Không xác định được số tiền hoàn — vui lòng thử lại');
    }
    if (!reason.trim()) {
      throw new Error('Vui lòng nhập lý do hoàn tiền');
    }

    set({ isProcessing: id });
    try {
      await paymentApi.refundPayment(id, { amount: Number(amount), reason: reason.trim(), type });
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'refunded' } : p),
        isProcessing: null,
      }));
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      throw err;
    }
  },

  queryTransaction: async (id) => {
    set({ isProcessing: id });
    try {
      const res = await paymentApi.queryTransaction(id);
      const result = res?.data ?? res;
      if (result?.vnp_TransactionStatus === '00') {
        set(state => ({
          payments: state.payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p),
        }));
        useToastStore.getState().success('Đối soát thành công — giao dịch đã được xác nhận');
      } else {
        useToastStore.getState().success(`Đối soát xong — trạng thái VNPay: ${result?.vnp_TransactionStatus ?? 'không xác định'}`);
      }
      set({ isProcessing: null });
      return result;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      useToastStore.getState().error(getFriendlyErrorMessage(err, 'Không thể đối soát giao dịch'));
      return null;
    }
  },

  invalidate: () => set({ fetchedAt: null }),
}));

export default usePaymentStore;