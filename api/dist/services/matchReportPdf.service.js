import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// ─── Font Unicode tiếng Việt ───────────────────────────────────────────────
// FIX GỐC: PDFKit mặc định dùng 14 font chuẩn PDF (Helvetica, Times, ...),
// các font này KHÔNG có glyph cho ký tự có dấu tiếng Việt (ư, ơ, đ, ệ...).
// Kết quả là PDF hiện chữ vỡ kiểu "BIÊN B ¢N TR ¬N êEP" thay vì
// "BIÊN BẢN TRẬN ĐẤU" — vì các byte dấu bị map sang glyph không tồn tại
// trong font đó. Phải embed 1 font TTF hỗ trợ Unicode đầy đủ (Roboto/Noto
// Sans) thì mới hiện đúng dấu tiếng Việt.
//
// FIX #2 (production ENOENT): bản cũ dùng path.join(process.cwd(), 'assets',
// 'fonts') — SAI vì process.cwd() phụ thuộc vào chỗ bạn `node` được khởi
// chạy (Docker WORKDIR, PM2 cwd, ts-node vs dist, v.v.), không đảm bảo là
// thư mục chứa app. Khi cwd khác project root, hoặc khi bước build/Dockerfile
// không copy assets/ vào image, readFileSync ném ENOENT giữa lúc render PDF
// (crash khó debug, message không nói rõ thiếu file nào).
//
// Thay bằng resolve theo vị trí thực của FILE NÀY (import.meta.url), không
// phụ thuộc cwd. Đồng thời thử vài vị trí ứng viên phổ biến (cùng cấp dist,
// lên project root, cwd) để chịu được cả 2 kiểu deploy (build copy assets
// vào dist/ hoặc giữ assets/ ở project root cạnh dist/). Nếu vẫn không thấy
// file, ném lỗi rõ ràng liệt kê các đường dẫn đã thử — thay vì để PDFKit
// ném ENOENT khó hiểu.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function resolveFontDir() {
    const candidates = [
        // 1. Cạnh file compiled, vd dist/services/../../assets/fonts -> dist/assets/fonts
        //    (nếu build script copy assets/ vào trong dist/)
        path.join(__dirname, '..', 'assets', 'fonts'),
        // 2. Lên tới project root từ dist/services -> <root>/assets/fonts
        //    (nếu assets/ nằm ở root, ngang hàng với dist/, không bị build động tới)
        path.join(__dirname, '..', '..', 'assets', 'fonts'),
        // 3. Fallback: cwd (giữ tương thích ngược nếu ai đó chạy đúng từ root)
        path.join(process.cwd(), 'assets', 'fonts'),
    ];
    for (const dir of candidates) {
        if (fs.existsSync(path.join(dir, 'Roboto-Regular.ttf'))) {
            return dir;
        }
    }
    throw new Error(`[matchReportPdf] Không tìm thấy font Roboto-Regular.ttf. Đã thử các đường dẫn sau:\n` +
        candidates.map(c => `  - ${c}`).join('\n') +
        `\nHãy đảm bảo thư mục assets/fonts (Roboto-Regular.ttf, Roboto-Bold.ttf, ` +
        `Roboto-Italic.ttf) được copy vào image/deploy (vd: bước COPY trong Dockerfile, ` +
        `hoặc copy-assets script sau khi build TypeScript), vì tsc KHÔNG tự copy file ` +
        `non-.ts như .ttf vào thư mục dist.`);
}
const FONT_DIR = resolveFontDir();
const FONT_REGULAR = path.join(FONT_DIR, 'Roboto-Regular.ttf');
const FONT_BOLD = path.join(FONT_DIR, 'Roboto-Bold.ttf');
const FONT_ITALIC = path.join(FONT_DIR, 'Roboto-Italic.ttf');
const COL_WIDTHS = [30, 150, 55, 50, 30, 45, 40, 40];
const COL_HEADERS = ['Số áo', 'Cầu thủ', 'Vị trí', 'BT/DB', 'Bàn', 'Phản lưới', 'Thẻ V', 'Thẻ Đ'];
export function renderMatchReportPdf(report) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
        // Đăng ký font Unicode — bắt buộc phải làm TRƯỚC khi gọi .text() lần đầu.
        doc.registerFont('Body', FONT_REGULAR);
        doc.registerFont('Body-Bold', FONT_BOLD);
        doc.registerFont('Body-Italic', FONT_ITALIC);
        doc.font('Body');
        renderHeader(doc, report);
        renderScoreBlock(doc, report);
        renderGoalsTimeline(doc, report);
        doc.moveDown(1);
        renderTeamSection(doc, report.home.name, report.lineups.home);
        doc.moveDown(1);
        renderTeamSection(doc, report.away.name, report.lineups.away);
        renderSignatureSection(doc, report);
        renderFooter(doc, report);
        doc.end();
    });
}
function renderHeader(doc, report) {
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
function renderScoreBlock(doc, report) {
    const s = report.score;
    doc.fontSize(18).font('Body-Bold').text(`${report.home.name}   ${s.homeFinal} - ${s.awayFinal}   ${report.away.name}`, { align: 'center' });
    doc.moveDown(0.3);
    // Bảng tỉ số theo từng hiệp — bám theo layout biên bản mẫu
    // (Hiệp 1 / Hiệp 2 / Luân lưu / Chung cuộc) thay vì gộp một dòng text.
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
        doc.font('Body').text(label, startX, y, { width: tableWidth * 0.55, align: 'left' });
        doc.font('Body-Bold').text(value, startX + tableWidth * 0.55, y, { width: tableWidth * 0.45, align: 'right' });
        y = doc.y;
    }
    doc.y = y;
    doc.moveDown(0.5);
}
function formatGoalLabel(e) {
    const minutePart = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
    const ogSuffix = e.isOwnGoal ? ' (OG)' : '';
    return `${e.playerName} ${minutePart}${ogSuffix}`;
}
function renderGoalsTimeline(doc, report) {
    const { home, away } = report.goalsTimeline;
    if (home.length === 0 && away.length === 0)
        return;
    doc.fontSize(9).font('Body-Bold').text('Bàn thắng:', { continued: false });
    doc.font('Body').fontSize(8.5);
    const maxRows = Math.max(home.length, away.length);
    const halfWidth = 250;
    for (let i = 0; i < maxRows; i++) {
        const y = doc.y;
        const homeEntry = home[i];
        const awayEntry = away[i];
        if (homeEntry)
            doc.text(formatGoalLabel(homeEntry), doc.x, y, { width: halfWidth });
        if (awayEntry)
            doc.text(formatGoalLabel(awayEntry), doc.x + halfWidth + 20, y, { width: halfWidth });
        doc.moveDown(0.9);
    }
    doc.moveDown(0.3);
}
function renderTeamSection(doc, teamName, rows) {
    if (doc.y > 650)
        doc.addPage();
    doc.fontSize(13).font('Body-Bold').text(teamName);
    doc.moveDown(0.3);
    doc.fontSize(8.5).font('Body-Bold');
    drawRow(doc, COL_HEADERS);
    doc.moveTo(doc.x, doc.y).lineTo(555, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(0.2);
    doc.font('Body').fontSize(8.5);
    const starters = rows.filter(r => r.isStarting);
    const subs = rows.filter(r => !r.isStarting);
    for (const p of [...starters, ...subs]) {
        if (doc.y > 720)
            doc.addPage();
        drawRow(doc, [
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
function drawRow(doc, cells) {
    const startX = doc.x;
    const y = doc.y;
    let x = startX;
    cells.forEach((c, i) => {
        const width = COL_WIDTHS[i] ?? 0;
        doc.text(c, x, y, { width, continued: false });
        x += width;
    });
    doc.y = y;
    doc.x = startX;
    doc.moveDown(1);
}
// ─── Phần chữ ký xác nhận kết quả của 2 đội ───────────────────────────────
// Thêm mới theo yêu cầu — mỗi đội một ô "Thay mặt đội bóng" + dòng kẻ để ký tay
// sau khi in ra giấy, giống mẫu biên bản tham khảo.
function renderSignatureSection(doc, report) {
    const boxHeight = 90;
    if (doc.y > doc.page.height - boxHeight - 60)
        doc.addPage();
    doc.moveDown(1.5);
    const pageLeft = doc.page.margins.left;
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / 2;
    const topY = doc.y;
    // Khung ngoài
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
    // Ô ký của trọng tài/giám sát bên dưới
    const refBoxTop = doc.y;
    doc.rect(pageLeft, refBoxTop, pageWidth, 60).strokeColor('#cccccc').stroke();
    doc.fontSize(9).font('Body-Bold').text('Trọng tài điều khiển trận đấu', pageLeft + 10, refBoxTop + 10, { width: pageWidth - 20 });
    doc.fontSize(9).font('Body').text('Chữ ký:', pageLeft + 10, refBoxTop + 40);
    doc.y = refBoxTop + 70;
}
function renderFooter(doc, report) {
    doc.moveDown(1);
    doc.fontSize(8).font('Body-Italic').fillColor('#888888').text(`Biên bản được xuất tự động lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`, { align: 'right' });
}
//# sourceMappingURL=matchReportPdf.service.js.map