const express = require('express');
const { signup, login, verifyOtp, resendOtp } = require('../controllers/authController');
const { signupValidation, loginValidation } = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', signupValidation, signup);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

// POST /api/auth/resend-otp
router.post('/resend-otp', resendOtp);

module.exports = router;