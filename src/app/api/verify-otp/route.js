import prisma from "@/lib/db";


export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 400,
      });
    }

    if (
      user.otp !== otp ||
      !user.otpExpiration ||
      user.otpExpiration < new Date()
    ) {
      return new Response(JSON.stringify({ error: 'Invalid or expired OTP' }), {
        status: 400,
      });
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    return new Response(
      JSON.stringify({ message: 'User verified successfully' }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Error during OTP verification:', err);
    return new Response(
      JSON.stringify({ error: 'Error during OTP verification' }),
      { status: 500 }
    );
  }
}
