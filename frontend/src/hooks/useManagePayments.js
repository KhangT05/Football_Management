import { useState, useMemo, useEffect } from 'react';
import usePaymentStore from '../store/paymentStore';
import useSeasonStore from '../store/seasonStore';
import useToastStore from '../store/toastStore';
import { seasonTeamApi } from '../api';

/**
 * ============================================================
 * Hình thức thanh toán (payment method)
 * ============================================================
 * Backend hiện chưa có field chuẩn cho "hình thức thanh toán".
 * Hàm resolvePaymentMethod() cố gắng suy luận từ các field khả dĩ:
 *   - payment.payment_method / payment.method / payment.gateway (nếu backend trả về)
 *   - payment.vnp_transaction_no (dấu hiệu giao dịch qua VNPay)
 *   - transaction_ref có tiền tố "VNP"
 * Nếu backend bổ sung field `payment_method` ('vnpay' | 'manual') thì
 * hàm này sẽ tự động dùng đúng giá trị đó, không cần sửa lại chỗ khác.
 * ============================================================
 */
export const PAYMENT_METHOD_LABELS = {
    vnpay: {
        label: 'VNPay (Online)',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
    },
    manual: {
        label: 'Thủ công / Chuyển khoản',
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
    },
};

export function resolvePaymentMethod(payment) {
    if (!payment) return 'manual';
    const raw = (payment.payment_method || payment.method || payment.gateway || '')
        .toString()
        .toLowerCase();
    if (raw.includes('vnpay')) return 'vnpay';
    if (raw) return raw;
    if (payment.vnp_transaction_no || payment.transaction_ref?.toUpperCase?.().startsWith('VNP')) {
        return 'vnpay';
    }
    return 'manual';
}

