import { Request, Response } from 'express';
import { query } from '../config/db';

import { globalAnalytics } from '../services/SeedService';

export const getIndicators = async (req: Request, res: Response): Promise<void> => {
  try {
    let indicators = globalAnalytics;
    try {
      if (!indicators) {
        const dbRes = await query('SELECT data FROM analytics LIMIT 1');
        if (dbRes.rows.length > 0) {
          indicators = dbRes.rows[0].data;
        }
      }
    } catch (dbErr) {
      // ignore db error, fallback to mock
    }

    if (!indicators) {
      indicators = {
        totalDocuments: 12450,
        activeDisputes: 842,
        resolvedDisputes: 3105,
        landUseDistribution: [
          { name: 'Agricultural', value: 45 },
          { name: 'Urban', value: 30 },
          { name: 'Forest', value: 15 },
          { name: 'Water Bodies', value: 10 }
        ],
        monthlyTrends: [
          { month: 'Jan', disputes: 120, policies: 5 },
          { month: 'Feb', disputes: 150, policies: 2 },
          { month: 'Mar', disputes: 110, policies: 8 },
          { month: 'Apr', disputes: 90, policies: 4 },
        ]
      };
    }
    
    res.json({
      data: indicators,
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to load analytics indicators' } });
  }
};
