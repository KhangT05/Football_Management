// controllers/upload.controller.ts
import { Route, Post, UploadedFile, UploadedFiles, Tags, Security, Request } from "tsoa";
import { Body, FormField } from "tsoa";
import { storageService } from "../services/storage.service.js";
import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & { user: { user_id: number } };

interface SingleUploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
}

interface MultiUploadResult {
    files: Array<SingleUploadResult & { originalName: string }>;
}

@Route("upload")
@Tags("Upload")
@Security("jwt")
export class UploadController {
    /**
     * Upload single file cho bất kỳ entity/field nào.
     * namespace = tên table (e.g. "teams", "tournaments")
     * kind = tên field (e.g. "logo", "avatar", "banner")
     */
    @Post("single")
    async uploadSingle(
        @FormField() namespace: string,
        @FormField() kind: string,
        @UploadedFile("file") file: Express.Multer.File,
        @Request() _req: AuthRequest
    ): Promise<SingleUploadResult> {
        const result = await storageService.upload({ namespace, kind, file });
        return result;
    }

    /**
     * Upload nhiều files cùng lúc.
     * Trả array theo đúng thứ tự upload.
     * Caller tự map url vào field tương ứng.
     */
    @Post("multi")
    async uploadMulti(
        @FormField() namespace: string,
        @FormField() kind: string,
        @UploadedFiles("files") files: Express.Multer.File[],
        @Request() _req: AuthRequest
    ): Promise<MultiUploadResult> {
        const results = await Promise.all(
            files.map((file) =>
                storageService.upload({ namespace, kind, file }).then((r) => ({
                    ...r,
                    originalName: file.originalname,
                }))
            )
        );
        return { files: results };
    }
}