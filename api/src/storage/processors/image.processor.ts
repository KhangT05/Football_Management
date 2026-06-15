import { CompressOptions, ProcessedImage } from "../types.js";
import sharp from "sharp";

const FORMAT_MAP = {
    webp: "webp",
    jpeg: "jpeg",
    jpg: "jpeg",
    png: "png",
} as const;

type SharpFormat = (typeof FORMAT_MAP)[keyof typeof FORMAT_MAP];

export class ImageProcessor {
    async process(buffer: Buffer, opts: CompressOptions): Promise<ProcessedImage> {
        // Read metadata once — used later if we need to preserve original format
        const meta = await sharp(buffer).metadata();

        let pipeline = sharp(buffer, { failOn: "error" });

        // Auto-rotate from EXIF then strip metadata
        if (opts.stripExif !== false) {
            pipeline = pipeline.rotate();
        }

        if (opts.maxWidth || opts.maxHeight) {
            pipeline = pipeline.resize({
                width: opts.maxWidth,
                height: opts.maxHeight,
                fit: "inside",
                withoutEnlargement: true,
            });
        }

        const targetFormat: SharpFormat | null =
            opts.format && opts.format !== "original"
                ? (FORMAT_MAP[opts.format as keyof typeof FORMAT_MAP] ?? "webp")
                : null;

        if (targetFormat) {
            pipeline = pipeline.toFormat(targetFormat, { quality: opts.quality ?? 85 });
        } else if (opts.quality) {
            // Preserve original format, apply quality only
            const fmt: SharpFormat =
                FORMAT_MAP[(meta.format ?? "jpeg") as keyof typeof FORMAT_MAP] ?? "jpeg";
            pipeline = pipeline.toFormat(fmt, { quality: opts.quality });
        }

        const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });

        return {
            buffer: data,
            format: info.format,
            width: info.width,
            height: info.height,
        };
    }

    /** Reprocess without uploading. Used for preview/export flows. */
    async reprocess(buffer: Buffer, opts: CompressOptions): Promise<ProcessedImage> {
        return this.process(buffer, opts);
    }
}

export const imageProcessor = new ImageProcessor();