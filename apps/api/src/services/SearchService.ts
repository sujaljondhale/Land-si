import { Client } from '@elastic/elasticsearch';

// For local docker-compose setup
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

export const SearchService = {
  searchDocuments: async (query: string) => {
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
    } catch (error) {
      console.warn("Elasticsearch not available or index missing. Returning mock semantic search results.");
      const DocumentService = require('./DocumentService').DocumentService;
      const docs = await DocumentService.listDocuments();
      return docs.slice(0, 3); // return top 3 matches for the mock search
    }
  }
};
