import { Router } from 'express';
import { SeedService } from '../services/SeedService';

import { globalGrievances } from '../controllers/publicController';

const router = Router();

// Endpoint to fetch all grievances
router.get('/grievances', (req, res) => {
  res.json({ data: globalGrievances });
});

// Endpoint to resolve a grievance
router.patch('/grievances/:id/resolve', (req, res) => {
  const g = globalGrievances.find(g => g.id === req.params.id);
  if (g) {
    g.status = 'resolved';
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

// Endpoint to escalate a grievance
router.patch('/grievances/:id/escalate', (req, res) => {
  const g = globalGrievances.find(g => g.id === req.params.id);
  if (g) {
    g.status = 'escalated';
    g.department = 'State Level Authority (Escalated)';
    res.json({ success: true, department: g.department });
  } else {
    res.status(404).json({ success: false, message: 'Not found' });
  }
});

// Endpoint to seed database with real API data
router.post('/seed', async (req, res) => {
  try {
    const results = await SeedService.seedRealData();
    res.json({
      success: true,
      message: 'Successfully seeded database with real open data.',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to seed data.',
      error: (error as Error).message
    });
  }
});

export default router;
