import { Router } from 'express';
import { getIndicators } from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Analytics is mostly for Policymakers and Admins, but researchers may see some.
router.get('/indicators', authenticate, getIndicators);

export default router;
