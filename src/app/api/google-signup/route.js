import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, firstName, img, isVerified } = body;
    console.log("Received data:", body);


    if (!email || !firstName) {
        return new Response(
        JSON.stringify({
          error: "Missing email or first name"
        }),
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "User already exists",
          user: existingUser,
        }),
        {
          status: 200,
        }
      );
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
      JSON.stringify({
        message: "user created successfully",
        user: newUser,
      }),
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

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, firstName, img, isVerified } = body;

//     let user = await prisma.user.upsert({
//       where: { email },
//       update: { firstName, img, isVerified }, // Update user profile
//       create: { email, firstName, img, isVerified }, // Create new user if not exists
//     });

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
//       expiresIn: "7d",
//     });

//     await prisma.loggedInUser.upsert({
//       where: { userId: user.id },
//       update: { verifiedOtp: true, token },
//       create: { userId: user.id, verifiedOtp: true, token },
//     });

//     return new Response(
//       JSON.stringify({
//         message: "User verified successfully",
//         userData: { ...user },
//         token,
//       }),
//       { status: 200 }
//     );
//   } catch (err) {
//     console.log("Error occurred while creating/updating user:", err);
//     return new Response(
//       JSON.stringify({ message: "Error occurred while logging in with Google" }),
//       { status: 500 }
//     );
//   }
// }
