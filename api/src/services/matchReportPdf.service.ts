import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MatchReportOutput, MatchReportPlayerRow, MatchReportTeamInfo } from '../types/matchReport.type.js';
import { MatchReportGoalEntry } from '../helper/match.helper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ResolvedFonts {
    regular: string;
    bold: string;
    italic: string;
}

interface TeamAssets {
    logo: Buffer | null;
}
type EventKind = 'goal' | 'ownGoal' | 'yellowCard' | 'redCard';

/**
 * FIX (field bị rớt khi render): trước đây `RenderEventRow` chỉ có
 * minute/addedMinute — bỏ hẳn `clockTime`/`clockConfidence` mà
 * `MatchReportGoalEntry` (match.helper.ts) đã tính sẵn cho "giờ thực"
 * (9h + phút = 9h05). Data có sẵn nhưng tầng render không dùng, nên PDF
 * export không bao giờ hiện giờ thực dù report JSON đã có.
 *
 * Giờ chuẩn hoá thành 1 type duy nhất `TimelineEntry`, build qua 1 hàm
 * `buildTimelineEntry()` duy nhất (trước đây có 2 hàm gần như giống hệt
 * nhau — `toEventRow`/`toCardEventRow` — chỉ khác input shape, gộp lại).
 *
 * `clockLabel` là `string | null`: null chỉ khi thiếu `scheduled_at` của
 * trận (report cho trận chưa có lịch cụ thể) — KHÔNG còn phân biệt goal vs
 * card như trước. match.helper.ts đã được mở rộng để tính clockTime cho cả
 * card (yellow/red), không chỉ goal.
 */
interface TimelineEntry {
    minuteLabel: string;       // "45+2'" hoặc "-" (penalty không có phút)
    clockLabel: string | null; // "~09:05" hoặc null nếu không tính được
    teamName: string;
    playerName: string;
    kind: EventKind;
    sortMinute: number;        // tách riêng khỏi label để sort không phải parse lại string
    sortAddedMinute: number;
}

const COL_WIDTHS = [30, 150, 55, 50, 30, 45, 40, 40] as const;
const COL_HEADERS = ['Số áo', 'Cầu thủ', 'Vị trí', 'Trạng thái', 'Bàn', 'Phản lưới', 'Thẻ V', 'Thẻ Đ'];
// FIX: table border trước đây hardcode x=555 (không khớp tổng COL_WIDTHS=440,
// lệch ra ngoài nội dung bảng thật). Derive từ chính COL_WIDTHS — 1 nguồn sự thật.
const TABLE_WIDTH = COL_WIDTHS.reduce((a, b) => a + b, 0);

const IMAGE_FETCH_TIMEOUT_MS = 5000;

// Màu badge — vector-based, KHÔNG phụ thuộc glyph emoji của font (NotoSans
// không có emoji màu, ⚽/🟨/🟥 trước đây render ra ô trống, không đọc được
// loại sự kiện sau khi export). doc.rect()/doc.circle().fill() luôn render
// được bất kể font đang active, đây là kỹ thuật giống renderJerseySwatch()
// đã dùng ổn định trong file này.
const BADGE_COLOR: Record<EventKind, string> = {
    goal: '#1f2937',
    ownGoal: '#f97316',
    yellowCard: '#facc15',
    redCard: '#ef4444',
};
const BADGE_SIZE = 8;

export class MatchReportPdfRenderer {
    // Font path resolution + fs.existsSync là I/O — cache ở static level,
    // dùng chung cho mọi instance/request trong cùng process thay vì re-resolve
    // mỗi lần render (trước đây đã cache nhưng ở module scope, giờ gắn vào class
    // để không rò rỉ state ra ngoài module).
    private static fontsCache: ResolvedFonts | null = null;
    private static fontsError: Error | null = null;

    // State riêng theo từng lần render — instance này KHÔNG được tái sử dụng
    // giữa các request đồng thời (factory function bên dưới tạo instance mới
    // mỗi lần gọi, đảm bảo an toàn concurrency).
    private doc!: PDFKit.PDFDocument;

