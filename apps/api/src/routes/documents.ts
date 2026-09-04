import { Router } from 'express';
import multer from 'multer';
import { uploadDocument, listDocuments } from '../controllers/documentController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Use memory storage to process buffers in the StorageAdapter
const upload = multer({ storage: multer.memoryStorage() });

// Repository is protected: 
// Uploads restricted to researchers, institutions, admins
router.post(
  '/', 
  authenticate, 
  authorize(['researcher', 'institution', 'admin']), 
  upload.single('file'), 
  uploadDocument
);

// Listing is available to any authenticated user (even public roles)
router.get('/', authenticate, listDocuments);

export default router;
