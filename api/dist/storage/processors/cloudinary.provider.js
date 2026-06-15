import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
export class CloudinaryProvider {
    async upload(buffer, publicId, resourceType = "image") {
        const result = await this._uploadStream(buffer, {
            public_id: publicId,
            resource_type: resourceType,
            overwrite: false,
        });
        return this._map(result);
    }
    async delete(publicId) {
        await cloudinary.uploader.destroy(publicId);
    }
    async deleteMany(publicIds) {
        const chunks = chunk(publicIds, 100);
        await Promise.all(chunks.map(ids => cloudinary.api.delete_resources(ids)));
    }
    buildUrl(publicId, transform) {
        if (!transform || !Object.keys(transform).length) {
            return cloudinary.url(publicId, { secure: true });
        }
        const parts = [];
        if (transform.width)
            parts.push(`w_${transform.width}`);
        if (transform.height)
            parts.push(`h_${transform.height}`);
        if (transform.crop)
            parts.push(`c_${transform.crop}`);
        if (transform.gravity)
            parts.push(`g_${transform.gravity}`);
        if (transform.quality)
            parts.push(`q_${transform.quality}`);
        if (transform.format)
            parts.push(`f_${transform.format}`);
        return cloudinary.url(publicId, {
            secure: true,
            transformation: [{ raw_transformation: parts.join(",") }],
        });
    }
    _uploadStream(buffer, options) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
                if (err || !result)
                    return reject(err ?? new Error("Upload failed"));
                resolve(result);
            });
            stream.end(buffer);
        });
    }
    _map(r) {
        return {
            url: r.secure_url,
            publicId: r.public_id,
            format: r.format,
            bytes: r.bytes,
            width: r.width ?? undefined,
            height: r.height ?? undefined,
        };
    }
}
function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}
export const cloudinaryProvider = new CloudinaryProvider();
//# sourceMappingURL=cloudinary.provider.js.map