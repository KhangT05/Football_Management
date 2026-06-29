import { randomBytes } from 'crypto';
import { PaymentStatus, } from '../generated/prisma/client.js';
import { VNPay, VNPAY_GATEWAY_SANDBOX_HOST, HashAlgorithm, VnpLocale, VnpCurrCode, ProductCode, VnpTransactionType, dateFormat, getDateInGMT7, } from 'vnpay';
import { createAppError } from '../common/app.error.js';
// ─── VNPay instance ───────────────────────────────────────────────────────────
export function createVNPayInstance() {
    return new VNPay({
        tmnCode: process.env.VNPAY_TMN_CODE,
        secureSecret: process.env.VNPAY_SECURE_SECRET,
        vnpayHost: process.env.VNPAY_HOST ?? VNPAY_GATEWAY_SANDBOX_HOST,
        queryDrAndRefundHost: process.env.VNPAY_QUERY_REFUND_HOST ?? process.env.VNPAY_HOST ?? VNPAY_GATEWAY_SANDBOX_HOST,
        testMode: process.env.NODE_ENV !== 'production',
        hashAlgorithm: HashAlgorithm.SHA512,
        enableLog: process.env.NODE_ENV !== 'production',
    });
}
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
export class PaymentService {
    prisma;
    vnpay;
    // Window tái sử dụng payment_url khi leader F5/back.
    // Đây là heuristic ở app layer — KHÔNG phải vnp_ExpireDate thực tế VNPay set
    // cho URL đó (URL đó cũng dùng cùng window này, xem _buildUrl).
    static PAYMENT_EXPIRE_MINUTES = 15;
    constructor(prisma, vnpay) {
        this.prisma = prisma;
        this.vnpay = vnpay;
    }
    // ─── Initiate ─────────────────────────────────────────────────────────────
    // Guards:
    //   - season_team thuộc về leader (user_id = leaderId từ JWT)
    //   - season còn open registration
    //   - chưa có payment confirmed cho season_team này
    //   - pending cũ CÒN HẠN → reuse transaction_ref (tránh duplicate khi F5)
    //   - pending cũ HẾT HẠN → tạo payment mới, transaction_ref mới
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
                        created_at: true, // cần để check expiry window
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
        // Tạo payment mới — pending cũ (nếu có) đã hết hạn, để nguyên trong DB
        // (KHÔNG xoá/update nó — IPN trễ của lần trước vẫn cần match được ref cũ
        // nếu lỡ tới muộn; guard idempotency ở handleIpn tự xử lý theo status).
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
            // VNPay yêu cầu GMT+7 — thiếu convert này gây lệch giờ nếu server chạy UTC
            vnp_CreateDate: dateFormat(getDateInGMT7(now)),
            vnp_ExpireDate: dateFormat(getDateInGMT7(expire)),
        });
    }
    // ─── IPN handler ──────────────────────────────────────────────────────────
    // Đây là nơi DUY NHẤT update status → confirmed (source of truth).
    // Atomic update (status điều kiện nằm trong WHERE) — chống race khi VNPay
    // retry IPN gần như đồng thời, thứ mà read-then-write tách rời sẽ miss.
    // KHÔNG throw — luôn return IpnResponse để controller trả HTTP 200.
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
        const receivedAmount = verify.vnp_Amount; // package đã /100
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
                vnp_transaction_no: verify.vnp_TransactionNo != null ? String(verify.vnp_TransactionNo) : null, // cần cho queryDr/refund sau này
            },
        });
        if (result.count === 0) {
            // Lost race — request IPN khác đã confirm trước, vẫn báo VNPay dừng retry
            return { RspCode: '02', Message: 'Order already confirmed' };
        }
        console.log(`[IPN] Confirmed paymentId=${payment.id} txn=${verify.vnp_TransactionNo}`);
        return { RspCode: '00', Message: 'Success' };
    }
    // ─── Return URL verify ────────────────────────────────────────────────────
    // Chỉ show UI result — KHÔNG update DB. Source of truth = IPN.
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
    // Atomic update — chống 2 admin confirm cùng lúc (TOCTOU).
    async confirmManual(paymentId, adminId, note) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, status: true },
        });
        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);
        if (payment.status === PaymentStatus.confirmed)
            throw createAppError('CONFLICT', `Payment ${paymentId} đã confirmed`);
        const now = new Date();
        const result = await this.prisma.payment.updateMany({
            where: { id: paymentId, status: payment.status },
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
    // Đối soát khi nghi ngờ IPN miss, trước khi confirm tay.
    // KHÔNG phải nguồn confirm chính — nếu VNPay báo success mà DB còn pending,
    // tự reconcile bằng atomic update giống handleIpn.
    async queryTransaction(paymentId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, transaction_ref: true, status: true, created_at: true },
        });
        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);
        const now = new Date();
        const result = await this.vnpay.queryDr({
            vnp_RequestId: randomBytes(8).toString('hex'), // unique mỗi call — KHÔNG dùng transaction_ref
            vnp_IpAddr: process.env.SERVER_IP ?? '127.0.0.1', // IP server gọi API, không phải IP leader
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
    // Lock trước khi gọi API ngoài (chống double-call irreversible).
    // Network/timeout giữa lúc gọi VNPay → KHÔNG biết kết quả thật, giữ
    // refund_pending để admin tự verify qua merchant portal/queryDr trước retry.
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
        // Optimistic lock: chỉ transition từ confirmed → refund_pending
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
            // Network error / timeout — outcome không rõ, giữ refund_pending
            // Admin cần check VNPay portal và resolve thủ công
            console.error(`[Refund] Network/timeout paymentId=${paymentId} txn=${payment.transaction_ref}`, err);
            throw createAppError('SERVICE_UNAVAILABLE', 'Không thể kết nối VNPay — payment giữ trạng thái refund_pending, cần xử lý thủ công');
        }
        if (result.vnp_ResponseCode !== '00') {
            // VNPay reject rõ ràng → revert về confirmed
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
                        season: { select: { name: true, registration_fee: true } },
                    },
                },
            },
        });
        if (!payment)
            return null;
        if (payment.season_team.user_id !== leaderId)
            throw createAppError('FORBIDDEN', 'Không có quyền xem payment này');
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
            season_name: payment.season_team.season.name,
            registration_fee: Number(payment.season_team.season.registration_fee),
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
                            season: { select: { name: true, registration_fee: true } },
                        },
                    },
                },
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            data: rows.map(p => ({
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
                season_name: p.season_team.season.name,
                registration_fee: Number(p.season_team.season.registration_fee),
            })),
            total,
            page,
            limit,
        };
    }
}
//# sourceMappingURL=payment.service.js.map