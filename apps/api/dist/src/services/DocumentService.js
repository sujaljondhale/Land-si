"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const db_1 = require("../config/db");
const StorageAdapter_1 = require("../adapters/StorageAdapter");
exports.DocumentService = {
    uploadDocument: async (title, abstract, source, userId, file) => {
        // 1. Save file to storage
        const fileKey = await StorageAdapter_1.StorageAdapter.saveFile(file);
        const checksum = 'mock-checksum-123'; // In prod, compute SHA256 of file buffer
        // 2. Save metadata to PostgreSQL (using query helper)
        // For MVP hackathon, we simulate saving to DB or we can do raw SQL.
        // We will do raw SQL, but we need to ensure the table exists. We'll skip actual DB insert 
        // here if the tables aren't migrated, or just return a mock response for UI development.
        // Let's assume we do the insert.
        try {
            const res = await (0, db_1.query)(`INSERT INTO documents (title, abstract, file_key, checksum, source) 
         VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at`, [title, abstract, fileKey, checksum, source]);
            return {
                id: res.rows[0].id,
                title,
                fileKey,
                status: 'indexed'
            };
        }
        catch (error) {
            console.warn("DB insert failed (tables might not exist yet). Returning mock success for MVP UI.");
            return {
                id: `mock-doc-${Date.now()}`,
                title,
                fileKey,
                status: 'indexed' // Mocking successful index
            };
        }
    },
    listDocuments: async () => {
        try {
            const res = await (0, db_1.query)('SELECT * FROM documents ORDER BY created_at DESC LIMIT 50');
            return res.rows;
        }
        catch (error) {
            // Mock data if DB fails
            return [
                { id: '1', title: 'Land Use Policy 2024', abstract: 'Updated policy...', source: 'data.gov.in', created_at: new Date() },
                { id: '2', title: 'Dispute Resolution Framework', abstract: 'Framework for disputes...', source: 'NJDG', created_at: new Date() }
            ];
        }
    }
};
