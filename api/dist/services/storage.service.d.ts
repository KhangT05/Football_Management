import { CompressOptions, IStorageProvider, ProcessedImage, TransformOptions, UploadInput, UploadResult } from "../storage/types.js";
export declare class StorageService {
    private readonly provider;
    private readonly concurrency;
    constructor(provider?: IStorageProvider);
    upload(input: UploadInput): Promise<UploadResult>;
    uploadMany(inputs: UploadInput[]): Promise<UploadResult[]>;
    delete(publicId: string): Promise<void>;
    deleteMany(publicIds: string[]): Promise<void>;
    buildUrl(publicId: string, transform?: TransformOptions): string;
    reprocess(file: Express.Multer.File, opts: CompressOptions): Promise<ProcessedImage>;
    replaceAsset(oldUrl: string | null | undefined, newUrl: string | null | undefined, logger?: {
        warn: (msg: string, meta?: object) => void;
    }): void;
    static extractPublicId(url: string): string | undefined;
}
export declare class StorageError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
export declare const storageService: StorageService;
//# sourceMappingURL=storage.service.d.ts.map