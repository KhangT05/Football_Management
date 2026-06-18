import { createRequire } from "module";
import { createAppError } from "../common/app.error.js";

/**
 * Extract raw text from PDF buffer.
 * Throws VALIDATION_ERROR nếu PDF corrupt / password-protected / image-only scan.
 *
 * Caller chịu trách nhiệm check độ dài min (>= 20 chars) — đã handle ở service layer.
 */
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse") as (
    buffer: Buffer,
    options?: { pagerender?: () => string; max?: number }
) => Promise<{ text: string; numpages: number; info: unknown }>;


export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw createAppError("VALIDATION_ERROR", "PDF buffer rỗng hoặc không hợp lệ");
    }

    let result: Awaited<ReturnType<typeof pdfParse>>;
    try {
        result = await pdfParse(buffer, {
            pagerender: () => "",
            max: 50,
        });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        const isEncrypted =
            message.toLowerCase().includes("encrypt") ||
            message.toLowerCase().includes("password");

        throw createAppError(
            "VALIDATION_ERROR",
            isEncrypted
                ? "PDF được mã hoá, cần password để đọc"
                : `PDF parse thất bại: ${message}`
        );
    }

    return result.text ?? "";
}