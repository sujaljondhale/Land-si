import { Router } from 'express';
import { submitGrievance, submitInnovation } from '../controllers/publicController';
import { authenticate } from '../middleware/auth';

const router = Router();

// These endpoints are accessible by the Public role
router.post('/grievance', authenticate, submitGrievance);
router.post('/innovation', authenticate, submitInnovation);

export default router;
