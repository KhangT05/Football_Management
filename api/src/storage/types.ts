export type ImageFormat = "webp" | "jpeg" | "png" | "original";
export type CropMode = "fill" | "fit" | "limit" | "scale" | "thumb";
export type OutputFormat = "auto" | "webp" | "png" | "jpg";

export interface CompressOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;   // 1–100
    format?: ImageFormat;
    stripExif?: boolean;
}

export interface TransformOptions {
    width?: number;
    height?: number;
    crop?: CropMode;
    quality?: "auto" | number;
    format?: OutputFormat;
    gravity?: "face" | "center" | "auto";
}

export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
    width?: number;
    height?: number;
}

export interface ProcessedImage {
    buffer: Buffer;
    format: string;
    width: number;
    height: number;
}

export interface IStorageProvider {
    upload(buffer: Buffer, publicId: string, resourceType?: "image" | "raw"): Promise<UploadResult>;
    delete(publicId: string): Promise<void>;
    deleteMany(publicIds: string[]): Promise<void>;
    buildUrl(publicId: string, transform?: TransformOptions): string;
}

export interface UploadInput {
    /** Logical namespace → folder on cloud. e.g. "tournaments", "users" */
    namespace: string;
    /** Sub-type hint, used in publicId path only. e.g. "logo", "avatar" */
    kind: string;
    file: Express.Multer.File;
    /** Override default compress options. */
    compressOverride?: Partial<CompressOptions>;
}