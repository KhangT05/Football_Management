/**
 * ASSUMPTION: chưa xác nhận stack email thật của hệ thống (SES / SendGrid /
 * SMTP nội bộ). File này dùng nodemailer với SMTP config qua env vars vì đó
 * là mẫu số chung — SES/SendGrid/Mailgun đều expose SMTP endpoint tương
 * thích, chỉ cần đổi SMTP_HOST/PORT/USER/PASS tương ứng, không cần đổi code.
 *
 * Nếu team đã có provider riêng (vd. dùng SES SDK trực tiếp thay vì SMTP),
 * thay nội dung hàm `send()` bên dưới bằng SDK call tương ứng — phần còn lại
 * (buildInviteEmailHtml, sendInviteEmail) không cần đổi.
 *
 * Required env vars:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
 *   FRONTEND_URL          (dùng để build link accept-invite, vd https://app.example.com)
 *
 * Nếu SMTP_HOST không được set (vd. local dev chưa có provider), service sẽ
 * KHÔNG throw — thay vào đó log nội dung + link ra console để dev vẫn lấy
 * được link test, và không làm fail luồng tạo player (business logic chính)
 * chỉ vì thiếu config email.
 */
interface InviteEmailPayload {
    token: string;
    name: string;
}
declare class MailService {
    private transporter;
    private readonly from;
    private readonly frontendUrl;
    private readonly isConfigured;
    constructor();
    private buildAcceptInviteUrl;
    private buildInviteEmailHtml;
    private escapeHtml;
    /**
     * Gửi email mời user mới (được thêm làm player nhưng chưa từng đăng
     * nhập) đặt mật khẩu lần đầu. Ném lỗi nếu gửi thất bại — caller
     * (player.service) chịu trách nhiệm catch + log, không rollback
     * transaction đã tạo player chỉ vì email fail.
     */
    sendInviteEmail(toEmail: string, payload: InviteEmailPayload): Promise<void>;
}
export declare const mailService: MailService;
export {};
//# sourceMappingURL=mail.service.d.ts.map