export function useManagePayments() {
    const toast = useToastStore();

    // Zustand stores
    const { payments, isLoading: isLoadingPayments, fetchPayments, confirmManual, refundPayment, isProcessing } = usePaymentStore();
    const { seasons, fetchAll: fetchSeasons } = useSeasonStore();

    // Local state for fetching season teams
    const [seasonTeams, setSeasonTeams] = useState([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);

    const [activeTab, setActiveTab] = useState('status');

    // Filters & Pagination - Transactions
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState(''); // 'vnpay' | 'manual'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filters & Pagination - Status
    const [statusSearchQuery, setStatusSearchQuery] = useState('');
    const [debouncedStatusQuery, setDebouncedStatusQuery] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState(''); // 'paid', 'unpaid', 'pending'
    const [statusCurrentPage, setStatusCurrentPage] = useState(1);
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(() => {
        fetchSeasons({ per_page: 100, sort: 'id', direction: 'desc' });
        fetchPayments();

        // Fetch all season teams
        const fetchAllTeams = async () => {
            setIsLoadingTeams(true);
            try {
                const res = await seasonTeamApi.getAll({ per_page: 5000 });
                const payload = typeof res?.status === 'boolean' ? res.data?.data || res.data : res?.data?.data || res?.data || res || [];
                setSeasonTeams(Array.isArray(payload) ? payload : []);
            } catch (err) {
                console.error(err);
                toast.error('Không thể tải danh sách đội tham gia');
            } finally {
                setIsLoadingTeams(false);
            }
        };
        fetchAllTeams();
    }, [fetchSeasons, fetchPayments, toast]);

    useEffect(() => {
        if (seasons.length > 0 && !selectedSeason) {
            // Default to latest season if available
            const latest = seasons.find(s => s.status === 'registration_open' || s.status === 'ongoing') || seasons[0];
            setSelectedSeason(latest.id.toString());
        }
    }, [seasons, selectedSeason]);

    // Debounce searches
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedStatusQuery(statusSearchQuery);
            setStatusCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [statusSearchQuery]);

    // --- Map: season_team_id -> [payment ids đã THÀNH CÔNG] ---
    // Dùng để phát hiện giao dịch trùng: nếu 1 đội đã có giao dịch
    // thành công mà admin lại chuẩn bị duyệt thêm 1 giao dịch pending khác
    // của cùng đội đó, hệ thống sẽ cảnh báo trước khi cho duyệt.
    const teamSuccessPaymentMap = useMemo(() => {
        const map = new Map();
        payments.forEach(p => {
            if (p.status === 'success' || p.status === 'confirmed') {
                const key = String(p.season_team_id);
                if (!map.has(key)) map.set(key, []);
                map.get(key).push(p.id);
            }
        });
        return map;
    }, [payments]);

    const handleConfirm = async (id) => {
        const payment = payments.find(p => p.id === id);
        const successIdsForTeam = payment ? (teamSuccessPaymentMap.get(String(payment.season_team_id)) || []) : [];
        const otherSuccessId = successIdsForTeam.find(pid => pid !== id);

        const confirmMessage = otherSuccessId
            ? `⚠️ CẢNH BÁO TRÙNG GIAO DỊCH\n\nĐội "${payment?.team_name || 'này'}" đã có 1 giao dịch THÀNH CÔNG khác (mã #${otherSuccessId}).\n\nBạn có chắc chắn vẫn muốn XÁC NHẬN thêm giao dịch #${payment?.transaction_ref || id} này không?`
            : 'Bạn có chắc chắn muốn XÁC NHẬN khoản thanh toán này?';

        if (!window.confirm(confirmMessage)) return;
        const success = await confirmManual(id);
        if (success) {
            toast.success('Đã xác nhận thanh toán thành công');
        } else {
            toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
        }
    };

    const handleReject = async (id) => {
        const reason = window.prompt('Nhập lý do từ chối giao dịch:');
        if (reason === null) return; // User cancelled
        const success = await rejectPayment(id, reason || 'Admin từ chối');
        if (success) {
            toast.success('Đã từ chối giao dịch');
        } else {
            toast.error('Có lỗi xảy ra khi từ chối');
        }
    };

    const handleRefund = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn HOÀN TIỀN khoản thanh toán này?')) return;
        const success = await refundPayment(id);
        if (success) {
            toast.success('Đã hoàn tiền');
        } else {
            toast.error('Có lỗi xảy ra khi hoàn tiền');
        }
    };

    // --- Transactions Tab Logic ---
    const filteredPayments = useMemo(() => {
        return payments
            .filter(p => {
                const matchSearch = p.transaction_ref?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                    p.team_name?.toLowerCase().includes(debouncedQuery.toLowerCase());
                const matchStatus = !statusFilter || p.status === statusFilter;
                const matchMethod = !methodFilter || resolvePaymentMethod(p) === methodFilter;
                return matchSearch && matchStatus && matchMethod;
            })
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(p => {
                const successIdsForTeam = teamSuccessPaymentMap.get(String(p.season_team_id)) || [];
                return {
                    ...p,
                    paymentMethod: resolvePaymentMethod(p),
                    // Cờ báo: giao dịch đang pending nhưng đội đã có 1 giao dịch thành công khác
                    hasConfirmedElsewhere: p.status === 'pending' && successIdsForTeam.some(pid => pid !== p.id),
                };
            });
    }, [payments, debouncedQuery, statusFilter, methodFilter, teamSuccessPaymentMap]);

    const totalTransactionPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
    const safeTxPage = Math.min(currentPage, totalTransactionPages);
    const paginatedPayments = filteredPayments.slice((safeTxPage - 1) * itemsPerPage, safeTxPage * itemsPerPage);

    // --- Status Tab Logic ---
    const teamPaymentStatusList = useMemo(() => {
        let teamsInSeason = seasonTeams;
        if (selectedSeason) {
            teamsInSeason = teamsInSeason.filter(st => String(st.season_id) === String(selectedSeason));
        }

        return teamsInSeason.map(st => {
            // Find all payments for this season_team
            const teamPayments = payments.filter(p => String(p.season_team_id) === String(st.id));

            let status = 'unpaid';
            if (teamPayments.some(p => p.status === 'success' || p.status === 'confirmed')) {
                status = 'paid';
            } else if (teamPayments.some(p => p.status === 'pending')) {
                status = 'pending';
            }

            const latestPayment = [...teamPayments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0] || null;

            return {
                ...st,
                paymentStatus: status,
                payments: teamPayments,
                latestPayment,
                latestPaymentMethod: latestPayment ? resolvePaymentMethod(latestPayment) : null,
            };
        });
    }, [seasonTeams, payments, selectedSeason]);

    const filteredTeamStatus = useMemo(() => {
        return teamPaymentStatusList.filter(ts => {
            const matchSearch = ts.team?.name?.toLowerCase().includes(debouncedStatusQuery.toLowerCase());
            const matchStatus = !paymentStatusFilter || ts.paymentStatus === paymentStatusFilter;
            return matchSearch && matchStatus;
        });
    }, [teamPaymentStatusList, debouncedStatusQuery, paymentStatusFilter]);

    const totalStatusPages = Math.ceil(filteredTeamStatus.length / itemsPerPage) || 1;
    const safeStatusPage = Math.min(statusCurrentPage, totalStatusPages);
    const paginatedTeamStatus = filteredTeamStatus.slice((safeStatusPage - 1) * itemsPerPage, safeStatusPage * itemsPerPage);

    const stats = useMemo(() => {
        return {
            total: teamPaymentStatusList.length,
            paid: teamPaymentStatusList.filter(t => t.paymentStatus === 'paid').length,
            unpaid: teamPaymentStatusList.filter(t => t.paymentStatus === 'unpaid').length,
            pending: teamPaymentStatusList.filter(t => t.paymentStatus === 'pending').length,
        };
    }, [teamPaymentStatusList]);

    return {
        // Shared state
        activeTab, setActiveTab,
        seasons,
        isLoading: isLoadingPayments || isLoadingTeams,
        isProcessing,

        // Actions
        handleConfirm,
        handleRefund,
        handleReject,

        // Transactions filters/pagination
        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        methodFilter, setMethodFilter,
        currentPage: safeTxPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        paginatedPayments,
        totalTransactionPages,

        // Status filters/pagination
        statusSearchQuery, setStatusSearchQuery,
        paymentStatusFilter, setPaymentStatusFilter,
        statusCurrentPage: safeStatusPage, setStatusCurrentPage,
        selectedSeason, setSelectedSeason,
        paginatedTeamStatus,
        totalStatusPages,
        stats
    };
}