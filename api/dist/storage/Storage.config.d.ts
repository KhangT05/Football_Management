/**
 * Default config cho StorageService.
 * Caller override từng field qua compressOverride khi cần dimension khác.
 */
export declare const storageConfig: {
    /** Global hard cap — multer cũng enforce, đây là belt + suspenders */
    readonly maxBytes: number;
    readonly allowedMime: Record<string, string>;
    /** MIME types bypass sharp — upload thẳng lên cloud */
    readonly binaryMime: Set<string>;
    /** Default compress — áp dụng cho mọi image upload trừ khi override */
    readonly compress: {
        readonly maxWidth: 1920;
        readonly maxHeight: 1080;
        readonly quality: 85;
        readonly format: "webp";
        readonly stripExif: true;
    };
};
//# sourceMappingURL=storage.config.d.ts.map