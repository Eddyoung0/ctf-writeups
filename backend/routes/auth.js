//creating a register API
import express from 'express';
import { registerUser, loginUser, getSessionMeta, forgotPasswordByEmail, requestPasswordOtp, verifyPasswordOtp, resetPasswordWithOtp } from '../Controller/authContoller.js';

const router = express.Router();  

//Register
router.post('/register', registerUser);

//login
router.post('/login', loginUser);

// forgot password - send temporary password to registered email
router.post('/forgot-password', forgotPasswordByEmail);

// change password - send OTP to registered email
router.post('/change-password', requestPasswordOtp);

// forgot password - verify OTP
router.post('/verify-password-otp', verifyPasswordOtp);

// forgot password - reset password after OTP verification
router.post('/reset-password', resetPasswordWithOtp);

// server session metadata
router.get('/session-meta', getSessionMeta);


export default router;

