import { Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { Role } from '@prisma/client';

interface JwtPayload {
    id: number;
    email: string;
    role: Role; // 'USER' | 'ADMIN'
}

export function authenticateToken(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token required' });
    }

    try {
        const decoded = verifyToken(token) as JwtPayload;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        return next(); // ✅ Fix: return statement
    } catch (error: any) {
        return res.status(403).json({ success: false, message: error.message });
    }
}
