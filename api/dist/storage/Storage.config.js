/**
 * Default config cho StorageService.
 * Caller override từng field qua compressOverride khi cần dimension khác.
 */
export const storageConfig = {
    /** Global hard cap — multer cũng enforce, đây là belt + suspenders */
    maxBytes: 20 * 1024 * 1024, // 20MB
    allowedMime: {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "application/pdf": "pdf",
    },
    /** MIME types bypass sharp — upload thẳng lên cloud */
    binaryMime: new Set(["image/svg+xml", "application/pdf"]),
    /** Default compress — áp dụng cho mọi image upload trừ khi override */
    compress: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 85,
        format: "webp",
        stripExif: true,
    },
};
//# sourceMappingURL=storage.config.js.map