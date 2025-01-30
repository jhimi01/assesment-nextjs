import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/utils/email";
import { generateOTP } from "@/utils/otp";
import prisma from "@/lib/db";

export async function POST(req, res) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      title,
      dateOfBirth,
      gender,
      address,
      mobileNumber,
      country,
      nid,
    } = body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 400,
      });
    }

    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        title,
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        gender,
        otp,
        otpExpiration,
        address,
        mobileNumber,
        country,
        nid,
      },
    });

    await sendOTPEmail(email, otp);

    return new Response(JSON.stringify({ message: "OTP sent to your email" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error during signup:", err);
    return new Response(JSON.stringify({ error: "Error during signup" }), {
      status: 500,
    });
  }
}
