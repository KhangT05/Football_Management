import { Controller } from "tsoa";
import { UploadResult } from "../storage/types.js";
export declare class StorageController extends Controller {
    /**
     * Upload single file.
     * Content-Type: multipart/form-data
     * Fields: file (binary), namespace, kind
     */
    upload(file: Express.Multer.File, namespace: string, kind: string): Promise<UploadResult>;
    /**
     * Upload multiple files.
     * Content-Type: multipart/form-data
     * Fields: files[] (binary), namespace, kind
     */
    uploadMany(files: Express.Multer.File[], namespace: string, kind: string): Promise<UploadResult[]>;
}
//# sourceMappingURL=storage.controller.d.ts.map