import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const getMailCredentials = () => {
    const user = String(process.env.EMAIL_USER || '').trim();
    const rawPass = String(process.env.EMAIL_PASS || '').trim();
    // Gmail app passwords are 16 characters and often copied with spaces.
    const pass = rawPass.replace(/\s+/g, '');
    return { user, pass };
};

const createTransporter = () => {
    const { user, pass } = getMailCredentials();

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT || 465),
        secure: String(process.env.SMTP_SECURE || 'true').toLowerCase() !== 'false',
        auth: {
            user,
            pass,
        },
    });
};

const SendEmail = async(to, subject, text, html = '') => {
    const { user, pass } = getMailCredentials();

    // Check if email credentials are configured
    if(!user || !pass) {
        console.warn("⚠️ Email service not configured - missing EMAIL_USER or EMAIL_PASS in .env");
        return { success: false, message: "Email service not configured" };
    }

    const transporter = createTransporter();

    const mailOption = {
        from : user,
        to,
        subject,
        text,
        html: html || undefined,
    };

    try{
        const info = await transporter.sendMail(mailOption);
        console.log("✓ Email sent successfully to:", to);
        return { success: true, message: "Email sent successfully", info };
    } catch(err){
        console.error('✗ Error sending email to', to, ':', err.message);
        if (err.code) {
            console.error('✗ Mail error code:', err.code);
        }
        if (err.response) {
            console.error('✗ Mail server response:', err.response);
        }
        const isBadCredentials = err.responseCode === 535 || /BadCredentials|Username and Password not accepted/i.test(String(err.response || err.message || ''));
        if (isBadCredentials) {
            return {
                success: false,
                message: 'Gmail rejected credentials. Use EMAIL_USER as your Gmail address and EMAIL_PASS as a valid 16-character Google App Password (no spaces). Also ensure 2-Step Verification is enabled on that Google account.',
                error: err.message,
                code: err.code,
            };
        }
        return { success: false, message: err.response || err.message || "Failed to send email", error: err.message, code: err.code };
    }
}

export {SendEmail}