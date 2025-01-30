
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, firstName, img, isVerified } = body;
    console.log("Received data:", req.body);

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

    if (!user) {
      return new Response(JSON.stringify({ message: "User creation failed" }), {
        status: 500,
      });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "7d",
    // });

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
    console.log("Error ocured while login with google:", err);
    return new Response(
      JSON.stringify({ message: "Error ocured while login with google" }),
      { status: 500 }
    );
  }
}
