// src/utils/jwt.utils.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env['JWT_SECRET'] || 'jwt_secret';

export function generateToken(payload: object) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
}

