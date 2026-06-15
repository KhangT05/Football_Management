import { randomUUID } from "crypto";
import pLimit from "p-limit";
import { cloudinaryProvider } from "../storage/processors/cloudinary.provider.js";
import { storageConfig } from "../storage/storage.config.js";
import { imageProcessor } from "../storage/processors/image.processor.js";
export class StorageService {
    provider;
    concurrency = pLimit(3);
    constructor(provider = cloudinaryProvider) {
        this.provider = provider;
    }
    // ── Single upload ──────────────────────────────────────────────────────────
    async upload(input) {
        const { namespace, kind, file, compressOverride } = input;
        if (!storageConfig.allowedMime[file.mimetype]) {
            throw new StorageError(`Unsupported MIME: ${file.mimetype}`, "INVALID_MIME");
        }
        if (file.size > storageConfig.maxBytes) {
            throw new StorageError(`File too large: max ${storageConfig.maxBytes / 1024 / 1024}MB`, "FILE_TOO_LARGE");
        }
        const isBinary = storageConfig.binaryMime.has(file.mimetype);
        const resourceType = file.mimetype === "image/svg+xml" ? "raw" : "image";
        const compress = isBinary
            ? { format: "original", stripExif: false }
            : { ...storageConfig.compress, ...compressOverride };
        const buffer = isBinary
            ? file.buffer
            : (await imageProcessor.process(file.buffer, compress)).buffer;
        const publicId = buildPublicId(namespace, kind);
        return this.provider.upload(buffer, publicId, resourceType);
    }
    // ── Batch upload ───────────────────────────────────────────────────────────
    async uploadMany(inputs) {
        return Promise.all(inputs.map(input => this.concurrency(() => this.upload(input))));
    }
    // ── Delete ─────────────────────────────────────────────────────────────────
    async delete(publicId) {
        return this.provider.delete(publicId);
    }
    async deleteMany(publicIds) {
        return this.provider.deleteMany(publicIds);
    }
    // ── Transform URL ─────────────────────────────────────────────────────────
    buildUrl(publicId, transform) {
        return this.provider.buildUrl(publicId, transform);
    }
    // ── Reprocess in-memory (no upload) ───────────────────────────────────────
    async reprocess(file, opts) {
        if (storageConfig.binaryMime.has(file.mimetype)) {
            throw new StorageError(`MIME ${file.mimetype} does not support reprocess`, "UNSUPPORTED_MIME");
        }
        return imageProcessor.reprocess(file.buffer, opts);
    }
}
// ── Helpers ───────────────────────────────────────────────────────────────────
function buildPublicId(namespace, kind) {
    const yyyyMM = new Date().toISOString().slice(0, 7).replace("-", "");
    return `${namespace}/${kind}/${yyyyMM}/${randomUUID()}`;
}
export class StorageError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "StorageError";
    }
}
export const storageService = new StorageService();
//# sourceMappingURL=storage.service.js.map