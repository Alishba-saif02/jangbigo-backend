import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const service = new AuthService();

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const result = await service.register(req.body);
            res.status(201).json({ success: true, ...result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const result = await service.login(req.body);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            const result = await service.verifyOtp(email, String(otp)); // force string
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            console.error('[Verify OTP Error]', error.message);
            res.status(400).json({ success: false, message: error.message });
        }
    },
    async resendOtp(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const result = await service.resendOtp(email);
            res.status(200).json({ success: true, ...result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({
                    success: false,
                    message: 'Email is required',
                });
            }

            const result = await service.forgotPassword(email);
            res.status(200).json({...result });
        } catch (error: any) {
            console.error('[Forgot Password Error]', error.message);
            res.status(error.message === 'User not found' ? 404 : 500).json({
                success: false,
                message: error.message || 'Failed to send password reset email',
            });
        }
    },

    async resetPassword(req: Request, res: Response) {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Token and new password are required',
                });
            }

            const result = await service.resetPassword(token, newPassword);
            res.status(200).json({...result });
        } catch (error: any) {
            console.error('[Reset Password Error]', error.message);
            res.status(
                error.message === 'Invalid or expired token' ? 400 : 500
            ).json({
                success: false,
                message: error.message || 'Failed to reset password',
            });
        }
    },
};
