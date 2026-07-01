// middleware/error.middleware.ts
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

    if (err instanceof ValidateError) {
        console.warn(`[ValidateError] Caught Validation Error for ${req.path}:`, err.fields);
        res.status(422).json({
            status: false,
            code: "VALIDATION_FAILED",
            message: "Validation failed",
            data: err?.fields,
            timestamp: new Date().toISOString(),
            requestId,
        });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            res.status(409).json({
                status: false,
                code: "CONFLICT",
                message: "A record with this value already exists (Unique constraint failed)",
                data: err.meta,
                timestamp: new Date().toISOString(),
                requestId,
            });
            return;
        }
        if (err.code === "P2003") {
            res.status(400).json({
                status: false,
                code: "FOREIGN_KEY_FAILED",
                message: "Foreign key constraint failed (e.g. Tournament or User does not exist)",
                data: err.meta,
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