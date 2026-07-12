import { randomBytes } from 'crypto';
import { PaymentStatus, } from '../generated/prisma/client.js';
import { VnpLocale, VnpCurrCode, ProductCode, VnpTransactionType, dateFormat, getDateInGMT7, } from 'vnpay';
import { createAppError } from '../common/app.error.js';
// ─── Service ──────────────────────────────────────────────────────────────────
// Flow:
//   Leader POST /payments/initiate
//     → lấy registration_fee từ season (qua season_team)
//     → tạo Payment record (pending) hoặc reuse pending còn hạn
//     → buildPaymentUrl (có vnp_ExpireDate) → trả về payment_url
//   Leader redirect → VNPay gateway → quét QR / chuyển khoản
//   VNPay IPN GET /payments/ipn
//     → verifyIpnCall → match transaction_ref → verify amount → confirm (atomic)
//   VNPay return URL → frontend poll hoặc lấy status từ IPN result
//   Admin PATCH /payments/:id/confirm → manual confirm nếu IPN miss
//   Admin GET   /payments/:id/query   → queryDr đối soát khi nghi ngờ IPN miss
//   Admin POST  /payments/:id/refund  → refund khi team rút lui / hoàn phí
//
// NOTE: model Payment không có deleted_at — hard-delete only theo schema hiện
// tại. Mọi lookup theo field unique (id, transaction_ref) dùng findUnique;
// lookup theo season_team_id (không unique, có thể nhiều attempt) dùng findFirst.
//
// NOTE (bank multi-tenant): VNPay instance (constructor) dùng 1 merchant
// (vnp_TmnCode/vnp_HashSecret) DÙNG CHUNG cho toàn hệ thống — sandbox hiện tại
// và production hiện tại đều như vậy. QR chuyển khoản thủ công thì multi theo
// Season.bank_id/bank_account_no/bank_account_name — 2 cơ chế độc lập, không
// trộn logic. Nếu sau này mỗi ban tổ chức cần merchant VNPay riêng, đó là thay
// đổi ở tầng khác (multi VNPay instance theo season), KHÔNG sửa ở đây.
export class PaymentService {
    prisma;
    vnpay;
    static PAYMENT_EXPIRE_MINUTES = 15;
    constructor(prisma, vnpay) {
        this.prisma = prisma;
        this.vnpay = vnpay;
    }
    // ─── Initiate ─────────────────────────────────────────────────────────────
    async initiatePayment(leaderId, input) {
        const seasonTeam = await this.prisma.seasonTeam.findUnique({
            where: { id: input.season_team_id },
            select: {
                id: true,
                user_id: true,
                season: {
                    select: {
                        id: true,
                        name: true,
                        registration_fee: true,
                        is_registration_open: true,
                    },
                },
                team: { select: { name: true } },
                payments: {
                    select: {
                        id: true,
                        status: true,
                        transaction_ref: true,
                        amount: true,
                        created_at: true,
                    },
                    orderBy: { created_at: 'desc' },
                    take: 1,
                },
            },
        });
        if (!seasonTeam)
            throw createAppError('NOT_FOUND', `SeasonTeam ${input.season_team_id} không tồn tại`);
        if (seasonTeam.user_id !== leaderId)
            throw createAppError('FORBIDDEN', 'Không có quyền thanh toán cho team này');
        if (!seasonTeam.season.is_registration_open)
            throw createAppError('CONFLICT', 'Mùa giải đã đóng đăng ký');
        const registrationFee = Number(seasonTeam.season.registration_fee);
        if (registrationFee <= 0)
            throw createAppError('CONFLICT', 'Mùa giải này không có phí đăng ký');
        const latestPayment = seasonTeam.payments[0];
        if (latestPayment?.status === PaymentStatus.confirmed)
            throw createAppError('CONFLICT', 'Team đã hoàn tất thanh toán lệ phí');
        const isPendingReusable = latestPayment?.status === PaymentStatus.pending &&
            !!latestPayment.transaction_ref &&
            Date.now() - latestPayment.created_at.getTime() <=
                PaymentService.PAYMENT_EXPIRE_MINUTES * 60_000;
        if (isPendingReusable) {
            const paymentUrl = this._buildUrl(latestPayment.transaction_ref, Number(latestPayment.amount), input.ip_addr, input.return_url);
            return {
                payment_id: latestPayment.id,
                transaction_ref: latestPayment.transaction_ref,
                amount: Number(latestPayment.amount),
                payment_url: paymentUrl,
            };
        }
        const transaction_ref = `PAY${Date.now()}${randomBytes(4).toString('hex')}`;
        const payment = await this.prisma.payment.create({
            data: {
                season_team_id: input.season_team_id,
                amount: registrationFee,
                status: PaymentStatus.pending,
                transaction_ref,
            },
            select: { id: true },
        });
        const paymentUrl = this._buildUrl(transaction_ref, registrationFee, input.ip_addr, input.return_url);
        return {
            payment_id: payment.id,
            transaction_ref,
            amount: registrationFee,
            payment_url: paymentUrl,
        };
    }
    _buildUrl(transaction_ref, amount, ip_addr, return_url) {
        const now = new Date();
        const expire = new Date(now.getTime() + PaymentService.PAYMENT_EXPIRE_MINUTES * 60_000);
        return this.vnpay.buildPaymentUrl({
            vnp_Amount: amount,
            vnp_IpAddr: ip_addr,
            vnp_TxnRef: transaction_ref,
            vnp_OrderInfo: `Nop le phi dang ky ${transaction_ref}`,
            vnp_OrderType: ProductCode.Other,
            vnp_ReturnUrl: return_url,
            vnp_Locale: VnpLocale.VN,
            vnp_CurrCode: VnpCurrCode.VND,
            vnp_CreateDate: dateFormat(getDateInGMT7(now)),
            vnp_ExpireDate: dateFormat(getDateInGMT7(expire)),
        });
    }
    // ─── IPN handler ──────────────────────────────────────────────────────────
    async handleIpn(query) {
        const verify = this.vnpay.verifyIpnCall(query);
        if (!verify.isVerified)
            return { RspCode: '97', Message: 'Invalid checksum' };
        const payment = await this.prisma.payment.findUnique({
            where: { transaction_ref: verify.vnp_TxnRef },
            select: { id: true, amount: true, status: true },
        });
        if (!payment)
            return { RspCode: '01', Message: 'Order not found' };
        if (payment.status === PaymentStatus.confirmed)
            return { RspCode: '02', Message: 'Order already confirmed' };
        if (!verify.isSuccess) {
            console.warn(`[IPN] Payment failed txnRef=${verify.vnp_TxnRef} code=${verify.vnp_ResponseCode}`);
            return { RspCode: '00', Message: 'Acknowledged' };
        }
        const expectedAmount = Number(payment.amount);
        const receivedAmount = verify.vnp_Amount;
        if (expectedAmount !== receivedAmount) {
            console.error(`[IPN] Amount mismatch paymentId=${payment.id} ` +
                `expected=${expectedAmount} received=${receivedAmount}`);
            return { RspCode: '04', Message: 'Invalid amount' };
        }
        const now = new Date();
        const result = await this.prisma.payment.updateMany({
            where: { id: payment.id, status: PaymentStatus.pending },
            data: {
                status: PaymentStatus.confirmed,
                paid_at: now,
                confirmed_at: now,
                confirmed_by: null,
                vnp_transaction_no: verify.vnp_TransactionNo != null ? String(verify.vnp_TransactionNo) : null,
            },
        });
        if (result.count === 0) {
            return { RspCode: '02', Message: 'Order already confirmed' };
        }
        console.log(`[IPN] Confirmed paymentId=${payment.id} txn=${verify.vnp_TransactionNo}`);
        return { RspCode: '00', Message: 'Success' };
    }
    // ─── Return URL verify ────────────────────────────────────────────────────
    async verifyReturn(query) {
        const verify = this.vnpay.verifyReturnUrl(query);
        if (!verify.isVerified)
            return { is_verified: false, is_success: false, payment_id: null, status: null };
        const payment = await this.prisma.payment.findUnique({
            where: { transaction_ref: verify.vnp_TxnRef },
            select: { id: true, status: true },
        });
        return {
            is_verified: true,
            is_success: verify.isSuccess,
            payment_id: payment?.id ?? null,
            status: payment?.status ?? null,
        };
    }
    // ─── Manual confirm (admin) ───────────────────────────────────────────────
    // FIX: khoá cứng chỉ transition từ `pending` → `confirmed`. Bản cũ dùng
    // where: { status: payment.status } — match theo bất kỳ status hiện tại,
    // nghĩa là admin có thể "confirm" cả payment đang refund_pending/refunded,
    // đẩy ngược domain state sai. Giờ chỉ pending mới confirm được; các state
    // khác → CONFLICT rõ ràng thay vì âm thầm update sai.
    async confirmManual(paymentId, adminId, note) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, status: true },
        });
        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);
        if (payment.status !== PaymentStatus.pending)
            throw createAppError('CONFLICT', `Chỉ confirm được payment đang pending (hiện tại: ${payment.status})`);
        const now = new Date();
        const result = await this.prisma.payment.updateMany({
            where: { id: paymentId, status: PaymentStatus.pending },
            data: {
                status: PaymentStatus.confirmed,
                paid_at: now,
                confirmed_at: now,
                confirmed_by: adminId,
            },
        });
        if (result.count === 0)
            throw createAppError('CONFLICT', `Payment ${paymentId} đã đổi status — admin khác vừa xử lý`);
        console.log(`[Payment] Manual confirmed paymentId=${paymentId} by adminId=${adminId} note=${note}`);
    }
    // ─── Query transaction (admin) ────────────────────────────────────────────
    async queryTransaction(paymentId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, transaction_ref: true, status: true, created_at: true },
        });
        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);
        const now = new Date();
        const result = await this.vnpay.queryDr({
            vnp_RequestId: randomBytes(8).toString('hex'),
            vnp_IpAddr: process.env.SERVER_IP ?? '127.0.0.1',
            vnp_TxnRef: payment.transaction_ref,
            vnp_OrderInfo: `Query ${payment.transaction_ref}`,
            vnp_TransactionDate: dateFormat(getDateInGMT7(payment.created_at)),
            vnp_CreateDate: dateFormat(getDateInGMT7(now)),
        });
        if (result.vnp_TransactionStatus === '00' && payment.status === PaymentStatus.pending) {
            const confirmedAt = new Date();
            await this.prisma.payment.updateMany({
                where: { id: payment.id, status: PaymentStatus.pending },
                data: {
                    status: PaymentStatus.confirmed,
                    paid_at: confirmedAt,
                    confirmed_at: confirmedAt,
                    confirmed_by: null,
                    vnp_transaction_no: result.vnp_TransactionNo != null ? String(result.vnp_TransactionNo) : null,
                },
            });
        }
        return result;
    }
    // ─── Refund (admin) ───────────────────────────────────────────────────────
    async refundPayment(paymentId, adminId, input) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: {
                id: true,
                amount: true,
                transaction_ref: true,
                status: true,
                paid_at: true,
                vnp_transaction_no: true,
            },
        });
        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);
        if (payment.status !== PaymentStatus.confirmed)
            throw createAppError('CONFLICT', 'Chỉ refund được payment đã confirmed');
        if (!payment.paid_at)
            throw createAppError('CONFLICT', `Payment ${paymentId} thiếu paid_at — data không hợp lệ`);
        if (input.amount <= 0 || input.amount > Number(payment.amount))
            throw createAppError('CONFLICT', 'Số tiền refund không hợp lệ');
        const lock = await this.prisma.payment.updateMany({
            where: { id: paymentId, status: PaymentStatus.confirmed },
            data: { status: PaymentStatus.refund_pending },
        });
        if (lock.count === 0)
            throw createAppError('CONFLICT', 'Payment đang được xử lý hoặc status đã thay đổi');
        const now = new Date();
        let result;
        try {
            result = await this.vnpay.refund({
                vnp_RequestId: randomBytes(8).toString('hex'),
                vnp_TxnRef: payment.transaction_ref,
                vnp_Amount: input.amount,
                vnp_OrderInfo: input.reason,
                vnp_TransactionType: input.type === 'full'
                    ? VnpTransactionType.FULL_REFUND
                    : VnpTransactionType.PARTIAL_REFUND,
                vnp_TransactionDate: dateFormat(getDateInGMT7(payment.paid_at)),
                vnp_CreateBy: String(adminId),
                vnp_CreateDate: dateFormat(getDateInGMT7(now)),
                vnp_IpAddr: process.env.SERVER_IP ?? '127.0.0.1',
                vnp_TransactionNo: payment.vnp_transaction_no
                    ? Number(payment.vnp_transaction_no)
                    : undefined,
            });
        }
        catch (err) {
            console.error(`[Refund] Network/timeout paymentId=${paymentId} txn=${payment.transaction_ref}`, err);
            throw createAppError('SERVICE_UNAVAILABLE', 'Không thể kết nối VNPay — payment giữ trạng thái refund_pending, cần xử lý thủ công');
        }
        if (result.vnp_ResponseCode !== '00') {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: { status: PaymentStatus.confirmed },
            });
            throw createAppError('CONFLICT', `VNPay từ chối refund [${result.vnp_ResponseCode}]: ${result.vnp_Message ?? 'Không có message'}`);
        }
        await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.refunded,
                refunded_at: now,
                refunded_by: adminId,
                refund_amount: input.amount,
            },
        });
        console.log(`[Refund] Success paymentId=${paymentId} amount=${input.amount} adminId=${adminId}`);
        return result;
    }
    // ─── Get payment status ───────────────────────────────────────────────────
    // FIX: thêm bank_id/bank_account_no/bank_account_name vào season select
    // + map ra PaymentRow — frontend (TeamPaymentModal) lấy bankInfo từ đây
    // qua paymentApi.getPaymentStatus(), không hard-code DEFAULT_BANK nữa.
    async getPaymentBySeasonTeam(season_team_id, leaderId) {
        const payment = await this.prisma.payment.findFirst({
            where: { season_team_id },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                season_team_id: true,
                amount: true,
                status: true,
                transaction_ref: true,
                paid_at: true,
                confirmed_at: true,
                confirmed_by: true,
                created_at: true,
                season_team: {
                    select: {
                        user_id: true,
                        team: { select: { name: true } },
                        season: {
                            select: {
                                name: true,
                                registration_fee: true,
                                bank_id: true,
                                bank_account_no: true,
                                bank_account_name: true,
                            },
                        },
                    },
                },
            },
        });
        if (!payment)
            return null;
        if (payment.season_team.user_id !== leaderId)
            throw createAppError('FORBIDDEN', 'Không có quyền xem payment này');
        const { season } = payment.season_team;
        const hasBankInfo = !!(season.bank_id && season.bank_account_no && season.bank_account_name);
        return {
            id: payment.id,
            season_team_id: payment.season_team_id,
            amount: Number(payment.amount),
            status: payment.status,
            transaction_ref: payment.transaction_ref,
            paid_at: payment.paid_at,
            confirmed_at: payment.confirmed_at,
            confirmed_by: payment.confirmed_by,
            created_at: payment.created_at,
            team_name: payment.season_team.team.name,
            season_name: season.name,
            registration_fee: Number(season.registration_fee),
            bank_info: hasBankInfo
                ? {
                    bank_id: season.bank_id,
                    bank_account_no: season.bank_account_no,
                    bank_account_name: season.bank_account_name,
                }
                : null,
        };
    }
    // ─── List (admin) ─────────────────────────────────────────────────────────
    async listPayments(filter) {
        const page = Math.max(filter.page ?? 1, 1);
        const limit = Math.min(filter.limit ?? 20, 100);
        const skip = (page - 1) * limit;
        const where = {
            ...(filter.status && { status: filter.status }),
            ...(filter.season_id && { season_team: { season_id: filter.season_id } }),
        };
        const [rows, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                select: {
                    id: true,
                    season_team_id: true,
                    amount: true,
                    status: true,
                    transaction_ref: true,
                    paid_at: true,
                    confirmed_at: true,
                    confirmed_by: true,
                    created_at: true,
                    season_team: {
                        select: {
                            user_id: true,
                            team: { select: { name: true } },
                            season: {
                                select: {
                                    name: true,
                                    registration_fee: true,
                                    bank_id: true,
                                    bank_account_no: true,
                                    bank_account_name: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            data: rows.map(p => {
                const { season } = p.season_team;
                const hasBankInfo = !!(season.bank_id && season.bank_account_no && season.bank_account_name);
                return {
                    id: p.id,
                    season_team_id: p.season_team_id,
                    amount: Number(p.amount),
                    status: p.status,
                    transaction_ref: p.transaction_ref,
                    paid_at: p.paid_at,
                    confirmed_at: p.confirmed_at,
                    confirmed_by: p.confirmed_by,
                    created_at: p.created_at,
                    team_name: p.season_team.team.name,
                    season_name: season.name,
                    registration_fee: Number(season.registration_fee),
                    bank_info: hasBankInfo
                        ? {
                            bank_id: season.bank_id,
                            bank_account_no: season.bank_account_no,
                            bank_account_name: season.bank_account_name,
                        }
                        : null,
                };
            }),
            total,
            page,
            limit,
        };
    }
}
//# sourceMappingURL=payment.service.js.map