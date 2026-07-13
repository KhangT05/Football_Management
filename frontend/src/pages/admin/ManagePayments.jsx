import { useEffect, useCallback, useState } from 'react';
import { CreditCard, Search, Loader2, AlertTriangle, Calendar, X } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import AdminLayout from '../../layouts/AdminLayout';
import Pagination from '../../components/ui/Pagination';
import useToastStore from '../../store/toastStore';
import usePaymentStore from '../../store/paymentStore';
import useAdminUIStore from '../../store/adminUIStore';
import { useDebouncedValue } from '../../hooks';
import { STATUS_LABELS } from '../../data/data';
import { getFriendlyErrorMessage } from '../../utils/errorHelper';

// LƯU Ý ENUM: PaymentStatus (Prisma) chỉ có 4 giá trị thật:
//   pending | confirmed | refund_pending | refunded
//
// FIX KIẾN TRÚC (bug chính gây "không lấy được data"):
// Bản cũ chỉ fetchPayments() MỘT LẦN lúc mount (page=1, limit=25, không
// filter status), sau đó mọi thao tác đổi tab/trang/filter chỉ lọc
// client-side trên đúng 25 record tĩnh đó. Backend listPayments() đã hỗ trợ
// filter status + phân trang thật (skip/take + count() riêng) nhưng FE
// không dùng tới → tab "chờ duyệt" rỗng bất cứ khi nào 25 bản ghi mới nhất
// không có cái nào pending, dù DB có nhiều pending ở trang sau.
//
// Giờ mỗi khi đổi tab / status filter / trang đều gọi lại fetchPayments()
// với filters.status tương ứng + page/limit thật, và dùng totalCount từ
// server để phân trang.
//
// GIỚI HẠN CÒN LẠI: backend listPayments() KHÔNG có tham số search theo
// transaction_ref/tên đội — ô tìm kiếm dưới đây chỉ lọc được trong các bản
// ghi đã tải về của TRANG HIỆN TẠI, không search toàn bộ DB. Cần thêm
// search/q param ở backend nếu muốn search toàn hệ thống.
//
// FIX (refund):
// Backend refundPayment() giờ BẮT BUỘC { amount, reason, type: 'full'|'partial' }
// và validate tường minh (amount phải là số hữu hạn > 0, reason không rỗng,
// type phải đúng 'full'/'partial', full phải bằng đúng amount đã thanh toán).
// Modal nhập amount/type/reason trước khi gọi refund, khớp đúng input mà
// service yêu cầu.
//
// FIX MỚI (đồng bộ với paymentStore đã sửa):
// confirmManual/refundPayment trong store giờ THROW lỗi thay vì return
// false — để component lấy được đúng message cụ thể từ AppError backend
// (qua getFriendlyErrorMessage) thay vì generic message cứng. Store KHÔNG
// còn tự gọi toast cho 2 action này nữa (tránh double toast: 1 generic từ
// component + 1 message cụ thể từ store như bản cũ) — component là nơi
// DUY NHẤT quyết định hiển thị feedback (toast hoặc inline error trong modal).

const REFUND_REASON_MAX = 500;

