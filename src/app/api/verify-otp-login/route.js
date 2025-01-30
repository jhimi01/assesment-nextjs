import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Validate OTP and expiration
    if (
      !user.otp ||
      !user.otpExpiration ||
      user.otp !== otp ||
      user.otpExpiration < new Date()
    ) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null, otpExpiration: null }, // Clear OTP after verification
    });

    // Validate JWT secret
    if (!process.env.JWT_SECRET_KEY) {
      console.error("Missing JWT_SECRET_KEY in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Update or create logged-in user record
    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: { verifiedOtp: true, token },
      create: { userId: user.id, verifiedOtp: true, token },
    });

    return NextResponse.json(
      {
        message: "User verified successfully",
        userData: { id: user.id, email: user.email, isVerified: true },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during OTP verification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
