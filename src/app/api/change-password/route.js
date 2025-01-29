import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header is missing");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Invalid token format");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;
    const body = await req.json(); // Ensure you're parsing the JSON body
    const { email, oldPassword, newPassword } = body;
    if (!oldPassword) {
      return new Response(
        JSON.stringify({ error: "you can't change password" }),
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ error: "User or password is missing." }),
        {
          status: 400,
        }
      );
    }

    // Compare the old password with the hashed password in the database
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return new Response(JSON.stringify({ error: "Incorrect old password" }));
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database with the new hashed password
    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" } // You can adjust the expiry time as needed
    );

    // Update the logged-in user with the new token
    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: {
        token: newToken, // Update token
      },
      create: {
        userId: user.id,
        token: newToken, // Create a new record with the new token
        verifiedOtp: true, // Add a default value for verifiedOtp
      },
    });

    return new Response(
      JSON.stringify({
        message: "Password updated successfully",
        token: newToken,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Error during password reset" }),
      { status: 500 }
    );
  }
}
