// src/auth/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { RegisterSchema, LoginSchema } from '../dto/auth.dto';
import { validate } from '../middleware/validate.middleware';
import { authenticateToken } from '../middleware/auth.middleware';
// import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// ✅ POST /api/auth/register
router.post('/register', validate(RegisterSchema), AuthController.register);

// ✅ POST /api/auth/login
router.post('/login', validate(LoginSchema), AuthController.login);

//otp related
router.post('/verify-otp', (_req, _res, next) => {
    console.log('✅ Hit /verify-otp');
    next();
}, AuthController.verifyOtp);
router.post('/resend-otp', AuthController.resendOtp);
router.post('/forget-password', authenticateToken, AuthController.forgotPassword);
router.post('/reset-password', authenticateToken , AuthController.resetPassword);


export default router;
