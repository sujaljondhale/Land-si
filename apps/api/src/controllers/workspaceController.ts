import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const getWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Return mock workspaces for the user
    res.json({
      data: [
        { id: 'ws1', title: 'Urban Planning 2025', role: 'owner', documentCount: 5, collaborators: 2 },
        { id: 'ws2', title: 'Agricultural Zoning Research', role: 'collaborator', documentCount: 12, collaborators: 4 }
      ],
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch workspaces' } });
  }
};
