// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const path = req.nextUrl.pathname;

  // 💚 1) PUBLIC ROUTE (allow freely)
  if (path === "/login") {
    return NextResponse.next();
  }

  // 💚 2) READ COOKIES SAFELY
  const token = req.cookies.get("auth_token")?.value || "";
  const role = req.cookies.get("auth_role")?.value || "";

  // ❌ 3) BLOCK ALL PROTECTED ROUTES IF NO TOKEN
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 🎯 4) ROLE-BASED PROTECTION
  if (path.startsWith("/dashboard") && role !== "anm") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/phc") && role !== "phc") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/doctor") && role !== "doctor") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/phc/:path*",
    "/doctor/:path*",
    "/login"
  ],
};
