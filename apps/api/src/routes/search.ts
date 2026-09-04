import { Router } from 'express';
import { hybridSearch } from '../controllers/searchController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Search is available to all authenticated roles (including public)
router.get('/', authenticate, hybridSearch);

export default router;
