import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'hackathon-secret-key';

const MOCK_USERS = [
  { id: '1', email: 'admin@landgov.in', password: 'password123', role: 'admin', name: 'Admin User' },
  { id: '2', email: 'policymaker@landgov.in', password: 'password123', role: 'policymaker', name: 'Policy Maker' },
  { id: '3', email: 'researcher@univ.edu', password: 'password123', role: 'researcher', name: 'Dr. Researcher' },
  { id: '4', email: 'institution@ngo.org', password: 'password123', role: 'institution', name: 'NGO Partner' },
  { id: '5', email: 'citizen@example.com', password: 'password123', role: 'public', name: 'Citizen' }
];

export const login = (req: Request, res: Response): void => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: { code: 'BAD_REQUEST', message: 'Email and password required' } });
    return;
  }

  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (!user) {
    res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
    return;
  }
  
  // Issue JWT
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({
    data: {
      token,
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email
      }
    }
  });
};

export const getMe = (req: any, res: Response): void => {
  res.json({
    data: {
      user: req.user
    }
  });
};
