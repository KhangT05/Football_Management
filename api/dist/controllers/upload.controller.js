var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
// controllers/upload.controller.ts
import { Route, Post, UploadedFile, UploadedFiles, Tags, Security, Request } from "tsoa";
import { FormField } from "tsoa";
import { storageService } from "../services/storage.service.js";
let UploadController = class UploadController {
    /**
     * Upload single file cho bất kỳ entity/field nào.
     * namespace = tên table (e.g. "teams", "tournaments")
     * kind = tên field (e.g. "logo", "avatar", "banner")
     */
    async uploadSingle(namespace, kind, file, _req) {
        const result = await storageService.upload({ namespace, kind, file });
        return result;
    }
    /**
     * Upload nhiều files cùng lúc.
     * Trả array theo đúng thứ tự upload.
     * Caller tự map url vào field tương ứng.
     */
    async uploadMulti(namespace, kind, files, _req) {
        const results = await Promise.all(files.map((file) => storageService.upload({ namespace, kind, file }).then((r) => ({
            ...r,
            originalName: file.originalname,
        }))));
        return { files: results };
    }
};
__decorate([
    Post("single"),
    __param(0, FormField()),
    __param(1, FormField()),
    __param(2, UploadedFile("file")),
    __param(3, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadSingle", null);
__decorate([
    Post("multi"),
    __param(0, FormField()),
    __param(1, FormField()),
    __param(2, UploadedFiles("files")),
    __param(3, Request()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadMulti", null);
UploadController = __decorate([
    Route("upload"),
    Tags("Upload"),
    Security("jwt")
], UploadController);
export { UploadController };
//# sourceMappingURL=upload.controller.js.map