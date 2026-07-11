import { create } from 'zustand';
import { paymentApi } from '../api';

const CACHE_TTL_MS = 60_000;

const usePaymentStore = create((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,
  fetchedAt: null,
  isProcessing: null,

  fetchPayments: async ({ force = false } = {}) => {
    const { fetchedAt, isLoading } = get();
    if (isLoading) return;
    if (!force && fetchedAt && Date.now() - fetchedAt < CACHE_TTL_MS) return;

    set({ isLoading: true, error: null });
    try {
      const res = await paymentApi.getPayments({ limit: 5000 });
      const payload = typeof res?.status === 'boolean' ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
      const data = Array.isArray(payload) ? payload : [];
      set({ payments: data, isLoading: false, fetchedAt: Date.now() });
    } catch (err) {
      console.error('Lỗi khi tải danh sách thanh toán:', err);
      set({ error: 'Không thể tải danh sách thanh toán', isLoading: false });
    }
  },

  confirmManual: async (id) => {
    set({ isProcessing: id });
    try {
      await paymentApi.confirmManual(id, { status: 'success' });
      // Update local state instead of refetching everything to be faster
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p),
        isProcessing: null
      }));
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      return false;
    }
  },

  refundPayment: async (id) => {
    set({ isProcessing: id });
    try {
      await paymentApi.refundPayment(id, { reason: 'Admin rejected' });
      // Update local state
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'refunded' } : p),
        isProcessing: null
      }));
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      return false;
    }
  },

  rejectPayment: async (id, reason = 'Admin từ chối') => {
    set({ isProcessing: id });
    try {
      await paymentApi.rejectPayment(id, { reason });
      set(state => ({
        payments: state.payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p),
        isProcessing: null
      }));
      return true;
    } catch (err) {
      console.error(err);
      set({ isProcessing: null });
      return false;
    }
  },

  invalidate: () => set({ fetchedAt: null }),
}));

export default usePaymentStore;
