import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env['EMAIL_HOST'],
    port: Number(process.env['EMAIL_PORT'] || '2525'),
    secure: false,
    auth: {
        user: process.env['EMAIL_USER'],
        pass: process.env['EMAIL_PASS'],
    },
});

// ✅ Send OTP Email
export const sendOtpEmail = async (email: string, otp: string) => {
    const info = await transporter.sendMail({
        from: `"JangBigo" JangBigo`,
        to: email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP code is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });

    console.log('OTP email sent:', info.messageId);
};

// ✅ Send Password Reset Email
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `http://localhost:3000/reset-password?token=${token}&email=${email}`;

    const info = await transporter.sendMail({
        from: `"Support" JangBigo`,
        to:email,
        subject: 'Password Reset Request',
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset</h2>
        <p>You requested a password reset for your account. Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display:inline-block; padding:10px 20px; background:#007BFF; color:#fff; text-decoration:none; border-radius:5px;">Reset Password</a>
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>This link will expire in 15 minutes.</p>
      </div>
    `,
    });

    console.log('Reset email sent:', info.messageId);
}
