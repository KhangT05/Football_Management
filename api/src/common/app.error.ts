import { ERROR_REGISTRY, ErrorCode } from "./error.code.js";

export class AppError extends Error {
    public readonly httpStatus: number;
    public readonly exposedStatus: number;
    constructor(
        public readonly code: ErrorCode,
        public readonly internalMessage?: string, //log
        public readonly clientMessage?: string,        // override nếu muốn custom
    ) {
        super(internalMessage);
        this.httpStatus = ERROR_REGISTRY[code].httpStatus;
        this.exposedStatus = ERROR_REGISTRY[code].expose;
        this.name = this.constructor.name;
    }
}

export function createAppError(code: ErrorCode,
    internalMessage?: string,
    clientMessage?: string
): AppError {
    // FIX: hầu hết mọi nơi trong codebase gọi createAppError(code, message)
    // — chỉ truyền 2 tham số, với ý định message đó hiển thị cho client.
    // Nhưng message đó rơi vào `internalMessage` (chỉ dùng để log), còn
    // `clientMessage` (field DUY NHẤT middleware dùng để trả JSON cho FE)
    // luôn undefined -> middleware fallback "Request failed" cho MỌI lỗi
    // nghiệp vụ (CONFLICT/VALIDATION_ERROR/...) trong toàn hệ thống, dù
    // service đã viết message tiếng Việt rất cụ thể.
    //
    // Fix: khi không truyền clientMessage riêng, mặc định dùng luôn
    // internalMessage làm clientMessage — khớp đúng cách 99% call site
    // đang dùng (2 tham số, message dùng cho cả log lẫn hiển thị). Chỗ nào
    // cần che chi tiết nhạy cảm khỏi client thì gọi tường minh với 3 tham
    // số (internalMessage khác, clientMessage generic hơn) — cách gọi đó
    // vẫn hoạt động đúng như cũ, không bị fix này ghi đè.
    //
    // Auth errors (UNAUTHORIZED/FORBIDDEN/NOT_FOUND) không bị ảnh hưởng —
    // middleware đã ép message = "Access denied" bất kể clientMessage là
    // gì, nên default này không leak thông tin nhạy cảm ở nhóm đó.
    return new AppError(code, internalMessage, clientMessage ?? internalMessage);
}