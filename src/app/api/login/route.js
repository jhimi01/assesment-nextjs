import bcrypt from "bcryptjs";
import { generateOTP } from "@/utils/otp";
import { sendOTPEmail } from "@/utils/email";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";


// Utility function to validate token
const validateToken = (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header missing");
    
    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Invalid token format");

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT secret key is missing");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded?.userId) throw new Error("Invalid token payload");

    return decoded?.userId;
  } catch (error) {
    throw new Error(`Token validation failed: ${error.message}`);
  }
};


// Utility function to handle responses
const createResponse = (data, status = 200) =>
  NextResponse.json(data, { status });


// Utility function for error handling
const handleError = (error, customMessage = "An error occurred") => {
  console.error(customMessage, error);
  return NextResponse.json(
    { error: error.message || customMessage },
    { status: 500 }
  );
};

// Login
export async function POST(req) {
  try {
    const { email, password, recaptchaToken } = await req.json();

    // Verify reCAPTCHA
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!data.success)
      return createResponse({ error: "reCAPTCHA failed" }, 400);

    // Find user and verify password
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password)
      return createResponse({ error: "Invalid credentials" }, 400);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return createResponse({ error: "Invalid password" }, 401);

    // Generate OTP and send email
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiration },
    });

    await sendOTPEmail(email, otp);

    return createResponse({ message: "OTP sent to your email" });
  } catch (error) {
    return handleError(error, "Error during login");
  }
}

// Get loggedInUser data
export async function GET(req) {
  try {
    const userId = validateToken(req);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { loggedInUser: true },
    });

    // console.log(user);

    if (!user) return createResponse({ error: "User not found" }, 404);

    return createResponse({
      message: "User data retrieved successfully",
      // userData: { ...user },
      userData: user,
      // loggedInUser: user.loggedInUser,
    });
  } catch (error) {
    return handleError(error, "Error during token verification");
  }
}

// Update loggedInUser data
export async function PATCH(req) {
  // console.log("reeeeeeeq",req)
  try {
    const userId = validateToken(req);
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      dateOfBirth,
      gender,
      nid,
      country,
      title,
      address,
    } = body;

    const updateUserData = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email,
        mobileNumber,
        dateOfBirth,
        gender,
        nid,
        country,
        title,
        address,
      }, // Updates all properties dynamically
    });

    return createResponse({
      message: "User profile updated successfully",
      user: updateUserData,
    });
  } catch (error) {
    console.log(error)
    return handleError(error, "Error during user profile update");
  }
}

// Logout
export async function DELETE(req) {
  try {
    const userId = validateToken(req);

    await prisma.loggedInUser.delete({ where: { userId } });

    return createResponse({ message: "Logged out successfully" });
  } catch (error) {
    return handleError(error, "Failed to log out");
  }
}
