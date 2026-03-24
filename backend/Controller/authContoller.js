import bcrypt from 'bcrypt';
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import crypto from 'crypto';
import * as mail from '../utils/mailer.js';
import { getServerSessionMeta } from '../utils/serverSession.js';
dotenv.config();

const ALLOWED_ROLES = ['user', 'admin'];
const otpStore = new Map();
const passwordResetStore = new Map();
const normalizeRole = (roleValue) => {
    const role = String(roleValue || 'user').toLowerCase();
    return ALLOWED_ROLES.includes(role) ? role : 'user';
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const generateResetToken = () => crypto.randomBytes(24).toString('hex');
const generateTemporaryPassword = () => crypto.randomBytes(6).toString('base64url');

const forgotPasswordByEmail = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        db.query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to process forgot password request', error: err.message });
            }

            if (!result.length) {
                return res.status(404).json({ success: false, message: 'No account found for this email.' });
            }

            const user = result[0];
            const temporaryPassword = generateTemporaryPassword();
            const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

                db.query(
                    'UPDATE users SET password = ?, temporary_password_active = 1, temporary_password_used = 0, temporary_password_expires_at = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE id = ?',
                    [hashedPassword, user.id],
                    async (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Failed to update temporary password', error: updateErr.message });
                }

                const emailResult = await mail.SendEmail(
                    user.email,
                    'Quickkart temporary password',
                    `Hello ${user.name},\n\nA temporary password was requested for your Quickkart account.\n\nTemporary Password: ${temporaryPassword}\n\nPlease log in using this temporary password and change it immediately from your profile.\n\nBest,\nQuickkart Team`,
                    `
                    <div style="font-family: Arial, sans-serif; background: #f3f7f5; padding: 24px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5ece8;">
                            <tr>
                                <td style="background: linear-gradient(135deg, #007E5D 0%, #00A57A 100%); color: #ffffff; padding: 20px 24px;">
                                    <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Quickkart Forgot Password</h1>
                                    <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.95;">Use this temporary password to log in.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 24px; color: #1f2937;">
                                    <p style="margin: 0 0 14px; font-size: 15px;">Hello ${user.name},</p>
                                    <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;">Your temporary password is:</p>
                                    <div style="margin: 0 auto 20px; width: fit-content; padding: 12px 20px; border-radius: 10px; background: #ecfdf5; border: 1px dashed #10b981; color: #065f46; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                                        ${temporaryPassword}
                                    </div>
                                    <p style="margin: 0 0 10px; font-size: 14px; color: #4b5563;">Please log in and change your password immediately.</p>
                                    <p style="margin: 0; font-size: 13px; color: #6b7280;">If you did not request this, contact support right away.</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                                    Quickkart Team
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
                );

                if (!emailResult.success) {
                    return res.status(500).json({ message: emailResult.message || 'Failed to send temporary password email', code: emailResult.code || null });
                }

                return res.status(200).json({ success: true, message: 'Temporary password sent to your email.' });
            });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to process forgot password request', error: err.message });
    }
};

const requestPasswordOtp = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        db.query('SELECT id, name, email FROM users WHERE email = ? LIMIT 1', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to process forgot password request', error: err.message });
            }

            // Keep response generic to avoid exposing whether an email is registered.
            if (!result.length) {
                return res.status(200).json({ success: true, message: 'If this email is registered, an OTP has been sent.' });
            }

            const user = result[0];
            const otp = generateOtp();
            const expiresAt = Date.now() + (10 * 60 * 1000);
            otpStore.set(email, {
                otp,
                userId: user.id,
                expiresAt,
                attempts: 0,
            });

            const emailResult = await mail.SendEmail(
                user.email,
                'Quickkart password reset OTP',
                                `Hello ${user.name},\n\nYour Quickkart password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes. If you did not request this, you can ignore this email.\n\nBest,\nQuickkart Team`,
                                `
                                <div style="font-family: Arial, sans-serif; background: #f3f7f5; padding: 24px;">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5ece8;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #007E5D 0%, #00A57A 100%); color: #ffffff; padding: 20px 24px;">
                                                <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Quickkart Password Reset</h1>
                                                <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.95;">Use the OTP below to continue resetting your password.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 24px; color: #1f2937;">
                                                <p style="margin: 0 0 14px; font-size: 15px;">Hello ${user.name},</p>
                                                <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;">Your one-time password is:</p>
                                                <div style="margin: 0 auto 20px; width: fit-content; padding: 12px 20px; border-radius: 10px; background: #ecfdf5; border: 1px dashed #10b981; color: #065f46; font-size: 28px; font-weight: 700; letter-spacing: 6px;">
                                                    ${otp}
                                                </div>
                                                <p style="margin: 0 0 10px; font-size: 14px; color: #4b5563;">This OTP is valid for <strong>10 minutes</strong>.</p>
                                                <p style="margin: 0; font-size: 13px; color: #6b7280;">If you did not request this, you can safely ignore this email.</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 16px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                                                Quickkart Team
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                                `
            );

            if (!emailResult.success) {
                return res.status(500).json({ message: emailResult.message || 'Failed to send OTP email', code: emailResult.code || null });
            }

            return res.status(200).json({ success: true, message: 'OTP sent to your email address.' });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to process forgot password request', error: err.message });
    }
};

const verifyPasswordOtp = (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const otp = String(req.body?.otp || '').trim();

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const savedOtp = otpStore.get(email);
        if (!savedOtp) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        if (Date.now() > savedOtp.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (savedOtp.attempts >= 5) {
            otpStore.delete(email);
            return res.status(429).json({ success: false, message: 'Too many invalid attempts. Please request a new OTP.' });
        }

        if (savedOtp.otp !== otp) {
            savedOtp.attempts += 1;
            otpStore.set(email, savedOtp);
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        const resetToken = generateResetToken();
        passwordResetStore.set(email, {
            resetToken,
            expiresAt: Date.now() + (10 * 60 * 1000),
        });

        otpStore.delete(email);
        return res.status(200).json({ success: true, message: 'OTP verified successfully.', resetToken });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to verify OTP', error: err.message });
    }
};

const resetPasswordWithOtp = async (req, res) => {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase();
        const resetToken = String(req.body?.resetToken || '').trim();
        const newPassword = String(req.body?.newPassword || '');

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ message: 'Email, reset token, and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const resetSession = passwordResetStore.get(email);
        if (!resetSession) {
            return res.status(400).json({ message: 'Reset session not found. Please verify OTP again.' });
        }

        if (Date.now() > resetSession.expiresAt) {
            passwordResetStore.delete(email);
            return res.status(400).json({ message: 'Reset session expired. Please verify OTP again.' });
        }

        if (resetSession.resetToken !== resetToken) {
            return res.status(401).json({ message: 'Invalid reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query('UPDATE users SET password = ?, temporary_password_active = 0, temporary_password_used = 0, temporary_password_expires_at = NULL WHERE email = ?', [hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to reset password', error: err.message });
            }

            if (!result.affectedRows) {
                passwordResetStore.delete(email);
                return res.status(404).json({ message: 'User account not found' });
            }

            passwordResetStore.delete(email);
            return res.status(200).json({ success: true, message: 'Password updated successfully.' });
        });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to reset password', error: err.message });
    }
};

//user register
const registerUser = async (req, res) =>{
    //Request user data and check missing field
    try{
        const {name, email, password, role} = req.body;
        if (!name || !email || !password){
            return res.status(500).json({message: "Please, Fill all the credentials!"})
        }

        const normalizedRole = normalizeRole(role);

        //check for the user in DB
        db.query("SELECT * FROM users WHERE email = ?", [email], async(err, result) =>{
            if(err){
                return res.status(500).json({message: "Failed to locate existing user", error: err})
            } 

            if (result.length > 0){
                return res.status(400).json({message:"Email already exists!"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, normalizedRole], 
                async(err, result) => {
                    if(err){
                        return res.status(500).json({message: "Registration Failed!", error: err})
                    } else{
                        let subject = 'Welcome to Quickkart!';
                        let textBody = `Hi Anish,\n\n🎉 Congratulations and welcome to Quickkart!\n\nWe’re excited to have you with us.\n\nExplore categories, discover amazing offers, and enjoy a smooth shopping experience.\n\nHappy shopping!\nThe Quickkart Team`;
                        let htmlBody = `
                            <div style="font-family: Arial, sans-serif; background: #f3f7f5; padding: 24px;">
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5ece8;">
                                    <tr>
                                        <td style="background: linear-gradient(135deg, #007E5D 0%, #00A57A 100%); color: #ffffff; padding: 20px 24px;">
                                            <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Welcome to Quickkart</h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 24px; color: #1f2937; line-height: 1.7; font-size: 15px;">
                                            <p style="margin: 0 0 12px;">Hi Anish,</p>
                                            <p style="margin: 0 0 12px;">🎉 Congratulations and welcome to Quickkart!</p>
                                            <p style="margin: 0 0 12px;">We’re excited to have you with us.</p>
                                            <p style="margin: 0 0 12px;">Explore categories, discover amazing offers, and enjoy a smooth shopping experience.</p>
                                            <p style="margin: 0;">Happy shopping!<br/>The Quickkart Team</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        `;

                        if (normalizedRole === 'admin') {
                            subject = 'Quickkart Admin Account Created';
                            textBody = `Hi Anish,\n\nCongratulations! Your admin account has been successfully created.\n\nYou now have full access to the Quickkart admin dashboard.\n\nFrom here, you can manage products, monitor orders, and oversee platform activity.\n\nIf you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nQuickkart Team`;
                            htmlBody = `
                                <div style="font-family: Arial, sans-serif; background: #f3f7f5; padding: 24px;">
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5ece8;">
                                        <tr>
                                            <td style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); color: #ffffff; padding: 20px 24px;">
                                                <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Quickkart Admin Access</h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 24px; color: #1f2937; line-height: 1.7; font-size: 15px;">
                                                <p style="margin: 0 0 12px;">Hi Anish,</p>
                                                <p style="margin: 0 0 12px;">Congratulations! Your admin account has been successfully created.</p>
                                                <p style="margin: 0 0 12px;">You now have full access to the Quickkart admin dashboard.</p>
                                                <p style="margin: 0 0 12px;">From here, you can manage products, monitor orders, and oversee platform activity.</p>
                                                <p style="margin: 0 0 12px;">If you have any questions or need assistance, feel free to reach out.</p>
                                                <p style="margin: 0;">Best regards,<br/>Quickkart Team</p>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            `;
                        }

                        const emailResult = await mail.SendEmail(email, subject, textBody, htmlBody);
                        
                        if(emailResult.success){
                            console.log('✓ Welcome email sent to:', email);
                        } else {
                            console.warn('⚠️ Email failed for user:', email);
                        }
                        
                        return res.status(201).json({success: true, message: "User registered successfully", emailSent: emailResult.success})
                    }
                })

            })
            
    } catch(err){
        return res.status(500).json({message: "Database Error", error: err})
    }
}

//user login
const loginUser = async(req, res) =>{
    //check user data and missing fields
    try{
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({message: "Please provide email, password and role!"})
        }
        const selectedRole = normalizeRole(role);

        //check for the user in the database
        db.query("SELECT * FROM users WHERE email = ?", [email], async(err, result) => {
            if(err){
                return res.status(500).json({message: "Failed to match the user email", error: err})
            }
            if(result.length === 0){
                return res.status(500).json({message: "User not found", error: err});
            }

            const user = result[0]
            const validPassword = await bcrypt.compare(password, user.password)

            if(!validPassword){
                return res.status(401).json({message: "Invalid Password"});
            }

            const storedRole = normalizeRole(user.role);
            if (selectedRole !== storedRole) {
                return res.status(403).json({message: `This account is registered as ${storedRole}. Please select ${storedRole} role to continue.`});
            }
            let usedTemporaryPassword = false;

            const completeLogin = () => {
                const token = jwt.sign(
                    {id: user.id, email: user.email, role: storedRole},
                    process.env.JWT_SECRET,
                    {expiresIn : '24h'}
                );

                return res.json({
                    success: true,
                    message: "Login Successfull",
                    token: token,
                    temporaryPasswordUsed: usedTemporaryPassword,
                    ...getServerSessionMeta(),
                    user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: storedRole
                }
                });
            };

            const isTemporaryPasswordActive = Number(user.temporary_password_active || 0) === 1;
            const isTemporaryPasswordUsed = Number(user.temporary_password_used || 0) === 1;
            const temporaryPasswordExpiresAt = user.temporary_password_expires_at ? new Date(user.temporary_password_expires_at).getTime() : 0;

            if (!isTemporaryPasswordActive) {
                return completeLogin();
            }

            if (temporaryPasswordExpiresAt && Date.now() > temporaryPasswordExpiresAt) {
                return res.status(401).json({message: 'Temporary password expired. Please request a new one.'});
            }

            if (isTemporaryPasswordUsed) {
                return res.status(401).json({message: 'Temporary password has already been used. Please request a new one.'});
            }

            usedTemporaryPassword = true;
            db.query('UPDATE users SET temporary_password_used = 1 WHERE id = ?', [user.id], (markUsedErr) => {
                if (markUsedErr) {
                    return res.status(500).json({message: 'Failed to validate temporary password', error: markUsedErr.message});
                }

                return completeLogin();
            });
        })
    } catch(err){
        return res.status(500).json({message: "Database Error", error: err})
    }
};

const getSessionMeta = (req, res) => {
    return res.json(getServerSessionMeta());
};


export { registerUser, loginUser, getSessionMeta, forgotPasswordByEmail, requestPasswordOtp, verifyPasswordOtp, resetPasswordWithOtp };