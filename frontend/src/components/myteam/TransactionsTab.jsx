import { useState, useEffect } from 'react';
import { CreditCard, Loader2, Calendar, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { paymentApi } from '../../api';

const STATUS_LABELS = {
    pending: { label: 'Đang xử lý', className: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
    success: { label: 'Thành công', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' },
    failed: { label: 'Thất bại', className: 'bg-red-500/10 text-red-500 border-red-500/30' },
    refunded: { label: 'Hoàn tiền', className: 'bg-purple-500/10 text-purple-500 border-purple-500/30' },
};

export default function TransactionsTab({ teamId }) {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchTransactions = async () => {
            if (!teamId) return;
            setIsLoading(true);
            try {
                // Chúng ta dùng getPayments và lọc theo season_team_id hoặc team_id tùy backend
                // Hoặc giả lập mock data nếu backend chưa fully support search theo teamId
                const res = await paymentApi.getPayments({ team_id: teamId, per_page: 50 });
                const payload = typeof res?.status === 'boolean' ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
                
                if (mounted) {
                    setTransactions(Array.isArray(payload) ? payload : []);
                }
            } catch (err) {
                console.error('Lỗi khi tải lịch sử giao dịch:', err);
                if (mounted) setTransactions([]);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        fetchTransactions();
        return () => { mounted = false; };
    }, [teamId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-navy/30 rounded-3xl border border-navy-light">
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400 font-medium">Đang tải dữ liệu giao dịch...</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-16 bg-navy/30 border border-dashed border-navy-light rounded-3xl animate-fade-in">
                <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">Chưa có giao dịch nào</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto">
                    Đội của bạn hiện chưa có lịch sử thanh toán hay giao dịch nào được ghi nhận trên hệ thống.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {transactions.map((tx) => {
                const statusInfo = STATUS_LABELS[tx.status] || STATUS_LABELS.pending;
                
                return (
                    <div key={tx.id} className="bg-navy/50 border border-navy-light rounded-3xl p-5 hover:border-blue-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-lg font-black text-white truncate">
                                    Thanh toán đăng ký mùa giải
                                </p>
                                <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-gray-400 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(tx.created_at).toLocaleString('vi-VN')}
                                    </span>
                                    <span className="hidden sm:inline text-gray-600">•</span>
                                    <span>Mã GD: <span className="text-gray-300">{tx.transaction_ref || `#${tx.id}`}</span></span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t border-navy-light sm:border-t-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                            <span className="text-xl font-black text-emerald-400 tabular-nums">
                                {Number(tx.amount || 0).toLocaleString('vi-VN')} ₫
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${statusInfo.className}`}>
                                {statusInfo.label}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
