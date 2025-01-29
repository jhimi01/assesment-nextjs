import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, firstName, img, isVerified } = body;

    let user = await prisma.user.findUnique({ where: { email } });

    // If user does not exist, create a new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          img,
          isVerified,
        },
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

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

    return new Response(
      JSON.stringify({
        message: "User verified successfully",
        userData: { ...user },
        token,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.log("Error ocured while creating user:", err);
    return new Response(
      JSON.stringify({ message: "Error ocured while login with google" }),
      { status: 500 }
    );
  }
}
