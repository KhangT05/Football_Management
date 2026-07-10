import PDFDocument from 'pdfkit';
import { MatchReportOutput, MatchReportPlayerRow } from '../types/matchReport.type.js';
import { MatchReportGoalEntry } from '../helper/match.helper.js';

const COL_WIDTHS = [35, 170, 55, 55, 35, 55, 45, 45];
const COL_HEADERS = ['Số áo', 'Cầu thủ', 'Vị trí', 'BT/DB', 'Bàn', 'Phản lưới', 'Thẻ V', 'Thẻ Đ'];

export function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 40 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        renderHeader(doc, report);
        renderScoreBlock(doc, report);
        renderGoalsTimeline(doc, report);

        doc.moveDown(1);
        renderTeamSection(doc, report.home.name, report.lineups.home);
        doc.moveDown(1);
        renderTeamSection(doc, report.away.name, report.lineups.away);

        renderFooter(doc, report);

        doc.end();
    });
}

function renderHeader(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    doc.fontSize(16).font('Helvetica-Bold').text('BIÊN BẢN TRẬN ĐẤU', { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(10).font('Helvetica');

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
    doc.fontSize(18).font('Helvetica-Bold').text(
        `${report.home.name}   ${s.homeFinal} - ${s.awayFinal}   ${report.away.name}`,
        { align: 'center' },
    );
    doc.moveDown(0.3);

    const parts: string[] = [`HT: ${s.homeHalfTime ?? '-'} - ${s.awayHalfTime ?? '-'}`];
    if (s.homeExtraTime != null) parts.push(`ET: ${s.homeExtraTime}-${s.awayExtraTime}`);
    if (s.homePenalty != null) parts.push(`Pen: ${s.homePenalty}-${s.awayPenalty}`);

    doc.fontSize(9).font('Helvetica').text(parts.join('   |   '), { align: 'center' });
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

    doc.fontSize(9).font('Helvetica-Bold').text('Bàn thắng:', { continued: false });
    doc.font('Helvetica').fontSize(8.5);

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
    if (doc.y > 680) doc.addPage();

    doc.fontSize(13).font('Helvetica-Bold').text(teamName);
    doc.moveDown(0.3);

    doc.fontSize(8.5).font('Helvetica-Bold');
    drawRow(doc, COL_HEADERS);
    doc.moveTo(doc.x, doc.y).lineTo(555, doc.y).strokeColor('#cccccc').stroke();
    doc.moveDown(0.2);

    doc.font('Helvetica').fontSize(8.5);
    const starters = rows.filter(r => r.isStarting);
    const subs = rows.filter(r => !r.isStarting);

    for (const p of [...starters, ...subs]) {
        if (doc.y > 750) doc.addPage();
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

function renderFooter(doc: PDFKit.PDFDocument, report: MatchReportOutput) {
    doc.moveDown(1.5);
    doc.fontSize(8).font('Helvetica-Oblique').fillColor('#888888').text(
        `Biên bản được xuất tự động lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
        { align: 'right' },
    );
}