import { CompressOptions, ProcessedImage } from "../types.js";
export declare class ImageProcessor {
    process(buffer: Buffer, opts: CompressOptions): Promise<ProcessedImage>;
    /** Reprocess without uploading. Used for preview/export flows. */
    reprocess(buffer: Buffer, opts: CompressOptions): Promise<ProcessedImage>;
}
export declare const imageProcessor: ImageProcessor;
//# sourceMappingURL=image.processor.d.ts.map