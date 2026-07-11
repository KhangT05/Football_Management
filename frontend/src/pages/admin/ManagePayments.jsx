import { useEffect, useCallback } from 'react';
import { CreditCard, Search, Loader2, CheckCircle, XCircle, AlertTriangle, Calendar, User, ArrowRight } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import AdminLayout from '../../layouts/AdminLayout';
import Pagination from '../../components/ui/Pagination';
import useToastStore from '../../store/toastStore';
import usePaymentStore from '../../store/paymentStore';
import useAdminUIStore from '../../store/adminUIStore';
import { useDebouncedValue } from '../../hooks';
import { STATUS_LABELS } from '../../data/data';

export default function ManagePayments() {
    const toast = useToastStore();

    // Zustand Payment Store
    const { 
        payments, 
        isLoading, 
        isProcessing, 
        fetchPayments, 
        confirmManual, 
        rejectPayment, 
        refundPayment 
    } = usePaymentStore(useShallow(state => ({
        payments: state.payments,
        isLoading: state.isLoading,
        isProcessing: state.isProcessing,
        fetchPayments: state.fetchPayments,
        confirmManual: state.confirmManual,
        rejectPayment: state.rejectPayment,
        refundPayment: state.refundPayment
    })));

    // Zustand UI Store (Filters & Pagination)
    const { paymentFilters, setPaymentFilters } = useAdminUIStore(useShallow(state => ({
        paymentFilters: state.paymentFilters,
        setPaymentFilters: state.setPaymentFilters
    })));
    const { search: searchQuery, page: currentPage, limit: itemsPerPage, activeTab, status: statusFilter } = paymentFilters;

    const setSearchQuery = useCallback((val) => setPaymentFilters({ search: typeof val === 'function' ? val(searchQuery) : val }), [searchQuery, setPaymentFilters]);
    const setCurrentPage = useCallback((val) => setPaymentFilters({ page: typeof val === 'function' ? val(currentPage) : val }), [currentPage, setPaymentFilters]);
    const setItemsPerPage = useCallback((val) => setPaymentFilters({ limit: val, page: 1 }), [setPaymentFilters]);
    const setActiveTab = useCallback((tab) => setPaymentFilters({ activeTab: tab, page: 1, status: 'all' }), [setPaymentFilters]);
    const setStatusFilter = useCallback((status) => setPaymentFilters({ status, page: 1 }), [setPaymentFilters]);

    // Debounce search query
    const debouncedQuery = useDebouncedValue(searchQuery, 400);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedQuery, setCurrentPage]);

    // Fetch payments on mount
    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleConfirm = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn XÁC NHẬN khoản thanh toán này?')) return;
        const success = await confirmManual(id);
        if (success) {
            toast.success('Đã xác nhận thanh toán thành công');
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Nhập lý do từ chối giao dịch này:');
        if (reason === null) return; // user cancelled

        const success = await rejectPayment(id, reason || 'Admin từ chối');
        if (success) {
            toast.success('Đã từ chối giao dịch');
        }
    };

    const handleRefund = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn HOÀN TIỀN khoản thanh toán này?')) return;
        const success = await refundPayment(id);
        if (success) {
            toast.success('Đã hoàn tiền');
        }
    };

    // Filter logic
    const filteredPayments = payments.filter(p => {
        const matchSearch = p.transaction_ref?.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                            p.team?.name?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                            p.season_team?.team?.name?.toLowerCase().includes(debouncedQuery.toLowerCase());
                            
        let matchTab = true;
        if (activeTab === 'pending') {
            matchTab = p.status === 'pending';
        } else {
            matchTab = p.status !== 'pending';
        }

        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchTab && matchStatus;
    });

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const paginatedPayments = filteredPayments.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

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
                            placeholder="Tìm theo mã giao dịch hoặc tên đội..."
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
                            <option value="all">Tất cả trạng thái</option>
                            <option value="success">Đã thanh toán</option>
                            <option value="confirmed">Đã xác nhận</option>
                            <option value="failed">Thất bại</option>
                            <option value="refunded">Đã hoàn tiền</option>
                            <option value="rejected">Đã từ chối</option>
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
                                ) : paginatedPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-gray-500">
                                            <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>Không tìm thấy giao dịch nào</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedPayments.map((p) => {
                                        const StatusIcon = STATUS_LABELS[p.status]?.icon || AlertTriangle;
                                        const statusLabel = STATUS_LABELS[p.status] || STATUS_LABELS.pending;
                                        
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
                                                            <button
                                                                onClick={() => handleReject(p.id)}
                                                                disabled={isProcessing === p.id}
                                                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </div>
                                                    )}
                                                    {(p.status === 'success' || p.status === 'confirmed') && (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => handleRefund(p.id)}
                                                                disabled={isProcessing === p.id}
                                                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                            >
                                                                Hoàn tiền
                                                            </button>
                                                        </div>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
