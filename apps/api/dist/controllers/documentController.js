"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDocuments = exports.uploadDocument = void 0;
const DocumentService_1 = require("../services/DocumentService");
const uploadDocument = async (req, res) => {
    try {
        const { title, abstract, source } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'File is required' } });
            return;
        }
        const result = await DocumentService_1.DocumentService.uploadDocument(title, abstract || '', source || 'user_upload', req.user?.id || 'anonymous', file);
        // According to guide: "RAG pipeline: Ingest PDF/document -> extract text/OCR -> chunk -> embeddings -> index"
        // For MVP, we pretend this background job is triggered.
        res.status(201).json({
            data: result,
            meta: { message: 'Upload successful, indexing started.' },
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Upload failed' } });
    }
};
exports.uploadDocument = uploadDocument;
const listDocuments = async (req, res) => {
    try {
        const documents = await DocumentService_1.DocumentService.listDocuments();
        res.json({
            data: documents,
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch documents' } });
    }
};
exports.listDocuments = listDocuments;
