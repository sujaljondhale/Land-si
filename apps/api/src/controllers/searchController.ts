import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';
import { MockAIAdapter } from '../adapters/MockAIAdapter';

export const hybridSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    
    if (!query) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Query parameter q is required' } });
      return;
    }

    // 1. Retrieve relevant documents (Semantic/Keyword Hybrid)
    const documents = await SearchService.searchDocuments(query);

    // 2. Generate AI Answer using the retrieved context
    const aiResponse = await MockAIAdapter.generateRAGAnswer(query, documents);

    res.json({
      data: {
        results: documents,
        ai: aiResponse
      },
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Search failed' } });
  }
};
