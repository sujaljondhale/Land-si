import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const uploadDocument: (req: AuthRequest, res: Response) => Promise<void>;
export declare const listDocuments: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=documentController.d.ts.map