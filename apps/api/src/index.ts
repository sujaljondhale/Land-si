import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsMiddleware = require('cors');
app.use(corsMiddleware({
  origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());

console.log(">>> BACKEND IS RUNNING UPDATED CODE <<<");

// Request ID middleware (as requested in guide)
app.use((req: Request, res: Response, next: NextFunction) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || `req-${Date.now()}`;
  next();
});

import documentRoutes from './routes/documents';
import searchRoutes from './routes/search';
import gisRoutes from './routes/gis';
import analyticsRoutes from './routes/analytics';
import workspaceRoutes from './routes/workspace';
import simulatorRoutes from './routes/simulator';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';

app.use('/auth', authRoutes);
app.use('/documents', documentRoutes);
app.use('/search', searchRoutes);
app.use('/gis', gisRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/workspace', workspaceRoutes);
app.use('/simulator', simulatorRoutes);
app.use('/public', publicRoutes);
app.use('/admin', adminRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Generic Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    },
    requestId: req.headers['x-request-id']
  });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
