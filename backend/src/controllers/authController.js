const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');
const { generateToken } = require('../utils/jwt');

const signup = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, phone, username, password, registrationMethod } = req.body;

    // Validate that either email or phone is provided based on registration method
    if (registrationMethod === 'email' && !email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for email registration'
      });
    }

    if (registrationMethod === 'phone' && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required for phone registration'
      });
    }

    // Check if user already exists
    const whereConditions = [
      { username }
    ];
    
    // Only check email if it's provided and we're using email registration
    if (registrationMethod === 'email' && email) {
      whereConditions.push({ email });
    }
    
    // Only check phone if it's provided and we're using phone registration
    if (registrationMethod === 'phone' && phone) {
      whereConditions.push({ phone });
    }
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: whereConditions
      }
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email && existingUser.email === email) {
        message = 'Email already registered';
      } else if (existingUser.phone && existingUser.phone === phone) {
        message = 'Phone number already registered';
      } else if (existingUser.username === username) {
        message = 'Username already taken';
      }

      console.log(`🚫 User registration blocked: ${message}`);
      console.log(`📋 Existing user data:`, {
        id: existingUser.id,
        email: existingUser.email,
        phone: existingUser.phone,
        username: existingUser.username
      });

      return res.status(409).json({
        success: false,
        message
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: registrationMethod === 'email' ? email : null,
        phone: registrationMethod === 'phone' ? phone : null,
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        phone: true,
        username: true,
        createdAt: true
      }
    });

    // Generate JWT token
    const token = generateToken(user.id);

    console.log(`✅ User created successfully:`, {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      registrationMethod
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user,
        token
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, phone, password, loginMethod } = req.body;

    // Find user based on login method
    let user;
    if (loginMethod === 'email') {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { phone }
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp, registrationMethod, email, phone } = req.body;

    // Demo OTP bypass - accepts 951753
    if (otp === '951753') {
      // Find user based on registration method
      let user;
      if (registrationMethod === 'email') {
        user = await prisma.user.findUnique({
          where: { email }
        });
      } else {
        user = await prisma.user.findUnique({
          where: { phone }
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      // Return user data without password
      const userData = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username,
        createdAt: user.createdAt
      };

      console.log(`✅ OTP verified successfully for user:`, {
        id: user.id,
        email: user.email,
        phone: user.phone,
        username: user.username
      });

      return res.json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          user: userData,
          token
        }
      });
    }

    // Invalid OTP
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { registrationMethod, email, phone } = req.body;

    // Find user based on registration method
    let user;
    if (registrationMethod === 'email') {
      user = await prisma.user.findUnique({
        where: { email }
      });
    } else {
      user = await prisma.user.findUnique({
        where: { phone }
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For demo purposes, always return success
    console.log(`📱 OTP resent (demo) for user:`, {
      id: user.id,
      email: user.email,
      phone: user.phone,
      username: user.username
    });

    res.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  signup,
  login,
  verifyOtp,
  resendOtp
};