"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageAdapter = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const UPLOAD_DIR = path_1.default.join(__dirname, '../../../uploads');
// Ensure upload directory exists
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
exports.StorageAdapter = {
    saveFile: async (file) => {
        const filename = `${Date.now()}-${file.originalname}`;
        const filepath = path_1.default.join(UPLOAD_DIR, filename);
        // In a real app with S3, this would be an S3 upload call.
        // For local MVP, multer already saves it to memory or disk.
        // If using multer.memoryStorage, we write it here:
        fs_1.default.writeFileSync(filepath, file.buffer);
        return filename; // Return an object key/reference
    },
    getFileUrl: (filename) => {
        // In MVP, we might serve this via a static route, or return a mock URL
        return `/uploads/${filename}`;
    }
};