export default function ManagePayments() {
    const toast = useToastStore();

    const {
        payments,
        totalCount,
        isLoading,
        isProcessing,
        fetchPayments,
        confirmManual,
        refundPayment
    } = usePaymentStore(useShallow(state => ({
        payments: state.payments,
        totalCount: state.totalCount,
        isLoading: state.isLoading,
        isProcessing: state.isProcessing,
        fetchPayments: state.fetchPayments,
        confirmManual: state.confirmManual,
        refundPayment: state.refundPayment
    })));

    const { paymentFilters, setPaymentFilters } = useAdminUIStore(useShallow(state => ({
        paymentFilters: state.paymentFilters,
        setPaymentFilters: state.setPaymentFilters
    })));
    const { search: searchQuery, page: currentPage, limit: itemsPerPage, activeTab, status: statusFilter } = paymentFilters;

    const setSearchQuery = useCallback((val) => setPaymentFilters({ search: typeof val === 'function' ? val(searchQuery) : val }), [searchQuery, setPaymentFilters]);
    const setCurrentPage = useCallback((val) => setPaymentFilters({ page: typeof val === 'function' ? val(currentPage) : val }), [currentPage, setPaymentFilters]);
    const setItemsPerPage = useCallback((val) => setPaymentFilters({ limit: val, page: 1 }), [setPaymentFilters]);
    // Tab "pending" luôn filter cứng status=pending ở server.
    // Tab "history": mặc định về status 'confirmed' (không dùng 'all' vì
    // backend không hỗ trợ "khác pending" — chỉ match đúng 1 status).
    const setActiveTab = useCallback((tab) => setPaymentFilters({
        activeTab: tab,
        page: 1,
        status: tab === 'pending' ? 'pending' : 'confirmed',
    }), [setPaymentFilters]);
    const setStatusFilter = useCallback((status) => setPaymentFilters({ status, page: 1 }), [setPaymentFilters]);

    const debouncedQuery = useDebouncedValue(searchQuery, 400);

    // Modal refund — thu thập amount/reason/type trước khi gọi API, khớp
    // đúng RefundPaymentInput mà backend yêu cầu (xem comment đầu file).
    const [refundModal, setRefundModal] = useState({ open: false, payment: null, amount: '', type: 'full', reason: '' });
    const [refundError, setRefundError] = useState('');

    // Fetch lại từ server mỗi khi tab / status filter / trang / limit đổi.
    // Đây là điểm sửa chính: trước đây chỉ fetch 1 lần, giờ luôn đồng bộ
    // với backend theo đúng status + page đang chọn.
    useEffect(() => {
        const effectiveStatus = activeTab === 'pending' ? 'pending' : (statusFilter || 'confirmed');
        fetchPayments({
            force: true,
            page: currentPage,
            limit: itemsPerPage,
            filters: { status: effectiveStatus },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, statusFilter, currentPage, itemsPerPage]);

    const refetchCurrent = () => fetchPayments({
        force: true,
        page: currentPage,
        limit: itemsPerPage,
        filters: { status: activeTab === 'pending' ? 'pending' : statusFilter },
    });

    // FIX: confirmManual giờ throw thay vì return boolean — bỏ nhánh
    // `else { toast.error(generic) }` (dead code / gây double message với
    // catch bên dưới). Mọi lỗi API giờ đi qua đúng 1 đường: catch ->
    // getFriendlyErrorMessage -> toast, lấy đúng message cụ thể từ BE
    // (vd "Chỉ confirm được payment đang pending...") thay vì câu chung chung.
    const handleConfirm = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn XÁC NHẬN khoản thanh toán này?')) return;
        try {
            await confirmManual(id);
            toast.success('Đã xác nhận thanh toán thành công');
            refetchCurrent();
        } catch (err) {
            toast.error(getFriendlyErrorMessage(err, 'Có lỗi xảy ra khi xác nhận thanh toán.'));
        }
    };

    // Mở modal refund thay vì confirm() đơn giản — cần amount/type/reason
    // trước khi gọi API, nếu không backend sẽ reject với lỗi validate.
    const openRefundModal = (payment) => {
        setRefundError('');
        setRefundModal({
            open: true,
            payment,
            amount: String(Number(payment.amount || 0)),
            type: 'full',
            reason: '',
        });
    };

    const closeRefundModal = () => {
        if (isProcessing) return; // đang xử lý thì không cho đóng giữa chừng
        setRefundModal({ open: false, payment: null, amount: '', type: 'full', reason: '' });
        setRefundError('');
    };

    const handleRefundTypeChange = (type) => {
        setRefundModal(prev => ({
            ...prev,
            type,
            // full luôn khoá về đúng số tiền đã thanh toán, khớp validate BE
            amount: type === 'full' ? String(Number(prev.payment?.amount || 0)) : prev.amount,
        }));
    };

    // FIX: refundPayment giờ throw thay vì return boolean — bỏ nhánh
    // `else { setRefundError(generic) }`. Client-side pre-validate (amount
    // dương, không vượt max, full phải bằng đúng amount, reason không rỗng)
    // vẫn giữ nguyên để fail-fast không cần round-trip network; nhưng lỗi
    // từ server (network, business rule khác) giờ hiện đúng message cụ thể
    // qua getFriendlyErrorMessage trong catch, thay vì câu chung chung.
    const submitRefund = async () => {
        const { payment, type, reason } = refundModal;
        const amount = Number(refundModal.amount);

        setRefundError('');

        if (!Number.isFinite(amount) || amount <= 0) {
            setRefundError('Số tiền hoàn phải là số dương');
            return;
        }
        const maxAmount = Number(payment.amount || 0);
        if (amount > maxAmount) {
            setRefundError(`Số tiền hoàn không được vượt quá ${maxAmount.toLocaleString('vi-VN')} ₫`);
            return;
        }
        if (type === 'full' && amount !== maxAmount) {
            setRefundError('Hoàn tiền toàn phần phải bằng đúng số tiền đã thanh toán');
            return;
        }
        if (!reason.trim()) {
            setRefundError('Vui lòng nhập lý do hoàn tiền');
            return;
        }

        try {
            await refundPayment(payment.id, {
                amount,
                type,
                reason: reason.trim(),
            });
            toast.success('Đã hoàn tiền');
            closeRefundModal();
            refetchCurrent();
        } catch (err) {
            setRefundError(getFriendlyErrorMessage(err, 'Có lỗi xảy ra khi hoàn tiền.'));
        }
    };

    // Search: CHỈ lọc trong phạm vi trang hiện tại đã tải về (giới hạn của
    // backend hiện tại — xem cảnh báo đầu file).
    const visiblePayments = payments.filter(p => {
        if (!debouncedQuery) return true;
        const q = debouncedQuery.toLowerCase();
        return p.transaction_ref?.toLowerCase().includes(q) ||
            p.team_name?.toLowerCase().includes(q) ||
            p.season_team?.team?.name?.toLowerCase().includes(q);
    });

    const totalPages = Math.ceil((totalCount || 0) / itemsPerPage) || 1;

    return (
        <AdminLayout>
            <div className="w-full space-y-6 animate-fade-in pb-20">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                        <CreditCard className="w-6 h-6 text-blue-500" /> Quản Lý Thanh Toán
                    </h2>
                    <p className="text-gray-400 mt-1">Quản lý và xét duyệt các khoản thanh toán từ các đội bóng tham gia.</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-navy-light">
                    <button
                        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'border-amber-500 text-amber-400' : 'border-transparent text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Danh sách chờ duyệt
                    </button>
                    <button
                        className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === 'history' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('history')}
                    >
                        Lịch sử giao dịch
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm trong trang hiện tại (mã giao dịch / tên đội)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-navy-dark border border-navy-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>
                    {activeTab === 'history' && (
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full sm:w-48 bg-navy-dark border border-navy-light rounded-xl text-white px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm font-medium"
                        >
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="refund_pending">Đang hoàn tiền</option>
                            <option value="refunded">Đã hoàn tiền</option>
                        </select>
                    )}
                </div>

                {/* List */}
                <div className="bg-navy-dark border border-navy-light rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left whitespace-nowrap min-w-[900px]">
                            <thead>
                                <tr className="bg-navy/50 text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-navy-light">
                                    <th className="py-4 px-6">Giao dịch</th>
                                    <th className="py-4 px-6">Đội bóng</th>
                                    <th className="py-4 px-6 text-right">Số tiền</th>
                                    <th className="py-4 px-6 text-center">Trạng thái</th>
                                    <th className="py-4 px-6 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-light">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                                            <span className="text-gray-400">Đang tải dữ liệu...</span>
                                        </td>
                                    </tr>
                                ) : visiblePayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-500">
                                            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Không tìm thấy giao dịch nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    visiblePayments.map((p) => {
                                        const statusLabel = STATUS_LABELS[p.status] || STATUS_LABELS.pending;
                                        const StatusIcon = statusLabel.icon || AlertTriangle;

                                        return (
                                            <tr key={p.id} className="hover:bg-navy/30 transition-colors group">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${statusLabel.bg} ${statusLabel.border} ${statusLabel.color}`}>
                                                            <CreditCard className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                                                                #{p.transaction_ref || p.id}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(p.created_at).toLocaleString('vi-VN')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-300">
                                                            {p.team?.name || p.season_team?.team?.name || p.team_name || 'Đội vô danh'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <span className="text-sm font-black text-emerald-400 tabular-nums">
                                                        {Number(p.amount || 0).toLocaleString('vi-VN')} ₫
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border ${statusLabel.bg} ${statusLabel.color} ${statusLabel.border}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {statusLabel.label}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {p.status === 'pending' && (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleConfirm(p.id)}
                                                                disabled={isProcessing === p.id}
                                                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                            >
                                                                {isProcessing === p.id ? 'Đang...' : 'Duyệt'}
                                                            </button>
                                                        </div>
                                                    )}
                                                    {p.status === 'confirmed' && (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => openRefundModal(p)}
                                                                disabled={isProcessing === p.id}
                                                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                            >
                                                                Hoàn tiền
                                                            </button>
                                                        </div>
                                                    )}
                                                    {p.status === 'refund_pending' && (
                                                        <span className="text-xs text-amber-400 font-bold inline-flex items-center gap-1">
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            Đang xử lý hoàn tiền...
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination — dùng totalCount THẬT từ server, không đếm trên mảng đã cắt */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>

            {/* Modal hoàn tiền — thu thập amount/type/reason đúng theo
                RefundPaymentInput mà backend yêu cầu, tránh gửi request
                thiếu field khiến BE lọt guard cũ và nổ lỗi khó hiểu. */}
            {refundModal.open && refundModal.payment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-navy-dark border border-navy-light rounded-2xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-light">
                            <h3 className="text-white font-bold text-lg">Hoàn tiền giao dịch</h3>
                            <button
                                onClick={closeRefundModal}
                                disabled={isProcessing === refundModal.payment.id}
                                className="text-gray-400 hover:text-white disabled:opacity-40"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="text-sm text-gray-400">
                                Giao dịch <span className="text-white font-bold">#{refundModal.payment.transaction_ref || refundModal.payment.id}</span> —{' '}
                                <span className="text-emerald-400 font-bold">
                                    {Number(refundModal.payment.amount || 0).toLocaleString('vi-VN')} ₫
                                </span>
                            </div>

                            {/* Loại hoàn tiền */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Loại hoàn tiền
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRefundTypeChange('full')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${refundModal.type === 'full' ? 'bg-blue-500 border-blue-500 text-white' : 'border-navy-light text-gray-400 hover:text-white'}`}
                                    >
                                        Toàn phần
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleRefundTypeChange('partial')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${refundModal.type === 'partial' ? 'bg-blue-500 border-blue-500 text-white' : 'border-navy-light text-gray-400 hover:text-white'}`}
                                    >
                                        Một phần
                                    </button>
                                </div>
                            </div>

                            {/* Số tiền */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Số tiền hoàn (₫)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={Number(refundModal.payment.amount || 0)}
                                    value={refundModal.amount}
                                    disabled={refundModal.type === 'full'}
                                    onChange={(e) => setRefundModal(prev => ({ ...prev, amount: e.target.value }))}
                                    className="w-full bg-navy border border-navy-light rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm disabled:opacity-50"
                                />
                                {refundModal.type === 'full' && (
                                    <p className="text-xs text-gray-500 mt-1">Hoàn toàn phần luôn bằng đúng số tiền đã thanh toán.</p>
                                )}
                            </div>

                            {/* Lý do */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                                    Lý do hoàn tiền
                                </label>
                                <textarea
                                    rows={3}
                                    maxLength={REFUND_REASON_MAX}
                                    value={refundModal.reason}
                                    onChange={(e) => setRefundModal(prev => ({ ...prev, reason: e.target.value }))}
                                    placeholder="VD: Đội rút lui trước giải, hoàn phí đăng ký theo yêu cầu..."
                                    className="w-full bg-navy border border-navy-light rounded-lg text-white px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-right">{refundModal.reason.length}/{REFUND_REASON_MAX}</p>
                            </div>

                            {refundError && (
                                <div className="flex items-start gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                    <span>{refundError}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-light bg-navy/30">
                            <button
                                onClick={closeRefundModal}
                                disabled={isProcessing === refundModal.payment.id}
                                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-all disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={submitRefund}
                                disabled={isProcessing === refundModal.payment.id}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isProcessing === refundModal.payment.id && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isProcessing === refundModal.payment.id ? 'Đang xử lý...' : 'Xác nhận hoàn tiền'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}