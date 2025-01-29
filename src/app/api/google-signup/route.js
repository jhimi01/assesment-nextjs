import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, firstName, img, isVerified } = body;

    if (!email || !firstName) {
      return res.status(400).json({ error: "Missing email or first name" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
      });
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        img,
        isVerified,
      },
    });

    return new Response(
      JSON.stringify({ message: "user created successfully", user: newUser }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error ocured while creating user:", error);
    return new Response(
      JSON.stringify({ message: "Error ocured while creating user" })
    );
  }
}
