import { create } from 'zustand';
import { paymentApi } from '../api';
import useToastStore from './toastStore';
import { getFriendlyErrorMessage } from '../utils/errorHelper';

const CACHE_TTL_MS = 60_000;

const usePaymentStore = create((set, get) => ({
  payments: [],
  totalCount: 0,
  page: 1,
  limit: 25,
  isLoading: false,
  error: null,
  fetchedAt: null,
  isProcessing: null,

  // FIX: bỏ limit=5000 (backend clamp cứng ở 100, giả vờ lấy hết là ảo giác
  // nguy hiểm). Giờ fetch đúng theo page/limit thật, đồng bộ với Pagination
  // component — không còn silent data loss khi >100 record.
  fetchPayments: async ({ force = false, page, limit, filters = {} } = {}) => {
    const state = get();
    const targetPage = page ?? state.page;
    const targetLimit = limit ?? state.limit;

    if (state.isLoading) return;
    if (!force && state.fetchedAt && Date.now() - state.fetchedAt < CACHE_TTL_MS
      && targetPage === state.page && targetLimit === state.limit) return;

    set({ isLoading: true, error: null });
    try {
      const res = await paymentApi.getPayments({ ...filters, page: targetPage, limit: targetLimit });
      const body = res?.data ?? res;
      const data = Array.isArray(body?.data) ? body.data : [];
      const total = typeof body?.total === 'number' ? body.total : data.length;

      set({
        payments: data,
        totalCount: total,
        page: targetPage,
        limit: targetLimit,
        isLoading: false,
        fetchedAt: Date.now(),
      });
    } catch (err) {
      console.error('Lỗi khi tải danh sách thanh toán:', err);
      const message = getFriendlyErrorMessage(err, 'Không thể tải danh sách thanh toán');
      set({ error: message, isLoading: false });
      useToastStore.getState().error(message);
    }
  },

  setPage: (page) => get().fetchPayments({ force: true, page }),
  setLimit: (limit) => get().fetchPayments({ force: true, page: 1, limit }),

  confirmManual: async (id, note) => {
    set({ isProcessing: id });
    try {
      await paymentApi.confirmManual(id, note ? { note } : {});
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p),
        isProcessing: null
      }));
      useToastStore.getState().success('Đã xác nhận thanh toán thành công');
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      useToastStore.getState().error(getFriendlyErrorMessage(err, 'Không thể xác nhận thanh toán'));
      return false;
    }
  },

  refundPayment: async (id, overrides = {}) => {
    const payment = get().payments.find(p => p.id === id);
    const amount = overrides.amount ?? payment?.amount;
    const type = overrides.type ?? 'full';
    const reason = overrides.reason ?? 'Admin rejected';

    if (!amount || amount <= 0) {
      useToastStore.getState().error('Không xác định được số tiền hoàn — vui lòng thử lại');
      return false;
    }

    set({ isProcessing: id });
    try {
      await paymentApi.refundPayment(id, { amount, reason, type });
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'refunded' } : p),
        isProcessing: null
      }));
      useToastStore.getState().success('Đã hoàn tiền thành công');
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      useToastStore.getState().error(getFriendlyErrorMessage(err, 'Không thể hoàn tiền'));
      return false;
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