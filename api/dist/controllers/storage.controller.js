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
import { Controller, Post, Route, Tags, Security, UploadedFile, UploadedFiles, FormField, } from "tsoa";
import { storageService } from "../services/storage.service.js";
let StorageController = class StorageController extends Controller {
    /**
     * Upload single file.
     * Content-Type: multipart/form-data
     * Fields: file (binary), namespace, kind
     */
    async upload(file, namespace, kind) {
        return storageService.upload({ namespace, kind, file });
    }
    /**
     * Upload multiple files.
     * Content-Type: multipart/form-data
     * Fields: files[] (binary), namespace, kind
     */
    async uploadMany(files, namespace, kind) {
        return storageService.uploadMany(files.map(file => ({ namespace, kind, file })));
    }
};
__decorate([
    Post("upload"),
    __param(0, UploadedFile("file")),
    __param(1, FormField()),
    __param(2, FormField()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "upload", null);
__decorate([
    Post("upload/many"),
    __param(0, UploadedFiles("files")),
    __param(1, FormField()),
    __param(2, FormField()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadMany", null);
StorageController = __decorate([
    Security("jwt"),
    Route("storage"),
    Tags("Storage")
], StorageController);
export { StorageController };
//# sourceMappingURL=storage.controller.js.map