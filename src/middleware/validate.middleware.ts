import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

export function validate(schema: ZodSchema<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: result.error.format(),
            });
            return;
        }

        req.body = result.data; // overwrite with validated + parsed input
        next();
    };
}
