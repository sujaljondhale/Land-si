import { Router } from 'express';
import { runSimulation } from '../controllers/simulatorController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Simulator is highly restricted to Policymakers and Admins
router.post('/run', authenticate, authorize(['policymaker', 'admin']), runSimulation);

export default router;
