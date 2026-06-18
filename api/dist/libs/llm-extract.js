// import OpenAI from "openai";
// import { createAppError } from "../common/app.error.js";
// import { TiebreakerOption } from "../dtos/tournamentRule.schema.js";
export {};
// const client = new OpenAI({
//     apiKey: process.env.GEMINI_API_KEY,
//     baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
// });
// const MAX_TEXT_CHARS = 12_000;
// // Map LLM canonical → DB enum
// const TIEBREAKER_MAP: Record<string, TiebreakerOption> = {
//     goal_difference: "goal_diff",
//     goals_scored: "goals_scored",
//     head_to_head: "head_to_head",
//     yellow_cards: "yellow_cards",
//     red_cards: "red_cards",
//     drawing_of_lots: "goals_conceded", // không có slot phù hợp — xem note bên dưới
//     goals_conceded: "goals_conceded",
// };
// const SYSTEM_PROMPT = `Bạn là parser chuyên trích xuất thể lệ thi đấu bóng đá từ văn bản.
// Trả về JSON object THUẦN TÚY, không có markdown, không có giải thích.
// Schema bắt buộc:
// {
//   "points_per_win": number,
//   "points_per_draw": number,
//   "points_per_loss": number,
//   "tiebreaker_order": string[]
// }
// Quy tắc:
// - Nếu không tìm thấy field nào, set null.
// - tiebreaker_order dùng: "goal_difference", "goals_scored", "head_to_head", "yellow_cards", "red_cards", "goals_conceded", "drawing_of_lots"
// - Map thuật ngữ tiếng Việt sang giá trị trên (vd "hiệu số bàn thắng" → "goal_difference").
// - Không suy đoán nếu văn bản không đề cập rõ — trả null.`;
// export interface EvidenceJson {
//     points_per_win: number | null;
//     points_per_draw: number | null;
//     points_per_loss: number | null;
//     tiebreaker_order: string[] | null;
// }
// export interface ExtractedEvidence {
//     evidence: EvidenceJson;
//     tiebreaker_order: TiebreakerOption[];
//     unmapped_tiebreakers: string[]; // để ghi import_note
// }
// export async function extractEvidenceWithLLM(rawText: string): Promise<ExtractedEvidence> {
//     const truncated = rawText.length > MAX_TEXT_CHARS ? rawText.slice(0, MAX_TEXT_CHARS) : rawText;
//     const evidence = await callWithRetry(truncated, 2);
//     const unmapped_tiebreakers: string[] = [];
//     const tiebreaker_order: TiebreakerOption[] = [];
//     for (const item of evidence.tiebreaker_order ?? []) {
//         const mapped = TIEBREAKER_MAP[item];
//         if (mapped) {
//             tiebreaker_order.push(mapped);
//         } else {
//             unmapped_tiebreakers.push(item);
//         }
//     }
//     return { evidence, tiebreaker_order, unmapped_tiebreakers };
// }
// async function callWithRetry(text: string, maxAttempts: number): Promise<EvidenceJson> {
//     let lastError: unknown;
//     for (let attempt = 1; attempt <= maxAttempts; attempt++) {
//         try {
//             const completion = await client.chat.completions.create({
//                 model: "gemini-2.5-flash",
//                 max_tokens: 512,
//                 messages: [
//                     { role: "system", content: SYSTEM_PROMPT },
//                     { role: "user", content: `Trích xuất thể lệ từ văn bản sau:\n\n${text}` },
//                 ],
//             });
//             const responseText = completion.choices[0]?.message?.content ?? "";
//             return parseJsonStrict(responseText);
//         } catch (err) {
//             lastError = err;
//             if (attempt < maxAttempts) {
//                 await sleep(500 * attempt);
//             }
//         }
//     }
//     const isParseError = lastError instanceof SyntaxError;
//     throw createAppError(
//         "VALIDATION_ERROR",
//         isParseError
//             ? "LLM trả về response không phải JSON hợp lệ sau nhiều lần retry"
//             : `LLM API thất bại: ${lastError instanceof Error ? lastError.message : String(lastError)}`
//     );
// }
// function parseJsonStrict(text: string): EvidenceJson {
//     const cleaned = text
//         .replace(/^```(?:json)?\s*/i, "")
//         .replace(/\s*```\s*$/i, "")
//         .trim();
//     const parsed = JSON.parse(cleaned);
//     if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
//         throw new SyntaxError("LLM response không phải JSON object");
//     }
//     return parsed as EvidenceJson;
// }
// function sleep(ms: number): Promise<void> {
//     return new Promise((resolve) => setTimeout(resolve, ms));
// }
//# sourceMappingURL=llm-extract.js.map