import { z } from 'zod';


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
const passwordMessage ='Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and be at least 6 characters long.';

export const RegisterSchema = z.object({
    username: z.string().min(3, 'name must be at east characters long'),
    email: z.string().email('Invalid email'),
    password: z.string().regex(passwordRegex, { message: passwordMessage }),
    role: z.enum(['USER', 'ADMIN']).optional(),
});
export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().regex(passwordRegex, { message: passwordMessage }),
});
export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;