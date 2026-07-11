// vnpay.ts
import {
    VNPay,
    HashAlgorithm,
    VNPAY_GATEWAY_SANDBOX_HOST,
} from "vnpay";

export const vnpay = new VNPay({
    tmnCode: process.env.VNPAY_TMN_CODE!,
    secureSecret: process.env.VNPAY_SECURE_SECRET!,
    vnpayHost:
        process.env.VNPAY_HOST ?? VNPAY_GATEWAY_SANDBOX_HOST,
    queryDrAndRefundHost:
        process.env.VNPAY_QUERY_REFUND_HOST ??
        process.env.VNPAY_HOST ??
        VNPAY_GATEWAY_SANDBOX_HOST,
    testMode: process.env.NODE_ENV !== "production",
    hashAlgorithm: HashAlgorithm.SHA512,
    enableLog: process.env.NODE_ENV !== "production",
});