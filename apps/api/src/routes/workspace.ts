import { Router } from 'express';
import { getWorkspaces } from '../controllers/workspaceController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Workspaces are for Researchers and Institutions
router.get('/', authenticate, authorize(['researcher', 'institution', 'admin']), getWorkspaces);

export default router;
