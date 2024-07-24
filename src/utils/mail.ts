
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function sendWelcomeEmail(email: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Welcome to Our App!',
        text: 'Welcome to our app! We are excited to have you on board.',
    };

    await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You have requested to reset your password. Please click the following link to reset your password: ${resetLink}`,
    };

    await transporter.sendMail(mailOptions);
}
