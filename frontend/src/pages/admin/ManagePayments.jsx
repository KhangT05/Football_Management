import { useState, useEffect } from 'react';
import { CreditCard, Search, Loader2, CheckCircle, XCircle, AlertTriangle, Calendar, User, ArrowRight } from 'lucide-react';
import { paymentApi } from '../../../api';
import useToastStore from '../../../store/toastStore';
import Pagination from '../../../components/ui/Pagination';

const STATUS_LABELS = {
    pending: { label: 'Chờ duyệt', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle },
    success: { label: 'Đã thanh toán', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', icon: CheckCircle },
    failed: { label: 'Thất bại', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30', icon: XCircle },
    refunded: { label: 'Hoàn tiền', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: XCircle },
};

export default function ManagePayments() {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isProcessing, setIsProcessing] = useState(null); // id of payment being processed
    const toast = useToastStore();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            // Lấy toàn bộ giao dịch, nếu api có phân trang thì sẽ cần chỉnh
            const res = await paymentApi.getPayments({ per_page: 1000 });
            const payload = typeof res?.status === 'boolean' ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
            setPayments(Array.isArray(payload) ? payload : []);
        } catch (err) {
            console.error('Lỗi khi tải danh sách thanh toán:', err);
            toast.error('Không thể tải danh sách thanh toán');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn XÁC NHẬN khoản thanh toán này?')) return;
        setIsProcessing(id);
        try {
            await paymentApi.confirmPayment(id, { status: 'success' });
            toast.success('Đã xác nhận thanh toán thành công');
            fetchPayments();
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
        } finally {
            setIsProcessing(null);
        }
    };

    const handleRefund = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn TỪ CHỐI / HOÀN TIỀN khoản thanh toán này?')) return;
        setIsProcessing(id);
        try {
            await paymentApi.refundPayment(id, { reason: 'Admin rejected' });
            toast.success('Đã hoàn tiền/từ chối thanh toán');
            fetchPayments();
        } catch (err) {
            console.error(err);
            toast.error('Có lỗi xảy ra khi hoàn tiền');
        } finally {
            setIsProcessing(null);
        }
    };

    const filteredPayments = payments.filter(p => {
        const matchSearch = p.transaction_ref?.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                            p.team?.name?.toLowerCase().includes(debouncedQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
    const safePage = Math.min(currentPage, totalPages);
    const paginatedPayments = filteredPayments.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">Xác Nhận Thanh Toán</h2>
                <p className="text-gray-400 mt-1">Quản lý và xét duyệt các khoản thanh toán từ các đội bóng tham gia.</p>
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
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full sm:w-48 bg-navy-dark border border-navy-light rounded-xl text-white px-4 py-2.5 focus:outline-none focus:border-blue-500 text-sm font-medium"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="success">Đã thanh toán</option>
                    <option value="failed">Thất bại</option>
                    <option value="refunded">Đã hoàn tiền</option>
                </select>
            </div>

            {/* List */}
            <div className="bg-navy-dark border border-navy-light rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap">
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
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span className="text-sm font-semibold text-gray-300">
                                                        {p.team?.name || p.season_team?.team?.name || 'Đội vô danh'}
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
                                                            onClick={() => handleRefund(p.id)}
                                                            disabled={isProcessing === p.id}
                                                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                                                        >
                                                            Từ chối
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
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                </div>
            )}
        </div>
    );
}
