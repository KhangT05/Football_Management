import nodemailer, { Transporter } from "nodemailer";
import { logger } from "../libs/logger.js";

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

class MailService {
    private transporter: Transporter | null = null;
    private readonly from: string;
    private readonly frontendUrl: string;
    private readonly isConfigured: boolean;

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
        } else {
            logger.warn(
                "MailService: SMTP_HOST/SMTP_USER/SMTP_PASS chưa được cấu hình — " +
                "email sẽ được log ra console thay vì gửi thật. Không dùng cấu hình này ở production."
            );
        }
    }

    private buildAcceptInviteUrl(token: string): string {
        return `${this.frontendUrl}/accept-invite?token=${encodeURIComponent(token)}`;
    }

    private buildInviteEmailHtml(name: string, acceptUrl: string): string {
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

    private escapeHtml(str: string): string {
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
    async sendInviteEmail(toEmail: string, payload: InviteEmailPayload): Promise<void> {
        const acceptUrl = this.buildAcceptInviteUrl(payload.token);
        const html = this.buildInviteEmailHtml(payload.name, acceptUrl);
        const subject = "Mời đặt mật khẩu tài khoản";

        if (!this.isConfigured || !this.transporter) {
            // Dev fallback — không throw, để không chặn flow tạo player khi
            // chưa wire SMTP thật. Log rõ để dev/QA copy link test bằng tay.
            logger.warn(
                `[MailService:DEV] SMTP chưa cấu hình. Invite link cho ${toEmail}: ${acceptUrl}`
            );
            return;
        }

        await this.transporter.sendMail({
            from: this.from,
            to: toEmail,
            subject,
            html,
        });
    }
    private buildResetPasswordUrl(token: string): string {
        return `${this.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    }

    private buildResetPasswordEmailHtml(name: string, resetUrl: string): string {
        return `
<div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; color: #1f2937;">
  <h2 style="color: #111827;">Xin chào ${this.escapeHtml(name)},</h2>
  <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nhấn nút bên dưới để đặt mật khẩu mới:</p>
  <p style="text-align: center; margin: 32px 0;">
    <a href="${resetUrl}"
       style="background-color: #dc2626; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
      Đặt lại mật khẩu
    </a>
  </p>
  <p style="font-size: 13px; color: #6b7280;">
    Nếu nút trên không hoạt động, hãy copy đường dẫn sau vào trình duyệt:<br/>
    <a href="${resetUrl}" style="color: #dc2626; word-break: break-all;">${resetUrl}</a>
  </p>
  <p style="font-size: 13px; color: #6b7280;">Đường dẫn này hết hạn sau 1 giờ. Nếu bạn không yêu cầu việc này, hãy bỏ qua email — mật khẩu hiện tại vẫn an toàn.</p>
</div>`.trim();
    }

    /**
     * Không throw khi SMTP chưa cấu hình — cùng lý do như sendInviteEmail:
     * không chặn flow forgot-password ở local dev.
     */
    async sendResetPasswordEmail(toEmail: string, payload: InviteEmailPayload): Promise<void> {
        const resetUrl = this.buildResetPasswordUrl(payload.token);
        const html = this.buildResetPasswordEmailHtml(payload.name, resetUrl);
        const subject = "Yêu cầu đặt lại mật khẩu";

        if (!this.isConfigured || !this.transporter) {
            logger.warn(`[MailService:DEV] SMTP chưa cấu hình. Reset link cho ${toEmail}: ${resetUrl}`);
            return;
        }

        await this.transporter.sendMail({ from: this.from, to: toEmail, subject, html });
    }
}

export const mailService = new MailService();