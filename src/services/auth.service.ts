import { prisma } from '../prisma/client.prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';
import { login, register } from '../types/auth.d';
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/email.utils';
import { redis } from '../utils/redis.utils'
import crypto from 'crypto';

export class AuthService {
    async register(data: register) {
        try {
            const { username, email, password, role = 'USER' } = data;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) throw new Error('Email already in use');

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    role,
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    role: true,
                },
            });

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // ✅ Store OTP in Redis for 10 minutes
            await redis.set(`otp:${user.id}`, otp, { EX: 600 });

            sendOtpEmail(email, otp).catch(console.error); // fire-and-forget

            return {
                message: 'User registered. OTP sent to email.',
                data: user,
            };
        } catch (error: any) {
            console.error('[Register Error]', error);
            throw new Error(error.message || 'Registration failed');
        }
    }

    async verifyOtp(email: string, otp: string) {
        try {
            console.log('[Verify OTP] Attempt for:', email, 'with OTP:', otp);

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) throw new Error('User not found');
            if (user.isVerified) throw new Error('User already verified');

            const redisKey = `otp:${user.id}`;
            const cachedOtp = await redis.get(redisKey);

            console.log('[Redis OTP Debug]', {
                redisKey,
                cachedOtp,
                providedOtp: otp,
            });

            if (!cachedOtp) throw new Error('OTP not found or expired');

            if (String(cachedOtp).trim() !== String(otp).trim()) {
                throw new Error('Invalid OTP');
            }

            await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true },
            });

            await redis.del(redisKey); // cleanup

            return { message: 'OTP verified successfully. Your account is now verified.' };
        } catch (error: any) {
            console.error('[Verify OTP Error]', { message: error.message, stack: error.stack });
            throw new Error(error.message || 'OTP verification failed');
        }
    }

    async login(data: login) {
        try {
            const { email, password } = data;

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) throw new Error('Invalid email or password');
            if (!user.isVerified) throw new Error('User is not verified. Please verify OTP.');

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error('Invalid email or password');

            const token = generateToken({ id: user.id, role: user.role });

            return {
                message: 'Login successful',
                token,
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            };
        } catch (error: any) {
            console.error('[Login Error]', error);
            throw new Error(error.message || 'Login failed');
        }
    }
    async resendOtp(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) throw new Error('User not found');

            if (user.isVerified) throw new Error('User already verified');

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            // ✅ Store OTP in Redis for 10 minutes
            await redis.set(`otp:${user.id}`, otp, { EX: 600 });

            // ✅ Send OTP email
            await sendOtpEmail(email, otp);

            console.log('[Resend OTP] OTP:', otp);

            return { message: 'OTP resent to your email.' };
        } catch (error: any) {
            console.error('[Resend OTP Error]', error);
            throw new Error(error.message || 'Resending OTP failed');
        }
    }
    async forgotPassword(email: string) {
        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user) {
                throw new Error('User not found');
            }

            const token = crypto.randomBytes(32).toString('hex');

            // Save token to Redis with 15-minute expiry
            await redis.set(`reset:${user.id}`, token, { EX: 900 });

            // Send reset email asynchronously
            await sendPasswordResetEmail(email, token);

            return {
                success: true,
                message: 'Password reset email sent successfully',
            };
        } catch (error: any) {
            console.error('[Forgot Password Error]', {
                message: error.message,
                stack: error.stack,
            });

            throw new Error(error.message || 'Failed to initiate password reset');
        }
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const keys = await redis.keys('reset:*');
            let userId: number | null = null;

            for (const key of keys) {
            const cachedToken = await redis.get(key);
            if (cachedToken === token) {
                const idPart = key.split(':')[1];
                if (!idPart) break;

                const parsedId = parseInt(idPart, 10);
                if (!isNaN(parsedId)) {
                    userId = parsedId;
                    break;
                }
            }
        }

            if (!userId) {
                throw new Error('Invalid or expired token');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await Promise.all([
                prisma.user.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                }),
                redis.del(`reset:${userId}`),
            ]);

            return { success: true, message: 'Password updated successfully' };
        } catch (error: any) {
            console.error('[Reset Password Error]', {
                message: error.message,
                stack: error.stack,
            });

            throw new Error(error.message || 'Failed to reset password');
        }
    }
}