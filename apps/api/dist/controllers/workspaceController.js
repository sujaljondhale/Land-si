"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkspaces = void 0;
const getWorkspaces = async (req, res) => {
    try {
        // Return mock workspaces for the user
        res.json({
            data: [
                { id: 'ws1', title: 'Urban Planning 2025', role: 'owner', documentCount: 5, collaborators: 2 },
                { id: 'ws2', title: 'Agricultural Zoning Research', role: 'collaborator', documentCount: 12, collaborators: 4 }
            ],
            requestId: req.headers['x-request-id']
        });
    }
    catch (error) {
        res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch workspaces' } });
    }
};
exports.getWorkspaces = getWorkspaces;
