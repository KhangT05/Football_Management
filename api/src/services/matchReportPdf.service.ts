import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MatchReportOutput, MatchReportPlayerRow } from '../types/matchReport.type.js';
import { MatchReportGoalEntry } from '../helper/match.helper.js';

// ─── Font Unicode tiếng Việt ───────────────────────────────────────────────
// FIX GỐC: PDFKit mặc định dùng 14 font chuẩn PDF (Helvetica, Times, ...),
// các font này KHÔNG có glyph cho ký tự có dấu tiếng Việt (ư, ơ, đ, ệ...).
// Phải embed 1 font TTF hỗ trợ Unicode đầy đủ (Roboto/Noto Sans).
//
// FIX #2 (production ENOENT): resolve theo vị trí thực của FILE NÀY
// (import.meta.url), không phụ thuộc process.cwd().
//
// FIX #3 (CRITICAL — sập cả server, không chỉ tính năng PDF):
// Bản trước gọi resolveFontDir() ở top-level lúc MODULE ĐƯỢC IMPORT
// (`const FONT_DIR = resolveFontDir()`). app.ts import
// MatchReportBinaryController -> import module này ngay từ lúc khởi động,
// nên nếu thiếu font là process.exit ngay khi boot — toàn bộ API (live
// score, team management, ...) chết theo, không riêng gì xuất PDF.
// Đúng ra thiếu 1 asset không quan trọng bằng cả hệ thống thì không nên
// crash toàn app; chỉ nên fail đúng cái request xuất báo cáo đó thôi.
//
// Fix: đổi sang lazy resolution — chỉ resolve + throw lúc thực sự có người
// gọi renderMatchReportPdf(), và cache lại kết quả (hoặc lỗi) cho lần sau
// khỏi phải stat lại filesystem mỗi request.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ResolvedFonts {
    regular: string;
    bold: string;
    italic: string;
}

let cachedFonts: ResolvedFonts | null = null;
let cachedError: Error | null = null;

function resolveFontDir(): string {
    const candidates = [
        // 1. Cạnh file compiled, vd dist/services/../assets -> dist/assets/fonts
        //    (nếu build script copy assets/ vào trong dist/)
        path.join(__dirname, '..', 'assets', 'fonts'),
        // 2. Lên tới project root từ dist/services -> <root>/assets/fonts
        //    (nếu assets/ nằm ở root, ngang hàng với dist/)
        path.join(__dirname, '..', '..', 'assets', 'fonts'),
        // 3. Fallback: cwd (giữ tương thích ngược nếu chạy đúng từ root)
        path.join(process.cwd(), 'assets', 'fonts'),
    ];

    for (const dir of candidates) {
        if (fs.existsSync(path.join(dir, 'Roboto-Regular.ttf'))) {
            return dir;
        }
    }

    throw new Error(
        `[matchReportPdf] Không tìm thấy font Roboto-Regular.ttf. Đã thử các đường dẫn sau:\n` +
        candidates.map(c => `  - ${c}`).join('\n') +
        `\nHãy đảm bảo thư mục assets/fonts (Roboto-Regular.ttf, Roboto-Bold.ttf, ` +
        `Roboto-Italic.ttf) được copy vào image/deploy (vd: bước COPY trong Dockerfile, ` +
        `hoặc copy-assets script sau khi build TypeScript), vì tsc KHÔNG tự copy file ` +
        `non-.ts như .ttf vào thư mục dist.`,
    );
}

function getFonts(): ResolvedFonts {
    if (cachedFonts) return cachedFonts;
    // Không retry filesystem mỗi request nếu đã biết chắc thiếu file —
    // nhưng vẫn throw lại lỗi gốc (không nuốt lỗi) để controller trả 500
    // với message rõ ràng thay vì lỗi mơ hồ khác ở chỗ dùng font.
    if (cachedError) throw cachedError;

    try {
        const dir = resolveFontDir();
        cachedFonts = {
            regular: path.join(dir, 'Roboto-Regular.ttf'),
            bold: path.join(dir, 'Roboto-Bold.ttf'),
            italic: path.join(dir, 'Roboto-Italic.ttf'),
        };
        return cachedFonts;
    } catch (err) {
        cachedError = err as Error;
        throw cachedError;
    }
}

