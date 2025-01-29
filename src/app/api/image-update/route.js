import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Authorization header is missing");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Invalid token format");

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;

    const body = await req.json(); // Ensure you're parsing the JSON body
    const { img } = body;

    if (!img) {
      return new Response(JSON.stringify({ error: "Image url is required" }), {
        status: 400,
      });
    }

    // Update the user's profile image
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { img },
    });

    return new Response(
      JSON.stringify({
        message: "User image updated",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500 }
    );
  }
}
