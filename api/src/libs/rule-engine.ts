import { createAppError } from "../common/app.error.js";
import { createTournamentRuleSchema } from "../dtos/tournamentRule.schema.js";

interface EvidenceJson {
    win_points?: unknown;
    draw_points?: unknown;
    lose_points?: unknown;
    tiebreaker_order?: unknown;
    [key: string]: unknown;
}

export function runRuleEngine(evidence: EvidenceJson) {
    const required = ["win_points", "draw_points", "lose_points", "tiebreaker_order"];
    const missing = required.filter((f) => evidence[f] === undefined || evidence[f] === null);
    if (missing.length) {
        throw createAppError("VALIDATION_ERROR", `Thiếu field bắt buộc: ${missing.join(", ")}`);
    }

    const winPoints = Number(evidence.win_points);
    const drawPoints = Number(evidence.draw_points);
    const losePoints = Number(evidence.lose_points);

    if (!Number.isInteger(winPoints) || !Number.isInteger(drawPoints) || !Number.isInteger(losePoints)) {
        throw createAppError("VALIDATION_ERROR", "Points phải là số nguyên — LLM extract sai type");
    }
    if (!(winPoints > drawPoints && drawPoints >= losePoints && losePoints >= 0)) {
        throw createAppError("VALIDATION_ERROR", `Vi phạm invariant: win=${winPoints}, draw=${drawPoints}, lose=${losePoints}`);
    }

    const tiebreakers = evidence.tiebreaker_order;
    if (!Array.isArray(tiebreakers) || tiebreakers.length === 0) {
        throw createAppError("VALIDATION_ERROR", "tiebreaker_order phải là array không rỗng");
    }
    const uniqueTiebreakers = [...new Set(tiebreakers)];
    if (uniqueTiebreakers.length !== tiebreakers.length) {
        throw createAppError("VALIDATION_ERROR", "tiebreaker_order có giá trị duplicate");
    }

    const parsed = createTournamentRuleSchema.safeParse({
        ...evidence,
        win_points: winPoints,
        draw_points: drawPoints,
        lose_points: losePoints,
        tiebreaker_order: uniqueTiebreakers,
    });
    if (!parsed.success) {
        throw createAppError("VALIDATION_ERROR", parsed.error.issues.map((i) => i.message).join("; "));
    }

    return parsed.data;
}