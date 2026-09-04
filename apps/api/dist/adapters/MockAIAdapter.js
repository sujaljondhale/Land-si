"use strict";
// Mock AI Adapter for Hackathon MVP
// Demonstrates RAG explainability requirement without needing a real LLM API key.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIAdapter = void 0;
exports.MockAIAdapter = {
    generateRAGAnswer: async (query, documents) => {
        // Simulate AI generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (documents.length === 0) {
            return {
                answer: "I couldn't find any relevant documents in the repository to answer your query.",
                citations: []
            };
        }
        return {
            answer: `Based on the repository documents, the policy regarding "${query}" emphasizes sustainable development and local governance integration. The provided sources outline clear guidelines for dispute resolution and land use mapping.`,
            citations: documents.slice(0, 2).map((doc, i) => ({
                id: doc.id || `doc-${i}`,
                title: doc.title,
                source: doc.source,
                context: doc.abstract || "Relevant excerpt demonstrating why this document was selected."
            }))
        };
    }
};
