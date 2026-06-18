import { randomUUID } from "crypto";
import pLimit from "p-limit";
import { cloudinaryProvider } from "../storage/processors/cloudinary.provider.js";
import { storageConfig } from "../storage/storage.config.js";
import { imageProcessor } from "../storage/processors/image.processor.js";
import { CompressOptions, IStorageProvider, ProcessedImage, TransformOptions, UploadInput, UploadResult } from "../storage/types.js";

export class StorageService {
    private readonly concurrency = pLimit(3);

    constructor(private readonly provider: IStorageProvider = cloudinaryProvider) { }

    // ── Single upload ──────────────────────────────────────────────────────────

    async upload(input: UploadInput): Promise<UploadResult> {
        const { namespace, kind, file, compressOverride } = input;

        if (!storageConfig.allowedMime[file.mimetype]) {
            throw new StorageError(`Unsupported MIME: ${file.mimetype}`, "INVALID_MIME");
        }

        if (file.size > storageConfig.maxBytes) {
            throw new StorageError(
                `File too large: max ${storageConfig.maxBytes / 1024 / 1024}MB`,
                "FILE_TOO_LARGE",
            );
        }

        const isBinary = storageConfig.binaryMime.has(file.mimetype);
        const resourceType = file.mimetype === "image/svg+xml" ? "raw" : "image";

        const compress: CompressOptions = isBinary
            ? { format: "original", stripExif: false }
            : { ...storageConfig.compress, ...compressOverride };

        const buffer = isBinary
            ? file.buffer
            : (await imageProcessor.process(file.buffer, compress)).buffer;

        const publicId = buildPublicId(namespace, kind);

        return this.provider.upload(buffer, publicId, resourceType);
    }

    // ── Batch upload ───────────────────────────────────────────────────────────

    async uploadMany(inputs: UploadInput[]): Promise<UploadResult[]> {
        return Promise.all(
            inputs.map(input => this.concurrency(() => this.upload(input))),
        );
    }

    // ── Delete ─────────────────────────────────────────────────────────────────

    async delete(publicId: string): Promise<void> {
        return this.provider.delete(publicId);
    }

    async deleteMany(publicIds: string[]): Promise<void> {
        return this.provider.deleteMany(publicIds);
    }

    // ── Transform URL ─────────────────────────────────────────────────────────

    buildUrl(publicId: string, transform?: TransformOptions): string {
        return this.provider.buildUrl(publicId, transform);
    }

    // ── Reprocess in-memory (no upload) ───────────────────────────────────────

    async reprocess(file: Express.Multer.File, opts: CompressOptions): Promise<ProcessedImage> {
        if (storageConfig.binaryMime.has(file.mimetype)) {
            throw new StorageError(`MIME ${file.mimetype} does not support reprocess`, "UNSUPPORTED_MIME");
        }
        return imageProcessor.reprocess(file.buffer, opts);
    }

    replaceAsset(
        oldUrl: string | null | undefined,
        newUrl: string | null | undefined,
        logger?: { warn: (msg: string, meta?: object) => void }
    ): void {
        // null → null: xóa avatar (soft delete case)
        // same URL: no-op
        if (!oldUrl || oldUrl === newUrl) return;

        const publicId = StorageService.extractPublicId(oldUrl);
        if (!publicId) return;

        this.delete(publicId).catch((err) =>
            (logger ?? console).warn("Failed to delete old asset from Cloudinary", { err, publicId })
        );
    }

    static extractPublicId(url: string): string | undefined {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/);
        return match ? match[1] : undefined;
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildPublicId(namespace: string, kind: string): string {
    const yyyyMM = new Date().toISOString().slice(0, 7).replace("-", "");
    return `${namespace}/${kind}/${yyyyMM}/${randomUUID()}`;
}

export class StorageError extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
        this.name = "StorageError";
    }
}

export const storageService = new StorageService();