    async render(report: MatchReportOutput): Promise<Buffer> {
        const [homeLogo, awayLogo] = await Promise.all([
            this.fetchImageBuffer(report.home.jersey.logoUrl),
            this.fetchImageBuffer(report.away.jersey.logoUrl),
        ]);

        const fonts = MatchReportPdfRenderer.getFonts();

        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: 'A4', margin: 40 });
            this.doc = doc;
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            doc.registerFont('Body', fonts.regular);
            doc.registerFont('Body-Bold', fonts.bold);
            doc.registerFont('Body-Italic', fonts.italic);
            doc.font('Body');

            this.renderHeader(report, { logo: homeLogo }, { logo: awayLogo });
            this.renderScoreBlock(report);
            this.renderEventsTimeline(report);

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
    private static resolveFontDir(): string {
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

        throw new Error(
            `[MatchReportPdfRenderer] Không tìm thấy font NotoSans-Regular.ttf. Đã thử các đường dẫn sau:\n` +
            candidates.map(c => `  - ${c}`).join('\n') +
            `\nHãy đảm bảo thư mục assets/fonts (NotoSans-Regular.ttf, NotoSans-Bold.ttf, ` +
            `NotoSans-Italic.ttf) được copy vào image/deploy (vd: bước COPY trong Dockerfile, ` +
            `hoặc copy-assets script sau khi build TypeScript), vì tsc KHÔNG tự copy file ` +
            `non-.ts như .ttf vào thư mục dist.`,
        );
    }

    private static getFonts(): ResolvedFonts {
        if (MatchReportPdfRenderer.fontsCache) return MatchReportPdfRenderer.fontsCache;
        if (MatchReportPdfRenderer.fontsError) throw MatchReportPdfRenderer.fontsError;

        try {
            const dir = MatchReportPdfRenderer.resolveFontDir();
            MatchReportPdfRenderer.fontsCache = {
                regular: path.join(dir, 'NotoSans-Regular.ttf'),
                bold: path.join(dir, 'NotoSans-Bold.ttf'),
                italic: path.join(dir, 'NotoSans-Italic.ttf'),
            };
            return MatchReportPdfRenderer.fontsCache;
        } catch (err) {
            MatchReportPdfRenderer.fontsError = err as Error;
            throw MatchReportPdfRenderer.fontsError;
        }
    }

    // ─── Logo fetch ─────────────────────────────────────────────────────────
    private async fetchImageBuffer(url: string | null | undefined): Promise<Buffer | null> {
        if (!url) return null;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), IMAGE_FETCH_TIMEOUT_MS);
        try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) return null;
            const contentType = res.headers.get('content-type') ?? '';
            if (!/image\/(png|jpe?g)/i.test(contentType)) return null;
            const buf = Buffer.from(await res.arrayBuffer());
            return buf.length > 0 ? buf : null;
        } catch {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    // ─── Layout helper ──────────────────────────────────────────────────────
    private hasSpaceFor(minHeight: number): boolean {
        const doc = this.doc;
        return doc.y + minHeight <= doc.page.height - doc.page.margins.bottom;
    }

    // ─── Sections ───────────────────────────────────────────────────────────
    private renderHeader(report: MatchReportOutput, homeAssets: TeamAssets, awayAssets: TeamAssets) {
        const doc = this.doc;
        const logoSize = 44;
        const topY = doc.y;
        const centerX = doc.page.width / 2;

        if (homeAssets.logo) {
            try {
                doc.image(homeAssets.logo, centerX - 170, topY, { width: logoSize, height: logoSize, fit: [logoSize, logoSize] });
            } catch {
                // buffer decode lỗi (corrupt/không đúng format thực) — bỏ qua, không phá layout
            }
        }
        if (awayAssets.logo) {
            try {
                doc.image(awayAssets.logo, centerX + 126, topY, { width: logoSize, height: logoSize, fit: [logoSize, logoSize] });
            } catch {
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
        doc.text(
            `Sân: ${report.venueName ?? 'Chưa xác định'}  |  Trọng tài: ${report.referee ?? 'Chưa xác định'}`,
            { align: 'center' },
        );
        doc.moveDown(0.8);
    }

    private renderScoreBlock(report: MatchReportOutput) {
        const doc = this.doc;
        const s = report.score;
        doc.fontSize(18).font('Body-Bold').text(
            `${report.home.name}   ${s.homeFinal} - ${s.awayFinal}   ${report.away.name}`,
            { align: 'center' },
        );
        doc.moveDown(0.3);

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

    // ─── Timeline: format + build ───────────────────────────────────────────

    /**
     * Nguồn định dạng phút DUY NHẤT trong file này — trước đây bị viết tay
     * lại ngay trong loop render (ternary trùng logic với
     * `formatMinuteLabel()` đã export sẵn ở match.helper.ts). Không gọi
     * thẳng `formatMinuteLabel` vì signature của nó yêu cầu nguyên object
     * `MatchReportGoalEntry` (kèm isOwnGoal/playerName/clockTime không liên
     * quan) — card events không có shape đó. Định nghĩa local 1 lần, dùng
     * lại cho cả goal lẫn card, để KHÔNG còn 2 chỗ tự quyết định format phút
     * khác nhau trong cùng file.
     */
    private formatMinute(minute: number | null, addedMinute: number | null): string {
        if (minute == null) return '-';
        return addedMinute ? `${minute}+${addedMinute}'` : `${minute}'`;
    }

    /**
     * Giờ thực — cùng công thức với `formatClockLabel()` (match.helper.ts)
     * nhưng nhận thẳng (clockTime, clockConfidence) thay vì cả object
     * `MatchReportGoalEntry`, để card events (không có object đó) vẫn gọi
     * được nếu sau này match.helper.ts được mở rộng để tính clock cho thẻ.
     */
    private formatClock(clockTime: Date | null | undefined, clockConfidence: 'exact' | 'estimated' | null | undefined): string | null {
        if (!clockTime) return null;
        const hh = clockTime.getHours().toString().padStart(2, '0');
        const mm = clockTime.getMinutes().toString().padStart(2, '0');
        const prefix = clockConfidence === 'estimated' ? '~' : '';
        return `${prefix}${hh}:${mm}`;
    }

    private buildTimelineEntry(params: {
        minute: number | null;
        addedMinute: number | null;
        clockTime?: Date | null;
        clockConfidence?: 'exact' | 'estimated' | null;
        teamName: string;
        playerName: string;
        kind: EventKind;
    }): TimelineEntry {
        return {
            minuteLabel: this.formatMinute(params.minute, params.addedMinute),
            clockLabel: this.formatClock(params.clockTime, params.clockConfidence),
            teamName: params.teamName,
            playerName: params.playerName,
            kind: params.kind,
            sortMinute: params.minute ?? Infinity,
            sortAddedMinute: params.addedMinute ?? 0,
        };
    }

    private goalToTimelineEntry(e: MatchReportGoalEntry, teamName: string): TimelineEntry {
        return this.buildTimelineEntry({
            minute: e.minute,
            addedMinute: e.addedMinute,
            clockTime: e.clockTime,
            clockConfidence: e.clockConfidence,
            teamName,
            playerName: e.playerName,
            kind: e.isOwnGoal ? 'ownGoal' : 'goal',
        });
    }

    private collectCardEntries(rows: MatchReportPlayerRow[], teamName: string): TimelineEntry[] {
        const result: TimelineEntry[] = [];
        for (const p of rows) {
            for (const e of p.yellowCards) {
                result.push(this.buildTimelineEntry({
                    minute: e.minute, addedMinute: e.addedMinute,
                    clockTime: e.clockTime, clockConfidence: e.clockConfidence, // FIX: match.helper.ts giờ tính clock cho card, không còn luôn null
                    teamName, playerName: p.fullName, kind: 'yellowCard',
                }));
            }
            for (const e of p.redCards) {
                result.push(this.buildTimelineEntry({
                    minute: e.minute, addedMinute: e.addedMinute,
                    clockTime: e.clockTime, clockConfidence: e.clockConfidence,
                    teamName, playerName: p.fullName, kind: 'redCard',
                }));
            }
        }
        return result;
    }

    /**
     * Vẽ badge màu bằng vector (rect/circle), KHÔNG dùng ký tự emoji —
     * đảm bảo hiển thị được bất kể font active có glyph emoji hay không.
     * Reset fillColor về đen sau khi vẽ — nếu không, `doc.text()` gọi ngay
     * sau đó (tên cầu thủ) sẽ bị nhuộm màu badge cuối cùng đã vẽ (cùng loại
     * bug mà `renderJerseySwatch()` trong file này đã né bằng cách reset
     * tương tự).
     */
    private drawEventBadge(kind: EventKind, x: number, y: number): void {
        const doc = this.doc;
        const color = BADGE_COLOR[kind];
        if (kind === 'goal' || kind === 'ownGoal') {
            doc.circle(x + BADGE_SIZE / 2, y + BADGE_SIZE / 2, BADGE_SIZE / 2).fillColor(color).fill();
        } else {
            doc.rect(x, y, BADGE_SIZE, BADGE_SIZE).fillColor(color).fill();
        }
        doc.fillColor('black');
    }

    private renderEventLegend() {
        const doc = this.doc;
        const leftX = doc.page.margins.left;
        const items: [EventKind, string][] = [
            ['goal', 'Bàn thắng'],
            ['ownGoal', 'Phản lưới nhà'],
            ['yellowCard', 'Thẻ vàng'],
            ['redCard', 'Thẻ đỏ'],
        ];
        const y = doc.y;
        let x = leftX;
        doc.fontSize(7.5).font('Body');
        for (const [kind, label] of items) {
            this.drawEventBadge(kind, x, y + 1);
            doc.text(label, x + BADGE_SIZE + 4, y, { width: 78, continued: false });
            x += 90;
        }
        doc.y = y + 14;
        doc.moveDown(0.2);
    }

    private renderEventsTimeline(report: MatchReportOutput) {
        const doc = this.doc;
        const leftX = doc.page.margins.left; // neo cố định, không dùng doc.x (bị pdfkit mutate)

        const entries: TimelineEntry[] = [
            ...report.goalsTimeline.home.map(e => this.goalToTimelineEntry(e, report.home.name)),
            ...report.goalsTimeline.away.map(e => this.goalToTimelineEntry(e, report.away.name)),
            ...this.collectCardEntries(report.lineups.home, report.home.name),
            ...this.collectCardEntries(report.lineups.away, report.away.name),
        ].sort((a, b) => a.sortMinute - b.sortMinute || a.sortAddedMinute - b.sortAddedMinute);

        if (entries.length === 0) return;

        doc.fontSize(9).font('Body-Bold').text('Diễn biến trận đấu:', leftX, doc.y);
        doc.moveDown(0.2);
        this.renderEventLegend();

        doc.font('Body').fontSize(8.5);

        for (const ev of entries) {
            if (doc.y > doc.page.height - doc.page.margins.bottom - 20) doc.addPage();
            const y = doc.y;

            this.drawEventBadge(ev.kind, leftX, y + 1);

            doc.text(ev.minuteLabel, leftX + BADGE_SIZE + 6, y, { width: 32 });

            const nameSuffix = ev.kind === 'ownGoal' ? ' (phản lưới)' : '';
            doc.text(`${ev.playerName}${nameSuffix}`, leftX + BADGE_SIZE + 40, y, { width: 220 });

            // Giờ thực — chỉ hiện khi có (goal luôn có nếu scheduled_at tồn
            // tại; card hiện null cho tới khi match.helper.ts được mở rộng
            // để tính clock cho thẻ, xem docblock TimelineEntry ở đầu file).
            doc.fillColor('#6b7280').text(ev.clockLabel ?? '', leftX + BADGE_SIZE + 262, y, { width: 45 });
            doc.fillColor('black');

            doc.text(ev.teamName, leftX + BADGE_SIZE + 310, y, { width: TABLE_WIDTH - BADGE_SIZE - 310, align: 'right' });
            doc.moveDown(0.75);
        }
        doc.moveDown(0.3);
    }

    // Màu áo hiển thị dạng swatch (rect fill) — không dùng ảnh jersey vì
    // image_url cho trang phục thường là ảnh minh hoạ lớn, không hợp render
    // nhỏ cạnh tên đội; color swatch luôn render được kể cả khi thiếu image_url,
    // miễn có primaryColor (là field bắt buộc theo nghiệp vụ khi tạo jersey).
    private renderJerseySwatch(jersey: MatchReportTeamInfo['jersey'], x: number, y: number) {
        const doc = this.doc;
        if (!jersey.primaryColor) return;
        try {
            doc.rect(x, y, 12, 12).fill(jersey.primaryColor);
            if (jersey.secondaryColor) {
                doc.rect(x + 14, y, 12, 12).fill(jersey.secondaryColor);
            }
        } catch { /* invalid color string */ }
        doc.fillColor('black');
    }

    private renderTeamSection(team: MatchReportTeamInfo, rows: MatchReportPlayerRow[]) {
        const doc = this.doc;
        if (!this.hasSpaceFor(180)) doc.addPage();

        const leftX = doc.page.margins.left;   // luôn neo lại left margin tường minh
        const titleY = doc.y;
        doc.fontSize(13).font('Body-Bold').text(team.name, leftX, titleY, { continued: false });

        const swatchX = doc.page.width - doc.page.margins.right - 40;
        this.renderJerseySwatch(team.jersey, swatchX, titleY + 2);
        doc.x = leftX;              // reset cursor tường minh, không phụ thuộc save/restore
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
            if (!this.hasSpaceFor(20)) doc.addPage();
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

    private drawRow(cells: string[]) {
        const doc = this.doc;
        const startX = doc.x;
        const y = doc.y;
        let x = startX;

        const rowHeight = Math.max(
            ...cells.map((c, i) => doc.heightOfString(c, { width: COL_WIDTHS[i] ?? 0 })),
            doc.currentLineHeight(),
        );

        cells.forEach((c, i) => {
            const width = COL_WIDTHS[i] ?? 0;
            doc.text(c, x, y, { width, continued: false });
            x += width;
        });

        doc.x = startX;
        doc.y = y + rowHeight + 2;
    }

    private renderSignatureSection(report: MatchReportOutput) {
        const doc = this.doc;
        const boxHeight = 90;
        if (doc.y > doc.page.height - boxHeight - 60) doc.addPage();

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

    private renderFooter() {
        const doc = this.doc;
        doc.moveDown(1);
        doc.fontSize(8).font('Body-Italic').fillColor('#888888').text(
            `Biên bản được xuất tự động lúc ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`,
            { align: 'right' },
        );
    }
}

// Giữ nguyên call site cũ (matchApi.getMatchReport / route handler) —
// không phải sửa import ở nơi khác đang gọi renderMatchReportPdf().
export async function renderMatchReportPdf(report: MatchReportOutput): Promise<Buffer> {
    return new MatchReportPdfRenderer().render(report);
}