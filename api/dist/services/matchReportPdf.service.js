import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COL_WIDTHS = [30, 150, 55, 50, 30, 45, 40, 40];
const COL_HEADERS = ['Số áo', 'Cầu thủ', 'Vị trí', 'BT/DB', 'Bàn', 'Phản lưới', 'Thẻ V', 'Thẻ Đ'];
// FIX: table border trước đây hardcode x=555 (không khớp tổng COL_WIDTHS=440,
// lệch ra ngoài nội dung bảng thật). Derive từ chính COL_WIDTHS — 1 nguồn sự thật.
const TABLE_WIDTH = COL_WIDTHS.reduce((a, b) => a + b, 0);
const IMAGE_FETCH_TIMEOUT_MS = 5000;
export class MatchReportPdfRenderer {
    // Font path resolution + fs.existsSync là I/O — cache ở static level,
    // dùng chung cho mọi instance/request trong cùng process thay vì re-resolve
    // mỗi lần render (trước đây đã cache nhưng ở module scope, giờ gắn vào class
    // để không rò rỉ state ra ngoài module).
    static fontsCache = null;
    static fontsError = null;
    // State riêng theo từng lần render — instance này KHÔNG được tái sử dụng
    // giữa các request đồng thời (factory function bên dưới tạo instance mới
    // mỗi lần gọi, đảm bảo an toàn concurrency).
    doc;
    async render(report) {
        const [homeLogo, awayLogo] = await Promise.all([
            this.fetchImageBuffer(report.home.jersey.logoUrl),
            this.fetchImageBuffer(report.away.jersey.logoUrl),
        ]);
        const fonts = MatchReportPdfRenderer.getFonts();
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            this.doc = doc;
            const chunks = [];
            doc.on('data', (chunk) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
            doc.registerFont('Body', fonts.regular);
            doc.registerFont('Body-Bold', fonts.bold);
            doc.registerFont('Body-Italic', fonts.italic);
            doc.font('Body');
            this.renderHeader(report, { logo: homeLogo }, { logo: awayLogo });
            this.renderScoreBlock(report);
            this.renderGoalsTimeline(report);
            doc.moveDown(1);
            this.renderTeamSection(report.home, report.lineups.home);
            doc.moveDown(1);
            this.renderTeamSection(report.away, report.lineups.away);
            this.renderSignatureSection(report);
            this.renderFooter();
            doc.end();
        });
    }
    // ─── Font resolution (static — process-wide cache) ─────────────────────
    static resolveFontDir() {
        const candidates = [
            path.join(__dirname, '..', 'assets', 'fonts'),
            path.join(__dirname, '..', '..', 'assets', 'fonts'),
            path.join(process.cwd(), 'assets', 'fonts'),
        ];
        for (const dir of candidates) {
            if (fs.existsSync(path.join(dir, 'NotoSans-Regular.ttf'))) {
                return dir;
            }
        }
        throw new Error(`[MatchReportPdfRenderer] Không tìm thấy font NotoSans-Regular.ttf. Đã thử các đường dẫn sau:\n` +
            candidates.map(c => `  - ${c}`).join('\n') +
            `\nHãy đảm bảo thư mục assets/fonts (NotoSans-Regular.ttf, NotoSans-Bold.ttf, ` +
            `NotoSans-Italic.ttf) được copy vào image/deploy (vd: bước COPY trong Dockerfile, ` +
            `hoặc copy-assets script sau khi build TypeScript), vì tsc KHÔNG tự copy file ` +
            `non-.ts như .ttf vào thư mục dist.`);
    }
    static getFonts() {
        if (MatchReportPdfRenderer.fontsCache)
            return MatchReportPdfRenderer.fontsCache;
        if (MatchReportPdfRenderer.fontsError)
            throw MatchReportPdfRenderer.fontsError;
        try {
            const dir = MatchReportPdfRenderer.resolveFontDir();
            MatchReportPdfRenderer.fontsCache = {
                regular: path.join(dir, 'NotoSans-Regular.ttf'),
                bold: path.join(dir, 'NotoSans-Bold.ttf'),
                italic: path.join(dir, 'NotoSans-Italic.ttf'),
            };
            return MatchReportPdfRenderer.fontsCache;
        }
        catch (err) {
            MatchReportPdfRenderer.fontsError = err;
            throw MatchReportPdfRenderer.fontsError;
        }
    }
    // ─── Logo fetch ─────────────────────────────────────────────────────────
    // FIX: fetch trước không có timeout — 1 CDN logo treo là 1 PDF export
    // treo vô thời hạn (không timeout, không release connection). Thêm
    // AbortController timeout, fail-open về null như hành vi cũ.
    async fetchImageBuffer(url) {
        if (!url)
            return null;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);
        try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok)
                return null;
            const contentType = res.headers.get('content-type') ?? '';
            if (!/image\/(png|jpe?g)/i.test(contentType))
                return null;
            const buf = Buffer.from(await res.arrayBuffer());
            return buf.length > 0 ? buf : null;
        }
        catch {
            return null;
        }
        finally {
            clearTimeout(timeout);
        }
    }
    // ─── Sections ───────────────────────────────────────────────────────────
    renderHeader(report, homeAssets, awayAssets) {
        const doc = this.doc;
        const logoSize = 44;
        const topY = doc.y;
        const centerX = doc.page.width / 2;
        if (homeAssets.logo) {
            try {
                doc.image(homeAssets.logo, centerX - 170, topY, { width: logoSize, height: logoSize, fit: [logoSize, logoSize] });
            }
            catch {
                // buffer decode lỗi (corrupt/không đúng format thực) — bỏ qua, không phá layout
            }
        }
        if (awayAssets.logo) {
            try {
                doc.image(awayAssets.logo, centerX + 126, topY, { width: logoSize, height: logoSize, fit: [logoSize, logoSize] });
            }
            catch {
                // same as above
            }
        }
        doc.y = topY + (homeAssets.logo || awayAssets.logo ? logoSize + 8 : 0);
        doc.fontSize(16).font('Body-Bold').text('BIÊN BẢN TRẬN ĐẤU', { align: 'center' });
        doc.moveDown(0.4);
        doc.fontSize(10).font('Body');
        const playedAt = report.playedAt
            ? new Date(report.playedAt).toLocaleString('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'Asia/Ho_Chi_Minh',
            })
            : 'Chưa xác định';
        doc.text(`Trận đấu #${report.matchId}  |  Thời gian: ${playedAt}`, { align: 'center' });
        doc.text(`Sân: ${report.venueName ?? 'Chưa xác định'}  |  Trọng tài: ${report.referee ?? 'Chưa xác định'}`, { align: 'center' });
        doc.moveDown(0.8);
    }
    renderScoreBlock(report) {
        const doc = this.doc;
        const s = report.score;
        doc.fontSize(18).font('Body-Bold').text(`${report.home.name}   ${s.homeFinal} - ${s.awayFinal}   ${report.away.name}`, { align: 'center' });
        doc.moveDown(0.3);
        const rows = [
            ['Hiệp 1', `${s.homeHalfTime ?? '-'} - ${s.awayHalfTime ?? '-'}`],
        ];
        if (s.homeExtraTime != null) {
            rows.push(['Hiệp phụ', `${s.homeExtraTime} - ${s.awayExtraTime}`]);
        }
        if (s.homePenalty != null) {
            rows.push(['Luân lưu', `${s.homePenalty} - ${s.awayPenalty}`]);
        }
        rows.push(['Chung cuộc', `${s.homeFinal} - ${s.awayFinal}`]);
        const tableWidth = 220;
        const startX = (doc.page.width - tableWidth) / 2;
        doc.fontSize(9).font('Body');
        let y = doc.y;
        for (const [label, value] of rows) {
            // FIX: không có page-break guard — score block dài (hiệp phụ + luân
            // lưu) render gần cuối trang cũ có thể bị PDFKit tự flow sang trang
            // mới giữa chừng row, lệch cột trái/phải. Guard rõ ràng như các
            // section khác thay vì phó mặc auto-flow.
            if (y > doc.page.height - doc.page.margins.bottom - 20) {
                doc.addPage();
                y = doc.y;
            }
            doc.font('Body').text(label, startX, y, { width: tableWidth * 0.55, align: 'left' });
            doc.font('Body-Bold').text(value, startX + tableWidth * 0.55, y, { width: tableWidth * 0.45, align: 'right' });
            y = doc.y;
        }
        doc.y = y;
        doc.moveDown(0.5);
    }
    renderGoalsTimeline(report) {
        const doc = this.doc;
        const { home, away } = report.goalsTimeline;
        if (home.length === 0 && away.length === 0)
            return;
        doc.fontSize(9).font('Body-Bold').text('Bàn thắng:', { continued: false });
        doc.font('Body').fontSize(8.5);
        const maxRows = Math.max(home.length, away.length);
        const halfWidth = 250;
        for (let i = 0; i < maxRows; i++) {
            if (doc.y > doc.page.height - doc.page.margins.bottom - 20)
                doc.addPage();
            const y = doc.y;
            const homeEntry = home[i];
            const awayEntry = away[i];
            if (homeEntry)
                doc.text(this.formatGoalLabel(homeEntry), doc.x, y, { width: halfWidth });
            if (awayEntry)
                doc.text(this.formatGoalLabel(awayEntry), doc.x + halfWidth + 20, y, { width: halfWidth });
            doc.moveDown(0.9);
        }
        doc.moveDown(0.3);
    }
    formatGoalLabel(e) {
        const minutePart = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
        const ogSuffix = e.isOwnGoal ? ' (OG)' : '';
        return `${e.playerName} ${minutePart}${ogSuffix}`;
    }
    // Màu áo hiển thị dạng swatch (rect fill) — không dùng ảnh jersey vì
    // image_url cho trang phục thường là ảnh minh hoạ lớn, không hợp render
    // nhỏ cạnh tên đội; color swatch luôn render được kể cả khi thiếu image_url,
    // miễn có primaryColor (là field bắt buộc theo nghiệp vụ khi tạo jersey).
    renderJerseySwatch(jersey, x, y) {
        const doc = this.doc;
        if (!jersey.primaryColor)
            return;
        try {
            doc.rect(x, y, 12, 12).fill(jersey.primaryColor);
            if (jersey.secondaryColor) {
                doc.rect(x + 14, y, 12, 12).fill(jersey.secondaryColor);
            }
        }
        catch { /* invalid color string */ }
        doc.fillColor('black');
    }
    renderTeamSection(team, rows) {
        const doc = this.doc;
        if (doc.y > 650)
            doc.addPage();
        const leftX = doc.page.margins.left; // luôn neo lại left margin tường minh
        const titleY = doc.y;
        doc.fontSize(13).font('Body-Bold').text(team.name, leftX, titleY, { continued: false });
        const swatchX = doc.page.width - doc.page.margins.right - 40;
        this.renderJerseySwatch(team.jersey, swatchX, titleY + 2);
        doc.x = leftX; // reset cursor tường minh, không phụ thuộc save/restore
        doc.y = titleY + 20;
        doc.moveDown(0.3);
        doc.fontSize(8.5).font('Body-Bold');
        this.drawRow(COL_HEADERS);
        doc.moveTo(doc.x, doc.y).lineTo(doc.page.margins.left + TABLE_WIDTH, doc.y).strokeColor('#cccccc').stroke();
        doc.moveDown(0.2);
        doc.font('Body').fontSize(8.5);
        const starters = rows.filter(r => r.isStarting);
        const subs = rows.filter(r => !r.isStarting);
        for (const p of [...starters, ...subs]) {
            if (doc.y > 720)
                doc.addPage();
            this.drawRow([
                p.jerseyNumber?.toString() ?? '-',
                p.fullName + (p.isCaptain ? ' (C)' : ''),
                p.position,
                p.isStarting ? 'Đá chính' : 'Dự bị',
                String(p.goals.length),
                String(p.ownGoals.length),
                String(p.yellowCards.length),
                String(p.redCards.length),
            ]);
        }
    }
    // FIX (bug thật, không phải style): moveDown(1) cố định = 1 dòng chiều
    // cao font hiện tại, bất kể nội dung cell dài bao nhiêu. Cột "Cầu thủ"
    // width=150 — tên dài (kèm " (C)") wrap xuống 2 dòng thì hàng kế tiếp
    // (jerseyNumber/position/...) sẽ đè lên dòng wrap thứ 2, dữ liệu chồng
    // lên nhau không đọc được. Đo height thực tế mỗi cell bằng
    // heightOfString(text, {width}), lấy max làm row height rồi mới advance y.
    drawRow(cells) {
        const doc = this.doc;
        const startX = doc.x;
        const y = doc.y;
        let x = startX;
        const rowHeight = Math.max(...cells.map((c, i) => doc.heightOfString(c, { width: COL_WIDTHS[i] ?? 0 })), doc.currentLineHeight());
        cells.forEach((c, i) => {
            const width = COL_WIDTHS[i] ?? 0;
            doc.text(c, x, y, { width, continued: false });
            x += width;
        });
        doc.x = startX;
        doc.y = y + rowHeight + 2;
    }
    renderSignatureSection(report) {
        const doc = this.doc;
        const boxHeight = 90;
        if (doc.y > doc.page.height - boxHeight - 60)
            doc.addPage();
        doc.moveDown(1.5);
        const pageLeft = doc.page.margins.left;
        const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colWidth = pageWidth / 2;
        const topY = doc.y;
        doc.rect(pageLeft, topY, pageWidth, boxHeight).strokeColor('#cccccc').stroke();
        doc.moveTo(pageLeft + colWidth, topY)
            .lineTo(pageLeft + colWidth, topY + boxHeight)
            .strokeColor('#cccccc').stroke();
        doc.fontSize(9).font('Body-Bold');
        doc.text(`Thay mặt đội bóng: ${report.home.name}`, pageLeft + 10, topY + 10, { width: colWidth - 20 });
        doc.text(`Thay mặt đội bóng: ${report.away.name}`, pageLeft + colWidth + 10, topY + 10, { width: colWidth - 20 });
        doc.fontSize(9).font('Body');
        doc.text('Chữ ký:', pageLeft + 10, topY + 60);
        doc.text('Chữ ký:', pageLeft + colWidth + 10, topY + 60);
        doc.y = topY + boxHeight + 10;
        const refBoxTop = doc.y;
        doc.rect(pageLeft, refBoxTop, pageWidth, 60).strokeColor('#cccccc').stroke();
        doc.fontSize(9).font('Body-Bold').text('Trọng tài điều khiển trận đấu', pageLeft + 10, refBoxTop + 10, { width: pageWidth - 20 });
        doc.fontSize(9).font('Body').text('Chữ ký:', pageLeft + 10, refBoxTop + 40);
        doc.y = refBoxTop + 70;
    }
    renderFooter() {
        const doc = this.doc;
        doc.moveDown(1);
        doc.fontSize(8).font('Body-Italic').fillColor('#888888').text(`Biên bản được xuất tự động lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`, { align: 'right' });
    }
}
// Giữ nguyên call site cũ (matchApi.getMatchReport / route handler) —
// không phải sửa import ở nơi khác đang gọi renderMatchReportPdf().
export async function renderMatchReportPdf(report) {
    return new MatchReportPdfRenderer().render(report);
}
//# sourceMappingURL=matchReportPdf.service.js.map