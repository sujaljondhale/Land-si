"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const elasticsearch_1 = require("@elastic/elasticsearch");
// For local docker-compose setup
const esClient = new elasticsearch_1.Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});
exports.SearchService = {
    searchDocuments: async (query) => {
        try {
            // In a real implementation, we would do a semantic/hybrid search.
            // For this MVP MVP, we will try to connect to ES, but gracefully fallback to mock data
            // if ES is not fully initialized or seeded.
            const result = await esClient.search({
                index: 'documents',
                query: {
                    multi_match: {
                        query,
                        fields: ['title', 'abstract', 'content']
                    }
                }
            });
            return result.hits.hits.map(hit => hit._source);
        }
        catch (error) {
            console.warn("Elasticsearch not available or index missing. Returning mock semantic search results.");
            return [
                { id: '1', title: 'Land Use Policy 2024', abstract: 'Updated policy for urban areas...', source: 'data.gov.in' },
                { id: '2', title: 'Agricultural Zoning Report', abstract: 'Analysis of farming zones.', source: 'Bhuvan' }
            ];
        }
    }
};
