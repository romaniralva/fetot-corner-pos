// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to /login
  if (!token && !req.nextUrl.pathname.startsWith("/login")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect these routes
export const config = {
  matcher: ["/admin/:path*", "/manager/:path*", "/pos/:path*"],
};
