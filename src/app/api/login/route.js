import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateOTP } from "@/utils/otp"; // Correct path
import { sendOTPEmail } from "@/utils/email"; // Correct path
import axios from "axios";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, recaptchaToken } = body;

    // Verify reCAPTCHA
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification failed" }),
        { status: 400 }
      );
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ error: "Invalid email or credentials" }),
        { status: 400 }
      );
    }

    // Compare password (hashed)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }

    // Generate OTP and send it to user's email
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiration },
    });

    await sendOTPEmail(email, otp);

    return new Response(JSON.stringify({ message: "OTP sent to your email" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return new Response(JSON.stringify({ error: "Error during login" }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 401,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;
    // Check if userId exists in the decoded token
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID not found in token" }),
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        loggedInUser: true, // Ensure this matches your schema
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({
        message: "User data retrieved successfully",
        userData: { ...user },
        loggedInUser: user.loggedInUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during token verification:", error);
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
    });
  }
}
