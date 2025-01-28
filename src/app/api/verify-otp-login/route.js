import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // Check if OTP is valid and not expired
    if (
      user.otp !== otp ||
      !user.otpExpiration ||
      user.otpExpiration < new Date()
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired OTP" }),
        { status: 400 }
      );
    }

    // Mark user as verified
    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    // Update or create the logged-in user record
    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: {
        verifiedOtp: true,
        token,
      },
      create: {
        userId: user.id,
        verifiedOtp: true,
        token,
      },
    });

    // Return success response
    return new Response(
      JSON.stringify({
        message: "User verified successfully",
        userData: { ...user },
        token,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error during OTP verification:", err);
    return new Response(
      JSON.stringify({ error: "Error during OTP verification" }),
      { status: 500 }
    );
  }
}