const COL_WIDTHS = [30, 150, 55, 50, 30, 45, 40, 40];
const COL_HEADERS = ['Số áo', 'Cầu thủ', 'Vị trí', 'BT/DB', 'Bàn', 'Phản lưới', 'Thẻ V', 'Thẻ Đ'];

export function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        let fonts: ResolvedFonts;
        try {
            fonts = getFonts();
        } catch (err) {
            reject(err);
            return;
        }

        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Đăng ký font Unicode — bắt buộc phải làm TRƯỚC khi gọi .text() lần đầu.
        doc.registerFont('Body', fonts.regular);
        doc.registerFont('Body-Bold', fonts.bold);
        doc.registerFont('Body-Italic', fonts.italic);
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

function renderHeader(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
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
    doc.text(
        `Sân: ${report.venueName ?? 'Chưa xác định'}  |  Trọng tài: ${report.referee ?? 'Chưa xác định'}`,
        { align: 'center' },
    );
    doc.moveDown(0.8);
}

function renderScoreBlock(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    const s = report.score;
    doc.fontSize(18).font('Body-Bold').text(
        `${report.home.name}   ${s.homeFinal} - ${s.awayFinal}   ${report.away.name}`,
        { align: 'center' },
    );
    doc.moveDown(0.3);

    // Bảng tỉ số theo từng hiệp — bám theo layout biên bản mẫu
    // (Hiệp 1 / Hiệp 2 / Luân lưu / Chung cuộc) thay vì gộp một dòng text.
    const rows: [string, string][] = [
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

function formatGoalLabel(e: MatchReportGoalEntry): string {
    const minutePart = e.addedMinute ? `${e.minute}+${e.addedMinute}'` : `${e.minute}'`;
    const ogSuffix = e.isOwnGoal ? ' (OG)' : '';
    return `${e.playerName} ${minutePart}${ogSuffix}`;
}

function renderGoalsTimeline(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    const { home, away } = report.goalsTimeline;
    if (home.length === 0 && away.length === 0) return;

    doc.fontSize(9).font('Body-Bold').text('Bàn thắng:', { continued: false });
    doc.font('Body').fontSize(8.5);

    const maxRows = Math.max(home.length, away.length);
    const halfWidth = 250;

    for (let i = 0; i < maxRows; i++) {
        const y = doc.y;
        const homeEntry = home[i];
        const awayEntry = away[i];
        if (homeEntry) doc.text(formatGoalLabel(homeEntry), doc.x, y, { width: halfWidth });
        if (awayEntry) doc.text(formatGoalLabel(awayEntry), doc.x + halfWidth + 20, y, { width: halfWidth });
        doc.moveDown(0.9);
    }
    doc.moveDown(0.3);
}

function renderTeamSection(doc: PDFKit.PDFDocument, teamName: string, rows: MatchReportPlayerRow[]) {
    if (doc.y > 650) doc.addPage();

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
        if (doc.y > 720) doc.addPage();
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

function drawRow(doc: PDFKit.PDFDocument, cells: string[]) {
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
// Mỗi đội một ô "Thay mặt đội bóng" + dòng kẻ để ký tay sau khi in ra giấy,
// giống mẫu biên bản tham khảo.
function renderSignatureSection(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    const boxHeight = 90;
    if (doc.y > doc.page.height - boxHeight - 60) doc.addPage();

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

function renderFooter(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    doc.moveDown(1);
    doc.fontSize(8).font('Body-Italic').fillColor('#888888').text(
        `Biên bản được xuất tự động lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
        { align: 'right' },
    );
}