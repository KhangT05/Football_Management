import { createAppError } from "../common/app.error.js";

export function parseDaysParam(days?: number): number {
    if (days === undefined) return 30;
    if (!Number.isInteger(days) || days <= 0 || days > 365) {
        throw createAppError(
            "VALIDATION_ERROR",
            `Invalid 'days' param: ${days}`,
            "days phải là số nguyên trong khoảng 1-365",
        );
    }
    return days;
} 