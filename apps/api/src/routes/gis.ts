import { Router } from 'express';
import { getMapLayers, getFeatures } from '../controllers/gisController';
import { authenticate } from '../middleware/auth';

const router = Router();

// GIS access depends on role (public can see some, researchers see all). 
// Here we just authenticate for simplicity, but we could add authorize() checks.
router.get('/layers', authenticate, getMapLayers);
router.get('/layers/:layerId/features', authenticate, getFeatures);

export default router;
