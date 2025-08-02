import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
};

interface UserData {
  id: string;
  email?: string;
  phone?: string;
  username: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
  otpCode?: string;
  otpExpiry?: number;
}

// Register endpoint
export const register: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { email, phone, username, password } = body;

    // Validation
    if (!username || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Username and password are required",
        }),
      };
    }

    if (!email && !phone) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Either email or phone is required",
        }),
      };
    }

    // Check if user already exists
    let existingUser = null;
    
    if (email) {
      const emailCheck = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": email },
      }));
      existingUser = emailCheck.Items?.[0];
    }

    if (!existingUser && phone) {
      const phoneCheck = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "PhoneIndex",
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: { ":phone": phone },
      }));
      existingUser = phoneCheck.Items?.[0];
    }

    if (!existingUser) {
      const usernameCheck = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "UsernameIndex",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: { ":username": username },
      }));
      existingUser = usernameCheck.Items?.[0];
    }

    if (existingUser) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "User already exists with this email, phone, or username",
        }),
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP for verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create user
    const userId = uuidv4();
    const userData: UserData = {
      id: userId,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false,
      otpCode,
      otpExpiry,
      ...(email && { email }),
      ...(phone && { phone }),
    };

    await dynamodb.send(new PutCommand({
      TableName: process.env.USERS_TABLE!,
      Item: userData,
    }));

    // TODO: Send OTP via SMS/Email using SNS/SES

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "User registered successfully. OTP sent for verification.",
        data: {
          id: userId,
          username,
          email: email || null,
          phone: phone || null,
          requiresVerification: true,
        },
      }),
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};

// Login endpoint
export const login: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { identifier, password } = body; // identifier can be email, phone, or username

    if (!identifier || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Identifier and password are required",
        }),
      };
    }

    // Find user by email, phone, or username
    let user = null;
    
    // Try email first
    if (identifier.includes("@")) {
      const emailQuery = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: { ":email": identifier },
      }));
      user = emailQuery.Items?.[0];
    }
    
    // Try phone if no email match
    if (!user && /^\+?[\d\s-()]+$/.test(identifier)) {
      const phoneQuery = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "PhoneIndex",
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: { ":phone": identifier },
      }));
      user = phoneQuery.Items?.[0];
    }
    
    // Try username if no email/phone match
    if (!user) {
      const usernameQuery = await dynamodb.send(new QueryCommand({
        TableName: process.env.USERS_TABLE!,
        IndexName: "UsernameIndex",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: { ":username": identifier },
      }));
      user = usernameQuery.Items?.[0];
    }

    if (!user) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid credentials",
        }),
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid credentials",
        }),
      };
    }

    // Check if user is verified
    if (!user.isVerified) {
      return {
        statusCode: 403,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Account not verified. Please verify your account first.",
          requiresVerification: true,
          userId: user.id,
        }),
      };
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email || null,
        phone: user.phone || null,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email || null,
            phone: user.phone || null,
            createdAt: user.createdAt,
          },
        },
      }),
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};

// Verify OTP endpoint
export const verifyOtp: APIGatewayProxyHandler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { userId, otpCode } = body;

    if (!userId || !otpCode) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "User ID and OTP code are required",
        }),
      };
    }

    // Get user
    const userResult = await dynamodb.send(new GetCommand({
      TableName: process.env.USERS_TABLE!,
      Key: { id: userId },
    }));

    const user = userResult.Item as UserData;
    if (!user) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "User not found",
        }),
      };
    }

    // Check OTP
    if (user.otpCode !== otpCode) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "Invalid OTP code",
        }),
      };
    }

    // Check OTP expiry
    if (!user.otpExpiry || Date.now() > user.otpExpiry) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          success: false,
          message: "OTP code has expired",
        }),
      };
    }

    // Update user as verified
    await dynamodb.send(new PutCommand({
      TableName: process.env.USERS_TABLE!,
      Item: {
        ...user,
        isVerified: true,
        otpCode: undefined,
        otpExpiry: undefined,
      },
    }));

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username,
        email: user.email || null,
        phone: user.phone || null,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "24h" }
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "Account verified successfully",
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email || null,
            phone: user.phone || null,
            createdAt: user.createdAt,
          },
        },
      }),
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
    };
  }
};