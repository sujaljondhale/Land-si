"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const documentController_1 = require("../controllers/documentController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Use memory storage to process buffers in the StorageAdapter
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Repository is protected: 
// Uploads restricted to researchers, institutions, admins
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['researcher', 'institution', 'admin']), upload.single('file'), documentController_1.uploadDocument);
// Listing is available to any authenticated user (even public roles)
router.get('/', auth_1.authenticate, documentController_1.listDocuments);
exports.default = router;
