import { randomBytes } from 'crypto';
import {
    PaymentStatus,
    PrismaClient,
} from '../generated/prisma/client.js';
import {
    VNPay,
    VnpLocale,
    VnpCurrCode,
    ProductCode,
    VnpTransactionType,
    dateFormat,
    getDateInGMT7,
    type ReturnQueryFromVNPay,
    type QueryDr,
    type QueryDrResponse,
    type Refund,
    type RefundResponse,
} from 'vnpay';
import { createAppError } from '../common/app.error.js';
import {
    InitiatePaymentInput,
    InitiatePaymentOutput,
    IpnQuery,
    IpnResponse,
    PaymentRow,
} from '../types/payment.type.js';

export interface RefundPaymentInput {
    amount: number;
    reason: string;
    type: 'full' | 'partial';
}

// ─── Service ──────────────────────────────────────────────────────────────────
// Flow:
//   Leader POST /payments/initiate
//     → lấy registration_fee từ season (qua season_team)
//     → tạo Payment record (pending) hoặc reuse pending còn hạn
//     → buildPaymentUrl (có vnp_ExpireDate) → trả về payment_url
//   Leader POST /payments/manual
//     → tạo Payment record (pending) KHÔNG qua VNPay, KHÔNG transaction_ref
//     → admin thấy trong listPayments, tự đối chiếu sao kê rồi confirmManual
//   Leader redirect → VNPay gateway → quét QR / chuyển khoản
//   VNPay IPN GET /payments/ipn
//     → verifyIpnCall → match transaction_ref → verify amount → confirm (atomic)
//   VNPay return URL → frontend poll hoặc lấy status từ IPN result
//   Admin PATCH /payments/:id/confirm → manual confirm nếu IPN miss HOẶC payment
//     tạo từ nhánh manual (transaction_ref null → không thể queryDr/refund qua VNPay)
//   Admin GET   /payments/:id/query   → queryDr đối soát khi nghi ngờ IPN miss
//     (CHỈ áp dụng payment có transaction_ref — payment nhánh manual sẽ lỗi ở VNPay
//     nếu gọi nhầm, xem guard trong method)
//   Admin POST  /payments/:id/refund  → refund khi team rút lui / hoàn phí
//     (CHỈ áp dụng payment qua VNPay — payment manual không có gateway để hoàn tự động,
//     admin phải chuyển khoản tay và cập nhật DB riêng — ngoài scope method này)
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
    private static readonly PAYMENT_EXPIRE_MINUTES = 15;

    constructor(
        private readonly prisma: PrismaClient,
        private readonly vnpay: VNPay,
    ) { }

    // ─── Initiate (VNPay) ───────────────────────────────────────────────────────

    async initiatePayment(
        leaderId: number,
        input: InitiatePaymentInput,
    ): Promise<InitiatePaymentOutput> {
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

        const isPendingReusable =
            latestPayment?.status === PaymentStatus.pending &&
            !!latestPayment.transaction_ref &&
            Date.now() - latestPayment.created_at.getTime() <=
            PaymentService.PAYMENT_EXPIRE_MINUTES * 60_000;

        if (isPendingReusable) {
            const paymentUrl = this._buildUrl(
                latestPayment.transaction_ref!,
                Number(latestPayment.amount),
                input.ip_addr,
                input.return_url,
            );
            return {
                payment_id: latestPayment.id,
                transaction_ref: latestPayment.transaction_ref!,
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

        const paymentUrl = this._buildUrl(
            transaction_ref,
            registrationFee,
            input.ip_addr,
            input.return_url,
        );

        return {
            payment_id: payment.id,
            transaction_ref,
            amount: registrationFee,
            payment_url: paymentUrl,
        };
    }

    private _buildUrl(
        transaction_ref: string,
        amount: number,
        ip_addr: string,
        return_url: string,
    ): string {
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

    // ─── Initiate manual (chuyển khoản tay, không qua VNPay) ───────────────────
    // THÊM MỚI: nhánh này KHÔNG tạo transaction_ref, KHÔNG gọi VNPay — vì
    // queryTransaction/refundPayment bên dưới đều bắt buộc transaction_ref để
    // gọi vnpay.queryDr/vnpay.refund, payment tạo từ đây phải luôn transition
    // qua confirmManual (admin đối chiếu sao kê thủ công), KHÔNG BAO GIỜ qua
    // queryTransaction/refundPayment tự động — 2 method đó phải guard riêng
    // (xem dưới) để tránh admin bấm nhầm gây lỗi non-null assertion runtime.
    //
    // Cùng validate rule với initiatePayment (season mở đăng ký, chưa confirmed,
    // fee > 0) để tránh tạo payment rác hoặc double-payment qua đường vòng.

    async initiateManualPayment(
        leaderId: number,
        seasonTeamId: number,
    ): Promise<{ payment_id: number; amount: number; status: PaymentStatus }> {
        const seasonTeam = await this.prisma.seasonTeam.findUnique({
            where: { id: seasonTeamId },
            select: {
                id: true,
                user_id: true,
                season: {
                    select: {
                        registration_fee: true,
                        is_registration_open: true,
                        bank_id: true,
                        bank_account_no: true,
                        bank_account_name: true,
                    },
                },
                payments: {
                    select: { id: true, status: true, created_at: true },
                    orderBy: { created_at: 'desc' },
                    take: 1,
                },
            },
        });

        if (!seasonTeam)
            throw createAppError('NOT_FOUND', `SeasonTeam ${seasonTeamId} không tồn tại`);

        if (seasonTeam.user_id !== leaderId)
            throw createAppError('FORBIDDEN', 'Không có quyền thanh toán cho team này');

        if (!seasonTeam.season.is_registration_open)
            throw createAppError('CONFLICT', 'Mùa giải đã đóng đăng ký');

        const hasBankInfo = !!(
            seasonTeam.season.bank_id &&
            seasonTeam.season.bank_account_no &&
            seasonTeam.season.bank_account_name
        );
        if (!hasBankInfo)
            throw createAppError('CONFLICT', 'Ban tổ chức chưa cấu hình chuyển khoản thủ công');

        const registrationFee = Number(seasonTeam.season.registration_fee);
        if (registrationFee <= 0)
            throw createAppError('CONFLICT', 'Mùa giải này không có phí đăng ký');

        const latestPayment = seasonTeam.payments[0];
        if (latestPayment?.status === PaymentStatus.confirmed)
            throw createAppError('CONFLICT', 'Team đã hoàn tất thanh toán lệ phí');

        // Có pending gần đây (VNPay hoặc manual trước đó) → không tạo trùng,
        // trả lại chính record đó cho leader biết đang chờ xử lý.
        const isPendingRecent =
            latestPayment?.status === PaymentStatus.pending &&
            Date.now() - latestPayment.created_at.getTime() <=
            PaymentService.PAYMENT_EXPIRE_MINUTES * 60_000;

        if (isPendingRecent) {
            return {
                payment_id: latestPayment.id,
                amount: registrationFee,
                status: PaymentStatus.pending,
            };
        }

        const payment = await this.prisma.payment.create({
            data: {
                season_team_id: seasonTeamId,
                amount: registrationFee,
                status: PaymentStatus.pending,
                transaction_ref: null,
            },
            select: { id: true },
        });

        console.log(`[Payment] Manual payment created paymentId=${payment.id} seasonTeamId=${seasonTeamId}`);

        return {
            payment_id: payment.id,
            amount: registrationFee,
            status: PaymentStatus.pending,
        };
    }

    // ─── IPN handler ──────────────────────────────────────────────────────────

    async handleIpn(query: IpnQuery): Promise<IpnResponse> {
        const verify = this.vnpay.verifyIpnCall(query as unknown as ReturnQueryFromVNPay);

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
            console.error(
                `[IPN] Amount mismatch paymentId=${payment.id} ` +
                `expected=${expectedAmount} received=${receivedAmount}`,
            );
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

    async verifyReturn(
        query: Record<string, string>,
    ): Promise<{ is_verified: boolean; is_success: boolean; payment_id: number | null; status: PaymentStatus | null }> {
        const verify = this.vnpay.verifyReturnUrl(query as unknown as ReturnQueryFromVNPay);

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

    async confirmManual(paymentId: number, adminId: number, note?: string): Promise<void> {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, status: true },
        });

        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);

        if (payment.status !== PaymentStatus.pending)
            throw createAppError(
                'CONFLICT',
                `Chỉ confirm được payment đang pending (hiện tại: ${payment.status})`,
            );

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
    // FIX: thêm guard transaction_ref null — payment tạo từ initiateManualPayment
    // không có transaction_ref, gọi vnpay.queryDr sẽ crash ở `payment.transaction_ref!`
    // (non-null assertion sai thực tế). Trước đây không có nhánh manual nên
    // không lộ bug; giờ phải chặn tường minh, báo lỗi nghiệp vụ rõ ràng.

    async queryTransaction(paymentId: number): Promise<QueryDrResponse> {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            select: { id: true, transaction_ref: true, status: true, created_at: true },
        });

        if (!payment)
            throw createAppError('NOT_FOUND', `Payment ${paymentId} không tồn tại`);

        if (!payment.transaction_ref)
            throw createAppError(
                'CONFLICT',
                'Payment này tạo qua chuyển khoản thủ công, không có giao dịch VNPay để đối soát',
            );

        const now = new Date();
        const result = await this.vnpay.queryDr({
            vnp_RequestId: randomBytes(8).toString('hex'),
            vnp_IpAddr: process.env.SERVER_IP ?? '127.0.0.1',
            vnp_TxnRef: payment.transaction_ref,
            vnp_OrderInfo: `Query ${payment.transaction_ref}`,
            vnp_TransactionDate: dateFormat(getDateInGMT7(payment.created_at)),
            vnp_CreateDate: dateFormat(getDateInGMT7(now)),
        } as QueryDr);

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
    // FIX: thêm guard transaction_ref null — cùng lý do như queryTransaction.
    // Payment manual đã confirmed không thể refund qua VNPay gateway (không có
    // giao dịch gốc ở đó) — admin phải hoàn tiền tay qua ngân hàng và tự update
    // trạng thái qua đường khác (ngoài scope method này, tránh giả vờ tự động
    // hoàn tiền cho giao dịch chưa từng qua VNPay).

    async refundPayment(
        paymentId: number,
        adminId: number,
        input: RefundPaymentInput,
    ): Promise<RefundResponse> {
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
        if (!payment.transaction_ref)
            throw createAppError(
                'CONFLICT',
                'Payment này xác nhận qua chuyển khoản thủ công, không thể refund tự động qua VNPay',
            );
        if (payment.status !== PaymentStatus.confirmed)
            throw createAppError('CONFLICT', 'Chỉ refund được payment đã confirmed');
        if (!payment.paid_at)
            throw createAppError('CONFLICT', `Payment ${paymentId} thiếu paid_at — data không hợp lệ`);

        // FIX: validate tường minh bằng Number.isFinite thay vì so sánh trực
        // tiếp — so sánh `undefined <= 0` / `undefined > x` trong JS luôn trả
        // false, nên input rỗng/thiếu field lọt qua guard cũ, chạy thẳng tới
        // VNPay SDK và nổ lỗi kỹ thuật khó hiểu thay vì lỗi nghiệp vụ rõ ràng.
        if (!Number.isFinite(input.amount) || input.amount <= 0)
            throw createAppError('CONFLICT', 'Số tiền refund không hợp lệ hoặc bị thiếu');
        if (input.amount > Number(payment.amount))
            throw createAppError(
                'CONFLICT',
                `Số tiền refund (${input.amount}) vượt quá số tiền đã thanh toán (${Number(payment.amount)})`,
            );

        // FIX: type phải là 'full' | 'partial' tường minh — không được để mặc
        // định âm thầm về PARTIAL_REFUND khi FE quên gửi field này.
        if (input.type !== 'full' && input.type !== 'partial')
            throw createAppError('CONFLICT', 'Loại refund không hợp lệ — phải là "full" hoặc "partial"');

        // FIX: reason bắt buộc — VNPay yêu cầu vnp_OrderInfo, để trống dễ bị
        // gateway từ chối với lỗi khó hiểu, hoặc lưu log audit không có lý do.
        if (!input.reason || !input.reason.trim())
            throw createAppError('CONFLICT', 'Vui lòng nhập lý do hoàn tiền');

        if (input.type === 'full' && input.amount !== Number(payment.amount))
            throw createAppError(
                'CONFLICT',
                'Hoàn tiền toàn phần (full) phải bằng đúng số tiền đã thanh toán',
            );

        const lock = await this.prisma.payment.updateMany({
            where: { id: paymentId, status: PaymentStatus.confirmed },
            data: { status: PaymentStatus.refund_pending },
        });
        if (lock.count === 0)
            throw createAppError('CONFLICT', 'Payment đang được xử lý hoặc status đã thay đổi');

        const now = new Date();
        let result: Awaited<ReturnType<typeof this.vnpay.refund>>;

        try {
            result = await this.vnpay.refund({
                vnp_RequestId: randomBytes(8).toString('hex'),
                vnp_TxnRef: payment.transaction_ref,
                vnp_Amount: input.amount,
                vnp_OrderInfo: input.reason,
                vnp_TransactionType:
                    input.type === 'full'
                        ? VnpTransactionType.FULL_REFUND
                        : VnpTransactionType.PARTIAL_REFUND,
                vnp_TransactionDate: dateFormat(getDateInGMT7(payment.paid_at)),
                vnp_CreateBy: String(adminId),
                vnp_CreateDate: dateFormat(getDateInGMT7(now)),
                vnp_IpAddr: process.env.SERVER_IP ?? '127.0.0.1',
                vnp_TransactionNo: payment.vnp_transaction_no
                    ? Number(payment.vnp_transaction_no)
                    : undefined,
            } as Refund);
        } catch (err) {
            console.error(
                `[Refund] Network/timeout paymentId=${paymentId} txn=${payment.transaction_ref}`,
                err,
            );
            throw createAppError(
                'SERVICE_UNAVAILABLE',
                'Không thể kết nối VNPay — payment giữ trạng thái refund_pending, cần xử lý thủ công',
            );
        }

        if (result.vnp_ResponseCode !== '00') {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: { status: PaymentStatus.confirmed },
            });
            throw createAppError(
                'CONFLICT',
                `VNPay từ chối refund [${result.vnp_ResponseCode}]: ${result.vnp_Message ?? 'Không có message'}`,
            );
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

        console.log(
            `[Refund] Success paymentId=${paymentId} amount=${input.amount} adminId=${adminId}`,
        );
        return result;
    }

    // ─── Get payment status ───────────────────────────────────────────────────

    async getPaymentBySeasonTeam(
        season_team_id: number,
        leaderId: number,
    ): Promise<PaymentRow | null> {
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

        if (!payment) return null;

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
                    bank_id: season.bank_id!,
                    bank_account_no: season.bank_account_no!,
                    bank_account_name: season.bank_account_name!,
                }
                : null,
        };
    }

    // ─── List (admin) — pagination offset-based, đã dùng đúng chuẩn ────────────
    // page/limit từ query, skip/take cho Prisma, total riêng biệt qua count()
    // để FE tính totalPages mà không phải load hết data.

    async listPayments(filter: {
        season_id?: number;
        status?: PaymentStatus;
        page?: number;
        limit?: number;
    }): Promise<{ data: PaymentRow[]; total: number; page: number; limit: number }> {
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
                            bank_id: season.bank_id!,
                            bank_account_no: season.bank_account_no!,
                            bank_account_name: season.bank_account_name!,
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