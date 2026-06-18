import type { Request as ExRequest } from "express";
type AuthRequest = ExRequest & {
    user: {
        user_id: number;
    };
};
interface SingleUploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
}
interface MultiUploadResult {
    files: Array<SingleUploadResult & {
        originalName: string;
    }>;
}
export declare class UploadController {
    /**
     * Upload single file cho bất kỳ entity/field nào.
     * namespace = tên table (e.g. "teams", "tournaments")
     * kind = tên field (e.g. "logo", "avatar", "banner")
     */
    uploadSingle(namespace: string, kind: string, file: Express.Multer.File, _req: AuthRequest): Promise<SingleUploadResult>;
    /**
     * Upload nhiều files cùng lúc.
     * Trả array theo đúng thứ tự upload.
     * Caller tự map url vào field tương ứng.
     */
    uploadMulti(namespace: string, kind: string, files: Express.Multer.File[], _req: AuthRequest): Promise<MultiUploadResult>;
}
export {};
//# sourceMappingURL=upload.controller.d.ts.map