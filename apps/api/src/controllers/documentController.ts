import { Request, Response } from 'express';
import { DocumentService } from '../services/DocumentService';
import { AuthRequest } from '../middleware/auth';

export const uploadDocument = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, abstract, source } = req.body;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'File is required' } });
      return;
    }

    const result = await DocumentService.uploadDocument(
      title, 
      abstract || '', 
      source || 'user_upload', 
      req.user?.id || 'anonymous', 
      file
    );

    // According to guide: "RAG pipeline: Ingest PDF/document -> extract text/OCR -> chunk -> embeddings -> index"
    // For MVP, we pretend this background job is triggered.
    
    res.status(201).json({
      data: result,
      meta: { message: 'Upload successful, indexing started.' },
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Upload failed' } });
  }
};

export const listDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await DocumentService.listDocuments();
    res.json({
      data: documents,
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch documents' } });
  }
};
