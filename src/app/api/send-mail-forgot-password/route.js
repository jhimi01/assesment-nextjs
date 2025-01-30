import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import prisma from "@/lib/db";


export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;
    if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), {
            status: 400,
          });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return new Response(JSON.stringify({ error: "User does not exist" }), {
            status: 400,
          });
      }
      if (user && !user.password) {
        return new Response(JSON.stringify({ error: "Try logging in with your Gmail account using the same email address" }), {
            status: 400,
          });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      // console.log(`Generated token: ${token}`);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset your password",
        text: `http://localhost:5173/forgot-password/${user.id}/${token}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return new Response(JSON.stringify({ error: "Error during password reset" }), {
            status: 500,
          });
        } else {
          console.log("Email sent: " + info.response);
          return new Response(JSON.stringify({ message: "Email sent",}), {
            status: 200,
          });
        }
      });
  } catch (error) {
    console.log(error)
  }
}
