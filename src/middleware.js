import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("Token")?.value;

  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/profile")) {
    // If no token or no user data, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  if (pathname.startsWith("/login")) {
    // If both token and user exist, redirect to profile
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next(); // Continue if no redirection is needed
}

export const config = { matcher: ["/profile", "/login"] };
