import { Role } from '@prisma/client';
import { JwtPayload } from '../../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: Role | 'USER' | 'ADMIN';
            }
        }

    }
}

export { };
