import { IStorageProvider, TransformOptions, UploadResult } from "../types.js";
export declare class CloudinaryProvider implements IStorageProvider {
    upload(buffer: Buffer, publicId: string, resourceType?: "image" | "raw"): Promise<UploadResult>;
    delete(publicId: string): Promise<void>;
    deleteMany(publicIds: string[]): Promise<void>;
    buildUrl(publicId: string, transform?: TransformOptions): string;
    private _uploadStream;
    private _map;
}
export declare const cloudinaryProvider: CloudinaryProvider;
//# sourceMappingURL=cloudinary.provider.d.ts.map