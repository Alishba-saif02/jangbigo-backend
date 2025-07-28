import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Authorization token required' });
        return;
    }

    try {
        const decoded = verifyToken(token);
        (req as any).user = decoded; // attach user info to request
        next();
    } catch (error: any) {
        res.status(403).json({ success: false, message: error.message });
        return;
    }
}
