import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
            });
        }

        return next();
    };
};
