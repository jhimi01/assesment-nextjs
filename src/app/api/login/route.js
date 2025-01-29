import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateOTP } from "@/utils/otp";
import { sendOTPEmail } from "@/utils/email";
import axios from "axios";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// login
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

// get loggedInUser data
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

// update loggedInUser data
export async function PATCH(req) {
  try {
    // Ensure Authorization header exists
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const { userId } = decoded;
    // Parse the request body
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
      },
    });

    // console.log("updateUserData", updateUserData);

    return NextResponse.json(
      {
        message: "User profile updated successfully",
        user: updateUserData, // Return updated user data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during token update user:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// log out
export async function DELETE(req) {
  try {
    const token = req.headers.get("Authorization").split(" ")[1];

    console.log("token: " + token);

    if (!token) {
      return new Response(JSON.stringify({ error: "Token is required" }), {
        status: 401,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const { userId } = decoded;

    if (!userId) {
      return new Response(JSON.stringify({ error: "invalid token payload" }));
    }

    await prisma.loggedInUser.delete({
      where: { userId },
    });

    return new Response(JSON.stringify({ error: "logged out successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed logout" }), {
      status: 500,
    });
  }
}
