import { useState, useMemo, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import usePaymentStore from '../store/paymentStore';
import useSeasonStore from '../store/seasonStore';
import useToastStore from '../store/toastStore';
import { seasonTeamApi } from '../api';

export const PAYMENT_METHOD_LABELS = {
    vnpay: { label: 'VNPay (Online)', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    manual: { label: 'Thủ công / Chuyển khoản', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
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

// CẢNH BÁO KIẾN TRÚC:
// Tab "Trạng thái" tổng hợp paid/unpaid/pending theo TỪNG ĐỘI bằng cách quét
// `payments` client-side. Nhưng payments chỉ fetch được tối đa BACKEND_MAX_LIMIT
// bản ghi (backend clamp). Nếu tổng số giao dịch trong season > giới hạn này,
// những đội có giao dịch success nằm ngoài batch fetch sẽ bị tính SAI trạng thái
// (hiện unpaid/pending dù đã thanh toán). Đây là data-correctness bug tiềm ẩn,
// không phải edge case hiếm — sẽ xảy ra ngay khi giải đấu đủ lớn.
//
// FIX ĐÚNG: cần backend endpoint aggregate theo season_team_id
// (VD GET /season-teams/payment-status?season_id=X), không suy ra từ 1 trang
// payments. Tạm thời set limit cao nhất backend cho phép để giảm rủi ro,
// KHÔNG coi đây là fix triệt để.
const BACKEND_MAX_LIMIT = 100;

export function useManagePayments() {
    const toast = useToastStore();

    const {
        payments,
        totalCount,
        isLoading: isLoadingPayments,
        isProcessing,
        fetchPayments,
        confirmManual,
        refundPayment,
    } = usePaymentStore(useShallow(state => ({
        payments: state.payments,
        totalCount: state.totalCount,
        isLoading: state.isLoading,
        isProcessing: state.isProcessing,
        fetchPayments: state.fetchPayments,
        confirmManual: state.confirmManual,
        refundPayment: state.refundPayment,
    })));

    const { seasons, fetchAll: fetchSeasons } = useSeasonStore(useShallow(state => ({
        seasons: state.seasons,
        fetchAll: state.fetchAll,
    })));

    const [seasonTeams, setSeasonTeams] = useState([]);
    const [isLoadingTeams, setIsLoadingTeams] = useState(true);
    const [activeTab, setActiveTab] = useState('status');

    // Transactions tab
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [methodFilter, setMethodFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Status tab
    const [statusSearchQuery, setStatusSearchQuery] = useState('');
    const [debouncedStatusQuery, setDebouncedStatusQuery] = useState('');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
    const [statusCurrentPage, setStatusCurrentPage] = useState(1);
    const [selectedSeason, setSelectedSeason] = useState('');

    useEffect(() => {
        fetchSeasons({ per_page: 100, sort: 'id', direction: 'desc' });
        // Xem cảnh báo kiến trúc ở đầu file — limit=100 giảm rủi ro nhưng
        // không loại bỏ hoàn toàn bug tổng hợp trạng thái theo đội.
        fetchPayments({ force: true, page: 1, limit: BACKEND_MAX_LIMIT });

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (seasons.length > 0 && !selectedSeason) {
            const latest = seasons.find(s => s.status === 'registration_open' || s.status === 'ongoing') || seasons[0];
            setSelectedSeason(latest.id.toString());
        }
    }, [seasons, selectedSeason]);

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

    // Chỉ 'confirmed' là trạng thái "đã thanh toán thành công" thật trong
    // PaymentStatus enum (pending | confirmed | refund_pending | refunded).
    // Bản cũ có check thêm p.status === 'confirmed' trùng lặp với chính nó
    // qua alias 'success' không tồn tại — đã bỏ nhánh chết đó.
    const teamSuccessPaymentMap = useMemo(() => {
        const map = new Map();
        payments.forEach(p => {
            if (p.status === 'confirmed') {
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
        if (success) toast.success('Đã xác nhận thanh toán thành công');
        else toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
    };

    // handleReject: ĐÃ BỎ — backend không có route/method reject tương ứng.

    const handleRefund = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn HOÀN TIỀN khoản thanh toán này?')) return;
        const success = await refundPayment(id);
        if (success) toast.success('Đã hoàn tiền');
        else toast.error('Có lỗi xảy ra khi hoàn tiền');
    };

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
                    hasConfirmedElsewhere: p.status === 'pending' && successIdsForTeam.some(pid => pid !== p.id),
                };
            });
    }, [payments, debouncedQuery, statusFilter, methodFilter, teamSuccessPaymentMap]);

    // NOTE: totalTransactionPages dựa trên `payments` đã bị giới hạn ở
    // BACKEND_MAX_LIMIT — nếu totalCount (server) > BACKEND_MAX_LIMIT, số
    // trang hiển thị ở đây SAI (thấp hơn thực tế) và giao dịch cũ hơn sẽ
    // không bao giờ hiện ra. Cần chuyển filter này lên server (status/search
    // query param) trước khi ship cho giải đấu quy mô lớn.
    const totalTransactionPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
    const safeTxPage = Math.min(currentPage, totalTransactionPages);
    const paginatedPayments = filteredPayments.slice((safeTxPage - 1) * itemsPerPage, safeTxPage * itemsPerPage);

    const teamPaymentStatusList = useMemo(() => {
        let teamsInSeason = seasonTeams;
        if (selectedSeason) {
            teamsInSeason = teamsInSeason.filter(st => String(st.season_id) === String(selectedSeason));
        }

        return teamsInSeason.map(st => {
            const teamPayments = payments.filter(p => String(p.season_team_id) === String(st.id));

            let status = 'unpaid';
            if (teamPayments.some(p => p.status === 'confirmed')) {
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

    const stats = useMemo(() => ({
        total: teamPaymentStatusList.length,
        paid: teamPaymentStatusList.filter(t => t.paymentStatus === 'paid').length,
        unpaid: teamPaymentStatusList.filter(t => t.paymentStatus === 'unpaid').length,
        pending: teamPaymentStatusList.filter(t => t.paymentStatus === 'pending').length,
    }), [teamPaymentStatusList]);

    return {
        activeTab, setActiveTab,
        seasons,
        isLoading: isLoadingPayments || isLoadingTeams,
        isProcessing,
        totalCount,

        handleConfirm,
        handleRefund,

        searchQuery, setSearchQuery,
        statusFilter, setStatusFilter,
        methodFilter, setMethodFilter,
        currentPage: safeTxPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        paginatedPayments,
        totalTransactionPages,

        statusSearchQuery, setStatusSearchQuery,
        paymentStatusFilter, setPaymentStatusFilter,
        statusCurrentPage: safeStatusPage, setStatusCurrentPage,
        selectedSeason, setSelectedSeason,
        paginatedTeamStatus,
        totalStatusPages,
        stats,
    };
}