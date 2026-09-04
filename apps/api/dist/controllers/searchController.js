"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hybridSearch = void 0;
const SearchService_1 = require("../services/SearchService");
const MockAIAdapter_1 = require("../adapters/MockAIAdapter");
const hybridSearch = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Query parameter q is required' } });
            return;
        }
        // 1. Retrieve relevant documents (Semantic/Keyword Hybrid)
        const documents = await SearchService_1.SearchService.searchDocuments(query);
        // 2. Generate AI Answer using the retrieved context
        const aiResponse = await MockAIAdapter_1.MockAIAdapter.generateRAGAnswer(query, documents);
        res.json({
            data: {
                results: documents,
                ai: aiResponse
            },
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Search failed' } });
    }
};
exports.hybridSearch = hybridSearch;
