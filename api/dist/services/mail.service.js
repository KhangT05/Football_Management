import nodemailer from "nodemailer";
import { logger } from "../libs/logger.js";
class MailService {
    transporter = null;
    from;
    frontendUrl;
    isConfigured;
    constructor() {
        this.from = process.env.SMTP_FROM || "no-reply@example.com";
        this.frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");
        this.isConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
        if (this.isConfigured) {
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: Number(process.env.SMTP_PORT) === 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }
        else {
            logger.warn("MailService: SMTP_HOST/SMTP_USER/SMTP_PASS chưa được cấu hình — " +
                "email sẽ được log ra console thay vì gửi thật. Không dùng cấu hình này ở production.");
        }
    }
    buildAcceptInviteUrl(token) {
        return `${this.frontendUrl}/accept-invite?token=${encodeURIComponent(token)}`;
    }
    buildInviteEmailHtml(name, acceptUrl) {
        // Giữ HTML đơn giản, inline style — nhiều mail client (Outlook, Gmail
        // app) strip <style> block nên tránh phụ thuộc CSS ngoài inline.
        return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
  <h2 style="color: #111827;">Xin chào ${this.escapeHtml(name)},</h2>
  <p>Bạn vừa được thêm vào một đội bóng trên hệ thống. Để bắt đầu sử dụng tài khoản, vui lòng đặt mật khẩu bằng nút bên dưới:</p>
  <p style="text-align: center; margin: 32px 0;">
    <a href="${acceptUrl}"
       style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
      Đặt mật khẩu
    </a>
  </p>
  <p style="font-size: 13px; color: #6b7280;">
    Nếu nút trên không hoạt động, hãy copy đường dẫn sau vào trình duyệt:<br/>
    <a href="${acceptUrl}" style="color: #2563eb; word-break: break-all;">${acceptUrl}</a>
  </p>
  <p style="font-size: 13px; color: #6b7280;">Đường dẫn này hết hạn sau 7 ngày. Nếu bạn không yêu cầu việc này, có thể bỏ qua email.</p>
</div>`.trim();
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    /**
     * Gửi email mời user mới (được thêm làm player nhưng chưa từng đăng
     * nhập) đặt mật khẩu lần đầu. Ném lỗi nếu gửi thất bại — caller
     * (player.service) chịu trách nhiệm catch + log, không rollback
     * transaction đã tạo player chỉ vì email fail.
     */
    async sendInviteEmail(toEmail, payload) {
        const acceptUrl = this.buildAcceptInviteUrl(payload.token);
        const html = this.buildInviteEmailHtml(payload.name, acceptUrl);
        const subject = "Mời đặt mật khẩu tài khoản";
        if (!this.isConfigured || !this.transporter) {
            // Dev fallback — không throw, để không chặn flow tạo player khi
            // chưa wire SMTP thật. Log rõ để dev/QA copy link test bằng tay.
            logger.warn(`[MailService:DEV] SMTP chưa cấu hình. Invite link cho ${toEmail}: ${acceptUrl}`);
            return;
        }
        await this.transporter.sendMail({
            from: this.from,
            to: toEmail,
            subject,
            html,
        });
    }
}
export const mailService = new MailService();
//# sourceMappingURL=mail.service.js.map