import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AppError } from "../common/app.error.js";
import { ValidateError } from "tsoa";
import { Prisma } from "../generated/prisma/client.js";
import { AUTH_CODE } from "../common/error.code.js";

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const requestId = (req.headers["x-request-id"] as string) ?? crypto.randomUUID();

    if (err instanceof AppError) {

        const isAuthError = AUTH_CODE.has(err.code);

        // Auth errors: luôn log internal, expose generic message — tránh leak resource existence
        console.error(`[AppError] ${err.code}: ${err.internalMessage ?? err.message} | requestId=${requestId}`);

        res.status(err.exposedStatus).json({
            status: false,
            code: isAuthError ? "FORBIDDEN" : err.code,
            message: isAuthError
                ? "Access denied"
                : (err.clientMessage ?? "Request failed"),
            data: null,
            timestamp: new Date().toISOString(),
            requestId,
        });
        return;
    }

    if (err instanceof ValidateError || err?.name === "ValidateError") {
        const validateErr = err as ValidateError;
        console.warn(`[ValidateError] Caught Validation Error for ${req.path}:`, validateErr.fields);
        res.status(422).json({
            status: false,
            code: "VALIDATION_FAILED",
            message: "Validation failed",
            data: validateErr.fields,
            timestamp: new Date().toISOString(),
            requestId,
        });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            let field = "";
            if (err.meta && err.meta.target) {
                field = Array.isArray(err.meta.target) ? err.meta.target.join(", ") : String(err.meta.target);
            }
            res.status(409).json({
                status: false,
                code: "CONFLICT",
                message: field ? `Dữ liệu thuộc trường "${field}" đã tồn tại trong hệ thống.` : "Dữ liệu này đã tồn tại trong hệ thống.",
                data: null,
                timestamp: new Date().toISOString(),
                requestId,
            });
            return;
        }
        if (err.code === "P2003") {
            res.status(400).json({
                status: false,
                code: "FOREIGN_KEY_FAILED",
                message: "Ràng buộc dữ liệu không hợp lệ (Dữ liệu liên quan không tồn tại).",
                data: null,
                timestamp: new Date().toISOString(),
                requestId,
            });
            return;
        }
    }

    // Unexpected — không leak detail
    console.error("[UnhandledError]", err, `| requestId=${requestId}`);

    res.status(500).json({
        status: false,
        code: "INTERNAL_ERROR",
        message: "Something went wrong",
        data: null,
        timestamp: new Date().toISOString(),
        requestId,
    });
}